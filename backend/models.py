"""
Slope Safe – Database Models & Pydantic Schemas
"""

from datetime import datetime
from typing import Optional, List
from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from pydantic import BaseModel, Field, field_validator
from .database import Base

# ================= SQLAlchemy ORM Models =================

class LandslideEvent(Base):
    __tablename__ = "landslide_events"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    location = Column(String(255), nullable=False, index=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    date = Column(DateTime, default=datetime.utcnow)
    rainfall = Column(Float, nullable=False)
    soil_moisture = Column(Float, nullable=False)
    slope = Column(Float, nullable=False)
    elevation = Column(Integer, nullable=False)
    soil_type = Column(String(50), nullable=False)
    severity = Column(String(50), nullable=False)


class PredictionRecord(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    location = Column(String(255), nullable=False, index=True)
    rainfall = Column(Float, nullable=False)
    soil_moisture = Column(Float, nullable=False)
    slope = Column(Float, nullable=False)
    elevation = Column(Integer, nullable=False)
    soil_type = Column(String(50), nullable=False)
    previous_landslide = Column(Integer, nullable=False)
    risk_score = Column(Float, nullable=False)
    risk_level = Column(String(50), nullable=False)
    prediction_time = Column(DateTime, default=datetime.utcnow)


class AlertRecord(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    location = Column(String(255), nullable=False)
    risk_level = Column(String(50), nullable=False)
    message = Column(Text, nullable=False)
    status = Column(String(50), default="ACTIVE")
    created_at = Column(DateTime, default=datetime.utcnow)


class FieldReportRecord(Base):
    __tablename__ = "field_reports"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    location = Column(String(255), nullable=False)
    report = Column(Text, nullable=False)
    actual_condition = Column(String(100), nullable=False)
    reported_by = Column(String(255), nullable=False)
    date = Column(DateTime, default=datetime.utcnow)


# ================= Pydantic Schemas for FastAPI =================

class PredictionInput(BaseModel):
    location: Optional[str] = "Kohima NH-29"
    rainfall: float = Field(..., description="24h cumulative precipitation in mm", ge=0)
    soil_moisture: float = Field(..., description="Soil moisture saturation percentage", ge=0, le=100)
    slope: float = Field(..., description="Terrain slope angle in degrees", ge=0, le=90)
    elevation: float = Field(..., description="Elevation above sea level in meters", ge=0)
    soil_type: str = Field(..., description="Geological soil classification (clay, loam, silt, gravelly, sand)")
    previous_landslide: int = Field(..., description="Binary indicator: 1 if previous slip recorded, else 0")

    @field_validator("soil_type")
    @classmethod
    def validate_soil(cls, v: str) -> str:
        valid_soils = ["clay", "loam", "silt", "gravelly", "sand"]
        val = v.strip().lower()
        if val not in valid_soils:
            raise ValueError(f"Soil type must be one of {valid_soils}")
        return val

    @field_validator("previous_landslide")
    @classmethod
    def validate_prev(cls, v: int) -> int:
        if v not in (0, 1):
            raise ValueError("previous_landslide must be 0 or 1")
        return v


class ShapFactor(BaseModel):
    feature: str
    label: str
    value: float
    shap_value: float
    influence: str
    impact_direction: str
    detail: str


class PredictionResponse(BaseModel):
    location: str
    risk_score: float
    risk_level: str
    main_factors: List[str]
    shap_explanations: List[ShapFactor]
    recommended_action: str
    calibration_notice: str
    model_used: str
    stored_in_db: bool


class FieldReportInput(BaseModel):
    location: str = Field(..., min_length=2)
    actual_condition: str = Field(..., description="Ground observation status")
    report: str = Field(..., min_length=3)
    reported_by: str = Field(..., min_length=2)

    @field_validator("actual_condition")
    @classmethod
    def validate_condition(cls, v: str) -> str:
        valid = [
            "Landslide observed",
            "No landslide observed",
            "Minor movement",
            "Road blockage",
            "Soil cracking",
            "Other"
        ]
        if v not in valid:
            raise ValueError(f"Actual condition must be one of: {valid}")
        return v
