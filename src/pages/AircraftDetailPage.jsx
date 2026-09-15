import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Scale, 
  BookOpen, 
  Sliders, 
  Lightbulb, 
  AlertCircle,
  ArrowRight
} from "lucide-react";
import { aircraftData } from "../data/aircraftData";
import AircraftCard from "../ui/cards/AircraftCard";
import ThemeToggle from "../ui/buttons/ThemeToggle";

const AircraftDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const aircraft = aircraftData.find((a) => a.id === id);

  if (!aircraft) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 font-display">Aircraft Record Not Found</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
          The requested aircraft specification file does not exist in the active telemetry database.
        </p>
        <Link
          to="/aircrafts"
          className="px-5 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs inline-flex items-center gap-2 shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Catalog</span>
        </Link>
      </div>
    );
  }

  const isInService = aircraft.status.includes("In Service");

  // Related aircraft
  const relatedAircraft = aircraftData
    .filter((a) => a.id !== aircraft.id && (a.category === aircraft.category || a.manufacturer === aircraft.manufacturer))
    .slice(0, 3);

  return (
    <div className="min-h-screen pb-20">
      {/* Top Navigation & Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4 flex items-center justify-between border-b border-slate-200 dark:border-[#1a3254] mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs font-mono uppercase text-slate-600 dark:text-sky-400/80 hover:text-slate-900 dark:hover:text-sky-300 transition-colors font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
          <span>Back to Fleet Index</span>
        </button>

        <div className="flex items-center gap-3">
          <ThemeToggle showLabel className="px-2.5 py-1.5 text-xs" />
          <Link
            to={`/compare?aircraft1=${aircraft.id}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-[#0c182b] hover:bg-slate-50 dark:hover:bg-[#10233d] border border-slate-300 dark:border-[#1a3254] text-slate-700 dark:text-sky-300 hover:text-sky-700 dark:hover:text-white text-xs font-mono transition-colors shadow-xs"
          >
            <Scale className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>Compare Telemetry</span>
          </Link>
        </div>
      </div>

      {/* Hero Visual Dossier Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-[#1a3254] bg-slate-900 shadow-md dark:shadow-2xl">
          <div className="relative h-[320px] sm:h-[420px] w-full">
            <img
              src={aircraft.image}
              alt={aircraft.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/images/aircraft/boeing-787-dreamliner.jpg";
              }}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
            
            {/* Overlay Telemetry Info */}
            <div className="absolute bottom-6 sm:bottom-8 left-6 sm:left-8 right-6 sm:right-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2.5">
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-mono uppercase font-semibold bg-slate-900/90 text-white border border-slate-700 shadow-xs">
                    {aircraft.category}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded text-[11px] font-mono uppercase font-semibold border flex items-center gap-1.5 shadow-xs ${
                    isInService 
                      ? "bg-emerald-500/90 text-white border-emerald-400" 
                      : "bg-amber-500/90 text-white border-amber-400"
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    <span>{aircraft.status}</span>
                  </span>
                  <span className="text-[11px] font-mono text-slate-200 px-2 py-0.5 rounded bg-slate-900/80 border border-slate-700">
                    First Flight: {aircraft.firstFlight}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight font-display">
                  {aircraft.name}
                </h1>
                
                <p className="text-slate-200 font-medium text-sm sm:text-base mt-1 drop-shadow-sm">
                  Engineered by <strong className="text-sky-300">{aircraft.manufacturer}</strong> • {aircraft.role}
                </p>
              </div>

              {/* Quick telemetry blocks */}
              <div className="flex gap-2">
                <div className="p-3 rounded-xl bg-slate-900/95 border border-slate-700 text-center min-w-[95px] shadow-lg">
                  <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">Max Speed</span>
                  <span className="text-lg sm:text-xl font-bold text-amber-400 font-mono">M {aircraft.speedMach}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/95 border border-slate-700 text-center min-w-[95px] shadow-lg">
                  <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">Max Range</span>
                  <span className="text-lg sm:text-xl font-bold text-sky-300 font-mono">{aircraft.maxRangeKm.toLocaleString()} km</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Description, Specs Table, Fun facts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overview */}
          <div className="aero-panel rounded-xl p-6 border border-slate-200 dark:border-[#1a3254] bg-white dark:bg-[#0c182b] shadow-xs transition-colors">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2 font-display">
              <BookOpen className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>Technical Overview & Flight History</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
              {aircraft.description}
            </p>
          </div>

          {/* Technical Specifications Grid */}
          <div className="aero-panel rounded-xl p-6 border border-slate-200 dark:border-[#1a3254] bg-white dark:bg-[#0c182b] shadow-xs transition-colors">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2 font-display">
              <Sliders className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>Certified Telemetry & Operational Limits</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#07101f] border border-slate-200 dark:border-[#1a3254]">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono tracking-wider block">Top Airspeed</span>
                <span className="text-sm font-bold text-amber-600 dark:text-amber-400 font-mono">{aircraft.topSpeed}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#07101f] border border-slate-200 dark:border-[#1a3254]">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono tracking-wider block">Standard Cruise Speed</span>
                <span className="text-sm font-bold text-slate-800 dark:text-sky-200 font-mono">{aircraft.cruiseSpeed}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#07101f] border border-slate-200 dark:border-[#1a3254]">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono tracking-wider block">Operational Range</span>
                <span className="text-sm font-bold text-sky-700 dark:text-sky-300 font-mono">{aircraft.maxRange}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#07101f] border border-slate-200 dark:border-[#1a3254]">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono tracking-wider block">Payload Capacity</span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200 font-mono">
                  {aircraft.passengerCapacity > 6 ? `${aircraft.passengerCapacity} Passengers` : `${aircraft.passengerCapacity} Crew Members`}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#07101f] border border-slate-200 dark:border-[#1a3254]">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono tracking-wider block">Wingspan</span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200 font-mono">{aircraft.wingspan}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#07101f] border border-slate-200 dark:border-[#1a3254]">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono tracking-wider block">Overall Length</span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200 font-mono">{aircraft.length}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#07101f] border border-slate-200 dark:border-[#1a3254]">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono tracking-wider block">Overall Height</span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200 font-mono">{aircraft.height}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#07101f] border border-slate-200 dark:border-[#1a3254]">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono tracking-wider block">Max Takeoff Weight (MTOW)</span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200 font-mono">{aircraft.maxTakeoffWeight}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#07101f] border border-slate-200 dark:border-[#1a3254]">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono tracking-wider block">Service Ceiling</span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200 font-mono">{aircraft.serviceCeiling}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#07101f] border border-slate-200 dark:border-[#1a3254]">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono tracking-wider block">Fuel Capacity</span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200 font-mono">{aircraft.fuelCapacity}</span>
              </div>
            </div>

            {/* Powerplants Banner */}
            <div className="mt-3 p-3.5 rounded-lg bg-sky-50/70 dark:bg-[#071224] border border-sky-200 dark:border-[#1a3254]">
              <span className="text-[10px] text-sky-700 dark:text-sky-400 font-mono uppercase tracking-wider block font-bold">
                Powerplants & Thrust
              </span>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                {aircraft.engines}
              </p>
            </div>
          </div>

          {/* Historical & Engineering Notes */}
          {aircraft.funFacts && aircraft.funFacts.length > 0 && (
            <div className="aero-panel rounded-xl p-6 border border-slate-200 dark:border-[#1a3254] bg-white dark:bg-[#0c182b] shadow-xs transition-colors">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2 font-display">
                <Lightbulb className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                <span>Aerodynamic Breakthroughs & Operational Notes</span>
              </h2>
              <div className="space-y-3">
                {aircraft.funFacts.map((fact, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-[#07101f] border border-slate-200/80 dark:border-[#1a3254]"
                  >
                    <div className="w-5 h-5 rounded bg-sky-100 dark:bg-[#10223d] text-sky-700 dark:text-sky-300 font-mono flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5 border border-sky-200 dark:border-[#1a3254]">
                      {index + 1}
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
                      {fact}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Manufacturer Sidebar & Actions */}
        <div className="space-y-5">
          {/* Compare Card CTA */}
          <div className="aero-panel rounded-xl p-5 border border-slate-200 dark:border-[#1a3254] bg-white dark:bg-[#0c182b] shadow-xs transition-colors">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white mb-2 font-display font-bold text-base">
              <Scale className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>Head-to-Head Comparison</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
              Benchmark the {aircraft.name} against competing airframes on certified airspeed, range, and operational ceilings.
            </p>
            <Link
              to={`/compare?aircraft1=${aircraft.id}`}
              className="w-full py-2 px-3 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs text-center block transition-colors shadow-xs"
            >
              Launch Telemetry Comparison
            </Link>
          </div>

          {/* Manufacturer Profile */}
          <div className="aero-panel rounded-xl p-5 border border-slate-200 dark:border-[#1a3254] bg-white dark:bg-[#0c182b] shadow-xs transition-colors">
            <span className="text-[10px] font-mono uppercase tracking-wider text-sky-600 dark:text-sky-400/80 block mb-1 font-semibold">
              Manufacturer Profile
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
              {aircraft.manufacturer}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              Explore the entire catalog of commercial and tactical aircraft produced by {aircraft.manufacturer}.
            </p>
            <Link
              to={`/aircrafts?company=${encodeURIComponent(aircraft.manufacturer)}`}
              className="mt-3 inline-flex items-center gap-1 text-xs font-mono text-sky-600 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300 font-semibold"
            >
              <span>Browse manufacturer fleet</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Suggest Correction */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-[#1a3254] bg-slate-50 dark:bg-[#081222] text-xs text-slate-500 dark:text-slate-400 shadow-xs">
            <span className="font-bold text-slate-800 dark:text-sky-200 block mb-1">Notice an inaccurate specification?</span>
            <p className="mb-2 leading-relaxed">All telemetry records are verified against official manufacturer type certificates.</p>
            <Link to="/suggest" className="text-sky-600 dark:text-sky-400 hover:underline font-mono text-[11px] font-semibold">
              Submit telemetry revision →
            </Link>
          </div>
        </div>
      </div>

      {/* Related Aircraft Section */}
      {relatedAircraft.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 border-t border-slate-200 dark:border-[#1a3254] pt-10">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 font-display">
            Related Aircraft in Same Category / Manufacturer
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
