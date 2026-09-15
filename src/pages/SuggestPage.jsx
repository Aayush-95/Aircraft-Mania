import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Send, CheckCircle2, ArrowRight, FilePlus, RotateCcw } from "lucide-react";
import ThemeToggle from "../ui/buttons/ThemeToggle";

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
        <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md bg-sky-50 dark:bg-[#071224] border border-sky-200 dark:border-[#1a3254] text-sky-700 dark:text-sky-300 text-xs font-mono mb-3 font-semibold shadow-xs">
          <FilePlus className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
          <span className="uppercase tracking-wider">Community Contributions</span>
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display">
          Suggest an Aircraft Dossier
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm mt-2 max-w-xl mx-auto leading-relaxed">
          Contribute certified technical specifications for historical airframes, rare prototypes, or newly debuted aircraft.
        </p>
        <div className="flex justify-center mt-4">
          <ThemeToggle showLabel className="px-3 py-1.5 text-xs" />
        </div>
      </div>

      {submitted ? (
        <div className="aero-panel p-8 sm:p-10 rounded-xl border border-slate-200 dark:border-[#1a3254] bg-white dark:bg-[#0c182b] text-center max-w-lg mx-auto shadow-sm dark:shadow-2xl transition-colors">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2 font-display">Specification Transmitted</h2>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm mb-6 leading-relaxed">
            Thank you for contributing telemetry for <strong>"{formData.aircraftName}"</strong>. Our aviation curator team will verify certificate specifications before inducting it into the encyclopedia.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={handleReset}
              className="px-5 py-2.5 rounded-lg bg-slate-100 dark:bg-[#07101f] hover:bg-slate-200 dark:hover:bg-[#10223b] text-slate-700 dark:text-sky-300 text-xs font-mono border border-slate-300 dark:border-[#1a3254] flex items-center justify-center gap-1.5 transition-colors font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Submit Another Record</span>
            </button>
            <Link
              to="/aircrafts"
              className="px-5 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <span>Explore Fleet Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="aero-panel p-6 sm:p-8 rounded-xl border border-slate-200 dark:border-[#1a3254] bg-white dark:bg-[#0c182b] shadow-xs dark:shadow-2xl transition-colors">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Aircraft Name */}
              <div>
                <label className="block text-xs font-mono uppercase text-slate-700 dark:text-sky-300 tracking-wider mb-2 font-bold">
                  Aircraft Designation & Variant *
                </label>
                <input
                  type="text"
                  required
                  value={formData.aircraftName}
                  onChange={(e) => setFormData({ ...formData, aircraftName: e.target.value })}
                  placeholder="e.g. McDonnell Douglas MD-11"
                  className="w-full bg-slate-50 dark:bg-[#07101f] text-slate-900 dark:text-slate-100 text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-[#1a3254] focus:outline-none focus:bg-white dark:focus:bg-[#07101f] focus:border-sky-600 dark:focus:border-sky-400 font-mono"
                />
              </div>

              {/* Manufacturer */}
              <div>
                <label className="block text-xs font-mono uppercase text-slate-700 dark:text-sky-300 tracking-wider mb-2 font-bold">
                  Manufacturer / Prime Contractor *
                </label>
                <input
                  type="text"
                  required
                  value={formData.manufacturer}
                  onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                  placeholder="e.g. McDonnell Douglas / Boeing"
                  className="w-full bg-slate-50 dark:bg-[#07101f] text-slate-900 dark:text-slate-100 text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-[#1a3254] focus:outline-none focus:bg-white dark:focus:bg-[#07101f] focus:border-sky-600 dark:focus:border-sky-400 font-mono"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-mono uppercase text-slate-700 dark:text-sky-300 tracking-wider mb-2 font-bold">
                  Classification
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-[#07101f] text-slate-900 dark:text-slate-100 text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-[#1a3254] focus:outline-none focus:bg-white dark:focus:bg-[#07101f] focus:border-sky-600 dark:focus:border-sky-400 font-display"
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
                <label className="block text-xs font-mono uppercase text-slate-700 dark:text-sky-300 tracking-wider mb-2 font-bold">
                  Top Airspeed (km/h or Mach)
                </label>
                <input
                  type="text"
                  value={formData.topSpeed}
                  onChange={(e) => setFormData({ ...formData, topSpeed: e.target.value })}
                  placeholder="e.g. 945 km/h (Mach 0.88)"
                  className="w-full bg-slate-50 dark:bg-[#07101f] text-slate-900 dark:text-slate-100 text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-[#1a3254] focus:outline-none focus:bg-white dark:focus:bg-[#07101f] focus:border-sky-600 dark:focus:border-sky-400 font-mono"
                />
              </div>

              {/* Max Range */}
              <div>
                <label className="block text-xs font-mono uppercase text-slate-700 dark:text-sky-300 tracking-wider mb-2 font-bold">
                  Maximum Range (km)
                </label>
                <input
                  type="text"
                  value={formData.maxRange}
                  onChange={(e) => setFormData({ ...formData, maxRange: e.target.value })}
                  placeholder="e.g. 12,600 km"
                  className="w-full bg-slate-50 dark:bg-[#07101f] text-slate-900 dark:text-slate-100 text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-[#1a3254] focus:outline-none focus:bg-white dark:focus:bg-[#07101f] focus:border-sky-600 dark:focus:border-sky-400 font-mono"
                />
              </div>

              {/* Contributor Name */}
              <div>
                <label className="block text-xs font-mono uppercase text-slate-700 dark:text-sky-300 tracking-wider mb-2 font-bold">
                  Contributor Call-Sign / Name
                </label>
                <input
                  type="text"
                  value={formData.contributorName}
                  onChange={(e) => setFormData({ ...formData, contributorName: e.target.value })}
                  placeholder="e.g. Flight Captain Maverick"
                  className="w-full bg-slate-50 dark:bg-[#07101f] text-slate-900 dark:text-slate-100 text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-[#1a3254] focus:outline-none focus:bg-white dark:focus:bg-[#07101f] focus:border-sky-600 dark:focus:border-sky-400 font-mono"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-mono uppercase text-slate-700 dark:text-sky-300 tracking-wider mb-2 font-bold">
                Technical Background & Operational Highlights
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detail technical innovations, powerplant specifications, certification milestones, or notable airframe history..."
                className="w-full bg-slate-50 dark:bg-[#07101f] text-slate-900 dark:text-slate-100 text-xs p-3.5 rounded-lg border border-slate-300 dark:border-[#1a3254] focus:outline-none focus:bg-white dark:focus:bg-[#07101f] focus:border-sky-600 dark:focus:border-sky-400 font-mono"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-colors flex items-center gap-2 shadow-sm"
              >
                <span>Transmit Telemetry Record</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default SuggestPage;
