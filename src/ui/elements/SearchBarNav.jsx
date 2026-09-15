import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, ArrowRight } from "lucide-react";
import { aircraftData } from "../../data/aircraftData";

const SearchBarNav = () => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const filteredAircraft = query.trim() === "" 
    ? [] 
    : aircraftData.filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.manufacturer.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/aircrafts?search=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
    }
  };

  const handleSelectAircraft = (id) => {
    navigate(`/aircraft/${id}`);
    setQuery("");
    setIsOpen(false);
  };

  return (
    <div className="relative w-full max-w-xs" ref={dropdownRef}>
      <form onSubmit={handleSearchSubmit} className="relative flex items-center">
        <Search className="w-4 h-4 absolute left-3 text-sky-600 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search call-sign, model, specs..."
          className="w-full bg-slate-100/90 text-slate-900 text-xs pl-9 pr-7 py-2 rounded-lg border border-slate-300 focus:outline-none focus:bg-white focus:border-sky-600 focus:ring-1 focus:ring-sky-500/30 placeholder:text-slate-400 transition font-mono"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setIsOpen(false);
            }}
            className="absolute right-2.5 text-slate-400 hover:text-slate-700"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </form>

      {/* Dropdown Suggestions */}
      {isOpen && query.trim() !== "" && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden z-50">
          {filteredAircraft.length > 0 ? (
            <div className="py-1">
              <div className="px-3 py-1.5 text-[10px] uppercase font-mono font-semibold text-slate-500 tracking-wider border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <span>Matching Specifications</span>
                <span className="text-[9px] text-sky-600 font-bold">FLIGHT ARCHIVE</span>
              </div>
              {filteredAircraft.map((plane) => (
                <button
                  key={plane.id}
                  onClick={() => handleSelectAircraft(plane.id)}
                  className="w-full text-left px-3 py-2 hover:bg-sky-50/80 flex items-center gap-3 transition-colors text-sm text-slate-700 group border-b border-slate-50 last:border-0"
                >
                  <img
                    src={plane.image}
                    alt=""
                    className="w-9 h-7 object-cover rounded border border-slate-200"
                  />
                  <div className="flex-1 truncate">
                    <span className="font-semibold text-slate-900 group-hover:text-sky-700 block truncate text-xs font-display">
                      {plane.name}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {plane.manufacturer} • Mach {plane.speedMach}
                    </span>
                  </div>
                </button>
              ))}
              <div className="p-1.5 border-t border-slate-100 bg-slate-50">
                <button
                  onClick={handleSearchSubmit}
                  className="w-full py-1.5 text-center text-xs text-sky-700 hover:text-sky-800 hover:bg-sky-100/50 rounded flex items-center justify-center gap-1 font-mono font-medium"
                >
                  <span>View telemetry for "{query}"</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 text-center text-xs text-slate-500">
              No matching aircraft found for "{query}".
              <div className="mt-2">
                <button
                  onClick={() => {
                    navigate("/aircrafts");
                    setIsOpen(false);
                  }}
                  className="text-sky-600 hover:underline font-mono text-[11px] font-semibold"
                >
                  Browse Full Catalog
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBarNav;