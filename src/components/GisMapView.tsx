import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Layers, Info, Navigation, ZoomIn, ZoomOut, AlertTriangle, ShieldCheck } from 'lucide-react';
import { MonitoredLocation, RiskLevel } from '../types';

declare global {
  interface Window {
    L: any;
  }
}

interface GisMapViewProps {
  locations: MonitoredLocation[];
  onSelectForPrediction: (loc: MonitoredLocation) => void;
}

export const GisMapView: React.FC<GisMapViewProps> = ({ locations, onSelectForPrediction }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  const [filterLevel, setFilterLevel] = useState<string>('ALL');
  const [selectedLocation, setSelectedLocation] = useState<MonitoredLocation | null>(null);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Check if Leaflet is loaded
    if (typeof window !== 'undefined' && window.L && !mapInstanceRef.current) {
      const map = window.L.map(mapContainerRef.current).setView([25.8, 92.8], 7);

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '© OpenStreetMap contributors | Slope Safe NER Surveillance'
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers when locations or filterLevel changes
  useEffect(() => {
    if (!mapInstanceRef.current || !window.L) return;

    const map = mapInstanceRef.current;

    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const getColor = (level: string) => {
      switch (level) {
        case 'CRITICAL': return '#ef4444';
        case 'HIGH': return '#f97316';
        case 'MODERATE': return '#f59e0b';
        default: return '#10b981';
      }
    };

    const filtered = filterLevel === 'ALL'
      ? locations
      : locations.filter((l) => (l.severity || l.risk_level) === filterLevel);

    filtered.forEach((loc) => {
      const color = getColor(loc.severity || loc.risk_level || 'LOW');

      const circle = window.L.circleMarker([loc.latitude, loc.longitude], {
        radius: 12,
        fillColor: color,
        color: '#ffffff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.85
      }).addTo(map);

      circle.on('click', () => {
        setSelectedLocation(loc);
      });

      const popupHtml = `
        <div style="font-family: system-ui, sans-serif; min-width: 220px; color: #0f172a; padding: 4px;">
          <h4 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 700;">${loc.location}</h4>
          <div style="font-size: 11px; margin-bottom: 6px;">
            <span style="background-color: ${color}20; color: ${color}; font-weight: 700; padding: 2px 6px; border-radius: 4px; border: 1px solid ${color}40;">
              ${loc.severity || loc.risk_level} RISK (${loc.risk_score || 75}%)
            </span>
          </div>
          <div style="font-size: 11px; color: #475569; margin-bottom: 4px;">
            <strong>Rainfall:</strong> ${loc.rainfall} mm | <strong>Moisture:</strong> ${loc.soil_moisture}%<br>
            <strong>Slope:</strong> ${loc.slope}° | <strong>Soil:</strong> ${loc.soil_type.toUpperCase()}
          </div>
          <div style="font-size: 11px; color: #1e293b; background: #f1f5f9; padding: 6px; border-radius: 4px; margin-top: 6px;">
            <strong>Recommended SOP:</strong><br>${loc.recommended_action || 'Routine patrol.'}
          </div>
        </div>
      `;

      circle.bindPopup(popupHtml);
      markersRef.current.push(circle);
    });
  }, [locations, filterLevel]);

  const flyToCoords = (lat: number, lng: number, zoom = 11) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([lat, lng], zoom, { duration: 1.5 });
    }
  };

  return (
    <div className="space-y-6 py-4">
      {/* Disclaimer Notice */}
      <div className="bg-blue-950/30 border-l-4 border-blue-500 p-4 rounded-r-lg text-xs text-blue-200 flex items-start gap-3 shadow-sm">
        <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-blue-300 font-semibold">GIS Surveillance Layer:</strong> Monitored locations mapped below are calibrated prototype nodes along sensitive transport lifelines (NH-29 Dimapur-Kohima, Gangtok-Nathu La JN Road, Sairang-Aizawl Railway). Real operational deployment connects to state sensor networks and automatic weather stations (AWS).
        </div>
      </div>

      {/* Map Control Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">GIS Landslide Risk Map</h1>
          <p className="text-xs text-slate-400 mt-1">Spatial intelligence mapping topography and failure hazard across Northeast India.</p>
        </div>

        {/* Filters and Navigation Shortcuts */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Filter Severity:</span>
          {['ALL', 'CRITICAL', 'HIGH', 'MODERATE', 'LOW'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilterLevel(lvl)}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                filterLevel === lvl
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Corridor Focus Buttons */}
      <div className="flex flex-wrap items-center gap-2 text-xs bg-slate-900 border border-slate-800 p-2.5 rounded-lg">
        <span className="text-slate-400 font-medium flex items-center gap-1">
          <Navigation className="w-3.5 h-3.5 text-blue-400" />
          Focus Corridor:
        </span>
        <button
          onClick={() => flyToCoords(25.6751, 94.1086, 12)}
          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
        >
          Kohima NH-29 Bypass (Nagaland)
        </button>
        <button
          onClick={() => flyToCoords(27.3389, 88.6065, 12)}
          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
        >
          Gangtok JN Road (Sikkim)
        </button>
        <button
          onClick={() => flyToCoords(23.7785, 92.6562, 12)}
          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
        >
          Aizawl Sairang Ridge (Mizoram)
        </button>
        <button
          onClick={() => flyToCoords(25.5788, 91.8933, 11)}
          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
        >
          Shillong Peak Slopes (Meghalaya)
        </button>
        <button
          onClick={() => flyToCoords(25.8, 92.8, 7)}
          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-blue-400 border border-slate-700"
        >
          Reset NER View
        </button>
      </div>

      {/* Main Map Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg relative">
          <div
            id="gis-map-canvas"
            ref={mapContainerRef}
            className="w-full h-[540px] bg-slate-950"
          />

          {/* Floating Map Legend */}
          <div className="absolute bottom-4 right-4 z-[500] bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-3 rounded-lg text-[11px] text-slate-300 shadow-xl space-y-1.5">
            <span className="font-bold text-slate-100 block border-b border-slate-700 pb-1">Risk Classification</span>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Low (0–24%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>Moderate (25–49%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
              <span>High (50–74%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>Critical (75–100%)</span>
            </div>
          </div>
        </div>

        {/* Location Details Sidebar (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          {selectedLocation ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Node Details</span>
                <h3 className="text-base font-bold text-slate-100 mt-1">{selectedLocation.location}</h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Lat: {selectedLocation.latitude.toFixed(4)}°, Lng: {selectedLocation.longitude.toFixed(4)}°
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Risk Level:</span>
                  <span className="font-bold text-slate-100">
                    {selectedLocation.severity || selectedLocation.risk_level} ({selectedLocation.risk_score || 78}%)
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">24h Rainfall:</span>
                  <span className="text-blue-300 font-mono">{selectedLocation.rainfall} mm</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Soil Moisture:</span>
                  <span className="text-cyan-300 font-mono">{selectedLocation.soil_moisture}%</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Slope Angle:</span>
                  <span className="text-amber-300 font-mono">{selectedLocation.slope}°</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Soil Geological Profile:</span>
                  <span className="text-slate-200 font-semibold uppercase">{selectedLocation.soil_type}</span>
                </div>
              </div>

              {/* Recommended Action */}
              <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 text-xs space-y-1">
                <span className="font-semibold text-amber-300">Action Advisory:</span>
                <p className="text-slate-300 leading-relaxed">
                  {selectedLocation.recommended_action || 'Routine monitoring.'}
                </p>
              </div>

              <button
                onClick={() => onSelectForPrediction(selectedLocation)}
                className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors"
              >
                Load Node into AI Prediction Model
              </button>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center space-y-3 h-full flex flex-col items-center justify-center">
              <MapPin className="w-10 h-10 text-slate-600" />
              <div className="max-w-xs">
                <h4 className="text-sm font-bold text-slate-300">Select a Corridor Node</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Click any marker on the GIS map to view localized pore pressure, slope angle, risk score, and standard operating response protocols.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
