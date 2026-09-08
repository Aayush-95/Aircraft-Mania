import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import SearchBarNav from "../ui/elements/SearchBarNav";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Aircrafts", path: "/aircrafts" },
    { name: "Companies", path: "/companies" },
    { name: "Compare", path: "/compare" },
    { name: "Suggest", path: "/suggest" },
    { name: "About", path: "/about" },
  ];

  const activeClass = "text-sky-400 font-semibold border-b-2 border-sky-400 pb-1";
  const inactiveClass = "text-slate-300 hover:text-sky-300 font-medium transition-colors pb-1";

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-sky-500/20 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <span className="text-xl">✈️</span>
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-sky-400 via-sky-200 to-indigo-300 bg-clip-text text-transparent">
                Aircraft Mania
              </span>
              <span className="hidden sm:block text-[10px] uppercase font-mono tracking-widest text-sky-400/80">
                Aviation Encyclopedia
              </span>
            </div>
          </Link>

          {/* Center / Right: Nav Links on Desktop */}
          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
                end={link.path === "/"}
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Search Bar + CTA */}
          <div className="hidden md:flex items-center gap-4">
            <SearchBarNav />
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white bg-slate-800/80 border border-slate-700"
              aria-label="Toggle Navigation Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-sky-500/20 bg-slate-950/95 px-4 pt-3 pb-6 space-y-3">
          <div className="pb-3">
            <SearchBarNav />
          </div>
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-base ${
                    isActive
                      ? "bg-sky-500/20 text-sky-400 font-semibold"
                      : "text-slate-300 hover:bg-slate-900 hover:text-white"
                  }`
                }
                end={link.path === "/"}
              >
                {link.name}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
