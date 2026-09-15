import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Scale, ArrowLeftRight, BarChart2, Table, ArrowRight } from "lucide-react";
import { aircraftData } from "../data/aircraftData";
import ThemeToggle from "../ui/buttons/ThemeToggle";

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
        <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md bg-sky-50 dark:bg-[#071224] border border-sky-200 dark:border-[#1a3254] text-sky-700 dark:text-sky-300 text-xs font-mono mb-3 font-semibold shadow-xs">
          <Scale className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
          <span className="uppercase tracking-wider">Flight Telemetry Comparison</span>
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display">
          Aircraft Specification Comparison
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base mt-2">
          Direct side-by-side telemetry benchmarking of operational speeds, certified ranges, and aerodynamic profiles.
        </p>
        <div className="flex justify-center mt-4">
          <ThemeToggle showLabel className="px-3 py-1.5 text-xs" />
        </div>
      </div>

      {/* Selectors Bar */}
      <div className="aero-panel p-5 rounded-xl border border-slate-200 dark:border-[#1a3254] bg-white dark:bg-[#0c182b] mb-8 shadow-xs transition-colors">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Aircraft 1 selector */}
          <div className="w-full md:w-5/12">
            <label className="block text-xs font-mono uppercase tracking-wider text-sky-700 dark:text-sky-400 mb-2 font-bold flex items-center justify-between">
              <span>Aircraft Alpha (Primary)</span>
              <span className="text-[10px] text-sky-600 dark:text-sky-300 font-bold">M {plane1.speedMach}</span>
            </label>
            <select
              value={planeId1}
              onChange={(e) => handleSelect1(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#07101f] text-slate-900 dark:text-white text-sm font-semibold px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-[#1a3254] focus:outline-none focus:border-sky-600 focus:bg-white dark:focus:border-sky-400"
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
            className="p-2.5 rounded-lg bg-slate-100 dark:bg-[#0f213b] hover:bg-slate-200 dark:hover:bg-[#163056] text-slate-700 dark:text-sky-300 transition border border-slate-300 dark:border-[#1a3254] shrink-0 mt-2 md:mt-5 shadow-xs"
            title="Swap Aircraft"
          >
            <ArrowLeftRight className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          </button>

          {/* Aircraft 2 selector */}
          <div className="w-full md:w-5/12">
            <label className="block text-xs font-mono uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-2 font-bold flex items-center justify-between">
              <span>Aircraft Bravo (Benchmark)</span>
              <span className="text-[10px] text-amber-600 dark:text-amber-300 font-bold">M {plane2.speedMach}</span>
            </label>
            <select
              value={planeId2}
              onChange={(e) => handleSelect2(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#07101f] text-slate-900 dark:text-white text-sm font-semibold px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-[#1a3254] focus:outline-none focus:border-amber-600 focus:bg-white dark:focus:border-amber-400"
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Plane 1 Card */}
        <div className="aero-panel rounded-xl overflow-hidden border border-slate-200 dark:border-[#1a3254] bg-white dark:bg-[#0c182b] shadow-xs transition-colors">
          <div className="relative h-52 w-full overflow-hidden bg-slate-900">
            <img
              src={plane1.image}
              alt={plane1.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/images/aircraft/boeing-787-dreamliner.jpg";
              }}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 dark:from-[#0c182b] via-transparent to-transparent" />
            <div className="absolute bottom-3 left-4">
              <span className="text-[10px] uppercase tracking-widest text-sky-300 dark:text-sky-400 font-mono font-bold">
                {plane1.manufacturer}
              </span>
              <h2 className="text-xl font-bold text-white font-display">{plane1.name}</h2>
            </div>
          </div>
          <div className="p-4">
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
              {plane1.description}
            </p>
            <Link
              to={`/aircraft/${plane1.id}`}
              className="mt-3 inline-flex items-center gap-1 text-xs font-mono text-sky-700 dark:text-sky-400 hover:text-sky-900 dark:hover:text-sky-300 font-bold"
            >
              <span>View Telemetry File</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Plane 2 Card */}
        <div className="aero-panel rounded-xl overflow-hidden border border-slate-200 dark:border-[#1a3254] bg-white dark:bg-[#0c182b] shadow-xs transition-colors">
          <div className="relative h-52 w-full overflow-hidden bg-slate-900">
            <img
              src={plane2.image}
              alt={plane2.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/images/aircraft/boeing-787-dreamliner.jpg";
              }}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 dark:from-[#0c182b] via-transparent to-transparent" />
            <div className="absolute bottom-3 left-4">
              <span className="text-[10px] uppercase tracking-widest text-amber-300 dark:text-amber-400 font-mono font-bold">
                {plane2.manufacturer}
              </span>
              <h2 className="text-xl font-bold text-white font-display">{plane2.name}</h2>
            </div>
          </div>
          <div className="p-4">
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
              {plane2.description}
            </p>
            <Link
              to={`/aircraft/${plane2.id}`}
              className="mt-3 inline-flex items-center gap-1 text-xs font-mono text-amber-700 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300 font-bold"
            >
              <span>View Telemetry File</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Visual Metric Comparison Bars */}
      <div className="aero-panel rounded-xl p-6 border border-slate-200 dark:border-[#1a3254] bg-white dark:bg-[#0c182b] shadow-xs mb-10 space-y-6 transition-colors">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 font-display">
          <BarChart2 className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          <span>Core Telemetry Benchmarks</span>
        </h3>

        {/* Top Speed Bar */}
        <div>
          <div className="flex justify-between items-center text-xs font-semibold mb-2">
            <span className="text-sky-700 dark:text-sky-400 font-mono font-bold">
              {plane1.name}: Mach {plane1.speedMach}
            </span>
            <span className="text-slate-500 dark:text-slate-400 uppercase text-[10px] font-mono tracking-wider">
              Top Airspeed (Mach)
            </span>
            <span className="text-amber-700 dark:text-amber-400 font-mono font-bold">
              {plane2.name}: Mach {plane2.speedMach}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 h-3 bg-slate-100 dark:bg-[#07101f] rounded overflow-hidden p-0.5 border border-slate-200 dark:border-[#1a3254]">
            <div className="flex justify-end">
              <div
                style={{ width: `${(plane1.speedMach / maxSpeed) * 100}%` }}
                className="h-full bg-sky-600 dark:bg-sky-500 rounded-xs transition-all duration-300"
              />
            </div>
            <div className="flex justify-start">
              <div
                style={{ width: `${(plane2.speedMach / maxSpeed) * 100}%` }}
                className="h-full bg-amber-500 rounded-xs transition-all duration-300"
              />
            </div>
          </div>
        </div>

        {/* Max Range Bar */}
        <div>
          <div className="flex justify-between items-center text-xs font-semibold mb-2">
            <span className="text-sky-700 dark:text-sky-400 font-mono font-bold">
              {plane1.maxRangeKm.toLocaleString()} km
            </span>
            <span className="text-slate-500 dark:text-slate-400 uppercase text-[10px] font-mono tracking-wider">
              Operational Nautical Radius
            </span>
            <span className="text-amber-700 dark:text-amber-400 font-mono font-bold">
              {plane2.maxRangeKm.toLocaleString()} km
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 h-3 bg-slate-100 dark:bg-[#07101f] rounded overflow-hidden p-0.5 border border-slate-200 dark:border-[#1a3254]">
            <div className="flex justify-end">
              <div
                style={{ width: `${(plane1.maxRangeKm / maxRange) * 100}%` }}
                className="h-full bg-sky-600 dark:bg-sky-500 rounded-xs transition-all duration-300"
              />
            </div>
            <div className="flex justify-start">
              <div
                style={{ width: `${(plane2.maxRangeKm / maxRange) * 100}%` }}
                className="h-full bg-amber-500 rounded-xs transition-all duration-300"
              />
            </div>
          </div>
        </div>

        {/* Passenger Capacity Bar */}
        <div>
          <div className="flex justify-between items-center text-xs font-semibold mb-2">
            <span className="text-sky-700 dark:text-sky-400 font-mono font-bold">
              {plane1.passengerCapacity} pax
            </span>
            <span className="text-slate-500 dark:text-slate-400 uppercase text-[10px] font-mono tracking-wider">
              Payload / Passenger Seating
            </span>
            <span className="text-amber-700 dark:text-amber-400 font-mono font-bold">
              {plane2.passengerCapacity} pax
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 h-3 bg-slate-100 dark:bg-[#07101f] rounded overflow-hidden p-0.5 border border-slate-200 dark:border-[#1a3254]">
            <div className="flex justify-end">
              <div
                style={{ width: `${(plane1.passengerCapacity / maxPax) * 100}%` }}
                className="h-full bg-sky-600 dark:bg-sky-500 rounded-xs transition-all duration-300"
              />
            </div>
            <div className="flex justify-start">
              <div
                style={{ width: `${(plane2.passengerCapacity / maxPax) * 100}%` }}
                className="h-full bg-amber-500 rounded-xs transition-all duration-300"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-Side Detailed Specs Table */}
      <div className="aero-panel rounded-xl p-6 border border-slate-200 dark:border-[#1a3254] bg-white dark:bg-[#0c182b] shadow-xs overflow-x-auto transition-colors">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2 font-display">
          <Table className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          <span>Certified Specifications Matrix</span>
        </h3>

        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-[#1a3254] text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50/70 dark:bg-[#071224]">
              <th className="py-2.5 px-3">Specification</th>
              <th className="py-2.5 px-3 text-sky-700 dark:text-sky-400 font-bold">{plane1.name}</th>
              <th className="py-2.5 px-3 text-amber-700 dark:text-amber-400 font-bold">{plane2.name}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-[#1a3254]/70 font-medium">
            <tr>
              <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400 font-normal">Classification</td>
              <td className="py-2.5 px-3 text-slate-900 dark:text-white">{plane1.category}</td>
              <td className="py-2.5 px-3 text-slate-900 dark:text-white">{plane2.category}</td>
            </tr>
            <tr>
              <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400 font-normal">Mission Role</td>
              <td className="py-2.5 px-3 text-slate-900 dark:text-white">{plane1.role}</td>
              <td className="py-2.5 px-3 text-slate-900 dark:text-white">{plane2.role}</td>
            </tr>
            <tr>
              <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400 font-normal">Status</td>
              <td className="py-2.5 px-3 text-slate-900 dark:text-white">{plane1.status}</td>
              <td className="py-2.5 px-3 text-slate-900 dark:text-white">{plane2.status}</td>
            </tr>
            <tr>
              <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400 font-normal">First Flight</td>
              <td className="py-2.5 px-3 text-slate-900 dark:text-white font-mono">{plane1.firstFlight}</td>
              <td className="py-2.5 px-3 text-slate-900 dark:text-white font-mono">{plane2.firstFlight}</td>
            </tr>
            <tr>
              <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400 font-normal">Wingspan</td>
              <td className="py-2.5 px-3 text-slate-900 dark:text-white font-mono">{plane1.wingspan}</td>
              <td className="py-2.5 px-3 text-slate-900 dark:text-white font-mono">{plane2.wingspan}</td>
            </tr>
            <tr>
              <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400 font-normal">Overall Length</td>
              <td className="py-2.5 px-3 text-slate-900 dark:text-white font-mono">{plane1.length}</td>
              <td className="py-2.5 px-3 text-slate-900 dark:text-white font-mono">{plane2.length}</td>
            </tr>
            <tr>
              <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400 font-normal">Propulsion</td>
              <td className="py-2.5 px-3 text-slate-900 dark:text-white">{plane1.engines}</td>
              <td className="py-2.5 px-3 text-slate-900 dark:text-white">{plane2.engines}</td>
            </tr>
            <tr>
              <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400 font-normal">Service Ceiling</td>
              <td className="py-2.5 px-3 text-slate-900 dark:text-white font-mono">{plane1.serviceCeiling}</td>
              <td className="py-2.5 px-3 text-slate-900 dark:text-white font-mono">{plane2.serviceCeiling}</td>
            </tr>
            <tr>
              <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400 font-normal">Max Takeoff Weight (MTOW)</td>
              <td className="py-2.5 px-3 text-slate-900 dark:text-white font-mono">{plane1.maxTakeoffWeight}</td>
              <td className="py-2.5 px-3 text-slate-900 dark:text-white font-mono">{plane2.maxTakeoffWeight}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComparePage;
