import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
        <span className="absolute left-3.5 text-slate-400 pointer-events-none text-sm">
          🔍
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search aircraft, company..."
          className="w-full bg-slate-900/80 text-slate-100 text-sm pl-9 pr-4 py-2 rounded-full border border-sky-500/30 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 placeholder:text-slate-500 transition shadow-inner"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setIsOpen(false);
            }}
            className="absolute right-3 text-slate-400 hover:text-slate-200 text-xs"
          >
            ✕
          </button>
        )}
      </form>

      {/* Dropdown Suggestions */}
      {isOpen && query.trim() !== "" && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 backdrop-blur-xl border border-sky-500/30 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in duration-150">
          {filteredAircraft.length > 0 ? (
            <div className="py-1">
              <div className="px-3 py-1 text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                Matching Aircraft
              </div>
              {filteredAircraft.map((plane) => (
                <button
                  key={plane.id}
                  onClick={() => handleSelectAircraft(plane.id)}
                  className="w-full text-left px-3 py-2 hover:bg-sky-500/15 flex items-center gap-3 transition-colors text-sm text-slate-200 group"
                >
                  <img
                    src={plane.image}
                    alt=""
                    className="w-9 h-7 object-cover rounded border border-slate-700"
                  />
                  <div className="flex-1 truncate">
                    <span className="font-medium text-slate-100 group-hover:text-sky-300 block truncate">
                      {plane.name}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {plane.manufacturer} • {plane.category}
                    </span>
                  </div>
                </button>
              ))}
              <div className="p-1 border-t border-slate-800">
                <button
                  onClick={handleSearchSubmit}
                  className="w-full py-1.5 text-center text-xs text-sky-400 hover:text-sky-300 hover:bg-slate-800/60 rounded"
                >
                  View all results for "{query}" →
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 text-center text-xs text-slate-400">
              No aircraft found for "{query}".
              <div className="mt-1">
                <button
                  onClick={() => {
                    navigate("/aircrafts");
                    setIsOpen(false);
                  }}
                  className="text-sky-400 hover:underline"
                >
                  Browse all aircraft
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