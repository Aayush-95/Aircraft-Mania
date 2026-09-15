import React from "react";
import { Link } from "react-router-dom";
import { 
  X, 
  Plane, 
  Compass, 
  Gauge, 
  ArrowUpRight, 
  ArrowDownRight, 
  Minus, 
  Radio, 
  ShieldAlert, 
  MapPin, 
  ExternalLink,
  Activity,
  Globe
} from "lucide-react";

// Known airline prefix mapping for rich telemetry metadata
const AIRLINE_CALLSIGN_MAP = {
  AAL: { name: "American Airlines", hub: "Dallas / Fort Worth (DFW)" },
  UAL: { name: "United Airlines", hub: "Chicago O'Hare (ORD)" },
  DAL: { name: "Delta Air Lines", hub: "Atlanta Hartsfield (ATL)" },
  SWA: { name: "Southwest Airlines", hub: "Dallas Love Field (DAL)" },
  BAW: { name: "British Airways", hub: "London Heathrow (LHR)" },
  DLH: { name: "Lufthansa", hub: "Frankfurt / Munich (FRA/MUC)" },
  AFR: { name: "Air France", hub: "Paris Charles de Gaulle (CDG)" },
  KLM: { name: "KLM Royal Dutch", hub: "Amsterdam Schiphol (AMS)" },
  UAE: { name: "Emirates", hub: "Dubai International (DXB)" },
  QTR: { name: "Qatar Airways", hub: "Doha Hamad (DOH)" },
  SIA: { name: "Singapore Airlines", hub: "Singapore Changi (SIN)" },
  CPA: { name: "Cathay Pacific", hub: "Hong Kong (HKG)" },
  ANA: { name: "All Nippon Airways", hub: "Tokyo Haneda / Narita (HND)" },
  JAL: { name: "Japan Airlines", hub: "Tokyo Haneda / Narita (HND)" },
  QFA: { name: "Qantas", hub: "Sydney Kingsford Smith (SYD)" },
  ACA: { name: "Air Canada", hub: "Toronto Pearson (YYZ)" },
  THY: { name: "Turkish Airlines", hub: "Istanbul Airport (IST)" },
  AIC: { name: "Air India", hub: "Delhi Indira Gandhi (DEL)" },
  IGO: { name: "IndiGo", hub: "Delhi Indira Gandhi (DEL)" },
  FDX: { name: "FedEx Express Cargo", hub: "Memphis SuperHub (MEM)" },
  UPS: { name: "UPS Airlines Cargo", hub: "Louisville Worldport (SDF)" },
  SWR: { name: "Swiss International", hub: "Zurich (ZRH)" },
  AUA: { name: "Austrian Airlines", hub: "Vienna (VIE)" },
  IBE: { name: "Iberia", hub: "Madrid-Barajas (MAD)" },
  ITY: { name: "ITA Airways", hub: "Rome Fiumicino (FCO)" },
  EIN: { name: "Aer Lingus", hub: "Dublin (DUB)" },
  SAS: { name: "Scandinavian Airlines", hub: "Copenhagen / Stockholm" },
};

function inferOperator(callsign) {
  if (!callsign || callsign.length < 3) return null;
  const prefix = callsign.slice(0, 3).toUpperCase();
  return AIRLINE_CALLSIGN_MAP[prefix] || null;
}

const FlightDossierPanel = ({ flight, onClose }) => {
  if (!flight) return null;

  const operator = inferOperator(flight.callsign);
  const machEstimate = flight.velocityKmh ? (flight.velocityKmh / 1062).toFixed(2) : "0.00";

  return (
    <div className="w-full lg:w-96 flex flex-col bg-white dark:bg-[#071224] border border-slate-300 dark:border-[#1a3254] rounded-xl shadow-2xl overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 lg:slide-in-from-right-4">
      {/* Header Banner */}
      <div className="p-4 bg-gradient-to-r from-sky-600 via-sky-700 to-indigo-700 text-white relative">
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-1 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
          aria-label="Close Flight Dossier"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-1 text-xs font-mono text-sky-200">
          <Plane className="w-3.5 h-3.5 text-sky-300 -rotate-45" />
          <span>FLIGHT TELEMETRY DOSSIER</span>
          {flight.onGround ? (
            <span className="px-1.5 py-0.5 rounded bg-amber-500/30 text-amber-200 text-[10px] font-bold">
              ON GROUND
            </span>
          ) : (
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/30 text-emerald-200 text-[10px] font-bold animate-pulse">
              AIRBORNE
            </span>
          )}
        </div>

        <h3 className="text-2xl font-bold font-display tracking-tight text-white flex items-center gap-2">
          {flight.callsign}
        </h3>

        <div className="flex items-center gap-2 text-xs text-sky-100 font-mono mt-0.5">
          <Globe className="w-3.5 h-3.5" />
          <span>{flight.country}</span>
          <span>•</span>
          <span>ICAO: {flight.icao24}</span>
        </div>
      </div>

      {/* Emergency Alert Banner if squawk 7700/7600 */}
      {flight.isEmergency && (
        <div className="bg-red-600/15 border-b border-red-500/40 px-4 py-2 flex items-center gap-2 text-red-500 dark:text-red-400 text-xs font-mono font-bold">
          <ShieldAlert className="w-4 h-4 animate-bounce" />
          <span>TRANSPONDER SQUAWK {flight.squawk} — SPECIAL SQUAWK ADVISORY</span>
        </div>
      )}

      {/* Operator Info if recognized */}
      {operator && (
        <div className="px-4 py-2.5 bg-sky-50/50 dark:bg-[#0c1a30] border-b border-slate-200 dark:border-[#1a3254] flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] uppercase font-mono text-slate-500 dark:text-slate-400 block">Operator</span>
            <span className="font-semibold text-slate-800 dark:text-sky-300">{operator.name}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-mono text-slate-500 dark:text-slate-400 block">Hub Base</span>
            <span className="text-slate-600 dark:text-slate-300 font-mono text-[11px]">{operator.hub}</span>
          </div>
        </div>
      )}

      {/* Core Telemetry Grid */}
      <div className="p-4 space-y-4 max-h-[calc(100vh-280px)] overflow-y-auto">
        {/* Altitude & Vertical Rate */}
        <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#0c182b] border border-slate-200 dark:border-[#1a3254]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-mono uppercase text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-sky-500" />
              Barometric Altitude
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300 font-bold">
              {flight.flightLevel}
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
              {flight.altitudeFeet != null ? flight.altitudeFeet.toLocaleString() : "---"}{" "}
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400">ft</span>
            </span>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
              {flight.altitudeMeters != null ? flight.altitudeMeters.toLocaleString() + " m" : "---"}
            </span>
          </div>

          <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-500 dark:text-slate-400">Vertical Speed:</span>
            <div className="flex items-center gap-1 font-semibold">
              {flight.isClimbing ? (
                <>
                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">+{flight.verticalRateFpm} ft/min</span>
                </>
              ) : flight.isDescending ? (
                <>
                  <ArrowDownRight className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-amber-600 dark:text-amber-400">{flight.verticalRateFpm} ft/min</span>
                </>
              ) : (
                <>
                  <Minus className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-600 dark:text-slate-300">Level (0 ft/min)</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Speed & Mach */}
        <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#0c182b] border border-slate-200 dark:border-[#1a3254]">
          <span className="text-xs font-mono uppercase text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-1">
            <Gauge className="w-3.5 h-3.5 text-emerald-500" />
            Ground Velocity
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
              {flight.velocityKts}{" "}
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400">kts</span>
            </span>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
              {flight.velocityKmh} km/h
            </span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-500 dark:text-slate-400">Airspeed Estimate:</span>
            <span className="font-semibold text-sky-600 dark:text-sky-300">Mach {machEstimate}</span>
          </div>
        </div>

        {/* Heading & Squawk Two-Column */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#0c182b] border border-slate-200 dark:border-[#1a3254]">
            <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-1">
              <Compass className="w-3 h-3 text-indigo-500" />
              True Track
            </span>
            <span className="text-lg font-bold font-mono text-slate-900 dark:text-white block">
              {flight.heading}°
            </span>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
              {flight.headingCardinal}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#0c182b] border border-slate-200 dark:border-[#1a3254]">
            <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-1">
              <Radio className="w-3 h-3 text-amber-500" />
              Transponder
            </span>
            <span className="text-lg font-bold font-mono text-slate-900 dark:text-white block">
              {flight.squawk}
            </span>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">Mode-S / ADS-B</span>
          </div>
        </div>

        {/* Geographic Coordinates */}
        <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#0c182b] border border-slate-200 dark:border-[#1a3254] space-y-1.5">
          <div className="flex items-center gap-1 text-xs font-mono uppercase text-slate-500 dark:text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-rose-500" />
            <span>Telemetry Coordinates</span>
          </div>
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-500 dark:text-slate-400">Latitude:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{flight.lat}° N</span>
          </div>
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-500 dark:text-slate-400">Longitude:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{flight.lng}° E</span>
          </div>
        </div>

        {/* Quick Action Links */}
        <div className="pt-2 flex flex-col gap-2">
          <Link
            to={`/aircrafts?q=${encodeURIComponent(flight.callsign.slice(0, 3))}`}
            className="w-full py-2.5 px-3 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <Plane className="w-4 h-4" />
            <span>Search Fleet Catalog for Aircraft</span>
          </Link>

          <a
            href={`https://flightaware.com/live/flight/${encodeURIComponent(flight.callsign)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 px-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-mono flex items-center justify-center gap-2 border border-slate-300 dark:border-[#1a3254] transition-colors"
          >
            <span>External FlightAware Dossier</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default FlightDossierPanel;
