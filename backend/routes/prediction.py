"""
Slope Safe – Prediction Route
Handles POST /predict with validation, ML inference, SHAP XAI explanation, and DB storage.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import sys
import os

# Add root to python path to import ml modules
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from backend.database import get_db
from backend.models import PredictionInput, PredictionResponse, PredictionRecord, AlertRecord
from ml.predict import predict_landslide_risk
from ml.explain import explain_prediction

router = APIRouter(prefix="/predict", tags=["Prediction"])

@router.post("", response_model=PredictionResponse, status_code=status.HTTP_200_OK)
def predict_risk(data: PredictionInput, db: Session = Depends(get_db)):
    """
    POST /predict
    1. Receive environmental input
    2. Validate input parameters
    3. Generate ML risk score
    4. Generate risk level category
    5. Generate SHAP explanation factors
    6. Store prediction in MySQL database
    7. Automatically trigger alert if HIGH or CRITICAL
    8. Return structured decision support JSON
    """
    input_dict = data.model_dump()

    try:
        # Run inference
        pred_result = predict_landslide_risk(input_dict)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Inference error: {str(e)}"
        )

    # Compute SHAP explanation factors
    try:
        shap_factors = explain_prediction(input_dict)
    except Exception as e:
        shap_factors = []

    # Extract high-level main factors
    main_factors = []
    for factor in shap_factors:
        if factor.get("influence") in ["Strong influence", "Moderate influence"] and factor.get("shap_value", 0) > 0:
            main_factors.append(f"{factor['label']} ({factor['detail']})")

    if not main_factors:
        main_factors = ["Environmental indicators within standard baseline stability bounds"]

    # Store prediction in MySQL database
    stored = False
    try:
        record = PredictionRecord(
            location=data.location or "NER Location",
            rainfall=data.rainfall,
            soil_moisture=data.soil_moisture,
            slope=data.slope,
            elevation=int(data.elevation),
            soil_type=data.soil_type,
            previous_landslide=data.previous_landslide,
            risk_score=pred_result["risk_score"],
            risk_level=pred_result["risk_level"]
        )
        db.add(record)

        # Auto-create alert if HIGH or CRITICAL
        if pred_result["risk_level"] in ["HIGH", "CRITICAL"]:
            alert_msg = f"{pred_result['risk_level']} Landslide Alert for {data.location}. Factors: {', '.join(main_factors[:2])}. Action: {pred_result['recommended_action']}"
            alert = AlertRecord(
                location=data.location,
                risk_level=pred_result["risk_level"],
                message=alert_msg,
                status="ACTIVE"
            )
            db.add(alert)

        db.commit()
        stored = True
    except Exception as db_err:
        db.rollback()
        print(f"[Warning] Database storage failed: {db_err}")
        stored = False

    return PredictionResponse(
        location=pred_result["location"],
        risk_score=pred_result["risk_score"],
        risk_level=pred_result["risk_level"],
        main_factors=main_factors,
        shap_explanations=shap_factors,
        recommended_action=pred_result["recommended_action"],
        calibration_notice=pred_result["calibration_notice"],
        model_used=pred_result["model_used"],
        stored_in_db=stored
    )
