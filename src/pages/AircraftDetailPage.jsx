import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { aircraftData } from "../data/aircraftData";
import AircraftCard from "../ui/cards/AircraftCard";

const AircraftDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const aircraft = aircraftData.find((a) => a.id === id);

  if (!aircraft) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <span className="text-6xl block mb-4">🛬</span>
        <h1 className="text-3xl font-extrabold text-white mb-2">Aircraft Not Found</h1>
        <p className="text-slate-400 mb-6">
          The aircraft specification file you are looking for does not exist in our telemetry database.
        </p>
        <Link
          to="/aircrafts"
          className="px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm inline-block"
        >
          Return to Aircraft Catalog
        </Link>
      </div>
    );
  }

  // Related aircraft
  const relatedAircraft = aircraftData
    .filter((a) => a.id !== aircraft.id && (a.category === aircraft.category || a.manufacturer === aircraft.manufacturer))
    .slice(0, 3);

  return (
    <div className="min-h-screen pb-20">
      {/* Top Navigation & Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-sky-300 font-medium transition"
        >
          <span>←</span> Back to Previous
        </button>

        <div className="flex items-center gap-3">
          <Link
            to={`/compare?aircraft1=${aircraft.id}`}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-400/30 text-sky-300 text-xs font-semibold transition"
          >
            <span>⚖️ Compare this Aircraft</span>
          </Link>
        </div>
      </div>

      {/* Hero Visual Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden border border-sky-500/25 shadow-2xl bg-slate-950">
          <div className="relative h-[320px] sm:h-[450px] w-full">
            <img
              src={aircraft.image}
              alt={aircraft.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/images/aircraft/boeing-787-dreamliner.jpg";
              }}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            
            {/* Overlay Info */}
            <div className="absolute bottom-6 sm:bottom-10 left-6 sm:left-10 right-6 sm:right-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/20 backdrop-blur-md border border-sky-400/40 text-sky-300">
                    {aircraft.category}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md border ${
                    aircraft.status.includes("In Service") 
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" 
                      : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                  }`}>
                    {aircraft.status}
                  </span>
                  <span className="text-xs font-mono text-slate-300 backdrop-blur-md px-2.5 py-1 rounded bg-slate-900/60 border border-slate-700">
                    First Flight: {aircraft.firstFlight}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight">
                  {aircraft.name}
                </h1>
                
                <p className="text-sky-400 font-medium text-base sm:text-lg mt-1">
                  Engineered by <strong className="text-white">{aircraft.manufacturer}</strong> • {aircraft.role}
                </p>
              </div>

              {/* Quick speed & range badges */}
              <div className="flex gap-3">
                <div className="p-3 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-sky-500/30 text-center min-w-[100px]">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-medium">Speed</span>
                  <span className="text-xl sm:text-2xl font-black text-sky-400 font-mono">Mach {aircraft.speedMach}</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-sky-500/30 text-center min-w-[100px]">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-medium">Range</span>
                  <span className="text-xl sm:text-2xl font-black text-slate-200 font-mono">{aircraft.maxRangeKm.toLocaleString()} km</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Description, Specs Table, Fun facts */}
        <div className="lg:col-span-2 space-y-8">
          {/* Overview & Design Story */}
          <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-sky-500/20 bg-slate-900/60 shadow-xl">
            <h2 className="text-2xl font-extrabold text-white mb-4 flex items-center gap-2">
              <span>📖</span> Aircraft Overview & Engineering
            </h2>
            <p className="text-slate-300 leading-relaxed text-base sm:text-lg">
              {aircraft.description}
            </p>
          </div>

          {/* Technical Specifications Grid */}
          <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-sky-500/20 bg-slate-900/60 shadow-xl">
            <h2 className="text-2xl font-extrabold text-white mb-6 flex items-center gap-2">
              <span>⚙️</span> Technical Specifications
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-xs text-slate-400 uppercase tracking-wider block">Top Speed</span>
                <span className="text-base font-bold text-sky-300 font-mono">{aircraft.topSpeed}</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-xs text-slate-400 uppercase tracking-wider block">Typical Cruise Speed</span>
                <span className="text-base font-bold text-slate-200 font-mono">{aircraft.cruiseSpeed}</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-xs text-slate-400 uppercase tracking-wider block">Max Range</span>
                <span className="text-base font-bold text-slate-200 font-mono">{aircraft.maxRange}</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-xs text-slate-400 uppercase tracking-wider block">Capacity</span>
                <span className="text-base font-bold text-slate-200 font-mono">
                  {aircraft.passengerCapacity > 6 ? `${aircraft.passengerCapacity} Passengers` : `${aircraft.passengerCapacity} Crew Members`}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-xs text-slate-400 uppercase tracking-wider block">Wingspan</span>
                <span className="text-base font-bold text-slate-200 font-mono">{aircraft.wingspan}</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-xs text-slate-400 uppercase tracking-wider block">Overall Length</span>
                <span className="text-base font-bold text-slate-200 font-mono">{aircraft.length}</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-xs text-slate-400 uppercase tracking-wider block">Overall Height</span>
                <span className="text-base font-bold text-slate-200 font-mono">{aircraft.height}</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-xs text-slate-400 uppercase tracking-wider block">Max Takeoff Weight (MTOW)</span>
                <span className="text-base font-bold text-slate-200 font-mono">{aircraft.maxTakeoffWeight}</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-xs text-slate-400 uppercase tracking-wider block">Service Ceiling</span>
                <span className="text-base font-bold text-slate-200 font-mono">{aircraft.serviceCeiling}</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-xs text-slate-400 uppercase tracking-wider block">Fuel Capacity</span>
                <span className="text-base font-bold text-slate-200 font-mono">{aircraft.fuelCapacity}</span>
              </div>
            </div>

            {/* Engines Banner */}
            <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-sky-950/40 to-slate-900 border border-sky-500/20">
              <span className="text-xs text-sky-400 font-mono uppercase tracking-wider block font-semibold">
                Propulsion & Powerplants
              </span>
              <p className="text-base font-medium text-slate-100 mt-1">
                {aircraft.engines}
              </p>
            </div>
          </div>

          {/* Fun Facts */}
          {aircraft.funFacts && aircraft.funFacts.length > 0 && (
            <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-sky-500/20 bg-slate-900/60 shadow-xl">
              <h2 className="text-2xl font-extrabold text-white mb-6 flex items-center gap-2">
                <span>💡</span> Fascinating Aviation Facts
              </h2>
              <div className="space-y-4">
                {aircraft.funFacts.map((fact, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-xl bg-slate-950/50 border border-slate-800/80"
                  >
                    <div className="w-7 h-7 rounded-full bg-sky-500/20 text-sky-300 flex items-center justify-center font-bold text-xs shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {fact}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Manufacturer Sidebar & Actions */}
        <div className="space-y-6">
          {/* Compare Card CTA */}
          <div className="glass-panel rounded-2xl p-6 border border-sky-500/30 bg-gradient-to-b from-sky-950/40 to-slate-900/80 text-center">
            <span className="text-4xl block mb-2">⚖️</span>
            <h3 className="text-lg font-bold text-white mb-1">
              Compare with Another Aircraft
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Put this {aircraft.name} head-to-head against any competitor to analyze speed, range, and dimensions.
            </p>
            <Link
              to={`/compare?aircraft1=${aircraft.id}`}
              className="w-full py-2.5 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm block transition shadow-lg shadow-sky-500/20"
            >
              Launch Comparison Tool
            </Link>
          </div>

          {/* Manufacturer Profile */}
          <div className="glass-panel rounded-2xl p-6 border border-sky-500/20 bg-slate-900/60">
            <span className="text-xs font-mono uppercase tracking-wider text-sky-400 block mb-2">
              Manufacturer Profile
            </span>
            <h3 className="text-xl font-bold text-white">
              {aircraft.manufacturer}
            </h3>
            <p className="text-xs text-slate-400 mt-2">
              Click below to view all aircraft in our directory produced by {aircraft.manufacturer}.
            </p>
            <Link
              to={`/aircrafts?company=${encodeURIComponent(aircraft.manufacturer)}`}
              className="mt-4 inline-block text-xs font-semibold text-sky-400 hover:text-sky-300 hover:underline"
            >
              View {aircraft.manufacturer} Aircraft Fleet →
            </Link>
          </div>

          {/* Suggest Correction */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 bg-slate-900/40 text-xs text-slate-400">
            <span className="font-semibold text-slate-200 block mb-1">Notice an inaccurate spec?</span>
            <p className="mb-3">Our aviation database is constantly curated by the enthusiast community.</p>
            <Link to="/suggest" className="text-sky-400 hover:underline font-medium">
              Submit a correction or aircraft suggestion →
            </Link>
          </div>
        </div>
      </div>

      {/* Related Aircraft Section */}
      {relatedAircraft.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <h2 className="text-2xl font-extrabold text-white mb-6">
            Similar & Related Aircraft
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedAircraft.map((plane) => (
              <AircraftCard key={plane.id} aircraft={plane} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AircraftDetailPage;
