import React, { useState } from 'react';
import { Bell, AlertTriangle, ShieldAlert, CheckCircle2, TestTube2, Send, Clock, MapPin } from 'lucide-react';
import { AlertItem, RiskLevel } from '../types';

interface AlertCenterViewProps {
  alerts: AlertItem[];
  onAddAlert: (newAlert: any) => void;
  onNavigateToPrediction: () => void;
  onOpenReportModal: (location?: string) => void;
}

export const AlertCenterView: React.FC<AlertCenterViewProps> = ({
  alerts,
  onAddAlert,
  onNavigateToPrediction,
  onOpenReportModal
}) => {
  const [showSimModal, setShowSimModal] = useState(false);
  const [simLocation, setSimLocation] = useState('Champhai Border Highway KM 22 (Mizoram)');
  const [simRiskLevel, setSimRiskLevel] = useState<RiskLevel>('CRITICAL');
  const [simReason, setSimReason] = useState('Heavy simulated rainfall (210mm) + high slope saturation (89%) + clay subgrade');

  const [filterType, setFilterType] = useState<'ALL' | 'ACTIVE' | 'SIMULATION'>('ALL');

  const handleSimulateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const simulatedAlert = {
      location: simLocation,
      risk_level: simRiskLevel,
      message: `[DEMO / SIMULATION] ${simRiskLevel} landslide risk advisory generated. Reason: ${simReason}`,
      status: 'SIMULATION',
      created_at: new Date().toISOString()
    };
    onAddAlert(simulatedAlert);
    setShowSimModal(false);
  };

  const filteredAlerts = alerts.filter((a) => {
    if (filterType === 'ACTIVE') return a.status === 'ACTIVE';
    if (filterType === 'SIMULATION') return a.status === 'SIMULATION';
    return true;
  });

  const getAlertBadge = (level: string, isSim: boolean) => {
    if (isSim) {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40 flex items-center gap-1">
          <TestTube2 className="w-3 h-3" />
          DEMO / SIMULATION
        </span>
      );
    }
    switch (level) {
      case 'CRITICAL':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">🔴 RED ALERT</span>;
      case 'HIGH':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-500/20 text-orange-300 border border-orange-500/40">🟠 ORANGE WATCH</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">🟡 YELLOW ADVISORY</span>;
    }
  };

  return (
    <div className="space-y-8 py-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">Disaster Alert & Warning Center</h1>
          <p className="text-sm text-slate-400 mt-1">
            Automated emergency broadcasting to State Disaster Management Authorities (SDMAs) & Border Roads Organisation (BRO).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-open-sim-modal"
            onClick={() => setShowSimModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-xs font-semibold border border-blue-500/40 transition-colors shadow-sm"
          >
            <TestTube2 className="w-3.5 h-3.5 text-blue-400" />
            <span>Trigger Drill / Simulation Alert</span>
          </button>
          <button
            onClick={() => onOpenReportModal()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <span>+ Submit Field Report</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filterType === 'ALL'
                ? 'bg-slate-800 text-slate-100 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Broadcasts ({alerts.length})
          </button>
          <button
            onClick={() => setFilterType('ACTIVE')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filterType === 'ACTIVE'
                ? 'bg-slate-800 text-slate-100 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Active Threats ({alerts.filter((a) => a.status === 'ACTIVE').length})
          </button>
          <button
            onClick={() => setFilterType('SIMULATION')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filterType === 'SIMULATION'
                ? 'bg-slate-800 text-slate-100 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Drill Simulations ({alerts.filter((a) => a.status === 'SIMULATION').length})
          </button>
        </div>

        <span className="text-[11px] text-slate-400 hidden sm:inline">
          Last broadcast sync: {new Date().toLocaleTimeString()}
        </span>
      </div>

      {/* Alert Feed List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-10 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-200">No active warnings in this filter</h3>
            <p className="text-xs text-slate-400">All regional slope sectors are currently operating within acceptable threshold limits.</p>
          </div>
        ) : (
          filteredAlerts.map((alert, idx) => {
            const isSim = alert.status === 'SIMULATION' || alert.message.includes('SIMULATION');
            const isCrit = alert.risk_level === 'CRITICAL';
            const isHigh = alert.risk_level === 'HIGH';

            return (
              <div
                key={idx}
                className={`bg-slate-900 rounded-xl p-5 border transition-all ${
                  isSim
                    ? 'border-blue-500/40 bg-blue-950/10'
                    : isCrit
                    ? 'border-rose-500/50 bg-rose-950/10'
                    : isHigh
                    ? 'border-orange-500/40 bg-orange-950/10'
                    : 'border-slate-800'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    {getAlertBadge(alert.risk_level, isSim)}
                    <span className="text-sm font-bold text-slate-100 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {alert.location}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(alert.created_at).toLocaleTimeString()}</span>
                  </div>
                </div>

                <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
                  <p>{alert.message}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="text-[11px] text-slate-400">
                    <strong>Dispatched To:</strong> State Disaster Management Authority (SDMA) & NDRF Regional Command.
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenReportModal(alert.location)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700"
                    >
                      Record Ground Feedback
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Simulation Modal */}
      {showSimModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <TestTube2 className="w-4 h-4 text-blue-400" />
                Run Mock Disaster Response Drill
              </h3>
              <button
                onClick={() => setShowSimModal(false)}
                className="text-slate-400 hover:text-slate-200 text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              This triggers a simulated early action alert to test the multi-agency dispatch channel. All simulated notices will be prominently labeled with <strong>[DEMO / SIMULATION]</strong>.
            </p>

            <form onSubmit={handleSimulateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Target Drill Sector</label>
                <input
                  type="text"
                  value={simLocation}
                  onChange={(e) => setSimLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Simulated Threat Level</label>
                <select
                  value={simRiskLevel}
                  onChange={(e) => setSimRiskLevel(e.target.value as RiskLevel)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 outline-none"
                >
                  <option value="CRITICAL">CRITICAL (Red Alert - Evacuation Drill)</option>
                  <option value="HIGH">HIGH (Orange Watch - Road Standby)</option>
                  <option value="MODERATE">MODERATE (Yellow Advisory)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Simulated Environmental Trigger</label>
                <textarea
                  value={simReason}
                  onChange={(e) => setSimReason(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 outline-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSimModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="btn-confirm-simulate"
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-md"
                >
                  Broadcast Simulated Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
