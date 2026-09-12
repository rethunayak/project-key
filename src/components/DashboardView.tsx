import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, Cpu, Activity, ArrowUpRight, Plus, MapPin, Eye } from 'lucide-react';
import { MonitoredLocation, PredictionResult, RiskLevel } from '../types';

interface DashboardViewProps {
  locations: MonitoredLocation[];
  predictions: any[];
  activeAlertCount: number;
  onNavigate: (tab: string) => void;
  onSelectPrediction: (pred: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  locations,
  predictions,
  activeAlertCount,
  onNavigate,
  onSelectPrediction
}) => {
  const totalLocations = locations.length || 8;
  const lowCount = locations.filter((l) => (l.severity || l.risk_level) === 'LOW').length;
  const modCount = locations.filter((l) => (l.severity || l.risk_level) === 'MODERATE').length;
  const highCount = locations.filter((l) => (l.severity || l.risk_level) === 'HIGH').length;
  const critCount = locations.filter((l) => (l.severity || l.risk_level) === 'CRITICAL').length;

  const getBadge = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return <span className="px-2 py-0.5 rounded text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">🔴 CRITICAL</span>;
      case 'HIGH':
        return <span className="px-2 py-0.5 rounded text-xs font-bold bg-orange-500/20 text-orange-300 border border-orange-500/40">🟠 HIGH</span>;
      case 'MODERATE':
        return <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">🟡 MODERATE</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">🟢 LOW</span>;
    }
  };

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">Disaster Management Overview</h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time decision intelligence across North Eastern Region (NER) hill highways & fracture zones.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Data Quality: Good
          </span>
          <button
            id="dashboard-new-prediction-btn"
            onClick={() => onNavigate('prediction')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Prediction</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Locations */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5">
          <p className="text-xs font-medium text-slate-400">Total Monitored Nodes</p>
          <p className="text-3xl font-extrabold text-slate-100 mt-2">{totalLocations}</p>
          <p className="text-[11px] text-blue-400 mt-1 flex items-center gap-1">
            <span>NER Arterial Corridors</span>
          </p>
        </div>

        {/* Low Risk */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5">
          <p className="text-xs font-medium text-slate-400">Low-Risk Locations</p>
          <p className="text-3xl font-extrabold text-emerald-400 mt-2">{lowCount}</p>
          <p className="text-[11px] text-slate-500 mt-1">Score 0–24% (Normal Traffic)</p>
        </div>

        {/* High Risk */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5">
          <p className="text-xs font-medium text-slate-400">High-Risk Locations</p>
          <p className="text-3xl font-extrabold text-orange-400 mt-2">{highCount}</p>
          <p className="text-[11px] text-slate-500 mt-1">Score 50–74% (Orange Watch)</p>
        </div>

        {/* Critical Risk */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5">
          <p className="text-xs font-medium text-slate-400">Critical-Risk Locations</p>
          <p className="text-3xl font-extrabold text-rose-400 mt-2">{critCount}</p>
          <p className="text-[11px] text-slate-500 mt-1">Score 75–100% (Red Alert)</p>
        </div>

        {/* Active Alerts */}
        <div className="col-span-2 lg:col-span-1 bg-rose-950/20 border border-rose-500/30 rounded-xl p-4 sm:p-5">
          <p className="text-xs font-medium text-rose-300">Active Warnings</p>
          <p className="text-3xl font-extrabold text-rose-400 mt-2">{activeAlertCount}</p>
          <button
            onClick={() => onNavigate('alerts')}
            className="text-[11px] text-rose-300 hover:text-rose-200 mt-1 flex items-center gap-1 underline font-medium"
          >
            <span>Inspect Alerts Feed</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Model Status Card & Fast Action Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-blue-400" />
                AI Model Engine State
              </h3>
              <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Random Forest v1.2 Active
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs">
              <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/50">
                <span className="text-slate-400 block text-[11px]">Accuracy</span>
                <span className="text-slate-100 font-bold text-base">96.0%</span>
              </div>
              <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/50">
                <span className="text-slate-400 block text-[11px]">Sensitivity (Recall)</span>
                <span className="text-amber-400 font-bold text-base">97.0%</span>
              </div>
              <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/50">
                <span className="text-slate-400 block text-[11px]">F1-Score</span>
                <span className="text-emerald-400 font-bold text-base">95.5%</span>
              </div>
              <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/50">
                <span className="text-slate-400 block text-[11px]">ROC-AUC</span>
                <span className="text-purple-400 font-bold text-base">0.988</span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Baseline comparison model: XGBoost Classifier (F1: 92.3%)</span>
            <button
              onClick={() => onNavigate('performance')}
              className="text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1"
            >
              Full Model Benchmarks →
            </button>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-400" />
              GIS Geospatial Monitor
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Spatial surveillance active along NH-29 Kohima, Gangtok JN Road, and Sairang Railway cuttings.
            </p>
          </div>
          <button
            onClick={() => onNavigate('map')}
            className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            Open Interactive GIS Map
          </button>
        </div>
      </div>

      {/* Recent Predictions Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-100">Recent AI Landslide Risk Predictions</h3>
            <p className="text-xs text-slate-400">Evaluated telemetry instances with automated risk level & action classification.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">Location</th>
                <th className="py-3 px-3">Rainfall (24h)</th>
                <th className="py-3 px-3">Moisture</th>
                <th className="py-3 px-3">Slope</th>
                <th className="py-3 px-3">Soil</th>
                <th className="py-3 px-3">Risk Score</th>
                <th className="py-3 px-3">Risk Level</th>
                <th className="py-3 px-3">Recommended SOP</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {predictions.map((p, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-sans font-semibold text-slate-100">{p.location}</td>
                  <td className="py-3 px-3 text-blue-300">{p.rainfall} mm</td>
                  <td className="py-3 px-3 text-cyan-300">{p.soil_moisture}%</td>
                  <td className="py-3 px-3 text-amber-300">{p.slope}°</td>
                  <td className="py-3 px-3 uppercase text-[11px] text-slate-400">{p.soil_type}</td>
                  <td className="py-3 px-3 font-bold text-slate-100">{p.risk_score}%</td>
                  <td className="py-3 px-3 font-sans">{getBadge(p.risk_level)}</td>
                  <td className="py-3 px-3 font-sans text-slate-400 max-w-xs truncate">{p.recommended_action}</td>
                  <td className="py-3 px-3 text-right font-sans">
                    <button
                      onClick={() => onSelectPrediction(p)}
                      className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>XAI</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
