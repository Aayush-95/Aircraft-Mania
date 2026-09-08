import React from "react";
import { Link } from "react-router-dom";
import { companiesData } from "../data/companiesData";
import { aircraftData } from "../data/aircraftData";
import CompanyCard from "../ui/cards/CompanyCard";

const CompaniesPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      {/* Header Banner */}
      <div className="mb-10 text-center max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-300 text-xs font-semibold mb-3 font-mono">
          🏢 Aerospace Manufacturers
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Pioneering Aircraft Companies
        </h1>
        <p className="text-slate-400 text-base mt-3 leading-relaxed">
          From the pioneers of the Jet Age to modern composite aerospace marvels. Learn about the legendary aerospace corporations shaping the skies.
        </p>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {companiesData.map((company) => {
          // Count models in dataset
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
      <div className="glass-panel rounded-3xl p-8 sm:p-10 border border-sky-500/20 bg-slate-900/60 shadow-2xl">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-6 flex items-center gap-3">
          <span>🏛️</span> Historic Aerospace Milestones
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companiesData.map((comp) => (
            <div key={comp.id} className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800">
              <h3 className="text-lg font-bold text-sky-300 mb-3">{comp.name}</h3>
              <ul className="space-y-2 text-xs text-slate-300">
                {comp.keyMilestones?.map((m, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-sky-400">▹</span>
                    <span>{m}</span>
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
