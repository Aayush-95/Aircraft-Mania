import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Plane, 
  Scale, 
  ArrowRight, 
  Gauge, 
  Compass, 
  Shield, 
  Zap, 
  Briefcase, 
  Package, 
  Building2,
  Radio,
  Globe 
} from "lucide-react";
import { aircraftData, aircraftCategories } from "../data/aircraftData";
import { companiesData } from "../data/companiesData";
import AircraftCard from "../ui/cards/AircraftCard";
import ThemeToggle from "../ui/buttons/ThemeToggle";

const WelcomePage = () => {
  const featuredAircraft = aircraftData.slice(0, 4);

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case "Commercial":
        return <Plane className="w-5 h-5 text-sky-600 dark:text-sky-400" />;
      case "Military":
        return <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      case "Supersonic":
        return <Zap className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />;
      case "Business Jet":
        return <Briefcase className="w-5 h-5 text-indigo-600 dark:text-sky-300" />;
      case "Cargo":
        return <Package className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      default:
        return <Compass className="w-5 h-5 text-slate-500 dark:text-slate-400" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="relative border-b border-slate-200 dark:border-[#1a3254] pt-16 pb-20 lg:pt-24 lg:pb-28 bg-gradient-to-b from-white via-sky-50/30 to-[#f4f7fb] dark:from-[#060d19] dark:via-[#060d19] dark:to-[#081324] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Flight Deck Status Beacon */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2.5 px-3.5 py-1 rounded-md bg-sky-50 dark:bg-[#071224] border border-sky-200 dark:border-[#1a3254] text-sky-700 dark:text-sky-300 text-xs font-mono mb-6 shadow-xs font-semibold"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
            <span className="tracking-wider uppercase">FLIGHT LEVEL ARCHIVE • CERTIFIED TELEMETRY</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1] max-w-4xl mx-auto font-display"
          >
            Engineering Excellence Across the Horizons of <span className="text-sky-600 dark:text-sky-400">Flight</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed"
          >
            Comprehensive technical dossiers on legendary commercial airliners, supersonic interceptors, and high-altitude aerospace prototypes.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-wrap justify-center items-center gap-3"
          >
            <Link
              to="/live-tracking"
              className="px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 transition-all text-sm flex items-center gap-2.5 shadow-md shadow-sky-600/20"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <Radio className="w-4 h-4 text-sky-200" />
              <span>Live Flight Radar</span>
            </Link>
            <Link
              to="/aircrafts"
              className="px-6 py-3 rounded-lg font-semibold text-slate-700 dark:text-sky-200 bg-white dark:bg-[#0c182b] hover:bg-slate-50 dark:hover:bg-[#10223b] border border-slate-300 dark:border-[#1a3254] transition-colors text-sm flex items-center gap-2 shadow-xs"
            >
              <span>Explore Fleet Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/compare"
              className="px-6 py-3 rounded-lg font-semibold text-slate-700 dark:text-sky-200 bg-white dark:bg-[#0c182b] hover:bg-slate-50 dark:hover:bg-[#10223b] border border-slate-300 dark:border-[#1a3254] transition-colors text-sm flex items-center gap-2 shadow-xs"
            >
              <Scale className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>Telemetry Comparison</span>
            </Link>
            <ThemeToggle showLabel className="px-4 py-2.5 text-xs rounded-lg" />
          </motion.div>

          {/* Flight Deck Telemetry Readout Console */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-14 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-0 rounded-xl border border-slate-200 dark:border-[#1a3254] bg-white dark:bg-[#091527] overflow-hidden shadow-sm dark:shadow-2xl transition-colors"
          >
            <div className="p-5 text-center border-b md:border-b-0 border-r border-slate-200 dark:border-[#1a3254]">
              <div className="text-2xl sm:text-3xl font-bold text-amber-600 dark:text-amber-400 font-mono">Mach 3.3+</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono tracking-wider mt-1">Airspeed Limit Record</div>
            </div>
            <div className="p-5 text-center border-b md:border-b-0 md:border-r border-slate-200 dark:border-[#1a3254]">
              <div className="text-2xl sm:text-3xl font-bold text-sky-700 dark:text-sky-300 font-mono">16,100 km</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono tracking-wider mt-1">Max Operational Range</div>
            </div>
            <div className="p-5 text-center border-r border-slate-200 dark:border-[#1a3254]">
              <div className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white font-mono">555+ Pax</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono tracking-wider mt-1">Superjumbo Capacity</div>
            </div>
            <div className="p-5 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">{aircraftData.length} Models</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono tracking-wider mt-1">Certified Dossiers</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Real-time Flight Radar Feature Banner */}
      <section className="pt-10 pb-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-2xl border border-sky-300/60 dark:border-sky-500/30 bg-gradient-to-r from-sky-900/90 via-[#0a1b36] to-[#071224] text-white p-6 sm:p-8 shadow-xl"
        >
          {/* Subtle radar background grid */}
          <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-mono mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="uppercase font-bold tracking-wider">NEW • LIVE OPENSKY NETWORK TELEMETRY</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white">
                Live Flight Tracking Across Global Airspace
              </h3>
              <p className="mt-2 text-sm text-slate-300 leading-relaxed font-sans">
                Track thousands of active commercial and cargo flights worldwide on an interactive aviation radar map with real-time ADS-B transponder altitude, true track heading, airspeed, and telemetry dossiers.
              </p>
            </div>

            <div className="flex-shrink-0">
              <Link
                to="/live-tracking"
                className="px-6 py-3.5 rounded-xl font-bold text-sm bg-sky-500 hover:bg-sky-400 text-slate-950 flex items-center gap-2.5 shadow-lg shadow-sky-500/30 transition-all hover:scale-105"
              >
                <Radio className="w-4 h-4" />
                <span>Launch Flight Radar</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Featured Aircraft Section */}
      <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 border-b border-slate-200 dark:border-[#1a3254] pb-4">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-sky-600 dark:text-sky-400 mb-1 font-semibold">
              Curated Squadron
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-display">
              Featured Aircraft Dossiers
            </h2>
          </div>
          <Link
            to="/aircrafts"
            className="text-xs font-mono uppercase tracking-wider text-sky-600 dark:text-sky-400/80 hover:text-sky-800 dark:hover:text-sky-300 flex items-center gap-1.5 transition-colors font-semibold"
          >
            <span>View All ({aircraftData.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredAircraft.map((plane) => (
            <AircraftCard key={plane.id} aircraft={plane} />
          ))}
        </div>
      </section>

      {/* Categories Showcase */}
      <section className="py-14 bg-white dark:bg-[#050c18] border-y border-slate-200 dark:border-[#1a3254] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-display">
              Classifications & Operational Roles
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1.5 max-w-xl mx-auto">
              Browse aircraft by mission design, aerodynamic architecture, and payload profile
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {aircraftCategories.filter(c => c !== "All").map((category) => {
              const count = aircraftData.filter(a => a.category === category).length;
              return (
                <Link
                  key={category}
                  to={`/aircrafts?category=${encodeURIComponent(category)}`}
                  className="aero-panel aero-panel-hover p-4 rounded-xl border border-slate-200 dark:border-[#1a3254] text-center flex flex-col items-center justify-center gap-2 group bg-slate-50/50 dark:bg-[#0c182b] hover:bg-sky-50/40 dark:hover:bg-[#0f1f38] transition-colors"
                >
                  <div className="p-2.5 rounded-lg bg-white dark:bg-[#071224] border border-slate-200 dark:border-[#1a3254] group-hover:border-sky-400 transition-colors shadow-xs">
                    {getCategoryIcon(category)}
                  </div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-sky-600 dark:group-hover:text-sky-300 text-xs sm:text-sm font-display">
                    {category}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-sky-400/70 font-mono">
                    {count} {count === 1 ? "model" : "models"}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Aerospace Manufacturers */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 border-b border-slate-200 dark:border-[#1a3254] pb-4">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-sky-600 dark:text-sky-400 mb-1 font-semibold">
              Industrial Pioneers
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-display">
              Major Aerospace Manufacturers
            </h2>
          </div>
          <Link
            to="/companies"
            className="text-xs font-mono uppercase tracking-wider text-sky-600 dark:text-sky-400/80 hover:text-sky-800 dark:hover:text-sky-300 flex items-center gap-1.5 transition-colors font-semibold"
          >
            <span>All Manufacturers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {companiesData.slice(0, 3).map((comp) => (
            <div
              key={comp.id}
              className="aero-panel rounded-xl p-5 border border-slate-200 dark:border-[#1a3254] bg-white dark:bg-[#0c182b] flex flex-col justify-between shadow-xs transition-colors"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">{comp.name}</h3>
                  <span className="text-[10px] font-mono text-sky-700 dark:text-sky-300 px-2 py-0.5 rounded bg-sky-50 dark:bg-[#071224] border border-sky-200 dark:border-[#1a3254] font-semibold">
                    Est. {comp.founded}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 font-mono">📍 {comp.country}</p>
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">{comp.description}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-[#1a3254] flex justify-between items-center text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                  Flagship: <strong className="text-slate-800 dark:text-sky-200 font-semibold">{comp.flagship}</strong>
                </span>
                <Link
                  to={`/aircrafts?company=${encodeURIComponent(comp.name)}`}
                  className="text-sky-600 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300 font-mono text-xs flex items-center gap-1 font-semibold"
                >
                  <span>Fleet</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default WelcomePage;
