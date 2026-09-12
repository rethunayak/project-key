import React from 'react';
import { ArrowRight, ShieldAlert, Cpu, Map, Activity, Bell, Info, Database, HelpCircle } from 'lucide-react';

interface LandingViewProps {
  onNavigate: (tab: string) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-12 py-6">
      {/* Prototype Calibration Banner */}
      <div id="landing-prototype-banner" className="bg-blue-950/40 border-l-4 border-blue-500 p-4 rounded-r-lg text-sm text-blue-200 flex items-start gap-3 shadow-sm">
        <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-blue-300 font-semibold">SIH 2026 Prototype Notice:</strong> Initial model trained on North Eastern Region (NER) demonstration data. Prototype risk categories (0–24 Low, 25–49 Moderate, 50–74 High, 75–100 Critical) require field calibration against local historical events and geotechnical domain thresholds before operational state deployment.
        </div>
      </div>

      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-6 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
          <span>Smart India Hackathon 2026</span>
          <span>•</span>
          <span>Problem Statement SIH26001</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-100 tracking-tight leading-tight">
          Slope Safe
        </h1>
        <h2 className="text-xl sm:text-2xl font-semibold text-blue-400">
          AI-Powered Early Warning & Dynamic Landslide Risk System
        </h2>
        <p className="text-lg text-slate-300 font-medium italic">
          From Monitoring to Prediction — From Prediction to Early Action.
        </p>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
          A dedicated decision-support intelligence platform combining 24h precipitation, pore soil moisture, topographic slope, elevation, and historical slip precedent to protect vulnerable corridors across Northeast India.
        </p>

        {/* 4 Primary Navigation Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <button
            id="btn-hero-dashboard"
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2 px-5 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-md transition-all active:scale-95"
          >
            <Activity className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            id="btn-hero-map"
            onClick={() => onNavigate('map')}
            className="flex items-center gap-2 px-5 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-sm border border-slate-700 shadow-md transition-all active:scale-95"
          >
            <Map className="w-4 h-4" />
            <span>Risk Map</span>
          </button>

          <button
            id="btn-hero-prediction"
            onClick={() => onNavigate('prediction')}
            className="flex items-center gap-2 px-5 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-sm border border-slate-700 shadow-md transition-all active:scale-95"
          >
            <Cpu className="w-4 h-4" />
            <span>AI Prediction</span>
          </button>

          <button
            id="btn-hero-alerts"
            onClick={() => onNavigate('alerts')}
            className="flex items-center gap-2 px-5 py-3 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm shadow-md transition-all active:scale-95"
          >
            <Bell className="w-4 h-4" />
            <span>Active Alerts</span>
          </button>
        </div>
      </div>

      {/* Core Workflow Pipeline Visualization */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            Core Disaster Intelligence Workflow
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            End-to-end telemetry ingestion, machine learning inference, explainability, GIS visualization, and ground-truth feedback loop.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-800/60 p-4 rounded-lg border border-slate-700/60 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Step 1</span>
            <h4 className="font-semibold text-slate-200">Data Sources & Cleaning</h4>
            <p className="text-slate-400 leading-relaxed">
              Rainfall (mm/24h), soil moisture (%), terrain slope (°), elevation, and soil classification validated against physical domain boundaries.
            </p>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-lg border border-slate-700/60 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Step 2</span>
            <h4 className="font-semibold text-slate-200">ML Model & Risk Score</h4>
            <p className="text-slate-400 leading-relaxed">
              Trained Random Forest classifier (selected over XGBoost for superior Recall 97.0%) calculates genuine 0–100% hazard probability.
            </p>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-lg border border-slate-700/60 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Step 3</span>
            <h4 className="font-semibold text-slate-200">Explainable AI (SHAP)</h4>
            <p className="text-slate-400 leading-relaxed">
              Tree SHAP attributions calculate causal drivers (e.g. Excessive precipitation + high pore saturation) for transparent decision making.
            </p>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-lg border border-slate-700/60 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Step 4</span>
            <h4 className="font-semibold text-slate-200">GIS & Actionable Alerts</h4>
            <p className="text-slate-400 leading-relaxed">
              Dynamic Leaflet map highlights corridor vulnerability (Green, Yellow, Orange, Red) with SOP recommendations for NDRF & BRO road teams.
            </p>
          </div>
        </div>

        <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800 flex items-center justify-between flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-3">
            <Database className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <span className="font-semibold text-slate-200">Continuous Ground-Truth Improvement Loop:</span>
              <p className="text-slate-400">Field feedback reports (soil cracking, rock movement, road blockages) are saved to MySQL to retrain future models.</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('alerts')}
            className="text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1 shrink-0"
          >
            <span>Submit Observation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
