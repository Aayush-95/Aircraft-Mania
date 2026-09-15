import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Plane, Menu, X } from "lucide-react";
import SearchBarNav from "../ui/elements/SearchBarNav";
import ThemeToggle from "../ui/buttons/ThemeToggle";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Overview", path: "/" },
    { name: "Live Radar", path: "/live-tracking", isLive: true },
    { name: "Fleet Catalog", path: "/aircrafts" },
    { name: "Manufacturers", path: "/companies" },
    { name: "Comparison", path: "/compare" },
    { name: "Suggest", path: "/suggest" },
    { name: "About", path: "/about" },
  ];

  const activeClass = "text-sky-600 dark:text-sky-400 font-bold border-b-2 border-sky-600 dark:border-sky-400 pb-1 flex items-center gap-1.5";
  const inactiveClass = "text-slate-600 dark:text-slate-300 hover:text-sky-700 dark:hover:text-sky-200 font-medium transition-colors pb-1 flex items-center gap-1.5";

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 dark:border-[#1a3254] bg-white/95 dark:bg-[#071120]/95 backdrop-blur-md shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand / Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-sky-50 dark:bg-sky-500/15 border border-sky-200 dark:border-sky-400/30 flex items-center justify-center text-sky-600 dark:text-sky-400 group-hover:bg-sky-600 group-hover:text-white transition-all shadow-xs">
              <Plane className="w-5 h-5 -rotate-45" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white font-display">
                AIRCRAFT<span className="text-sky-600 dark:text-sky-400">MANIA</span>
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500 dark:text-sky-400/80">
                Aero Telemetry & Flight Archive
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-6 text-sm font-display">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
                end={link.path === "/"}
              >
                <span>{link.name}</span>
                {link.isLive && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                )}
              </NavLink>
            ))}
          </div>

          {/* Search Bar + Theme Toggle (Desktop) */}
          <div className="hidden lg:flex items-center gap-3">
            <SearchBarNav />
            <ThemeToggle />
          </div>

          {/* Mobile controls (Theme Toggle + Menu button) */}
          <div className="flex lg:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-[#0c182b] border border-slate-200 dark:border-[#1a3254]"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-sky-600 dark:text-sky-400" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-[#1a3254] bg-white dark:bg-[#071120] px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <div className="pb-2">
            <SearchBarNav />
          </div>
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                    isActive
                      ? "bg-sky-50 dark:bg-sky-500/15 text-sky-700 dark:text-sky-400 font-bold border-l-2 border-sky-600 dark:border-sky-400"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#0c182b] hover:text-slate-900 dark:hover:text-white"
                  }`
                }
                end={link.path === "/"}
              >
                <span>{link.name}</span>
                {link.isLive && (
                  <span className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 uppercase font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    LIVE
                  </span>
                )}
              </NavLink>
            ))}
          </div>
          <div className="pt-3 border-t border-slate-100 dark:border-[#1a3254] flex items-center justify-between">
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">Flight Lighting Mode</span>
            <ThemeToggle showLabel />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
