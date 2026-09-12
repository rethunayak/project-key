import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingView } from './components/LandingView';
import { DashboardView } from './components/DashboardView';
import { PredictionView } from './components/PredictionView';
import { GisMapView } from './components/GisMapView';
import { AlertCenterView } from './components/AlertCenterView';
import { ModelPerformanceView } from './components/ModelPerformanceView';
import { FieldReportModal } from './components/FieldReportModal';
import { MonitoredLocation, AlertItem, FieldReport, PredictionResult } from './types';

// Default NER locations for demonstration
const DEFAULT_LOCATIONS: MonitoredLocation[] = [
  {
    id: 1,
    location: 'Kohima NH-29 Bypass Mile 14 (Nagaland)',
    latitude: 25.6751,
    longitude: 94.1086,
    rainfall: 195.5,
    soil_moisture: 88.4,
    slope: 43.5,
    elevation: 1440,
    soil_type: 'clay',
    severity: 'CRITICAL',
    risk_score: 88.5,
    risk_level: 'CRITICAL',
    main_factors: ['Monsoon cloudburst (195mm)', 'High clay pore saturation', 'Steep highway cut'],
    recommended_action: 'Immediate vehicular diversion. Alert SDMA Kohima and deploy BRO dozer units.'
  },
  {
    id: 2,
    location: 'Gangtok - Nathu La JN Road Sector (Sikkim)',
    latitude: 27.3389,
    longitude: 88.6065,
    rainfall: 178.0,
    soil_moisture: 84.0,
    slope: 39.0,
    elevation: 1650,
    soil_type: 'gravelly',
    severity: 'HIGH',
    risk_score: 73.0,
    risk_level: 'HIGH',
    main_factors: ['Continuous rain', 'Unconsolidated gravel scree'],
    recommended_action: 'Standby road clearance machinery. Halt heavy tourist transit.'
  },
  {
    id: 3,
    location: 'Aizawl Sairang Railway Ridge (Mizoram)',
    latitude: 23.7785,
    longitude: 92.6562,
    rainfall: 125.0,
    soil_moisture: 68.0,
    slope: 32.0,
    elevation: 1130,
    soil_type: 'loam',
    severity: 'MODERATE',
    risk_score: 46.0,
    risk_level: 'MODERATE',
    main_factors: ['Moderate saturation', 'Shale joint fractures'],
    recommended_action: 'Increase track-walk surveillance. Inspect culvert drainage.'
  },
  {
    id: 4,
    location: 'Shillong Peak Foothills (Meghalaya)',
    latitude: 25.5788,
    longitude: 91.8933,
    rainfall: 48.0,
    soil_moisture: 38.0,
    slope: 18.0,
    elevation: 1965,
    soil_type: 'silt',
    severity: 'LOW',
    risk_score: 14.5,
    risk_level: 'LOW',
    main_factors: ['Sub-threshold rainfall', 'Gentle slope gradient'],
    recommended_action: 'Routine meteorological observation.'
  },
  {
    id: 5,
    location: 'Dima Hasao Hill Section (Assam)',
    latitude: 25.1764,
    longitude: 93.0232,
    rainfall: 185.0,
    soil_moisture: 86.0,
    slope: 38.0,
    elevation: 850,
    soil_type: 'clay',
    severity: 'CRITICAL',
    risk_score: 82.0,
    risk_level: 'CRITICAL',
    main_factors: ['Intense rail cutting saturation', 'High clay swelling'],
    recommended_action: 'Preemptive railway speed restrictions and patrol.'
  },
  {
    id: 6,
    location: 'Itanagar - Banderdewa Corridor (Arunachal Pradesh)',
    latitude: 27.0844,
    longitude: 93.6053,
    rainfall: 142.0,
    soil_moisture: 72.0,
    slope: 34.0,
    elevation: 450,
    soil_type: 'sand',
    severity: 'HIGH',
    risk_score: 64.0,
    risk_level: 'HIGH',
    main_factors: ['Rapid infiltration', 'Sandy loam slope cut'],
    recommended_action: 'Restrict night vehicular movements along hill cuts.'
  },
  {
    id: 7,
    location: 'Churachandpur Hill Crest (Manipur)',
    latitude: 24.3333,
    longitude: 93.6667,
    rainfall: 92.0,
    soil_moisture: 54.0,
    slope: 28.0,
    elevation: 914,
    soil_type: 'loam',
    severity: 'MODERATE',
    risk_score: 38.0,
    risk_level: 'MODERATE',
    main_factors: ['Moderate rainfall', 'Vegetation buffer intact'],
    recommended_action: 'Monitor drainage outlets.'
  },
  {
    id: 8,
    location: 'Jampui Hills Sector (Tripura)',
    latitude: 23.9555,
    longitude: 92.2789,
    rainfall: 35.0,
    soil_moisture: 32.0,
    slope: 16.0,
    elevation: 750,
    soil_type: 'silt',
    severity: 'LOW',
    risk_score: 11.0,
    risk_level: 'LOW',
    main_factors: ['Low precipitation', 'Stable sandstone bedrock'],
    recommended_action: 'Normal conditions.'
  }
];

export function App() {
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [locations, setLocations] = useState<MonitoredLocation[]>(DEFAULT_LOCATIONS);
  const [alerts, setAlerts] = useState<AlertItem[]>([
    {
      id: 1,
      location: 'Kohima NH-29 Bypass Mile 14',
      risk_level: 'CRITICAL',
      message: 'Critical landslide risk (88.5%). Rainfall 195.5mm with 88.4% pore water saturation along active fault line. Preemptive vehicular diversion to alternate bypass recommended.',
      status: 'ACTIVE',
      created_at: new Date(Date.now() - 42 * 60000).toISOString()
    },
    {
      id: 2,
      location: 'Gangtok - JN Road Pass Sector',
      risk_level: 'HIGH',
      message: 'High slope hazard (73.0%). Heavy continuous rainfall on loose scree slopes. BRO quick reaction team placed on 30-minute notice.',
      status: 'ACTIVE',
      created_at: new Date(Date.now() - 110 * 60000).toISOString()
    },
    {
      id: 3,
      location: 'Dima Hasao Rail Corridor KM 44',
      risk_level: 'CRITICAL',
      message: 'Critical slope saturation alert. Saturated clay embankments nearing liquid limit. Speed restriction 20 km/h enforced on rail section.',
      status: 'ACTIVE',
      created_at: new Date(Date.now() - 180 * 60000).toISOString()
    }
  ]);

  const [predictions, setPredictions] = useState<any[]>([
    {
      location: 'Kohima NH-29 Bypass',
      rainfall: 195.5,
      soil_moisture: 88.4,
      slope: 43.5,
      elevation: 1440,
      soil_type: 'clay',
      risk_score: 88.5,
      risk_level: 'CRITICAL',
      recommended_action: 'Immediate vehicular diversion & SDMA red alert'
    },
    {
      location: 'Gangtok JN Road Pass',
      rainfall: 178.0,
      soil_moisture: 84.0,
      slope: 39.0,
      elevation: 1650,
      soil_type: 'gravelly',
      risk_score: 73.0,
      risk_level: 'HIGH',
      recommended_action: 'BRO dozer team standby on route'
    },
    {
      location: 'Aizawl Sairang Ridge',
      rainfall: 125.0,
      soil_moisture: 68.0,
      slope: 32.0,
      elevation: 1130,
      soil_type: 'loam',
      risk_score: 46.0,
      risk_level: 'MODERATE',
      recommended_action: 'Periodic moisture checks & municipal watch'
    },
    {
      location: 'Shillong Peak Foothills',
      rainfall: 48.0,
      soil_moisture: 38.0,
      slope: 18.0,
      elevation: 1965,
      soil_type: 'silt',
      risk_score: 14.5,
      risk_level: 'LOW',
      recommended_action: 'Routine meteorological surveillance'
    }
  ]);

  const [fieldReports, setFieldReports] = useState<FieldReport[]>([
    {
      id: 1,
      location: 'Kohima NH-29 Mile 14',
      actual_condition: 'Soil cracking',
      report: 'Tension cracks 2-4 inches wide observed along outer shoulder. Seepage water murky.',
      reported_by: 'Er. T. Jamir (PWD Hills)',
      date: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 2,
      location: 'Gangtok JN Road',
      actual_condition: 'Minor movement',
      report: 'Small scree slide cleared by morning road patrol. Road open to light vehicles.',
      reported_by: 'Sub. R. Sharma (BRO Project Swastik)',
      date: new Date(Date.now() - 172800000).toISOString()
    }
  ]);

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportModalLocation, setReportModalLocation] = useState('Kohima NH-29 Mile 14');

  // Load backend data if available
  useEffect(() => {
    async function loadData() {
      try {
        const resLoc = await fetch('/api/locations');
        if (resLoc.ok) {
          const data = await resLoc.json();
          if (data && data.length) setLocations(data);
        }
      } catch (e) {
        // Fallback default is already set
      }

      try {
        const resAlerts = await fetch('/api/alerts');
        if (resAlerts.ok) {
          const data = await resAlerts.json();
          if (data && data.length) setAlerts(data);
        }
      } catch (e) {
        // Fallback default is already set
      }

      try {
        const resReports = await fetch('/api/field-reports');
        if (resReports.ok) {
          const data = await resReports.json();
          if (data && data.length) setFieldReports(data);
        }
      } catch (e) {
        // Fallback default is already set
      }
    }
    loadData();
  }, []);

  const handlePredictionComplete = (newPred: PredictionResult) => {
    setPredictions((prev) => [newPred, ...prev]);

    // If High or Critical, generate alert automatically
    if (newPred.risk_level === 'CRITICAL' || newPred.risk_level === 'HIGH') {
      const newAlert: AlertItem = {
        id: Date.now(),
        location: newPred.location,
        risk_level: newPred.risk_level,
        message: `${newPred.risk_level} Landslide Warning (${newPred.risk_score}%). Primary factor: ${newPred.main_factors[0]}. Action: ${newPred.recommended_action}`,
        status: 'ACTIVE',
        created_at: new Date().toISOString()
      };
      setAlerts((prev) => [newAlert, ...prev]);
    }
  };

  const handleAddAlert = (alert: any) => {
    const created: AlertItem = {
      id: Date.now(),
      location: alert.location,
      risk_level: alert.risk_level,
      message: alert.message,
      status: alert.status || 'SIMULATION',
      created_at: alert.created_at || new Date().toISOString()
    };
    setAlerts((prev) => [created, ...prev]);
  };

  const handleReportSubmitted = (newRep: FieldReport) => {
    setFieldReports((prev) => [newRep, ...prev]);
  };

  const openReportForLocation = (locName?: string) => {
    setReportModalLocation(locName || 'Kohima NH-29 Mile 14');
    setIsReportModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        activeAlertCount={alerts.filter((a) => a.status === 'ACTIVE').length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {currentTab === 'landing' && (
          <LandingView onNavigate={(tab) => setCurrentTab(tab)} />
        )}

        {currentTab === 'dashboard' && (
          <DashboardView
            locations={locations}
            predictions={predictions}
            activeAlertCount={alerts.filter((a) => a.status === 'ACTIVE').length}
            onNavigate={(tab) => setCurrentTab(tab)}
            onSelectPrediction={(p) => {
              setCurrentTab('prediction');
            }}
          />
        )}

        {currentTab === 'prediction' && (
          <PredictionView
            onPredictionComplete={handlePredictionComplete}
            onNavigateToMap={() => setCurrentTab('map')}
            onOpenReportModal={openReportForLocation}
          />
        )}

        {currentTab === 'map' && (
          <GisMapView
            locations={locations}
            onSelectForPrediction={(loc) => {
              setCurrentTab('prediction');
            }}
          />
        )}

        {currentTab === 'alerts' && (
          <AlertCenterView
            alerts={alerts}
            onAddAlert={handleAddAlert}
            onNavigateToPrediction={() => setCurrentTab('prediction')}
            onOpenReportModal={openReportForLocation}
          />
        )}

        {currentTab === 'performance' && <ModelPerformanceView />}
      </main>

      {/* Field Report Ground Observation Modal */}
      <FieldReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        defaultLocation={reportModalLocation}
        reports={fieldReports}
        onReportSubmitted={handleReportSubmitted}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Slope Safe • Smart India Hackathon 2026 (SIH26001)</span>
          <span>Theme: Disaster Management • North Eastern Region (NER) Decision Intelligence</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
