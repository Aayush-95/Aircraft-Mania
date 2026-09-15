import React from "react";
import { Link } from "react-router-dom";
import { Target, Compass, Users, HelpCircle, ArrowRight, Quote, ShieldCheck } from "lucide-react";
import ThemeToggle from "../ui/buttons/ThemeToggle";

const AboutPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md bg-sky-50 dark:bg-[#071224] border border-sky-200 dark:border-[#1a3254] text-sky-700 dark:text-sky-300 text-xs font-mono mb-3 font-semibold shadow-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
          <span className="uppercase tracking-wider">About Aircraft Mania</span>
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display">
          Documenting the Science & Art of Flight
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
          Aircraft Mania was engineered for spotters, aerospace engineers, pilots, and aviation historians who demand accurate, uncluttered specifications and head-to-head performance benchmarks.
        </p>
        <div className="flex justify-center mt-5">
          <ThemeToggle showLabel className="px-3 py-1.5 text-xs" />
        </div>
      </div>

      {/* Mission Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
        <div className="aero-panel p-5 rounded-xl border border-slate-200 dark:border-[#1a3254] bg-white dark:bg-[#0c182b] shadow-xs transition-colors">
          <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-500/15 border border-sky-200 dark:border-sky-400/30 flex items-center justify-center text-sky-600 dark:text-sky-400 mb-3 shadow-xs">
            <Target className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5 font-display">Curated Archive</h3>
          <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
            Providing an authoritative, fast, and structured repository of commercial, military, and experimental aircraft specifications and avionics data.
          </p>
        </div>

        <div className="aero-panel p-5 rounded-xl border border-slate-200 dark:border-[#1a3254] bg-white dark:bg-[#0c182b] shadow-xs transition-colors">
          <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-500/15 border border-amber-200 dark:border-amber-400/30 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-3 shadow-xs">
            <Compass className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5 font-display">Certified Telemetry</h3>
          <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
            Every specification is cross-referenced with civil type certification data sheets (FAA, EASA) and aerospace manufacturer technical documentation.
          </p>
        </div>

        <div className="aero-panel p-5 rounded-xl border border-slate-200 dark:border-[#1a3254] bg-white dark:bg-[#0c182b] shadow-xs transition-colors">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-400/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-3 shadow-xs">
            <Users className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5 font-display">Enthusiast Telemetry</h3>
          <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
            A community-supported directory where aviation enthusiasts can propose rare prototypes, suggest specification revisions, and compare aircraft side-by-side.
          </p>
        </div>
      </div>

      {/* Aviation Timeline Quote */}
      <div className="aero-panel rounded-xl p-8 border border-slate-200 dark:border-[#1a3254] bg-white dark:bg-[#081222] text-center mb-12 shadow-xs transition-colors relative">
        <Quote className="w-6 h-6 text-sky-600/30 dark:text-sky-400/40 mx-auto mb-2" />
        <p className="text-lg sm:text-xl italic text-slate-800 dark:text-slate-200 max-w-2xl mx-auto leading-relaxed font-serif">
          "Once you have tasted flight, you will forever walk the earth with your eyes turned skyward, for there you have been, and there you will always long to return."
        </p>
        <p className="mt-3 text-xs font-mono uppercase tracking-widest text-sky-600 dark:text-sky-400 font-bold">
          — Leonardo da Vinci
        </p>
      </div>

      {/* Frequently Asked Questions */}
      <div className="aero-panel rounded-xl p-6 sm:p-8 border border-slate-200 dark:border-[#1a3254] bg-white dark:bg-[#0c182b] shadow-xs mb-12 transition-colors">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2 font-display">
          <HelpCircle className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          <span>Frequently Asked Questions</span>
        </h2>

        <div className="space-y-3">
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-[#07101f] border border-slate-200 dark:border-[#1a3254]">
            <h4 className="font-bold text-slate-900 dark:text-sky-200 text-xs sm:text-sm mb-1 font-display">
              How are aircraft comparison metrics calculated?
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Our telemetry engine normalizes official manufacturer figures including maximum certified Mach numbers, non-stop range with standard reserves, and typical passenger configurations.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 dark:bg-[#07101f] border border-slate-200 dark:border-[#1a3254]">
            <h4 className="font-bold text-slate-900 dark:text-sky-200 text-xs sm:text-sm mb-1 font-display">
              Can I suggest historical warbirds or experimental prototypes?
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Yes. Use our <Link to="/suggest" className="text-sky-600 dark:text-sky-400 hover:underline font-semibold">Suggest an Aircraft form</Link> to propose any aircraft from early pioneers to modern stealth prototypes.
            </p>
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <div className="text-center">
        <Link
          to="/aircrafts"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-colors shadow-sm"
        >
          <span>Explore Fleet Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default AboutPage;
