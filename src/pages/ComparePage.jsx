import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { aircraftData } from "../data/aircraftData";

const ComparePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const default1 = searchParams.get("aircraft1") || "concorde";
  const default2 = searchParams.get("aircraft2") || "sr-71-blackbird";

  const [planeId1, setPlaneId1] = useState(default1);
  const [planeId2, setPlaneId2] = useState(default2);

  useEffect(() => {
    const p1 = searchParams.get("aircraft1");
    const p2 = searchParams.get("aircraft2");
    if (p1 && aircraftData.some((a) => a.id === p1)) setPlaneId1(p1);
    if (p2 && aircraftData.some((a) => a.id === p2)) setPlaneId2(p2);
  }, [searchParams]);

  const plane1 = aircraftData.find((a) => a.id === planeId1) || aircraftData[0];
  const plane2 = aircraftData.find((a) => a.id === planeId2) || aircraftData[1];

  const handleSelect1 = (id) => {
    setPlaneId1(id);
    setSearchParams({ aircraft1: id, aircraft2: planeId2 });
  };

  const handleSelect2 = (id) => {
    setPlaneId2(id);
    setSearchParams({ aircraft1: planeId1, aircraft2: id });
  };

  const handleSwap = () => {
    const temp = planeId1;
    setPlaneId1(planeId2);
    setPlaneId2(temp);
    setSearchParams({ aircraft1: planeId2, aircraft2: temp });
  };

  // Comparison metrics calculations
  const maxSpeed = Math.max(plane1.speedMach, plane2.speedMach, 1);
  const maxRange = Math.max(plane1.maxRangeKm, plane2.maxRangeKm, 1);
  const maxPax = Math.max(plane1.passengerCapacity, plane2.passengerCapacity, 1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-300 text-xs font-semibold mb-3 font-mono">
          ⚖️ Head-to-Head Telemetry
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Aircraft Comparison Tool
        </h1>
        <p className="text-slate-400 text-base mt-2">
          Compare specifications, operational ranges, cruising speeds, and engineering capabilities side-by-side.
        </p>
      </div>

      {/* Selectors Bar */}
      <div className="glass-panel p-6 rounded-2xl border border-sky-500/20 bg-slate-900/60 shadow-xl mb-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Aircraft 1 selector */}
          <div className="w-full md:w-5/12">
            <label className="block text-xs font-mono uppercase tracking-wider text-sky-400 mb-2 font-semibold">
              Aircraft 1 (Alpha)
            </label>
            <select
              value={planeId1}
              onChange={(e) => handleSelect1(e.target.value)}
              className="w-full bg-slate-950 text-white text-base font-semibold px-4 py-3 rounded-xl border border-sky-500/30 focus:outline-none focus:border-sky-400"
            >
              {aircraftData.map((a) => (
                <option key={a.id} value={a.id} disabled={a.id === planeId2}>
                  {a.name} ({a.manufacturer})
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <button
            onClick={handleSwap}
            className="p-3 rounded-full bg-slate-800 hover:bg-sky-500 text-slate-200 hover:text-slate-950 transition border border-slate-700 shadow-md shrink-0"
            title="Swap Aircraft"
          >
            ⇄
          </button>

          {/* Aircraft 2 selector */}
          <div className="w-full md:w-5/12">
            <label className="block text-xs font-mono uppercase tracking-wider text-indigo-400 mb-2 font-semibold">
              Aircraft 2 (Bravo)
            </label>
            <select
              value={planeId2}
              onChange={(e) => handleSelect2(e.target.value)}
              className="w-full bg-slate-950 text-white text-base font-semibold px-4 py-3 rounded-xl border border-indigo-500/30 focus:outline-none focus:border-indigo-400"
            >
              {aircraftData.map((a) => (
                <option key={a.id} value={a.id} disabled={a.id === planeId1}>
                  {a.name} ({a.manufacturer})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Visual Cards Head-to-Head */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Plane 1 Card */}
        <div className="glass-panel rounded-3xl overflow-hidden border border-sky-500/30 bg-slate-900/60 shadow-2xl">
          <div className="relative h-60 w-full overflow-hidden bg-slate-950">
            <img
              src={plane1.image}
              alt={plane1.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/images/aircraft/boeing-787-dreamliner.jpg";
              }}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            <div className="absolute bottom-4 left-6">
              <span className="text-xs uppercase tracking-widest text-sky-400 font-mono">
                {plane1.manufacturer}
              </span>
              <h2 className="text-2xl font-bold text-white">{plane1.name}</h2>
            </div>
          </div>
          <div className="p-6">
            <p className="text-sm text-slate-300 leading-relaxed line-clamp-3">
              {plane1.description}
            </p>
            <Link
              to={`/aircraft/${plane1.id}`}
              className="mt-4 inline-block text-xs font-semibold text-sky-400 hover:text-sky-300 hover:underline"
            >
              View Full Specs Sheet →
            </Link>
          </div>
        </div>

        {/* Plane 2 Card */}
        <div className="glass-panel rounded-3xl overflow-hidden border border-indigo-500/30 bg-slate-900/60 shadow-2xl">
          <div className="relative h-60 w-full overflow-hidden bg-slate-950">
            <img
              src={plane2.image}
              alt={plane2.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/images/aircraft/boeing-787-dreamliner.jpg";
              }}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            <div className="absolute bottom-4 left-6">
              <span className="text-xs uppercase tracking-widest text-indigo-400 font-mono">
                {plane2.manufacturer}
              </span>
              <h2 className="text-2xl font-bold text-white">{plane2.name}</h2>
            </div>
          </div>
          <div className="p-6">
            <p className="text-sm text-slate-300 leading-relaxed line-clamp-3">
              {plane2.description}
            </p>
            <Link
              to={`/aircraft/${plane2.id}`}
              className="mt-4 inline-block text-xs font-semibold text-indigo-400 hover:text-indigo-300 hover:underline"
            >
              View Full Specs Sheet →
            </Link>
          </div>
        </div>
      </div>

      {/* Visual Metric Comparison Bars */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-sky-500/20 bg-slate-900/70 shadow-2xl mb-12 space-y-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <span>📊</span> Direct Metric Comparison
        </h3>

        {/* Top Speed Bar */}
        <div>
          <div className="flex justify-between items-center text-sm font-semibold mb-2">
            <span className="text-sky-400 font-mono">
              {plane1.name}: Mach {plane1.speedMach}
            </span>
            <span className="text-slate-400 uppercase text-xs tracking-wider">
              Top Speed (Mach)
            </span>
            <span className="text-indigo-400 font-mono">
              {plane2.name}: Mach {plane2.speedMach}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 h-4 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div className="flex justify-end">
              <div
                style={{ width: `${(plane1.speedMach / maxSpeed) * 100}%` }}
                className="h-full bg-gradient-to-l from-sky-400 to-sky-600 rounded-full transition-all duration-500"
              />
            </div>
            <div className="flex justify-start">
              <div
                style={{ width: `${(plane2.speedMach / maxSpeed) * 100}%` }}
                className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full transition-all duration-500"
              />
            </div>
          </div>
        </div>

        {/* Max Range Bar */}
        <div>
          <div className="flex justify-between items-center text-sm font-semibold mb-2">
            <span className="text-sky-400 font-mono">
              {plane1.maxRangeKm.toLocaleString()} km
            </span>
            <span className="text-slate-400 uppercase text-xs tracking-wider">
              Max Non-Stop Range
            </span>
            <span className="text-indigo-400 font-mono">
              {plane2.maxRangeKm.toLocaleString()} km
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 h-4 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div className="flex justify-end">
              <div
                style={{ width: `${(plane1.maxRangeKm / maxRange) * 100}%` }}
                className="h-full bg-gradient-to-l from-sky-400 to-sky-600 rounded-full transition-all duration-500"
              />
            </div>
            <div className="flex justify-start">
              <div
                style={{ width: `${(plane2.maxRangeKm / maxRange) * 100}%` }}
                className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full transition-all duration-500"
              />
            </div>
          </div>
        </div>

        {/* Passenger Capacity Bar */}
        <div>
          <div className="flex justify-between items-center text-sm font-semibold mb-2">
            <span className="text-sky-400 font-mono">
              {plane1.passengerCapacity} pax
            </span>
            <span className="text-slate-400 uppercase text-xs tracking-wider">
              Passenger Capacity
            </span>
            <span className="text-indigo-400 font-mono">
              {plane2.passengerCapacity} pax
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 h-4 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div className="flex justify-end">
              <div
                style={{ width: `${(plane1.passengerCapacity / maxPax) * 100}%` }}
                className="h-full bg-gradient-to-l from-sky-400 to-sky-600 rounded-full transition-all duration-500"
              />
            </div>
            <div className="flex justify-start">
              <div
                style={{ width: `${(plane2.passengerCapacity / maxPax) * 100}%` }}
                className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-Side Detailed Specs Table */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-sky-500/20 bg-slate-900/60 shadow-2xl overflow-x-auto">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <span>📋</span> Technical Specification Matrix
        </h3>

        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-xs font-mono uppercase tracking-wider text-slate-400">
              <th className="py-3 px-4">Parameter</th>
              <th className="py-3 px-4 text-sky-400">{plane1.name}</th>
              <th className="py-3 px-4 text-indigo-400">{plane2.name}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium">
            <tr>
              <td className="py-3 px-4 text-slate-400 font-normal">Category</td>
              <td className="py-3 px-4 text-slate-100">{plane1.category}</td>
              <td className="py-3 px-4 text-slate-100">{plane2.category}</td>
            </tr>
            <tr>
              <td className="py-3 px-4 text-slate-400 font-normal">Primary Role</td>
              <td className="py-3 px-4 text-slate-100">{plane1.role}</td>
              <td className="py-3 px-4 text-slate-100">{plane2.role}</td>
            </tr>
            <tr>
              <td className="py-3 px-4 text-slate-400 font-normal">Operational Status</td>
              <td className="py-3 px-4 text-slate-100">{plane1.status}</td>
              <td className="py-3 px-4 text-slate-100">{plane2.status}</td>
            </tr>
            <tr>
              <td className="py-3 px-4 text-slate-400 font-normal">First Flight</td>
              <td className="py-3 px-4 text-slate-100">{plane1.firstFlight}</td>
              <td className="py-3 px-4 text-slate-100">{plane2.firstFlight}</td>
            </tr>
            <tr>
              <td className="py-3 px-4 text-slate-400 font-normal">Wingspan</td>
              <td className="py-3 px-4 text-slate-100 font-mono">{plane1.wingspan}</td>
              <td className="py-3 px-4 text-slate-100 font-mono">{plane2.wingspan}</td>
            </tr>
            <tr>
              <td className="py-3 px-4 text-slate-400 font-normal">Overall Length</td>
              <td className="py-3 px-4 text-slate-100 font-mono">{plane1.length}</td>
              <td className="py-3 px-4 text-slate-100 font-mono">{plane2.length}</td>
            </tr>
            <tr>
              <td className="py-3 px-4 text-slate-400 font-normal">Engines & Power</td>
              <td className="py-3 px-4 text-slate-100">{plane1.engines}</td>
              <td className="py-3 px-4 text-slate-100">{plane2.engines}</td>
            </tr>
            <tr>
              <td className="py-3 px-4 text-slate-400 font-normal">Service Ceiling</td>
              <td className="py-3 px-4 text-slate-100 font-mono">{plane1.serviceCeiling}</td>
              <td className="py-3 px-4 text-slate-100 font-mono">{plane2.serviceCeiling}</td>
            </tr>
            <tr>
              <td className="py-3 px-4 text-slate-400 font-normal">Max Takeoff Weight</td>
              <td className="py-3 px-4 text-slate-100 font-mono">{plane1.maxTakeoffWeight}</td>
              <td className="py-3 px-4 text-slate-100 font-mono">{plane2.maxTakeoffWeight}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComparePage;
