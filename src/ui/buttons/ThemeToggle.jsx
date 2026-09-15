import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const ThemeToggle = ({ showLabel = false, className = "" }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`inline-flex items-center gap-2 p-2 rounded-lg border border-slate-200 dark:border-[#1a3254] bg-white dark:bg-[#0c182b] text-slate-700 dark:text-sky-300 hover:text-sky-600 dark:hover:text-white hover:border-sky-300 dark:hover:border-sky-500 transition-all shadow-xs cursor-pointer ${className}`}
      title={isDark ? "Switch to Daylight Flight Mode (Light)" : "Switch to Night Stratosphere Mode (Dark)"}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-180 duration-200" />
      ) : (
        <Moon className="w-4 h-4 text-sky-600 animate-in spin-in-180 duration-200" />
      )}
      {showLabel && (
        <span className="text-xs font-mono font-semibold uppercase tracking-wider">
          {isDark ? "Night Flight" : "Day Flight"}
        </span>
      )}
    </button>
  );
};

export default ThemeToggle;
