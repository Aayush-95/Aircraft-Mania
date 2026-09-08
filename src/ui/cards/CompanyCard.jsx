import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const CompanyCard = ({
  companyname,
  country,
  specialization,
  aircraftsCount,
  companyLogo,
  description,
  website,
  id
}) => {
  const companyKey = id || companyname?.toLowerCase().replace(/\s+/g, '-');

  return (
    <motion.div 
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
      className="glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col justify-between border border-sky-500/20 bg-slate-900/60 shadow-lg group relative overflow-hidden"
    >
      {/* Decorative accent top line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 via-indigo-500 to-sky-400 opacity-60 group-hover:opacity-100 transition-opacity" />

      {/* Top Header: Logo & Name */}
      <div>
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="h-14 w-28 p-2 rounded-xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center overflow-hidden">
            <img
              src={companyLogo}
              alt={`${companyname} logo`}
              className="max-h-full max-w-full object-contain filter brightness-95 group-hover:brightness-110 transition"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=300&q=80";
              }}
            />
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/20 text-sky-300 font-mono">
            {aircraftsCount || "Multiple"} Models
          </span>
        </div>

        <h3 className="text-2xl font-bold text-slate-100 group-hover:text-sky-300 transition-colors">
          {companyname}
        </h3>
        
        <p className="text-xs font-medium text-sky-400 mt-1 flex items-center gap-1.5">
          <span>📍</span> {country}
        </p>

        <p className="text-xs text-slate-400 mt-2 font-medium">
          <span className="text-slate-500">Domain:</span> {specialization}
        </p>

        {description && (
          <p className="text-sm text-slate-300 mt-3 line-clamp-3 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-3">
        <Link
          to={`/aircrafts?company=${encodeURIComponent(companyname)}`}
          className="flex-1 py-2 px-3 rounded-xl text-center text-xs font-semibold bg-sky-500 hover:bg-sky-400 text-slate-950 transition-colors shadow-sm"
        >
          View Aircraft Fleet →
        </Link>
        {website && (
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2 px-3 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
          >
            Site ↗
          </a>
        )}
      </div>
    </motion.div>
  );
};

export default CompanyCard;
