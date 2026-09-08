import React from "react";
import { Link } from "react-router-dom";

const AboutPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-300 text-xs font-semibold mb-3 font-mono">
          ✈️ About Aircraft Mania
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Fueling the Passion for Flight
        </h1>
        <p className="text-slate-300 text-base sm:text-lg mt-4 leading-relaxed">
          Aircraft Mania was created for spotters, aerospace engineers, pilots, and aviation enthusiasts worldwide who marvel at the beauty, science, and scale of flight.
        </p>
      </div>

      {/* Mission Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="glass-panel p-6 rounded-2xl border border-sky-500/20 bg-slate-900/60 shadow-xl">
          <span className="text-3xl block mb-3">🎯</span>
          <h3 className="text-lg font-bold text-white mb-2">Our Mission</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            To provide the cleanest, fastest, and most immersive encyclopedia of modern and historical aircraft specifications, avionics, and engineering triumphs.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-sky-500/20 bg-slate-900/60 shadow-xl">
          <span className="text-3xl block mb-3">📐</span>
          <h3 className="text-lg font-bold text-white mb-2">Accurate Telemetry</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Every aircraft record is cross-referenced with manufacturer type certificates (FAA & EASA) and aerospace archives to ensure precision dimensions and performance figures.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-sky-500/20 bg-slate-900/60 shadow-xl">
          <span className="text-3xl block mb-3">🤝</span>
          <h3 className="text-lg font-bold text-white mb-2">Community Driven</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Aviation lovers can suggest new models, submit rare facts, and compare their favorite aircraft side-by-side with intuitive telemetry comparison meters.
          </p>
        </div>
      </div>

      {/* Aviation Timeline Quote */}
      <div className="glass-panel rounded-3xl p-8 sm:p-10 border border-sky-500/30 bg-gradient-to-r from-sky-950/40 via-slate-900/80 to-slate-950 text-center mb-16 shadow-2xl">
        <p className="text-xl sm:text-2xl font-serif italic text-slate-200 max-w-3xl mx-auto leading-relaxed">
          "Once you have tasted flight, you will forever walk the earth with your eyes turned skyward, for there you have been, and there you will always long to return."
        </p>
        <p className="mt-4 text-xs font-mono uppercase tracking-widest text-sky-400">
          — Leonardo da Vinci
        </p>
      </div>

      {/* Frequently Asked Questions */}
      <div className="glass-panel rounded-3xl p-8 border border-sky-500/20 bg-slate-900/60 shadow-xl mb-12">
        <h2 className="text-2xl font-extrabold text-white mb-6 flex items-center gap-2">
          <span>❓</span> Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <h4 className="font-bold text-sky-300 text-sm mb-1">
              How are aircraft comparison metrics calculated?
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Our comparison engine normalizes real-world data points including maximum certified Mach cruising speeds, non-stop nautical range with standard reserves, and maximum typical seat configurations.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <h4 className="font-bold text-sky-300 text-sm mb-1">
              Can I suggest historical warbirds or experimental prototypes?
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Yes! Use our <Link to="/suggest" className="text-sky-400 hover:underline">Suggest an Aircraft form</Link> to propose any aircraft from the Wright Flyer to future electric eVTOL concepts.
            </p>
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <div className="text-center">
        <Link
          to="/aircrafts"
          className="inline-block px-8 py-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm shadow-lg shadow-sky-500/20 transition-all transform hover:-translate-y-0.5"
        >
          Explore Aircraft Catalog Now 🛫
        </Link>
      </div>
    </div>
  );
};

export default AboutPage;
