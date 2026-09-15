import React from "react";
import { Sun, Moon, Sparkles } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const FloatingThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="fixed bottom-6 right-6 z-50 group">
      <button
        onClick={toggleTheme}
        type="button"
        className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-full border border-slate-300/80 dark:border-sky-500/30 bg-white/90 dark:bg-[#0c182b]/95 backdrop-blur-md text-slate-800 dark:text-slate-100 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer group-hover:border-sky-500 dark:group-hover:border-sky-400"
        title={isDark ? "Switch to Daylight Flight Mode (Light Theme)" : "Switch to Night Flight Deck Mode (Dark Theme)"}
        aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      >
        {/* Aviation Beacon Indicator */}
        <span className="relative flex h-2.5 w-2.5">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              isDark ? "bg-amber-400" : "bg-sky-400"
            }`}
          />
          <span
            className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
              isDark ? "bg-amber-500" : "bg-sky-600"
            }`}
          />
        </span>

        {/* Icon */}
        <div className="w-5 h-5 flex items-center justify-center">
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300 group-hover:rotate-45" />
          ) : (
            <Moon className="w-4 h-4 text-sky-600 transition-transform duration-300 group-hover:-rotate-12" />
          )}
        </div>

        {/* Text / Status Label */}
        <div className="flex flex-col text-left leading-none pr-1">
          <span className="text-[9px] font-mono uppercase tracking-widest text-slate-500 dark:text-sky-300/80 font-bold">
            Lighting Mode
          </span>
          <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
            {isDark ? "Night Cockpit" : "Daylight"}
          </span>
        </div>
      </button>
    </div>
  );
};

export default FloatingThemeToggle;
