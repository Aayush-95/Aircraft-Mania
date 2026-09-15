import React from "react";
import { Link } from "react-router-dom";
import { Plane, Lightbulb } from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-20 border-t border-slate-200 dark:border-[#1a3254] bg-slate-100/80 dark:bg-[#071120] text-slate-600 dark:text-slate-400 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-sky-50 dark:bg-sky-500/15 border border-sky-200 dark:border-sky-400/30 flex items-center justify-center text-sky-600 dark:text-sky-400 shadow-xs">
                <Plane className="w-4 h-4 -rotate-45" />
              </div>
              <span className="text-base font-bold text-slate-900 dark:text-white tracking-tight font-display">
                AIRCRAFT<span className="text-sky-600 dark:text-sky-400">MANIA</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Aerospace telemetry and technical specification encyclopedia. Documenting flight achievements and aerodynamic milestones.
            </p>
            <div className="pt-1 flex gap-2 text-xs">
              <span className="px-2 py-0.5 rounded bg-white dark:bg-[#0c182b] border border-slate-200 dark:border-[#1a3254] text-[10px] font-mono text-slate-700 dark:text-slate-300 font-semibold shadow-xs">
                85+ Dossiers
              </span>
              <span className="px-2 py-0.5 rounded bg-white dark:bg-[#0c182b] border border-slate-200 dark:border-[#1a3254] text-[10px] font-mono text-slate-700 dark:text-slate-300 font-semibold shadow-xs">
                15+ Manufacturers
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-slate-900 dark:text-white font-bold text-xs font-mono uppercase tracking-wider mb-3">
              Flight Plan Index
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-sky-700 dark:hover:text-sky-400 transition-colors">
                  Overview
                </Link>
              </li>
              <li>
                <Link to="/live-tracking" className="hover:text-sky-700 dark:hover:text-sky-400 transition-colors flex items-center gap-1.5 font-semibold text-sky-600 dark:text-sky-400">
                  <span>Live Flight Radar</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </Link>
              </li>
              <li>
                <Link to="/aircrafts" className="hover:text-sky-700 dark:hover:text-sky-400 transition-colors">
                  Fleet Catalog
                </Link>
              </li>
              <li>
                <Link to="/companies" className="hover:text-sky-700 dark:hover:text-sky-400 transition-colors">
                  Aerospace Manufacturers
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-sky-700 dark:hover:text-sky-400 transition-colors">
                  Comparison Matrix
                </Link>
              </li>
              <li>
                <Link to="/suggest" className="hover:text-sky-700 dark:hover:text-sky-400 transition-colors">
                  Suggest an Aircraft
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-slate-900 dark:text-white font-bold text-xs font-mono uppercase tracking-wider mb-3">
              Classifications
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/aircrafts?category=Commercial" className="hover:text-sky-700 dark:hover:text-sky-400 transition-colors">
                  Commercial Airliners
                </Link>
              </li>
              <li>
                <Link to="/aircrafts?category=Military" className="hover:text-sky-700 dark:hover:text-sky-400 transition-colors">
                  Tactical & Stealth
                </Link>
              </li>
              <li>
                <Link to="/aircrafts?category=Supersonic" className="hover:text-sky-700 dark:hover:text-sky-400 transition-colors">
                  Supersonic Legends
                </Link>
              </li>
              <li>
                <Link to="/aircrafts?category=Business+Jet" className="hover:text-sky-700 dark:hover:text-sky-400 transition-colors">
                  Long-Range Business Jets
                </Link>
              </li>
              <li>
                <Link to="/aircrafts?category=Cargo" className="hover:text-sky-700 dark:hover:text-sky-400 transition-colors">
                  Heavy Cargo Transports
                </Link>
              </li>
            </ul>
          </div>

          {/* Aerospace Fact */}
          <div className="p-4 rounded-lg bg-white dark:bg-[#0c182b] border border-slate-200 dark:border-[#1a3254] shadow-xs">
            <h4 className="text-sky-700 dark:text-sky-400 font-bold text-xs font-mono uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>Aerodynamic Telemetry</span>
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              At cruising speed (Mach 3.2), the Lockheed SR-71 Blackbird's external skin temperature reached over 260°C (500°F) due to aerodynamic friction, expanding the titanium airframe several inches in flight.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 dark:border-[#1a3254] flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500 dark:text-slate-400 font-mono">
          <p>© {new Date().getFullYear()} Aircraft Mania. Curated for aerospace enthusiasts worldwide.</p>
          <div className="flex items-center gap-5">
            <Link to="/about" className="hover:text-sky-700 dark:hover:text-sky-400">About Dossier</Link>
            <Link to="/suggest" className="hover:text-sky-700 dark:hover:text-sky-400">Telemetry Revisions</Link>
            <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>XPDR: 1200 ALT • NOMINAL</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
