import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, X, RotateCcw, Scale, Filter } from "lucide-react";
import { aircraftData, aircraftCategories } from "../data/aircraftData";
import AircraftCard from "../ui/cards/AircraftCard";
import ThemeToggle from "../ui/buttons/ThemeToggle";

const AircraftsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read initial states from URL query parameters
  const initialCategory = searchParams.get("category") || "All";
  const initialCompany = searchParams.get("company") || "All";
  const initialSearch = searchParams.get("search") || "";

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedCompany, setSelectedCompany] = useState(initialCompany);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState("default");

  // Keep state synced if URL parameters change
  useEffect(() => {
    setSelectedCategory(searchParams.get("category") || "All");
    setSelectedCompany(searchParams.get("company") || "All");
    setSearchQuery(searchParams.get("search") || "");
  }, [searchParams]);

  // Sync state changes back to URL
  const updateFilters = (newCat, newComp, newQuery) => {
    const params = new URLSearchParams();
    if (newCat && newCat !== "All") params.set("category", newCat);
    if (newComp && newComp !== "All") params.set("company", newComp);
    if (newQuery && newQuery.trim()) params.set("search", newQuery.trim());
    setSearchParams(params, { replace: true });
  };

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    updateFilters(cat, selectedCompany, searchQuery);
  };

  const handleCompanyChange = (comp) => {
    setSelectedCompany(comp);
    updateFilters(selectedCategory, comp, searchQuery);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    updateFilters(selectedCategory, selectedCompany, query);
  };

  const handleResetFilters = () => {
    setSelectedCategory("All");
    setSelectedCompany("All");
    setSearchQuery("");
    setSortBy("default");
    setSearchParams({}, { replace: true });
  };

  // Filter and sort aircraft
  const filteredAircraft = useMemo(() => {
    return aircraftData
      .filter((plane) => {
        // Category filter
        if (selectedCategory !== "All" && plane.category !== selectedCategory) {
          return false;
        }
        // Company / Manufacturer filter
        if (selectedCompany !== "All") {
          const compMatch = plane.manufacturer.toLowerCase().includes(selectedCompany.toLowerCase());
          if (!compMatch) return false;
        }
        // Text Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = plane.name.toLowerCase().includes(q);
          const matchesMfr = plane.manufacturer.toLowerCase().includes(q);
          const matchesRole = plane.role.toLowerCase().includes(q);
          const matchesDesc = plane.description.toLowerCase().includes(q);
          if (!matchesName && !matchesMfr && !matchesRole && !matchesDesc) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "speed-desc") return b.speedMach - a.speedMach;
        if (sortBy === "range-desc") return b.maxRangeKm - a.maxRangeKm;
        if (sortBy === "pax-desc") return b.passengerCapacity - a.passengerCapacity;
        if (sortBy === "name-asc") return a.name.localeCompare(b.name);
        return 0; // Default
      });
  }, [selectedCategory, selectedCompany, searchQuery, sortBy]);

  // Unique manufacturers for dropdown
  const manufacturers = ["All", ...Array.from(new Set(aircraftData.map(a => a.manufacturer)))];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      {/* Header Banner */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-sky-600 dark:text-sky-400 mb-1 font-semibold">
            <span>Global Fleet Catalog & Telemetry Archive</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display">
            Aircraft Fleet Catalog
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed">
            Filter and examine certified technical specifications for commercial airliners, tactical stealth fighters, supersonic legends, and long-range transports.
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-2">
          <ThemeToggle showLabel className="px-3 py-2 text-xs" />
        </div>
      </div>

      {/* Control Panel / Filter Bar */}
      <div className="aero-panel rounded-xl p-4 border border-slate-200 dark:border-[#1a3254] bg-white dark:bg-[#0c182b] mb-6 space-y-4 shadow-xs transition-colors">
        {/* Top row: Search input + Company dropdown + Sort dropdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-sky-600 dark:text-sky-400/70 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search by model, role, designation..."
              className="w-full bg-slate-50 dark:bg-[#07101f] text-slate-900 dark:text-slate-100 text-xs pl-9 pr-7 py-2.5 rounded-lg border border-slate-300 dark:border-[#1a3254] focus:outline-none focus:bg-white dark:focus:bg-[#07101f] focus:border-sky-600 dark:focus:border-sky-400 font-mono"
            />
            {searchQuery && (
              <button
                onClick={() => handleSearchChange("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Manufacturer Selector */}
          <div>
            <select
              value={selectedCompany}
              onChange={(e) => handleCompanyChange(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#07101f] text-slate-900 dark:text-slate-100 text-xs px-3 py-2.5 rounded-lg border border-slate-300 dark:border-[#1a3254] focus:outline-none focus:bg-white dark:focus:bg-[#07101f] focus:border-sky-600 dark:focus:border-sky-400 font-display"
            >
              <option value="All">All Manufacturers</option>
              {manufacturers.filter(m => m !== "All").map((mfr) => (
                <option key={mfr} value={mfr}>{mfr}</option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#07101f] text-slate-900 dark:text-slate-100 text-xs px-3 py-2.5 rounded-lg border border-slate-300 dark:border-[#1a3254] focus:outline-none focus:bg-white dark:focus:bg-[#07101f] focus:border-sky-600 dark:focus:border-sky-400 font-display"
            >
              <option value="default">Sort: Default Order</option>
              <option value="speed-desc">Sort: Max Airspeed (Mach)</option>
              <option value="range-desc">Sort: Max Range (Distance)</option>
              <option value="pax-desc">Sort: Passenger Capacity</option>
              <option value="name-asc">Sort: Model Name (A - Z)</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills Row */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-[#1a3254]">
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 dark:text-sky-400/80 font-semibold mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-sky-600 dark:text-sky-400/60" />
            <span>Class:</span>
          </span>
          {aircraftCategories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                  isActive
                    ? "bg-sky-600 text-white font-semibold shadow-xs"
                    : "bg-slate-100 dark:bg-[#07101f] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#10223b] border border-slate-200 dark:border-[#1a3254]"
                }`}
              >
                {cat}
              </button>
            );
          })}

          {(selectedCategory !== "All" || selectedCompany !== "All" || searchQuery) && (
            <button
              onClick={handleResetFilters}
              className="ml-auto text-xs text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 font-mono flex items-center gap-1 transition-colors font-semibold"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Meta Info */}
      <div className="flex justify-between items-center mb-5 text-xs text-slate-500 font-mono">
        <div>
          Displaying <span className="text-slate-900 dark:text-white font-bold">{filteredAircraft.length}</span> of {aircraftData.length} records
        </div>
        <Link to="/compare" className="text-sky-600 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300 flex items-center gap-1 font-semibold">
          <Scale className="w-3.5 h-3.5" />
          <span>Launch Telemetry Comparison →</span>
        </Link>
      </div>

      {/* Aircraft Grid */}
      {filteredAircraft.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAircraft.map((plane) => (
            <AircraftCard key={plane.id} aircraft={plane} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="aero-panel p-12 rounded-xl border border-slate-200 dark:border-[#1a3254] text-center max-w-md mx-auto my-12 bg-white dark:bg-[#0c182b] shadow-xs transition-colors">
          <Filter className="w-10 h-10 text-slate-400 dark:text-sky-400/40 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 font-display">No Aircraft Matching Criteria</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 leading-relaxed">
            No technical dossiers match your query. Adjust search terms or clear active filters to view the full directory.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white transition-colors shadow-xs"
          >
            Clear All Active Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default AircraftsPage;
