import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Scale } from "lucide-react";

const AircraftCard = ({ aircraft }) => {
  const isInService = aircraft.status.includes("In Service");

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.15 }}
      className="aero-panel aero-panel-hover rounded-xl overflow-hidden flex flex-col justify-between border border-slate-200 dark:border-[#1a3254] bg-white dark:bg-[#0c182b] group shadow-xs transition-colors"
    >
      {/* Image container */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-900">
        <img
          src={aircraft.image}
          alt={aircraft.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/images/aircraft/boeing-787-dreamliner.jpg";
          }}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 dark:from-[#0c182b] via-transparent to-transparent opacity-80" />
        
        {/* Category Badge */}
        <span className="absolute top-3 left-3 bg-slate-900/85 dark:bg-[#071224]/90 text-white dark:text-sky-300 text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded uppercase tracking-wider border border-slate-700/50 dark:border-[#1a3254] shadow-xs">
          {aircraft.category}
        </span>

        {/* Status indicator */}
        <span className={`absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded font-mono font-semibold border flex items-center gap-1.5 shadow-xs ${
          isInService 
            ? "bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700/60" 
            : "bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-400 border-amber-300 dark:border-amber-700/60"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isInService ? "bg-emerald-500 dark:bg-emerald-400" : "bg-amber-500 dark:bg-amber-400"}`} />
          <span>{aircraft.status}</span>
        </span>

        {/* Manufacturer label */}
        <div className="absolute bottom-2 left-4">
          <span className="text-[11px] uppercase tracking-widest text-white/95 dark:text-sky-400/90 font-mono font-semibold drop-shadow-sm">
            {aircraft.manufacturer}
          </span>
        </div>
      </div>

      {/* Details Container */}
      <div className="p-4 flex flex-col flex-grow justify-between gap-3.5">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-300 transition-colors line-clamp-1 font-display">
            {aircraft.name}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {aircraft.role}
          </p>
        </div>

        {/* Specs Highlights */}
        <div className="grid grid-cols-3 gap-1.5 py-2 px-2.5 rounded-lg bg-slate-50 dark:bg-[#07101f] border border-slate-200/80 dark:border-[#1a3254] text-center">
          <div>
            <span className="text-[9px] text-slate-400 dark:text-slate-500 uppercase font-mono tracking-wider block">Airspeed</span>
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 font-mono">
              M {aircraft.speedMach}
            </span>
          </div>
          <div className="border-x border-slate-200 dark:border-[#1a3254]">
            <span className="text-[9px] text-slate-400 dark:text-slate-500 uppercase font-mono tracking-wider block">Range</span>
            <span className="text-xs font-bold text-sky-700 dark:text-sky-300 font-mono">
              {aircraft.maxRangeKm.toLocaleString()} km
            </span>
          </div>
          <div>
            <span className="text-[9px] text-slate-400 dark:text-slate-500 uppercase font-mono tracking-wider block">Capacity</span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 font-mono">
              {aircraft.passengerCapacity > 6 ? `${aircraft.passengerCapacity} pax` : `${aircraft.passengerCapacity} crew`}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <Link
            to={`/aircraft/${aircraft.id}`}
            className="flex-1 py-2 px-3 rounded-lg text-center text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white transition-colors duration-150 flex items-center justify-center gap-1.5 shadow-xs"
          >
            <span>Telemetry File</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to={`/compare?aircraft1=${aircraft.id}`}
            title="Compare Telemetry"
            className="p-2 rounded-lg text-slate-600 dark:text-sky-300 hover:text-sky-700 dark:hover:text-white bg-slate-100 dark:bg-[#0f213b] hover:bg-slate-200 dark:hover:bg-[#163056] border border-slate-200 dark:border-[#1a3254] transition-colors text-xs flex items-center justify-center"
          >
            <Scale className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default AircraftCard;
