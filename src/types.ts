export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface MonitoredLocation {
  id: number;
  location: string;
  latitude: number;
  longitude: number;
  date?: string;
  rainfall: number;
  soil_moisture: number;
  slope: number;
  elevation: number;
  soil_type: string;
  severity: RiskLevel;
  risk_score?: number;
  risk_level?: RiskLevel;
  main_factors?: string[];
  recommended_action?: string;
}

export interface ShapFactor {
  feature: string;
  label: string;
  value: number;
  shap_value: number;
  influence: 'Strong influence' | 'Moderate influence' | 'Lower influence';
  impact_direction: 'Increases Risk' | 'Decreases Risk';
  detail: string;
}

export interface PredictionResult {
  location: string;
  risk_score: number;
  risk_level: RiskLevel;
  main_factors: string[];
  shap_explanations: ShapFactor[];
  recommended_action: string;
  model_used: string;
  calibration_notice: string;
  stored_in_db: boolean;
  prediction_id?: number;
}

export interface AlertItem {
  id: number;
  location: string;
  risk_level: RiskLevel;
  message: string;
  status: 'ACTIVE' | 'SIMULATION' | 'DISPATCHED' | 'RESOLVED';
  created_at: string;
}

export interface FieldReport {
  id: number;
  location: string;
  actual_condition: string;
  report: string;
  reported_by: string;
  date: string;
}

export interface ModelMetric {
  model_name: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  roc_auc: number;
}

export interface ModelPerformanceData {
  selected_model: string;
  selection_reason: string;
  selected_metrics: ModelMetric;
  comparison: ModelMetric[];
  feature_importance: Array<{
    feature: string;
    importance: number;
    rank: number;
  }>;
  dataset_info: {
    total_records: number;
    training_split: number;
    test_split: number;
    label: string;
  };
}
