import React, { useState, useMemo } from "react";
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Plane, 
  Navigation, 
  SlidersHorizontal,
  X
} from "lucide-react";

const FlightRadarSidebar = ({
  flights = [],
  selectedFlight = null,
  onSelectFlight,
  isOpen = true,
  onToggleOpen,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [altitudeFilter, setAltitudeFilter] = useState("all"); // 'all' | 'high' | 'mid' | 'low' | 'ground'
  const [sortBy, setSortBy] = useState("altitude"); // 'altitude' | 'speed' | 'callsign' | 'country'
  const [sortAsc, setSortAsc] = useState(false);
  const [displayLimit, setDisplayLimit] = useState(50);

  // Filtered & sorted flight list
  const processedFlights = useMemo(() => {
    let list = flights;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (f) =>
          f.callsign.toLowerCase().includes(q) ||
          f.country.toLowerCase().includes(q) ||
          f.icao24.toLowerCase().includes(q)
      );
    }

    // Altitude filter
    if (altitudeFilter === "high") {
      list = list.filter((f) => !f.onGround && f.altitudeFeet >= 32000);
    } else if (altitudeFilter === "mid") {
      list = list.filter((f) => !f.onGround && f.altitudeFeet >= 10000 && f.altitudeFeet < 32000);
    } else if (altitudeFilter === "low") {
      list = list.filter((f) => !f.onGround && f.altitudeFeet < 10000);
    } else if (altitudeFilter === "ground") {
      list = list.filter((f) => f.onGround);
    }

    // Sorting
    return [...list].sort((a, b) => {
      let valA = 0;
      let valB = 0;
      if (sortBy === "altitude") {
        valA = a.altitudeFeet || 0;
        valB = b.altitudeFeet || 0;
      } else if (sortBy === "speed") {
        valA = a.velocityKts || 0;
        valB = b.velocityKts || 0;
      } else if (sortBy === "callsign") {
        return sortAsc
          ? a.callsign.localeCompare(b.callsign)
          : b.callsign.localeCompare(a.callsign);
      } else if (sortBy === "country") {
        return sortAsc
          ? a.country.localeCompare(b.country)
          : b.country.localeCompare(a.country);
      }
      return sortAsc ? valA - valB : valB - valA;
    });
  }, [flights, searchQuery, altitudeFilter, sortBy, sortAsc]);

  if (!isOpen) {
    return (
      <button
        onClick={onToggleOpen}
        className="fixed bottom-6 left-6 z-20 px-4 py-2.5 rounded-lg bg-slate-900/95 dark:bg-[#071224]/95 border border-slate-700 dark:border-[#1a3254] text-white text-xs font-mono flex items-center gap-2 shadow-2xl backdrop-blur-md hover:border-sky-400 transition-colors"
      >
        <SlidersHorizontal className="w-4 h-4 text-sky-400" />
        <span>Show Flight Manifest ({flights.length})</span>
      </button>
    );
  }

  return (
    <div className="w-full lg:w-80 h-full flex flex-col bg-white dark:bg-[#071224] border border-slate-300 dark:border-[#1a3254] rounded-xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="p-3.5 border-b border-slate-200 dark:border-[#1a3254] flex items-center justify-between bg-slate-50/70 dark:bg-[#0c182b]/70">
        <div className="flex items-center gap-2">
          <Plane className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          <h2 className="text-sm font-bold font-display uppercase tracking-wider text-slate-800 dark:text-slate-100">
            Sector Manifest
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300 font-bold">
            {processedFlights.length} / {flights.length}
          </span>
          {onToggleOpen && (
            <button
              onClick={onToggleOpen}
              className="lg:hidden p-1 rounded text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Search Input */}
      <div className="p-3 border-b border-slate-200 dark:border-[#1a3254]">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search Callsign, Country, ICAO..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-slate-100 dark:bg-[#0c182b] border border-slate-300 dark:border-[#1a3254] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 font-mono"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Altitude Filter Tabs */}
        <div className="grid grid-cols-5 gap-1 mt-2">
          {[
            { id: "all", label: "All" },
            { id: "high", label: "FL320+" },
            { id: "mid", label: "Cruising" },
            { id: "low", label: "Approach" },
            { id: "ground", label: "Ground" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setAltitudeFilter(tab.id)}
              className={`py-1 text-[10px] font-mono rounded text-center transition-colors truncate ${
                altitudeFilter === tab.id
                  ? "bg-sky-600 text-white font-bold"
                  : "bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Sort Controls */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px] font-mono text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1">
            <ArrowUpDown className="w-3 h-3 text-slate-400" />
            <span>Sort:</span>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs font-mono text-slate-700 dark:text-slate-300 border-none focus:outline-none cursor-pointer"
            >
              <option value="altitude" className="bg-white dark:bg-slate-900">Altitude</option>
              <option value="speed" className="bg-white dark:bg-slate-900">Speed</option>
              <option value="callsign" className="bg-white dark:bg-slate-900">Callsign</option>
              <option value="country" className="bg-white dark:bg-slate-900">Country</option>
            </select>
            <button
              onClick={() => setSortAsc(!sortAsc)}
              className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-700 dark:text-slate-300 hover:bg-slate-200"
              title="Toggle Ascending/Descending"
            >
              {sortAsc ? "▲" : "▼"}
            </button>
          </div>
        </div>
      </div>

      {/* Flight Cards List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5 divide-y divide-transparent">
        {processedFlights.length === 0 ? (
          <div className="py-12 text-center text-xs font-mono text-slate-400">
            <Plane className="w-8 h-8 mx-auto mb-2 opacity-30 -rotate-45" />
            <p>No flights match criteria in this sector.</p>
          </div>
        ) : (
          <>
            {processedFlights.slice(0, displayLimit).map((flight) => {
              const isSelected = selectedFlight && selectedFlight.id === flight.id;
              return (
                <div
                  key={flight.id}
                  onClick={() => onSelectFlight(flight)}
                  className={`p-2.5 rounded-lg cursor-pointer transition-all border ${
                    isSelected
                      ? "bg-sky-50 dark:bg-sky-950/40 border-sky-500 shadow-sm"
                      : "bg-slate-50/50 dark:bg-[#0c182b]/60 border-slate-200/80 dark:border-[#1a3254] hover:border-sky-400/60 hover:bg-slate-100/70 dark:hover:bg-[#0e203b]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-5 h-5 rounded flex items-center justify-center text-xs"
                        style={{
                          transform: `rotate(${flight.heading || 0}deg)`,
                        }}
                      >
                        <Navigation
                          className={`w-3.5 h-3.5 ${
                            flight.onGround
                              ? "text-slate-400"
                              : flight.altitudeFeet >= 32000
                              ? "text-amber-500"
                              : flight.altitudeFeet < 10000
                              ? "text-emerald-500"
                              : "text-sky-400"
                          }`}
                        />
                      </div>
                      <span className="font-bold font-mono text-sm text-slate-900 dark:text-white">
                        {flight.callsign}
                      </span>
                    </div>

                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                        flight.onGround
                          ? "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                          : "bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300"
                      }`}
                    >
                      {flight.flightLevel}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    <span className="truncate max-w-[120px]">{flight.country}</span>
                    <div className="flex items-center gap-2">
                      <span>{flight.velocityKts} kts</span>
                      <span>•</span>
                      <span>{flight.heading}°</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {processedFlights.length > displayLimit && (
              <div className="pt-2 text-center pb-2">
                <button
                  onClick={() => setDisplayLimit((prev) => prev + 50)}
                  className="w-full py-2 px-3 rounded-md bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-[#1a3254] transition-colors"
                >
                  Show More ({processedFlights.length - displayLimit} remaining)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FlightRadarSidebar;
