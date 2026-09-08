import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const AircraftCard = ({ aircraft }) => {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
      className="glass-panel glass-panel-hover rounded-2xl overflow-hidden flex flex-col justify-between border border-sky-500/20 bg-slate-900/60 shadow-lg group"
    >
      {/* Image container */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-950">
        <img
          src={aircraft.image}
          alt={aircraft.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/images/aircraft/boeing-787-dreamliner.jpg";
          }}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
        
        {/* Category Pill */}
        <span className="absolute top-3 left-3 bg-sky-500/20 backdrop-blur-md border border-sky-400/30 text-sky-300 text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
          {aircraft.category}
        </span>

        {/* Status indicator */}
        <span className={`absolute top-3 right-3 text-xs px-2.5 py-1 rounded-full font-medium backdrop-blur-md border ${
          aircraft.status.includes("In Service") 
            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" 
            : "bg-amber-500/20 text-amber-300 border-amber-500/30"
        }`}>
          {aircraft.status}
        </span>

        {/* Manufacturer label */}
        <div className="absolute bottom-2 left-4">
          <span className="text-xs uppercase tracking-widest text-sky-400/90 font-medium">
            {aircraft.manufacturer}
          </span>
        </div>
      </div>

      {/* Details Container */}
      <div className="p-5 flex flex-col flex-grow justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-100 group-hover:text-sky-300 transition-colors line-clamp-1">
            {aircraft.name}
          </h3>
          <p className="text-sm text-slate-400 mt-1 line-clamp-2">
            {aircraft.role}
          </p>
        </div>

        {/* Specs Highlights */}
        <div className="grid grid-cols-3 gap-2 py-3 px-3 rounded-xl bg-slate-950/50 border border-slate-800/80 text-center">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Speed</span>
            <span className="text-sm font-semibold text-sky-300 font-mono">
              Mach {aircraft.speedMach}
            </span>
          </div>
          <div className="border-x border-slate-800/80">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Range</span>
            <span className="text-sm font-semibold text-slate-200 font-mono">
              {aircraft.maxRangeKm.toLocaleString()} km
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Capacity</span>
            <span className="text-sm font-semibold text-slate-200 font-mono">
              {aircraft.passengerCapacity > 6 ? `${aircraft.passengerCapacity} pax` : `${aircraft.passengerCapacity} crew`}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <Link
            to={`/aircraft/${aircraft.id}`}
            className="flex-1 py-2.5 px-4 rounded-xl text-center text-sm font-medium bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold transition-colors duration-200 shadow-md shadow-sky-500/20"
          >
            Explore Details →
          </Link>
          <Link
            to={`/compare?aircraft1=${aircraft.id}`}
            title="Compare with another aircraft"
            className="p-2.5 rounded-xl text-slate-300 hover:text-sky-300 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 transition-colors text-sm"
          >
            ⚖️
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default AircraftCard;
