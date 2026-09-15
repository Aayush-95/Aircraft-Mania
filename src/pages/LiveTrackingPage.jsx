import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Radio, 
  RefreshCw, 
  Globe, 
  Plane, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  Gauge, 
  Compass, 
  ChevronRight,
  Wifi,
  WifiOff
} from "lucide-react";
import { 
  fetchLiveFlights, 
  RADAR_REGIONS 
} from "../services/openSkyService";
import LiveFlightMap from "../components/radar/LiveFlightMap";
import FlightDossierPanel from "../components/radar/FlightDossierPanel";
import FlightRadarSidebar from "../components/radar/FlightRadarSidebar";

const REFRESH_INTERVAL_SECONDS = 15; // 15 seconds respects OpenSky's 10s rule

const LiveTrackingPage = () => {
  const [selectedRegionKey, setSelectedRegionKey] = useState("AHMEDABAD_GUJARAT");
  const [customBounds, setCustomBounds] = useState(null);
  const [flights, setFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [apiSource, setApiSource] = useState("opensky");
  const [statusMessage, setStatusMessage] = useState("Connecting to OpenSky Network...");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL_SECONDS);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const countdownTimerRef = useRef(null);
  const activeRegion = RADAR_REGIONS[selectedRegionKey] || RADAR_REGIONS.AHMEDABAD_GUJARAT;

  // Load flight data from OpenSky
  const loadFlights = useCallback(async (regionKey = selectedRegionKey, bounds = customBounds) => {
    setIsLoading(true);
    try {
      const data = await fetchLiveFlights(regionKey, bounds);
      setFlights(data.flights);
      setApiSource(data.source);
      setStatusMessage(data.statusMessage);
      setLastUpdated(data.timestamp);

      // If a flight was previously selected, try to update its object with fresh coordinates
      setSelectedFlight((prev) => {
        if (!prev) return null;
        const updated = data.flights.find((f) => f.id === prev.id);
        return updated || prev;
      });
    } catch (err) {
      console.error("[Radar Page] Error updating flights:", err);
      setStatusMessage("Radar Telemetry Signal Interrupted");
    } finally {
      setIsLoading(false);
      setCountdown(REFRESH_INTERVAL_SECONDS);
    }
  }, [selectedRegionKey, customBounds]);

  // Initial load
  useEffect(() => {
    loadFlights(selectedRegionKey, customBounds);
  }, [selectedRegionKey, customBounds, loadFlights]);

  // Auto-refresh countdown loop
  useEffect(() => {
    if (!autoRefresh) {
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
      return;
    }

    countdownTimerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          loadFlights(selectedRegionKey, customBounds);
          return REFRESH_INTERVAL_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    };
  }, [autoRefresh, selectedRegionKey, customBounds, loadFlights]);

  // Handle region switch
  const handleSelectRegion = (key) => {
    setSelectedRegionKey(key);
    setCustomBounds(null); // Reset custom bounds to region default
    setSelectedFlight(null);
  };

  // Handle scanning current viewport bounds
  const handleScanViewport = (bbox) => {
    setCustomBounds(bbox);
    loadFlights(selectedRegionKey, bbox);
  };

  // Telemetry Aggregates
  const airborneCount = flights.filter((f) => !f.onGround).length;
  const groundCount = flights.filter((f) => f.onGround).length;
  const maxAltitude = flights.reduce((max, f) => (f.altitudeFeet && f.altitudeFeet > max ? f.altitudeFeet : max), 0);
  const avgSpeed = flights.length > 0
    ? Math.round(flights.reduce((sum, f) => sum + (f.velocityKts || 0), 0) / flights.length)
    : 0;

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f7fb] dark:bg-[#060d19] text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Telemetry Header Bar */}
      <div className="border-b border-slate-200 dark:border-[#1a3254] bg-white/95 dark:bg-[#071224]/95 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Title & Live Status */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-500/15 border border-sky-200 dark:border-sky-400/30 flex items-center justify-center text-sky-600 dark:text-sky-400 shadow-xs">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold font-display tracking-tight text-slate-900 dark:text-white">
                  Live Global Flight Radar
                </h1>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>
              <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
                Real-Time ADS-B / Mode-S Transponder Telemetry via OpenSky Network
              </p>
            </div>
          </div>

          {/* Quick Metrics & Auto-Refresh Controls */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            {/* API Status Badge */}
            <div
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[11px] ${
                apiSource === "opensky"
                  ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30"
                  : "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30"
              }`}
            >
              {apiSource === "opensky" ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              <span className="font-semibold">
                {apiSource === "opensky" ? "OpenSky Live Feed" : "Telemetry Emulation Mode"}
              </span>
            </div>

            {/* Countdown / Refresh Button */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#0c182b] border border-slate-200 dark:border-[#1a3254] rounded-md px-2.5 py-1">
              <Clock className="w-3 h-3 text-slate-400" />
              <span className="text-slate-600 dark:text-slate-300">
                {autoRefresh ? `${countdown}s` : "Paused"}
              </span>
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className="ml-1 text-[10px] text-sky-600 dark:text-sky-400 hover:underline"
              >
                {autoRefresh ? "Pause" : "Resume"}
              </button>
            </div>

            {/* Manual Refresh Button */}
            <button
              onClick={() => loadFlights(selectedRegionKey, customBounds)}
              disabled={isLoading}
              className="p-1.5 px-2.5 rounded-md bg-sky-600 hover:bg-sky-500 text-white font-semibold flex items-center gap-1.5 shadow-xs transition-colors disabled:opacity-50"
              title="Ping Radar for latest positions"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span>Sweep</span>
            </button>
          </div>
        </div>

        {/* Global Regional Sector Selector Pills */}
        <div className="max-w-7xl mx-auto mt-3 pt-2.5 border-t border-slate-100 dark:border-[#1a3254]/60 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-mono text-slate-400 uppercase mr-1 whitespace-nowrap flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-sky-500" />
            Sectors:
          </span>
          {customBounds && (
            <button
              onClick={() => setCustomBounds(null)}
              className="px-3 py-1 rounded-md text-xs font-mono whitespace-nowrap bg-emerald-600 text-white font-bold flex items-center gap-1.5 shadow-sm hover:bg-emerald-500 transition-colors"
              title="Click to reset to regional sector preset"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span>📍 Custom Zoomed Airspace (Reset)</span>
            </button>
          )}
          {Object.entries(RADAR_REGIONS).map(([key, region]) => (
            <button
              key={key}
              onClick={() => handleSelectRegion(key)}
              className={`px-3 py-1 rounded-md text-xs font-mono whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                selectedRegionKey === key && !customBounds
                  ? "bg-sky-600 text-white font-bold shadow-xs"
                  : "bg-slate-100 dark:bg-[#0c182b] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#12243d] border border-slate-200 dark:border-[#1a3254]"
              }`}
            >
              <span>{region.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Radar Screen Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-4">
        {/* Telemetry Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-white dark:bg-[#071224] border border-slate-200 dark:border-[#1a3254] shadow-xs">
            <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase flex items-center gap-1.5">
              <Plane className="w-3.5 h-3.5 text-sky-500" />
              <span>Tracked Targets</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white mt-0.5">
              {flights.length}{" "}
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                ({airborneCount} airborne)
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-[#071224] border border-slate-200 dark:border-[#1a3254] shadow-xs">
            <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
              <span>Highest Cruise</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white mt-0.5">
              {maxAltitude > 0 ? `FL${Math.round(maxAltitude / 100)}` : "FL000"}{" "}
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                ({maxAltitude.toLocaleString()} ft)
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-[#071224] border border-slate-200 dark:border-[#1a3254] shadow-xs">
            <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-emerald-500" />
              <span>Average Airspeed</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white mt-0.5">
              {avgSpeed}{" "}
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400">kts</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-[#071224] border border-slate-200 dark:border-[#1a3254] shadow-xs">
            <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-indigo-500" />
              <span>Active Sector</span>
            </div>
            <div className="text-sm sm:text-base font-bold font-display text-slate-900 dark:text-white mt-1 truncate">
              {customBounds ? "Custom Airspace Bounding Box" : activeRegion.name}
            </div>
          </div>
        </div>

        {/* Map & Panels Viewport */}
        <div className="relative flex-1 flex flex-col lg:flex-row gap-4 min-h-[620px]">
          {/* Left / Bottom Sidebar: Flight List */}
          <div className="order-2 lg:order-1 h-[340px] lg:h-auto">
            <FlightRadarSidebar
              flights={flights}
              selectedFlight={selectedFlight}
              onSelectFlight={(flight) => setSelectedFlight(flight)}
              isOpen={sidebarOpen}
              onToggleOpen={() => setSidebarOpen(!sidebarOpen)}
            />
          </div>

          {/* Center Map */}
          <div className="order-1 lg:order-2 flex-1 h-[450px] lg:h-auto relative">
            <LiveFlightMap
              flights={flights}
              selectedFlight={selectedFlight}
              onSelectFlight={(flight) => setSelectedFlight(flight)}
              regionCenter={activeRegion.center}
              regionZoom={activeRegion.zoom}
              onScanViewport={handleScanViewport}
            />

            {/* Selected Flight Dossier Sliding Overlay */}
            {selectedFlight && (
              <div className="absolute top-4 right-4 z-20 max-w-[90vw]">
                <FlightDossierPanel
                  flight={selectedFlight}
                  onClose={() => setSelectedFlight(null)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTrackingPage;
