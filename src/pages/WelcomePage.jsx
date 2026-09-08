import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { aircraftData, aircraftCategories } from "../data/aircraftData";
import { companiesData } from "../data/companiesData";
import AircraftCard from "../ui/cards/AircraftCard";

const WelcomePage = () => {
  const featuredAircraft = aircraftData.slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 cockpit-grid">
        {/* Ambient background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-500/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-indigo-500/15 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-300 text-xs sm:text-sm font-semibold mb-6 backdrop-blur-md"
          >
            <span className="animate-pulse">✈️</span>
            <span>Next-Gen Aerospace & Aviation Catalog</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto"
          >
            Discover the World's Most Legendary{" "}
            <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">
              Aircraft
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed"
          >
            From Mach 3 reconnaissance stealth jets and supersonic airliners to massive double-decker superjumbos. Explore specifications, avionics, and manufacturer fleets.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            <Link
              to="/aircrafts"
              className="px-8 py-3.5 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-sky-400 to-cyan-400 hover:from-sky-300 hover:to-cyan-300 transition-all transform hover:-translate-y-0.5 shadow-lg shadow-sky-500/25 text-base"
            >
              Explore Aircraft Catalog 🛫
            </Link>
            <Link
              to="/compare"
              className="px-8 py-3.5 rounded-xl font-semibold text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-sky-500/30 hover:border-sky-400/60 transition-all transform hover:-translate-y-0.5 backdrop-blur-md text-base"
            >
              Compare Specs ⚖️
            </Link>
          </motion.div>

          {/* Quick Metrics Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 p-6 glass-panel rounded-2xl border border-sky-500/20 bg-slate-900/50 shadow-2xl"
          >
            <div className="text-center">
              <div className="text-3xl font-extrabold text-sky-400 font-mono">Mach 3.3+</div>
              <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Top Speed Record</div>
            </div>
            <div className="text-center border-l border-slate-800">
              <div className="text-3xl font-extrabold text-sky-400 font-mono">16,100 km</div>
              <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Max Non-Stop Range</div>
            </div>
            <div className="text-center border-l md:border-l border-slate-800">
              <div className="text-3xl font-extrabold text-sky-400 font-mono">555+ Pax</div>
              <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Maximum Capacity</div>
            </div>
            <div className="text-center border-l border-slate-800">
              <div className="text-3xl font-extrabold text-sky-400 font-mono">{aircraftData.length}+ Models</div>
              <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider">In Encyclopedia</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Featured Aircraft Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-sky-400 mb-1">
              Spotlight
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Featured Aircraft
            </h2>
          </div>
          <Link
            to="/aircrafts"
            className="text-sm font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1 group"
          >
            <span>View All {aircraftData.length} Aircraft</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredAircraft.map((plane) => (
            <AircraftCard key={plane.id} aircraft={plane} />
          ))}
        </div>
      </section>

      {/* Categories Showcase */}
      <section className="py-16 bg-slate-950/60 border-y border-sky-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-white">
              Explore by Aircraft Category
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Filter models by their engineering classification and mission profile
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {aircraftCategories.filter(c => c !== "All").map((category) => {
              const count = aircraftData.filter(a => a.category === category).length;
              return (
                <Link
                  key={category}
                  to={`/aircrafts?category=${encodeURIComponent(category)}`}
                  className="glass-panel glass-panel-hover p-5 rounded-xl border border-sky-500/20 text-center flex flex-col items-center justify-center gap-2 group"
                >
                  <span className="text-3xl group-hover:scale-110 transition-transform">
                    {category === "Commercial" && "🛫"}
                    {category === "Military" && "🛩️"}
                    {category === "Supersonic" && "⚡"}
                    {category === "Business Jet" && "💼"}
                    {category === "Cargo" && "📦"}
                  </span>
                  <span className="font-semibold text-slate-200 group-hover:text-sky-300 text-sm">
                    {category}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    {count} {count === 1 ? "model" : "models"}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Companies Banner */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-sky-400 mb-1">
              Aerospace Leaders
            </div>
            <h2 className="text-3xl font-extrabold text-white">
              Top Aircraft Manufacturers
            </h2>
          </div>
          <Link
            to="/companies"
            className="text-sm font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1 group"
          >
            <span>View All Manufacturers</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {companiesData.slice(0, 3).map((comp) => (
            <div
              key={comp.id}
              className="glass-panel rounded-xl p-6 border border-sky-500/20 bg-slate-900/40 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-white">{comp.name}</h3>
                  <span className="text-xs font-mono text-sky-400 px-2 py-0.5 rounded bg-sky-500/10 border border-sky-400/20">
                    Est. {comp.founded}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-2">📍 {comp.country}</p>
                <p className="text-sm text-slate-300 line-clamp-2">{comp.description}</p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-400">Flagship: <strong className="text-slate-200">{comp.flagship}</strong></span>
                <Link
                  to={`/aircrafts?company=${encodeURIComponent(comp.name)}`}
                  className="text-sky-400 hover:text-sky-300 font-semibold"
                >
                  Fleet →
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
