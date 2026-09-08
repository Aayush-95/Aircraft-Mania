import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { aircraftData, aircraftCategories } from "../data/aircraftData";
import { companiesData } from "../data/companiesData";
import AircraftCard from "../ui/cards/AircraftCard";

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
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-sky-400 mb-1">
          <span>✈️</span> Aircraft Fleet & Directory
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Explore Aircraft Catalog
        </h1>
        <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl">
          Search and compare iconic jetliners, military stealth fighters, supersonic legends, and business jets.
        </p>
      </div>

      {/* Control Panel / Filter Bar */}
      <div className="glass-panel rounded-2xl p-5 border border-sky-500/20 bg-slate-900/60 shadow-xl mb-8 space-y-4">
        {/* Top row: Search input + Company dropdown + Sort dropdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Search */}
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
              🔍
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search by aircraft name, role..."
              className="w-full bg-slate-950/80 text-slate-100 text-sm pl-9 pr-8 py-2.5 rounded-xl border border-slate-700/80 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
            />
            {searchQuery && (
              <button
                onClick={() => handleSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Manufacturer Selector */}
          <div>
            <select
              value={selectedCompany}
              onChange={(e) => handleCompanyChange(e.target.value)}
              className="w-full bg-slate-950/80 text-slate-100 text-sm px-3.5 py-2.5 rounded-xl border border-slate-700/80 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
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
              className="w-full bg-slate-950/80 text-slate-100 text-sm px-3.5 py-2.5 rounded-xl border border-slate-700/80 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
            >
              <option value="default">Sort by: Featured</option>
              <option value="speed-desc">Sort by: Top Speed (Fastest)</option>
              <option value="range-desc">Sort by: Max Range (Longest)</option>
              <option value="pax-desc">Sort by: Passenger Capacity</option>
              <option value="name-asc">Sort by: Name (A - Z)</option>
            </select>
          </div>
        </div>

        {/* Category Pills Row */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold mr-1">
            Categories:
          </span>
          {aircraftCategories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-sky-500 text-slate-950 shadow-md shadow-sky-500/30"
                    : "bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700/60"
                }`}
              >
                {cat}
              </button>
            );
          })}

          {(selectedCategory !== "All" || selectedCompany !== "All" || searchQuery) && (
            <button
              onClick={handleResetFilters}
              className="ml-auto text-xs text-rose-400 hover:text-rose-300 font-medium underline flex items-center gap-1"
            >
              Reset Filters ↺
            </button>
          )}
        </div>
      </div>

      {/* Results Meta Info */}
      <div className="flex justify-between items-center mb-6 text-sm text-slate-400">
        <div>
          Showing <span className="text-sky-300 font-bold">{filteredAircraft.length}</span> of {aircraftData.length} aircraft models
        </div>
        <Link to="/compare" className="text-sky-400 hover:text-sky-300 font-semibold text-xs sm:text-sm">
          ⚖️ Compare Aircraft Specs →
        </Link>
      </div>

      {/* Aircraft Grid */}
      {filteredAircraft.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAircraft.map((plane) => (
            <AircraftCard key={plane.id} aircraft={plane} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="glass-panel p-12 rounded-2xl border border-sky-500/20 text-center max-w-lg mx-auto my-12">
          <span className="text-5xl block mb-3">📡</span>
          <h3 className="text-xl font-bold text-white mb-2">No Aircraft Found</h3>
          <p className="text-sm text-slate-400 mb-6">
            We couldn't find any aircraft matching your search filters. Try adjusting your search query or selecting "All".
          </p>
          <button
            onClick={handleResetFilters}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-sky-500 hover:bg-sky-400 text-slate-950 transition"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default AircraftsPage;
