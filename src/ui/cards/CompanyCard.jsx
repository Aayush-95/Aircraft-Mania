import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, ExternalLink, ArrowRight } from "lucide-react";

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
  return (
    <motion.div 
      whileHover={{ y: -3 }}
      transition={{ duration: 0.15 }}
      className="aero-panel aero-panel-hover rounded-xl p-5 flex flex-col justify-between border border-slate-200 dark:border-[#1a3254] bg-white dark:bg-[#0c182b] group relative overflow-hidden shadow-xs transition-colors"
    >
      {/* Hairline aviation horizon accent */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-slate-200 dark:bg-[#1a3254] group-hover:bg-sky-600 dark:group-hover:bg-sky-400 transition-colors duration-200" />

      {/* Top Header: Logo & Name */}
      <div>
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="h-12 w-24 p-2 rounded-lg bg-slate-50 dark:bg-[#07101f] border border-slate-200 dark:border-[#1a3254] flex items-center justify-center overflow-hidden">
            <img
              src={companyLogo}
              alt={`${companyname} logo`}
              className="max-h-full max-w-full object-contain filter group-hover:scale-105 transition"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=300&q=80";
              }}
            />
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-50 dark:bg-[#07101f] border border-sky-200 dark:border-[#1a3254] text-sky-700 dark:text-sky-300 font-semibold">
            {aircraftsCount || "Multiple"} Models
          </span>
        </div>

        <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-300 transition-colors font-display">
          {companyname}
        </h3>
        
        <p className="text-xs text-slate-500 dark:text-sky-400/90 mt-1 flex items-center gap-1 font-mono">
          <MapPin className="w-3 h-3 text-sky-600 dark:text-sky-400" />
          <span>{country}</span>
        </p>

        <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 font-mono">
          <span className="text-slate-400 dark:text-slate-500 uppercase text-[10px]">Domain:</span> {specialization}
        </p>

        {description && (
          <p className="text-xs text-slate-500 dark:text-slate-300 mt-2.5 line-clamp-3 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-5 pt-3 border-t border-slate-100 dark:border-[#1a3254] flex items-center gap-2">
        <Link
          to={`/aircrafts?company=${encodeURIComponent(companyname)}`}
          className="flex-1 py-1.5 px-3 rounded-lg text-center text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white transition-colors flex items-center justify-center gap-1.5 shadow-xs"
        >
          <span>Fleet Catalog</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
        {website && (
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg text-xs bg-slate-100 dark:bg-[#0f213b] hover:bg-slate-200 dark:hover:bg-[#163056] text-slate-600 dark:text-sky-300 border border-slate-200 dark:border-[#1a3254] transition flex items-center justify-center"
            title="Official Website"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </motion.div>
  );
};

export default CompanyCard;
