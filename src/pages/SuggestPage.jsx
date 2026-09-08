import React, { useState } from "react";
import { Link } from "react-router-dom";

const SuggestPage = () => {
  const [formData, setFormData] = useState({
    aircraftName: "",
    manufacturer: "",
    category: "Commercial",
    topSpeed: "",
    maxRange: "",
    description: "",
    contributorName: "",
    email: ""
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.aircraftName.trim() || !formData.manufacturer.trim()) {
      return;
    }
    setSubmitted(true);
  };

  const handleReset = () => {
    setFormData({
      aircraftName: "",
      manufacturer: "",
      category: "Commercial",
      topSpeed: "",
      maxRange: "",
      description: "",
      contributorName: "",
      email: ""
    });
    setSubmitted(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      {/* Header */}
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-300 text-xs font-semibold mb-3 font-mono">
          📡 Community Telemetry
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Suggest an Aircraft
        </h1>
        <p className="text-slate-400 text-base mt-2 max-w-xl mx-auto">
          Help expand the Aircraft Mania database. Submit details for your favorite commercial airliners, military fighters, or rare prototypes.
        </p>
      </div>

      {submitted ? (
        <div className="glass-panel p-10 rounded-3xl border border-sky-500/30 bg-slate-900/80 text-center max-w-xl mx-auto shadow-2xl animate-in fade-in">
          <span className="text-6xl block mb-4">🚀</span>
          <h2 className="text-2xl font-bold text-white mb-2">Transmission Received!</h2>
          <p className="text-slate-300 text-sm mb-6 leading-relaxed">
            Thank you for contributing <strong>"{formData.aircraftName}"</strong>. Our aviation curator team will review the telemetry data and verify specifications before inducting it into the encyclopedia.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={handleReset}
              className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold border border-slate-700"
            >
              Submit Another Aircraft
            </button>
            <Link
              to="/aircrafts"
              className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-sm font-bold shadow-md shadow-sky-500/20"
            >
              Browse Catalog
            </Link>
          </div>
        </div>
      ) : (
        <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-sky-500/20 bg-slate-900/60 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Aircraft Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Aircraft Name & Variant *
                </label>
                <input
                  type="text"
                  required
                  value={formData.aircraftName}
                  onChange={(e) => setFormData({ ...formData, aircraftName: e.target.value })}
                  placeholder="e.g. McDonnell Douglas MD-11"
                  className="w-full bg-slate-950 text-slate-100 text-sm px-4 py-3 rounded-xl border border-slate-700 focus:outline-none focus:border-sky-400"
                />
              </div>

              {/* Manufacturer */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Manufacturer / OEM *
                </label>
                <input
                  type="text"
                  required
                  value={formData.manufacturer}
                  onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                  placeholder="e.g. McDonnell Douglas / Boeing"
                  className="w-full bg-slate-950 text-slate-100 text-sm px-4 py-3 rounded-xl border border-slate-700 focus:outline-none focus:border-sky-400"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Aviation Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-slate-950 text-slate-100 text-sm px-4 py-3 rounded-xl border border-slate-700 focus:outline-none focus:border-sky-400"
                >
                  <option value="Commercial">Commercial Airliner</option>
                  <option value="Military">Military Fighter / Stealth</option>
                  <option value="Supersonic">Supersonic</option>
                  <option value="Business Jet">Business & Private Jet</option>
                  <option value="Cargo">Cargo & Heavy Lifter</option>
                  <option value="General Aviation">General Aviation</option>
                </select>
              </div>

              {/* Top Speed */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Top Speed (km/h or Mach)
                </label>
                <input
                  type="text"
                  value={formData.topSpeed}
                  onChange={(e) => setFormData({ ...formData, topSpeed: e.target.value })}
                  placeholder="e.g. 945 km/h (Mach 0.88)"
                  className="w-full bg-slate-950 text-slate-100 text-sm px-4 py-3 rounded-xl border border-slate-700 focus:outline-none focus:border-sky-400"
                />
              </div>

              {/* Max Range */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Maximum Range (km)
                </label>
                <input
                  type="text"
                  value={formData.maxRange}
                  onChange={(e) => setFormData({ ...formData, maxRange: e.target.value })}
                  placeholder="e.g. 12,600 km"
                  className="w-full bg-slate-950 text-slate-100 text-sm px-4 py-3 rounded-xl border border-slate-700 focus:outline-none focus:border-sky-400"
                />
              </div>

              {/* Contributor Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Your Call-Sign / Name
                </label>
                <input
                  type="text"
                  value={formData.contributorName}
                  onChange={(e) => setFormData({ ...formData, contributorName: e.target.value })}
                  placeholder="e.g. Captain Maverick"
                  className="w-full bg-slate-950 text-slate-100 text-sm px-4 py-3 rounded-xl border border-slate-700 focus:outline-none focus:border-sky-400"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Aircraft Overview & Key Highlights
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Share unique specifications, history, notable airlines, or why this aircraft deserves a spotlight..."
                className="w-full bg-slate-950 text-slate-100 text-sm p-4 rounded-xl border border-slate-700 focus:outline-none focus:border-sky-400"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-sky-400 to-cyan-400 hover:from-sky-300 hover:to-cyan-300 text-slate-950 font-bold text-sm shadow-lg shadow-sky-500/20 transition-all transform hover:-translate-y-0.5"
              >
                Submit Aircraft Telemetry ✈️
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default SuggestPage;
