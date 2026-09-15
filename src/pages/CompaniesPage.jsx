import React from "react";
import { Link } from "react-router-dom";
import { Building2, Milestone, ArrowRight } from "lucide-react";
import { companiesData } from "../data/companiesData";
import { aircraftData } from "../data/aircraftData";
import CompanyCard from "../ui/cards/CompanyCard";
import ThemeToggle from "../ui/buttons/ThemeToggle";

const CompaniesPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      {/* Header Banner */}
      <div className="mb-10 text-center max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md bg-sky-50 dark:bg-[#071224] border border-sky-200 dark:border-[#1a3254] text-sky-700 dark:text-sky-300 text-xs font-mono mb-3 font-semibold shadow-xs">
          <Building2 className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
          <span className="uppercase tracking-wider">Aerospace Industry Directory</span>
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display">
          Pioneering Aerospace Manufacturers
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
          From early supersonic pioneers and military defense primes to modern composite commercial aviation conglomerates.
        </p>
        <div className="flex justify-center mt-4">
          <ThemeToggle showLabel className="px-3 py-1.5 text-xs" />
        </div>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
        {companiesData.map((company) => {
          const count = aircraftData.filter((a) =>
            a.manufacturer.toLowerCase().includes(company.name.toLowerCase())
          ).length;

          return (
            <CompanyCard
              key={company.id}
              id={company.id}
              companyname={company.name}
              country={company.country}
              specialization={company.specialization}
              aircraftsCount={count || "5+"}
              companyLogo={company.logo}
              description={company.description}
              website={company.website}
            />
          );
        })}
      </div>

      {/* Aerospace Milestones Section */}
      <div className="aero-panel rounded-xl p-6 sm:p-8 border border-slate-200 dark:border-[#1a3254] bg-white dark:bg-[#0c182b] shadow-xs transition-colors">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2.5 font-display">
          <Milestone className="w-5 h-5 text-sky-600 dark:text-sky-400" />
          <span>Historical Aerospace Milestones</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {companiesData.map((comp) => (
            <div key={comp.id} className="p-4 rounded-lg bg-slate-50 dark:bg-[#07101f] border border-slate-200 dark:border-[#1a3254]">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2.5 font-display flex items-center justify-between">
                <span>{comp.name}</span>
                <span className="text-[10px] font-mono text-slate-500 dark:text-sky-400/80 font-normal">Est. {comp.founded}</span>
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                {comp.keyMilestones?.map((m, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-sky-600 dark:text-sky-400 font-mono text-[10px] shrink-0 mt-0.5">▪</span>
                    <span className="leading-relaxed">{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompaniesPage;
