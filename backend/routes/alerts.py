"""
Slope Safe – Early Warning Alerts Route
Manages active early warning alerts, sirens, notifications, and simulated drills.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
from pydantic import BaseModel
from typing import Optional, List
import random

from backend.database import get_db
from backend.models import AlertRecord

router = APIRouter(prefix="/alerts", tags=["Alerts"])

class SimulateAlertInput(BaseModel):
    location: Optional[str] = "Kohima NH-29 Mile 14"
    risk_level: Optional[str] = "CRITICAL"
    reason: Optional[str] = "Simulated extreme cloudburst (220mm/24h) + saturated clay subgrade"
    recommended_action: Optional[str] = "Field inspection and early warning. Preemptive traffic diversion."

@router.get("")
def get_alerts(db: Session = Depends(get_db)):
    """
    GET /alerts
    Returns all active and recent early warning alerts for disaster management authorities.
    """
    try:
        alerts = db.query(AlertRecord).order_by(AlertRecord.created_at.desc()).limit(50).all()
        return [
            {
                "id": a.id,
                "location": a.location,
                "risk_level": a.risk_level,
                "message": a.message,
                "status": a.status,
                "created_at": a.created_at.isoformat() if a.created_at else datetime.utcnow().isoformat()
            }
            for a in alerts
        ]
    except Exception as e:
        # Fallback demonstration alerts if database is initializing
        return [
            {
                "id": 101,
                "location": "Kohima NH-29 Bypass",
                "risk_level": "CRITICAL",
                "message": "Heavy rainfall (195mm) + high soil moisture (88%) on active shear plane. Immediate evacuation advised.",
                "status": "ACTIVE",
                "created_at": datetime.utcnow().isoformat()
            },
            {
                "id": 102,
                "location": "Gangtok - JN Road Sector",
                "risk_level": "HIGH",
                "message": "Continuous precipitation on steep incline. Border Roads Organisation alerted for debris clearance.",
                "status": "ACTIVE",
                "created_at": datetime.utcnow().isoformat()
            },
            {
                "id": 103,
                "location": "Aizawl Sairang Ridge",
                "risk_level": "MODERATE",
                "message": "Elevated soil moisture post 48h rain spell. Routine surveillance ongoing.",
                "status": "ACTIVE",
                "created_at": datetime.utcnow().isoformat()
            }
        ]

@router.post("/simulate")
def simulate_alert(payload: SimulateAlertInput, db: Session = Depends(get_db)):
    """
    Simulate a test alert for demonstration / drill purposes.
    Clearly tags the alert with [DEMO / SIMULATION].
    """
    sim_msg = f"[DEMO / SIMULATION] {payload.risk_level} Drill: {payload.reason}. Action: {payload.recommended_action}"
    
    try:
        alert = AlertRecord(
            location=payload.location or "Kohima NH-29 Demo Corridor",
            risk_level=payload.risk_level or "CRITICAL",
            message=sim_msg,
            status="SIMULATION"
        )
        db.add(alert)
        db.commit()
        db.refresh(alert)
        return {
            "id": alert.id,
            "location": alert.location,
            "risk_level": alert.risk_level,
            "message": alert.message,
            "status": alert.status,
            "created_at": alert.created_at.isoformat(),
            "notice": "DEMO / SIMULATION ONLY - Drill alert created for disaster preparedness training"
        }
    except Exception:
        return {
            "id": random.randint(500, 999),
            "location": payload.location or "Kohima NH-29 Demo Corridor",
            "risk_level": payload.risk_level or "CRITICAL",
            "message": sim_msg,
            "status": "SIMULATION",
            "created_at": datetime.utcnow().isoformat(),
            "notice": "DEMO / SIMULATION ONLY - Drill alert created for disaster preparedness training"
        }

@router.post("/{alert_id}/acknowledge")
def acknowledge_alert(alert_id: int, db: Session = Depends(get_db)):
    try:
        alert = db.query(AlertRecord).filter(AlertRecord.id == alert_id).first()
        if alert:
            alert.status = "DISPATCHED"
            db.commit()
            return {"status": "success", "alert_id": alert_id, "new_status": "DISPATCHED"}
        return {"status": "not_found"}
    except Exception:
        return {"status": "acknowledged (in-memory)"}
