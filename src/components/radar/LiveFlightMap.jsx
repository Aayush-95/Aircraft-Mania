import React, { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import { 
  Layers, 
  Scan, 
  ZoomIn, 
  ZoomOut, 
  Satellite, 
  Eye, 
  Sparkles,
  Info
} from "lucide-react";

// Map tile layers available (Satellite Recon as top priority default)
const TILE_LAYERS = {
  satellite: {
    name: "Satellite Recon",
    base: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    overlay: "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri &mdash; Earthstar Geographics, DeLorme, HERE, TomTom",
    maxZoom: 18,
    subdomains: "abc",
  },
  dark: {
    name: "Dark Avionics",
    base: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    overlay: null,
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
    subdomains: "abcd",
  },
  light: {
    name: "Daylight Radar",
    base: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    overlay: null,
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
    subdomains: "abcd",
  },
};

// Generates lightweight SVG airplane divIcon
function createAircraftDivIcon(flight, isSelected = false) {
  const heading = flight.heading || 0;
  const isGround = flight.onGround;

  // Altitude color banding
  let planeColor = "#38bdf8"; // Mid altitude default (sky-400)
  let glowColor = "rgba(56, 189, 248, 0.6)";

  if (isGround) {
    planeColor = "#94a3b8"; // Slate
    glowColor = "transparent";
  } else if (flight.altitudeFeet != null && flight.altitudeFeet < 10000) {
    planeColor = "#10b981"; // Emerald approach
    glowColor = "rgba(16, 185, 129, 0.7)";
  } else if (flight.altitudeFeet != null && flight.altitudeFeet >= 32000) {
    planeColor = "#fbbf24"; // Amber high cruise
    glowColor = "rgba(251, 191, 36, 0.7)";
  }

  if (flight.isEmergency) {
    planeColor = "#ef4444"; // Emergency Red
    glowColor = "rgba(239, 68, 68, 0.9)";
  }

  const iconSize = isSelected ? 32 : 22;
  const halfSize = iconSize / 2;

  const html = `
    <div class="plane-marker-icon ${isSelected ? "plane-marker-selected" : ""}" style="width: ${iconSize}px; height: ${iconSize}px; position: relative;">
      ${
        isSelected
          ? `<div class="absolute -inset-2 rounded-full border-2 border-sky-400 animate-target-ping pointer-events-none"></div>
             <div class="absolute -inset-1 rounded-full border border-sky-300 opacity-80 pointer-events-none"></div>`
          : ""
      }
      <svg 
        viewBox="0 0 24 24" 
        width="${iconSize}" 
        height="${iconSize}" 
        style="transform: rotate(${heading}deg); transform-origin: center center; filter: drop-shadow(0 0 4px ${glowColor});"
      >
        <path 
          d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" 
          fill="${planeColor}"
          stroke="${isSelected ? "#ffffff" : "#050b14"}"
          stroke-width="0.8"
          stroke-linejoin="round"
        />
      </svg>
      ${
        isSelected
          ? `<div class="absolute -bottom-5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-sky-950/90 border border-sky-400 text-[10px] font-mono font-bold text-sky-200 whitespace-nowrap shadow-lg pointer-events-none z-50">
              ${flight.callsign}
            </div>`
          : ""
      }
    </div>
  `;

  return L.divIcon({
    className: "custom-radar-plane",
    html,
    iconSize: [iconSize, iconSize],
    iconAnchor: [halfSize, halfSize],
    popupAnchor: [0, -halfSize - 4],
  });
}

// Adaptive flight quota based on zoom level to eliminate lagging
function getTargetQuotaForZoom(zoom) {
  if (zoom <= 3) return 40;  // Whole world / continents: only major high-altitude airliners
  if (zoom === 4) return 75; // Subcontinental view
  if (zoom === 5) return 130; // Large countries
  if (zoom === 6) return 220; // Regional airspace
  if (zoom === 7) return 350; // Metropolitan / TMA airspace
  return 800; // Close zoom (zoom >= 8): show all visible flights
}

const LiveFlightMap = ({
  flights = [],
  selectedFlight = null,
  onSelectFlight,
  regionCenter = [48.0, 10.0],
  regionZoom = 5,
  onScanViewport,
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersGroupRef = useRef(null);
  const markersMapRef = useRef(new Map()); // id -> { marker, flight, isSelected }
  const projectionLayerRef = useRef(null);
  const currentTileLayerRef = useRef(null);
  const currentOverlayLayerRef = useRef(null);

  // Default to satellite map per user request
  const [activeTileKey, setActiveTileKey] = useState("satellite");
  const [showTileMenu, setShowTileMenu] = useState(false);
  const [mapZoom, setMapZoom] = useState(regionZoom);
  const [visibleCount, setVisibleCount] = useState(0);
  const [totalInViewCount, setTotalInViewCount] = useState(0);

  const debounceTimerRef = useRef(null);

  // 1. Initialize Leaflet Map with Satellite Tiles Default
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: regionCenter,
      zoom: regionZoom,
      minZoom: 2,
      maxZoom: 18,
      zoomControl: false,
      worldCopyJump: true,
      preferCanvas: true,
    });

    // Add initial tile layer (Satellite Recon)
    const tileConfig = TILE_LAYERS[activeTileKey];
    const baseLayer = L.tileLayer(tileConfig.base, {
      attribution: tileConfig.attribution,
      maxZoom: tileConfig.maxZoom,
      subdomains: tileConfig.subdomains,
    }).addTo(map);

    currentTileLayerRef.current = baseLayer;

    if (tileConfig.overlay) {
      const overlayLayer = L.tileLayer(tileConfig.overlay, {
        maxZoom: tileConfig.maxZoom,
        subdomains: tileConfig.subdomains,
      }).addTo(map);
      currentOverlayLayerRef.current = overlayLayer;
    }

    // Layer groups for markers and projected tracks
    markersGroupRef.current = L.layerGroup().addTo(map);
    projectionLayerRef.current = L.layerGroup().addTo(map);

    // Zoom control
    L.control.zoom({ position: "topright" }).addTo(map);

    // Track zoom and movement to update adaptive density
    const handleViewportChange = () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = setTimeout(() => {
        if (!mapInstanceRef.current) return;
        setMapZoom(mapInstanceRef.current.getZoom());
      }, 80);
    };

    map.on("zoomend", handleViewportChange);
    map.on("moveend", handleViewportChange);

    mapInstanceRef.current = map;

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      map.remove();
      mapInstanceRef.current = null;
      markersMapRef.current.clear();
    };
  }, []);

  // 2. Handle Tile Layer Switching (Satellite / Dark / Light)
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (currentTileLayerRef.current) {
      mapInstanceRef.current.removeLayer(currentTileLayerRef.current);
    }
    if (currentOverlayLayerRef.current) {
      mapInstanceRef.current.removeLayer(currentOverlayLayerRef.current);
      currentOverlayLayerRef.current = null;
    }

    const tileConfig = TILE_LAYERS[activeTileKey];
    const newBaseLayer = L.tileLayer(tileConfig.base, {
      attribution: tileConfig.attribution,
      maxZoom: tileConfig.maxZoom,
      subdomains: tileConfig.subdomains,
    }).addTo(mapInstanceRef.current);
    currentTileLayerRef.current = newBaseLayer;

    if (tileConfig.overlay) {
      const newOverlayLayer = L.tileLayer(tileConfig.overlay, {
        maxZoom: tileConfig.maxZoom,
        subdomains: tileConfig.subdomains,
      }).addTo(mapInstanceRef.current);
      currentOverlayLayerRef.current = newOverlayLayer;
    }
  }, [activeTileKey]);

  // 3. Handle Sector / Region Changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.setView(regionCenter, regionZoom, {
      animate: true,
      duration: 1,
    });
  }, [regionCenter, regionZoom]);

  // 4. Ultra-Smooth Adaptive Density Marker Engine (Zoom & Viewport Culling)
  const updateMarkers = useCallback(() => {
    if (!mapInstanceRef.current || !markersGroupRef.current) return;

    const map = mapInstanceRef.current;
    const bounds = map.getBounds();
    const currentZoom = map.getZoom();
    const quota = getTargetQuotaForZoom(currentZoom);

    // Step A: Cull flights strictly outside current viewport bounds
    const south = bounds.getSouth() - 1;
    const north = bounds.getNorth() + 1;
    const west = bounds.getWest() - 1;
    const east = bounds.getEast() + 1;

    const inViewport = [];
    for (let i = 0; i < flights.length; i++) {
      const f = flights[i];
      if (f.lat == null || f.lng == null) continue;
      if (f.lat >= south && f.lat <= north && f.lng >= west && f.lng <= east) {
        inViewport.push(f);
      }
    }

    setTotalInViewCount(inViewport.length);

    // Step B: Sort & Prioritize flights to stay strictly within quota
    let prioritizedFlights = inViewport;

    if (inViewport.length > quota) {
      // Prioritize flights:
      // 1. Always keep selected flight
      // 2. High altitude & commercial flights with valid callsigns
      // 3. Distributed sampling across viewport
      prioritizedFlights = [...inViewport].sort((a, b) => {
        if (selectedFlight && a.id === selectedFlight.id) return -1;
        if (selectedFlight && b.id === selectedFlight.id) return 1;

        const scoreA = (a.onGround ? 0 : 500) + (a.altitudeFeet || 0) * 0.05 + (a.velocityKts || 0) * 0.1;
        const scoreB = (b.onGround ? 0 : 500) + (b.altitudeFeet || 0) * 0.05 + (b.velocityKts || 0) * 0.1;
        return scoreB - scoreA;
      }).slice(0, quota);
    }

    setVisibleCount(prioritizedFlights.length);

    // Step C: High-Performance Marker Diffing via markersMap
    const markersMap = markersMapRef.current;
    const activeIds = new Set();

    prioritizedFlights.forEach((flight) => {
      activeIds.add(flight.id);
      const isSelected = selectedFlight && selectedFlight.id === flight.id;
      const cached = markersMap.get(flight.id);

      if (cached) {
        // Marker already exists: update position smoothly without recreating DOM
        cached.marker.setLatLng([flight.lat, flight.lng]);

        // Update icon if selection or heading changed significantly
        if (cached.isSelected !== isSelected || Math.abs((cached.flight.heading || 0) - (flight.heading || 0)) > 5) {
          cached.marker.setIcon(createAircraftDivIcon(flight, isSelected));
          cached.isSelected = isSelected;
        }
        cached.flight = flight;
      } else {
        // Create new marker
        const icon = createAircraftDivIcon(flight, isSelected);
        const marker = L.marker([flight.lat, flight.lng], {
          icon,
          title: `${flight.callsign} (${flight.country})`,
        });

        marker.on("click", () => {
          onSelectFlight(flight);
        });

        // Hover tooltip
        const tooltipContent = `
          <div class="px-2.5 py-1.5 font-mono text-xs text-slate-100 bg-slate-950/95 border border-sky-500/40 rounded shadow-xl">
            <div class="flex items-center justify-between gap-3 border-b border-slate-700/60 pb-1 mb-1 font-bold">
              <span class="text-sky-400 font-display">${flight.callsign}</span>
              <span class="text-[10px] text-slate-400 uppercase">${flight.country}</span>
            </div>
            <div class="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[11px]">
              <span class="text-slate-400">Altitude:</span>
              <span class="text-amber-400 font-semibold">${flight.flightLevel} (${flight.altitudeFeet ? flight.altitudeFeet.toLocaleString() + " ft" : "N/A"})</span>
              <span class="text-slate-400">Speed:</span>
              <span class="text-emerald-400 font-semibold">${flight.velocityKts} kts (${flight.velocityKmh} km/h)</span>
              <span class="text-slate-400">Heading:</span>
              <span class="text-sky-300">${flight.heading}° ${flight.headingCardinal}</span>
            </div>
          </div>
        `;

        marker.bindTooltip(tooltipContent, {
          direction: "top",
          offset: [0, -14],
          opacity: 0.95,
          className: "radar-plane-tooltip",
        });

        markersGroupRef.current.addLayer(marker);
        markersMap.set(flight.id, { marker, flight, isSelected });
      }
    });

    // Remove markers that are no longer visible or exceed quota
    markersMap.forEach((entry, id) => {
      if (!activeIds.has(id)) {
        markersGroupRef.current.removeLayer(entry.marker);
        markersMap.delete(id);
      }
    });

    // Step D: Draw Vector Projection for Selected Aircraft
    projectionLayerRef.current.clearLayers();
    if (selectedFlight && selectedFlight.lat != null && selectedFlight.lng != null) {
      const headingRad = ((selectedFlight.heading || 0) * Math.PI) / 180;
      const projectDistKm = Math.max(30, (selectedFlight.velocityKmh || 450) * 0.15);
      const dLat = (projectDistKm * Math.cos(headingRad)) / 111.0;
      const dLng = (projectDistKm * Math.sin(headingRad)) / (111.0 * Math.cos((selectedFlight.lat * Math.PI) / 180));
      const projectedPoint = [selectedFlight.lat + dLat, selectedFlight.lng + dLng];

      const vectorLine = L.polyline([[selectedFlight.lat, selectedFlight.lng], projectedPoint], {
        color: "#38bdf8",
        weight: 2,
        dashArray: "4, 6",
        opacity: 0.85,
      });

      const endBeacon = L.circleMarker(projectedPoint, {
        radius: 3.5,
        color: "#0ea5e9",
        fillColor: "#38bdf8",
        fillOpacity: 1,
        weight: 1,
      });

      projectionLayerRef.current.addLayer(vectorLine);
      projectionLayerRef.current.addLayer(endBeacon);
    }
  }, [flights, selectedFlight, onSelectFlight]);

  // Run updateMarkers on data update or zoom/pan
  useEffect(() => {
    updateMarkers();
  }, [updateMarkers, mapZoom]);

  // Smooth camera pan to selected flight
  useEffect(() => {
    if (!selectedFlight || !mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([selectedFlight.lat, selectedFlight.lng], Math.max(mapInstanceRef.current.getZoom(), 7), {
      duration: 1.2,
      easeLinearity: 0.25,
    });
  }, [selectedFlight?.id]);

  // Handle Scan Map Viewport Bounds
  const handleScanBoundsClick = () => {
    if (!mapInstanceRef.current || !onScanViewport) return;
    const bounds = mapInstanceRef.current.getBounds();
    const bbox = {
      lamin: Number(Math.max(-85, bounds.getSouth()).toFixed(4)),
      lomin: Number(Math.max(-180, bounds.getWest()).toFixed(4)),
      lamax: Number(Math.min(85, bounds.getNorth()).toFixed(4)),
      lomax: Number(Math.min(180, bounds.getEast()).toFixed(4)),
    };
    onScanViewport(bbox);
  };

  return (
    <div className="relative w-full h-full min-h-[500px] overflow-hidden rounded-xl border border-slate-300 dark:border-[#1a3254] bg-[#060d19] shadow-2xl">
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full radar-map-container z-0" />

      {/* Floating Radar Legend & Density Status */}
      <div className="absolute top-4 left-4 z-10 hidden sm:flex flex-col gap-1.5 p-3 rounded-lg bg-slate-950/90 backdrop-blur-md border border-slate-700/60 shadow-2xl text-xs font-mono">
        <div className="flex items-center gap-2 pb-1.5 border-b border-slate-700/60">
          <Satellite className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
          <span className="font-bold uppercase tracking-wider text-slate-200">Satellite Orbital Radar</span>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#fbbf24]" />
            <span className="text-slate-300">High Cruise (FL320+)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#38bdf8]" />
            <span className="text-slate-300">Cruising (10k-32k)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#10b981]" />
            <span className="text-slate-300">Approach (&lt;10k ft)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#94a3b8]" />
            <span className="text-slate-300">Ground / Taxi</span>
          </div>
        </div>
      </div>

      {/* Map Control Buttons (Top Right) */}
      <div className="absolute top-20 right-3 z-10 flex flex-col gap-2">
        {/* Layer Basemap Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowTileMenu(!showTileMenu)}
            className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-700 text-slate-300 hover:text-white hover:border-sky-400 shadow-md backdrop-blur-md transition-colors"
            title="Switch Map Layers"
          >
            <Layers className="w-4 h-4 text-sky-400" />
          </button>

          {showTileMenu && (
            <div className="absolute right-12 top-0 w-48 p-2 rounded-lg bg-slate-900/95 border border-slate-700 shadow-2xl backdrop-blur-md flex flex-col gap-1 z-20">
              <span className="text-[10px] font-mono uppercase text-slate-400 px-2 py-1">Basemap Imagery</span>
              {Object.entries(TILE_LAYERS).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => {
                    setActiveTileKey(key);
                    setShowTileMenu(false);
                  }}
                  className={`text-left text-xs font-mono px-2.5 py-1.5 rounded transition-colors flex items-center justify-between ${
                    activeTileKey === key
                      ? "bg-sky-500/20 text-sky-300 font-bold border border-sky-400/40"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <span>{config.name}</span>
                  {key === "satellite" && <Sparkles className="w-3 h-3 text-amber-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Scan Viewport Airspace Button */}
        {onScanViewport && (
          <button
            onClick={handleScanBoundsClick}
            className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-700 text-slate-300 hover:text-sky-400 hover:border-sky-400 shadow-md backdrop-blur-md transition-all flex items-center justify-center group"
            title="Scan Current Viewport Airspace"
          >
            <Scan className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
          </button>
        )}
      </div>

      {/* Adaptive Density Indicator Badge (Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-950/90 backdrop-blur-md border border-slate-800 text-xs font-mono text-slate-300 shadow-xl">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>
          Rendering: <strong className="text-white">{visibleCount}</strong>{" "}
          {totalInViewCount > visibleCount && (
            <span className="text-slate-400">
              of {totalInViewCount.toLocaleString()} in view • <span className="text-sky-400 font-semibold">Zoom in for more</span>
            </span>
          )}
        </span>
      </div>
    </div>
  );
};

export default LiveFlightMap;
