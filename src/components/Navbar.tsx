import React from 'react';
import { Mountain, AlertTriangle, ShieldCheck, Activity, Map, Cpu, Bell, CheckCircle2 } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  activeAlertCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, activeAlertCount }) => {
  const tabs = [
    { id: 'landing', label: 'Home', icon: Mountain },
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'prediction', label: 'AI Prediction', icon: Cpu },
    { id: 'map', label: 'GIS Risk Map', icon: Map },
    { id: 'alerts', label: 'Alert Center', icon: Bell, badge: activeAlertCount },
    { id: 'performance', label: 'Model Performance', icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div
            id="nav-brand"
            onClick={() => setCurrentTab('landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:bg-blue-600/30 transition-colors">
              <Mountain className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-100 tracking-tight">Slope Safe</span>
                <span className="text-[10px] font-semibold tracking-wide bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded border border-blue-400/30">
                  SIH26001
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">NER Landslide Early Warning System</p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`nav-link-${tab.id}`}
                  onClick={() => setCurrentTab(tab.id)}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-800 text-blue-400 shadow-sm border border-slate-700'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline">{tab.label}</span>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-rose-500 text-white">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Status Badge */}
          <div className="hidden lg:flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Model Active (RF v1.2)
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
