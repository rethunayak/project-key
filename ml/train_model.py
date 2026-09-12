"""
Slope Safe – ML Training Pipeline
SIH 2026 Problem Statement: SIH26001 (Landslide Early Warning & Risk Intelligence System)

Dataset: DEMO / TRAINING DATA for North Eastern Region (NER) of India.
Notice: This dataset is structured as prototype training data. It will be replaced
by real historical sensor & meteorological data from GSI / IMD / NESAC / ISRO.
"""

import os
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score

try:
    from xgboost import XGBClassifier
    XGBOOST_AVAILABLE = True
except ImportError:
    XGBOOST_AVAILABLE = False

try:
    import shap
    SHAP_AVAILABLE = True
except ImportError:
    SHAP_AVAILABLE = False

SOIL_TYPES = ["clay", "loam", "silt", "gravelly", "sand"]
FEATURE_NAMES = ["rainfall", "soil_moisture", "slope", "elevation", "soil_type_code", "previous_landslide"]

def encode_soil_type(soil: str) -> int:
    s = str(soil).strip().lower()
    return SOIL_TYPES.index(s) if s in SOIL_TYPES else 1

def clean_data(df: pd.DataFrame) -> pd.DataFrame:
    print("\n--- 1. Data Cleaning & Validation ---")
    initial_len = len(df)
    print(f"Initial raw rows: {initial_len}")

    # Check and report missing values
    null_counts = df.isnull().sum()
    print("Null values per feature:")
    print(null_counts)
    df = df.dropna()

    # Check and report duplicates
    dup_count = df.duplicated().sum()
    print(f"Duplicate rows detected: {dup_count}")
    df = df.drop_duplicates()

    # Data validation constraints
    df = df[
        (df["rainfall"] >= 0) &
        (df["soil_moisture"] >= 0) & (df["soil_moisture"] <= 100) &
        (df["slope"] >= 0) & (df["slope"] <= 90) &
        (df["elevation"] >= 0) &
        (df["landslide"].isin([0, 1]))
    ]
    print(f"Cleaned valid records: {len(df)}")
    return df

def train_and_evaluate():
    csv_path = os.path.join(os.path.dirname(__file__), "landslide_data.csv")
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"Dataset not found at: {csv_path}")

    print(f"Loading dataset from: {csv_path}")
    df = pd.read_csv(csv_path)

    # Clean data
    df = clean_data(df)

    # Encode categorical features
    df["soil_type_code"] = df["soil_type"].apply(encode_soil_type)

    # Prepare features and target
    X = df[FEATURE_NAMES]
    y = df["landslide"]

    # Split dataset into training and testing (80/20 stratified)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    print(f"\nTraining samples: {len(X_train)} | Test samples: {len(X_test)}")

    # Model 1: Random Forest Classifier
    rf_model = RandomForestClassifier(
        n_estimators=100,
        max_depth=6,
        min_samples_split=4,
        random_state=42
    )
    rf_model.fit(X_train, y_train)

    rf_preds = rf_model.predict(X_test)
    rf_probs = rf_model.predict_proba(X_test)[:, 1]

    rf_metrics = {
        "model_name": "Random Forest Classifier",
        "accuracy": float(accuracy_score(y_test, rf_preds)),
        "precision": float(precision_score(y_test, rf_preds, zero_division=0)),
        "recall": float(recall_score(y_test, rf_preds, zero_division=0)),
        "f1_score": float(f1_score(y_test, rf_preds, zero_division=0)),
        "roc_auc": float(roc_auc_score(y_test, rf_probs))
    }

    # Model 2: XGBoost or Gradient Boosting
    if XGBOOST_AVAILABLE:
        comp_model = XGBClassifier(
            n_estimators=100,
            max_depth=4,
            learning_rate=0.08,
            random_state=42,
            eval_metric="logloss"
        )
        comp_name = "XGBoost Classifier"
    else:
        comp_model = GradientBoostingClassifier(
            n_estimators=100,
            max_depth=4,
            learning_rate=0.08,
            random_state=42
        )
        comp_name = "Gradient Boosting (XGBoost Comparative Baseline)"

    comp_model.fit(X_train, y_train)
    comp_preds = comp_model.predict(X_test)
    comp_probs = comp_model.predict_proba(X_test)[:, 1]

    comp_metrics = {
        "model_name": comp_name,
        "accuracy": float(accuracy_score(y_test, comp_preds)),
        "precision": float(precision_score(y_test, comp_preds, zero_division=0)),
        "recall": float(recall_score(y_test, comp_preds, zero_division=0)),
        "f1_score": float(f1_score(y_test, comp_preds, zero_division=0)),
        "roc_auc": float(roc_auc_score(y_test, comp_probs))
    }

    print("\n--- Model Evaluation & Comparison ---")
    print(f"{'Metric':<15} | {'Random Forest':<15} | {comp_name:<20}")
    print("-" * 55)
    for m in ["accuracy", "precision", "recall", "f1_score", "roc_auc"]:
        print(f"{m:<15} | {rf_metrics[m]:<15.4f} | {comp_metrics[m]:<20.4f}")

    # Model selection based on disaster management criteria:
    # High Recall and F1-score are critical to avoid false negatives in landslide warnings
    if comp_metrics["f1_score"] > rf_metrics["f1_score"] or (
        comp_metrics["f1_score"] == rf_metrics["f1_score"] and comp_metrics["recall"] > rf_metrics["recall"]
    ):
        selected_model = comp_model
        selected_name = comp_name
        selected_metrics = comp_metrics
    else:
        selected_model = rf_model
        selected_name = "Random Forest Classifier"
        selected_metrics = rf_metrics

    print(f"\n=> Selected Model for Deployment: {selected_name}")
    print(f"Selection Reason: Higher F1-score & Recall balance to prevent missed hazardous events.")

    # Save artifacts
    artifacts = {
        "model": selected_model,
        "model_name": selected_name,
        "feature_names": FEATURE_NAMES,
        "soil_types": SOIL_TYPES,
        "metrics": selected_metrics,
        "comparison": {
            "random_forest": rf_metrics,
            "comparison_model": comp_metrics
        }
    }

    model_path = os.path.join(os.path.dirname(__file__), "landslide_model.pkl")
    joblib.dump(artifacts, model_path)
    print(f"Saved trained model and pipeline bundle to: {model_path}")

    # Also save evaluation metrics to JSON for frontend/API consumption
    metrics_path = os.path.join(os.path.dirname(__file__), "model_metrics.json")
    with open(metrics_path, "w") as f:
        json.dump({
            "selected_model": selected_name,
            "selected_metrics": selected_metrics,
            "comparison": [rf_metrics, comp_metrics],
            "dataset_info": {
                "total_records": len(df),
                "training_split": len(X_train),
                "test_split": len(X_test),
                "features": FEATURE_NAMES,
                "label": "DEMO / PROTOTYPE TRAINING DATA"
            }
        }, f, indent=2)
    print(f"Saved evaluation metrics to: {metrics_path}")

    return artifacts

if __name__ == "__main__":
    train_and_evaluate()
