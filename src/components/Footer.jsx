import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="mt-20 border-t border-sky-500/20 bg-slate-950 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">✈️</span>
              <span className="text-xl font-bold text-white tracking-wide">
                Aircraft Mania
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              The premier aviation encyclopedia. Explore technical specifications, historical breakthroughs, and cutting-edge aerospace marvels.
            </p>
            <div className="pt-2 flex gap-3 text-sm text-sky-400">
              <span className="px-2.5 py-1 rounded bg-sky-950/60 border border-sky-800/60 text-xs font-mono">
                85+ Aircraft
              </span>
              <span className="px-2.5 py-1 rounded bg-sky-950/60 border border-sky-800/60 text-xs font-mono">
                15+ Manufacturers
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-sky-300 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/aircrafts" className="hover:text-sky-300 transition-colors">
                  Aircraft Catalog
                </Link>
              </li>
              <li>
                <Link to="/companies" className="hover:text-sky-300 transition-colors">
                  Aircraft Manufacturers
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-sky-300 transition-colors">
                  Comparison Tool
                </Link>
              </li>
              <li>
                <Link to="/suggest" className="hover:text-sky-300 transition-colors">
                  Suggest an Aircraft
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Categories
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/aircrafts?category=Commercial" className="hover:text-sky-300 transition-colors">
                  Commercial Airliners
                </Link>
              </li>
              <li>
                <Link to="/aircrafts?category=Military" className="hover:text-sky-300 transition-colors">
                  Military & Stealth
                </Link>
              </li>
              <li>
                <Link to="/aircrafts?category=Supersonic" className="hover:text-sky-300 transition-colors">
                  Supersonic Legends
                </Link>
              </li>
              <li>
                <Link to="/aircrafts?category=Business+Jet" className="hover:text-sky-300 transition-colors">
                  Ultra-Long Range Jets
                </Link>
              </li>
              <li>
                <Link to="/aircrafts?category=Cargo" className="hover:text-sky-300 transition-colors">
                  Heavy Cargo Lifters
                </Link>
              </li>
            </ul>
          </div>

          {/* Aerospace Fact */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-sky-500/20">
            <h4 className="text-sky-400 font-semibold text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span>💡</span> Did You Know?
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              At cruising speed (Mach 3.2), the Lockheed SR-71 Blackbird's external skin temperature reached over 260°C (500°F) due to air friction, causing the airframe to expand several inches in flight!
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Aircraft Mania. Built for aviation enthusiasts worldwide.</p>
          <div className="flex gap-6">
            <Link to="/about" className="hover:text-slate-400">About Us</Link>
            <Link to="/suggest" className="hover:text-slate-400">Feedback</Link>
            <span>Telemetry: All Systems Nominal ✈️</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
