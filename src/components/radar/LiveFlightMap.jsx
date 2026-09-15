import React, { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import { 
  Layers, 
  Scan, 
  Satellite, 
  Sparkles,
  MapPin,
  RefreshCw,
  Sliders,
  Eye
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

// Generates lightweight SVG airplane divIcon (ONLY used for the selected/focused flight)
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

// --- CANVAS PERFORMANCE HELPERS ---

// Get altitude-based color for canvas markers
function getAltitudeColor(flight) {
  if (flight.isEmergency) return "#ef4444";
  if (flight.onGround) return "#94a3b8";
  if (flight.altitudeFeet != null && flight.altitudeFeet < 10000) return "#10b981";
  if (flight.altitudeFeet != null && flight.altitudeFeet >= 32000) return "#fbbf24";
  return "#38bdf8";
}

// Compute heading indicator line start/end coordinates (scales with zoom)
function getHeadingLineCoords(flight, zoom) {
  const headingRad = ((flight.heading || 0) * Math.PI) / 180;
  // Line length in degrees, inversely proportional to zoom
  const zoomScale = Math.pow(2, Math.max(0, 7 - Math.min(zoom, 14)));
  const lineLength = 0.04 * zoomScale;
  const endLat = flight.lat + lineLength * Math.cos(headingRad);
  const cosLat = Math.cos((flight.lat * Math.PI) / 180) || 0.01;
  const endLng = flight.lng + (lineLength * Math.sin(headingRad)) / cosLat;
  return [[flight.lat, flight.lng], [endLat, endLng]];
}

// Create lightweight tooltip HTML for hover info
function createTooltipContent(flight) {
  return `<div class="px-2.5 py-1.5 font-mono text-xs text-slate-100 bg-slate-950/95 border border-sky-500/40 rounded shadow-xl">
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
  </div>`;
}

// Adaptive flight quota based on zoom level
// When zoomed in (zoom >= 6), returns Infinity so 100% OF ALL FLIGHTS in that area are visible!
function getTargetQuotaForZoom(zoom) {
  if (zoom <= 3) return 45;   // Global world view: show top 45 transcontinental flights
  if (zoom === 4) return 85;   // Continental view
  if (zoom === 5) return 160;  // Subcontinental
  return Infinity;            // Zoom >= 6: SHOW 100% OF ALL FLIGHTS in view! (No flights hidden in Ahmedabad, etc.)
}

// Approximate regional geographic label based on coordinates
function getAreaLabel(lat, lng) {
  if (lat == null || lng == null) return "Global Airspace";
  if (lat >= 21.0 && lat <= 24.5 && lng >= 69.5 && lng <= 74.5) return "Ahmedabad & Gujarat, India";
  if (lat >= 18.0 && lat <= 20.5 && lng >= 71.5 && lng <= 74.0) return "Mumbai & Maharashtra, India";
  if (lat >= 27.5 && lat <= 30.0 && lng >= 76.0 && lng <= 78.5) return "Delhi NCR, India";
  if (lat >= 12.0 && lat <= 14.0 && lng >= 76.5 && lng <= 78.5) return "Bengaluru, India";
  if (lat >= 16.5 && lat <= 18.5 && lng >= 77.5 && lng <= 79.5) return "Hyderabad, India";
  if (lat >= 23.5 && lat <= 26.5 && lng >= 53.5 && lng <= 56.5) return "Dubai & Emirates, UAE";
  if (lat >= 24.5 && lat <= 26.0 && lng >= 50.5 && lng <= 52.0) return "Doha, Qatar";
  if (lat >= 50.5 && lat <= 52.5 && lng >= -1.5 && lng <= 1.0) return "London & SE England";
  if (lat >= 48.0 && lat <= 50.0 && lng >= 1.5 && lng <= 3.5) return "Paris & France";
  if (lat >= 49.5 && lat <= 51.5 && lng >= 7.5 && lng <= 10.0) return "Frankfurt, Germany";
  if (lat >= 39.5 && lat <= 41.5 && lng >= -75.0 && lng <= -72.5) return "New York Tri-State Area";
  if (lat >= 33.0 && lat <= 35.0 && lng >= -119.5 && lng <= -116.5) return "Los Angeles Basin";
  if (lat >= 34.5 && lat <= 36.5 && lng >= 138.5 && lng <= 141.0) return "Tokyo Kanto Region";
  if (lat >= 0.5 && lat <= 2.5 && lng >= 102.5 && lng <= 105.0) return "Singapore Airspace";
  return `${lat > 0 ? lat.toFixed(2) + "°N" : Math.abs(lat).toFixed(2) + "°S"}, ${lng > 0 ? lng.toFixed(2) + "°E" : Math.abs(lng).toFixed(2) + "°W"}`;
}

const LiveFlightMap = ({
  flights = [],
  selectedFlight = null,
  onSelectFlight,
  regionCenter = [23.02, 72.57],
  regionZoom = 7,
  onScanViewport,
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersGroupRef = useRef(null);
  const markersMapRef = useRef(new Map()); // id -> { marker, headingLine?, flight, isSelected, type }
  const projectionLayerRef = useRef(null);
  const currentTileLayerRef = useRef(null);
  const currentOverlayLayerRef = useRef(null);

  // Default to satellite map per user request
  const [activeTileKey, setActiveTileKey] = useState("satellite");
  const [showTileMenu, setShowTileMenu] = useState(false);
  const [mapZoom, setMapZoom] = useState(regionZoom);
  const [visibleCount, setVisibleCount] = useState(0);
  const [totalInViewCount, setTotalInViewCount] = useState(0);
  const [currentAreaName, setCurrentAreaName] = useState("Ahmedabad & Gujarat, India");
  const [autoScanEnabled, setAutoScanEnabled] = useState(true);
  const [isScanning, setIsScanning] = useState(false);

  const debounceTimerRef = useRef(null);
  const autoScanTimerRef = useRef(null);
  const lastScannedCenterRef = useRef(null);
  const lastScannedZoomRef = useRef(null);
  const lastScanTimestampRef = useRef(0);
  const rafRef = useRef(null);

  // Trigger viewport scanning with ZOOM-AWARE threshold
  const triggerViewportScan = useCallback((force = false) => {
    if (!mapInstanceRef.current || !onScanViewport) return;
    const map = mapInstanceRef.current;
    const center = map.getCenter();
    const bounds = map.getBounds();
    const currentZoom = map.getZoom();

    const south = Number(Math.max(-85, Math.min(bounds.getSouth(), bounds.getNorth())).toFixed(4));
    const north = Number(Math.min(85, Math.max(bounds.getSouth(), bounds.getNorth())).toFixed(4));
    const west = Number(Math.max(-180, Math.min(bounds.getWest(), bounds.getEast())).toFixed(4));
    const east = Number(Math.min(180, Math.max(bounds.getWest(), bounds.getEast())).toFixed(4));

    const bbox = { lamin: south, lomin: west, lamax: north, lomax: east };
    
    const now = Date.now();
    if (!force && lastScannedCenterRef.current) {
      const dLat = Math.abs(center.lat - lastScannedCenterRef.current.lat);
      const dLng = Math.abs(center.lng - lastScannedCenterRef.current.lng);
      const zoomChanged = lastScannedZoomRef.current !== currentZoom;

      // ZOOM-AWARE THRESHOLD: at higher zoom, much smaller movement triggers rescan
      // At zoom 3: threshold ~0.8°, at zoom 8: ~0.025°, at zoom 12: ~0.0015°
      const zoomFactor = Math.pow(2, Math.max(0, currentZoom - 3));
      const moveThreshold = Math.max(0.001, 0.8 / zoomFactor);
      
      // Shorter cooldown when zoomed in (user expects responsive updates)
      const timeThreshold = currentZoom >= 8 ? 4000 : currentZoom >= 6 ? 6000 : 10000;
      const timeSinceLastScan = now - lastScanTimestampRef.current;

      // Skip ONLY if: zoom hasn't changed AND movement below threshold AND cooldown not expired
      if (!zoomChanged && dLat < moveThreshold && dLng < moveThreshold && timeSinceLastScan < timeThreshold) {
        return;
      }
    }

    lastScannedCenterRef.current = { lat: center.lat, lng: center.lng };
    lastScannedZoomRef.current = currentZoom;
    lastScanTimestampRef.current = now;
    setIsScanning(true);
    onScanViewport(bbox);

    setTimeout(() => {
      setIsScanning(false);
    }, 1200);
  }, [onScanViewport]);

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
      preferCanvas: true, // CRITICAL: enables canvas rendering for circleMarkers & polylines
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

    // Track zoom and movement to update adaptive density & trigger auto-scan
    const handleViewportChange = () => {
      if (!mapInstanceRef.current) return;
      const zoom = mapInstanceRef.current.getZoom();
      const center = mapInstanceRef.current.getCenter();
      setMapZoom(zoom);
      setCurrentAreaName(getAreaLabel(center.lat, center.lng));

      // Auto-scan with ZOOM-ADAPTIVE debounce (faster when zoomed in)
      if (autoScanTimerRef.current) clearTimeout(autoScanTimerRef.current);
      const debounceMs = zoom >= 8 ? 350 : zoom >= 6 ? 500 : 750;
      autoScanTimerRef.current = setTimeout(() => {
        triggerViewportScan(false);
      }, debounceMs);
    };

    map.on("zoomend", handleViewportChange);
    map.on("moveend", handleViewportChange);

    mapInstanceRef.current = map;

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      if (autoScanTimerRef.current) clearTimeout(autoScanTimerRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
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
    setCurrentAreaName(getAreaLabel(regionCenter[0], regionCenter[1]));
  }, [regionCenter, regionZoom]);

  // 4. HIGH-PERFORMANCE CANVAS-BASED Marker Engine
  //    - Non-selected flights: L.circleMarker (rendered on CANVAS = handles 1000+ easily)
  //    - Selected flight only: L.marker with detailed divIcon (DOM, only 1 element)
  //    - Heading indicators: L.polyline (canvas)
  const updateMarkers = useCallback(() => {
    if (!mapInstanceRef.current || !markersGroupRef.current) return;

    const map = mapInstanceRef.current;
    const bounds = map.getBounds();
    const currentZoom = map.getZoom();
    const quota = getTargetQuotaForZoom(currentZoom);

    // Step A: Cull flights outside current viewport (with slight padding)
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

    // Step B: Sort & prioritize if quota is finite; when zoomed in (Infinity), show ALL
    let prioritizedFlights = inViewport;
    if (quota !== Infinity && inViewport.length > quota) {
      prioritizedFlights = [...inViewport].sort((a, b) => {
        if (selectedFlight && a.id === selectedFlight.id) return -1;
        if (selectedFlight && b.id === selectedFlight.id) return 1;
        const scoreA = (a.onGround ? 0 : 500) + (a.altitudeFeet || 0) * 0.05 + (a.velocityKts || 0) * 0.1;
        const scoreB = (b.onGround ? 0 : 500) + (b.altitudeFeet || 0) * 0.05 + (b.velocityKts || 0) * 0.1;
        return scoreB - scoreA;
      }).slice(0, quota);
    }

    setVisibleCount(prioritizedFlights.length);

    // Step C: Canvas-Based Marker Diffing (MASSIVE perf improvement)
    const markersMap = markersMapRef.current;
    const activeIds = new Set();
    const flightCount = prioritizedFlights.length;

    // Dynamic marker radius based on zoom and density
    const markerRadius = currentZoom >= 10 ? 7 : currentZoom >= 7 ? 6 : currentZoom >= 5 ? 5 : 4;
    // Show heading direction lines only when flight count is manageable
    const showHeadingLines = flightCount <= 400;

    const tooltipOptions = {
      direction: "top",
      offset: [0, -8],
      opacity: 0.95,
      className: "radar-plane-tooltip",
    };

    prioritizedFlights.forEach((flight) => {
      activeIds.add(flight.id);
      const isSelected = selectedFlight && selectedFlight.id === flight.id;
      const color = getAltitudeColor(flight);
      const cached = markersMap.get(flight.id);

      if (isSelected) {
        // ─── SELECTED FLIGHT: Full detailed DOM marker (airplane SVG icon) ───
        if (cached && cached.type === "detailed") {
          // Update existing detailed marker position
          cached.marker.setLatLng([flight.lat, flight.lng]);
          if (Math.abs((cached.flight.heading || 0) - (flight.heading || 0)) > 5) {
            cached.marker.setIcon(createAircraftDivIcon(flight, true));
          }
          cached.flight = flight;
        } else {
          // Remove old canvas marker if switching from circle → detailed
          if (cached) {
            markersGroupRef.current.removeLayer(cached.marker);
            if (cached.headingLine) markersGroupRef.current.removeLayer(cached.headingLine);
          }
          // Create detailed DOM marker
          const icon = createAircraftDivIcon(flight, true);
          const marker = L.marker([flight.lat, flight.lng], { icon, zIndexOffset: 1000 });
          marker.on("click", () => onSelectFlight(flight));
          marker.bindTooltip(createTooltipContent(flight), {
            ...tooltipOptions,
            offset: [0, -14],
          });
          markersGroupRef.current.addLayer(marker);
          markersMap.set(flight.id, { marker, headingLine: null, flight, isSelected: true, type: "detailed" });
        }
      } else {
        // ─── NON-SELECTED: Canvas circleMarker (FAST! rendered on single <canvas>) ───
        if (cached && cached.type === "circle") {
          // Update existing canvas marker
          cached.marker.setLatLng([flight.lat, flight.lng]);
          if (cached.marker.options.fillColor !== color) {
            cached.marker.setStyle({ fillColor: color, color: color });
          }
          cached.marker.setRadius(markerRadius);
          // Update heading line
          if (showHeadingLines && cached.headingLine) {
            const [start, end] = getHeadingLineCoords(flight, currentZoom);
            cached.headingLine.setLatLngs([start, end]);
            if (cached.headingLine.options.color !== color) {
              cached.headingLine.setStyle({ color });
            }
          } else if (!showHeadingLines && cached.headingLine) {
            // Remove heading line if density is too high
            markersGroupRef.current.removeLayer(cached.headingLine);
            cached.headingLine = null;
          } else if (showHeadingLines && !cached.headingLine) {
            // Add heading line if density dropped
            const [start, end] = getHeadingLineCoords(flight, currentZoom);
            const headingLine = L.polyline([start, end], {
              color, weight: 2, opacity: 0.6,
            });
            markersGroupRef.current.addLayer(headingLine);
            cached.headingLine = headingLine;
          }
          cached.flight = flight;
          cached.isSelected = false;
        } else {
          // Remove old detailed marker if switching from detailed → circle
          if (cached) {
            markersGroupRef.current.removeLayer(cached.marker);
            if (cached.headingLine) markersGroupRef.current.removeLayer(cached.headingLine);
          }

          // Create canvas circleMarker
          const circle = L.circleMarker([flight.lat, flight.lng], {
            radius: markerRadius,
            color: color,
            fillColor: color,
            fillOpacity: 0.85,
            weight: 1.5,
            interactive: true,
          });

          circle.on("click", () => onSelectFlight(flight));
          circle.bindTooltip(createTooltipContent(flight), tooltipOptions);

          markersGroupRef.current.addLayer(circle);

          // Heading indicator line (also canvas-rendered)
          let headingLine = null;
          if (showHeadingLines) {
            const [start, end] = getHeadingLineCoords(flight, currentZoom);
            headingLine = L.polyline([start, end], {
              color, weight: 2, opacity: 0.6,
            });
            markersGroupRef.current.addLayer(headingLine);
          }

          markersMap.set(flight.id, { marker: circle, headingLine, flight, isSelected: false, type: "circle" });
        }
      }
    });

    // Remove markers that are no longer in view or exceed quota
    markersMap.forEach((entry, id) => {
      if (!activeIds.has(id)) {
        markersGroupRef.current.removeLayer(entry.marker);
        if (entry.headingLine) markersGroupRef.current.removeLayer(entry.headingLine);
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

  // Run updateMarkers on data update or zoom/pan (batched via rAF for smoothness)
  useEffect(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      updateMarkers();
    });
  }, [updateMarkers, mapZoom]);

  // Smooth camera pan to selected flight
  useEffect(() => {
    if (!selectedFlight || !mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([selectedFlight.lat, selectedFlight.lng], Math.max(mapInstanceRef.current.getZoom(), 7), {
      duration: 1.2,
      easeLinearity: 0.25,
    });
  }, [selectedFlight?.id]);

  return (
    <div className="relative w-full h-full min-h-[500px] overflow-hidden rounded-xl border border-slate-300 dark:border-[#1a3254] bg-[#060d19] shadow-2xl">
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full radar-map-container z-0" />

      {/* Floating Airspace Radar Scanner Pill (Top Center) */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-slate-950/90 border border-sky-500/40 shadow-2xl backdrop-blur-md text-xs font-mono">
        <span className={`w-2 h-2 rounded-full ${isScanning ? "bg-amber-400 animate-spin" : "bg-emerald-400 animate-pulse"}`} />
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-sky-400" />
          <span className="text-slate-200 font-semibold truncate max-w-[180px] sm:max-w-[280px]">
            {currentAreaName}
          </span>
        </div>
        <button
          onClick={() => triggerViewportScan(true)}
          disabled={isScanning}
          className="ml-1 px-2.5 py-0.5 rounded-full bg-sky-600 hover:bg-sky-500 text-white font-bold flex items-center gap-1 transition-all text-[11px] shadow-sm disabled:opacity-60"
          title="Scan live flights in this exact visible area"
        >
          <RefreshCw className={`w-3 h-3 ${isScanning ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">{isScanning ? "Scanning..." : "Scan Here"}</span>
        </button>
      </div>

      {/* Floating Radar Altitude Legend (Top Left) */}
      <div className="absolute top-4 left-4 z-10 hidden sm:flex flex-col gap-1.5 p-3 rounded-lg bg-slate-950/90 backdrop-blur-md border border-slate-700/60 shadow-2xl text-xs font-mono">
        <div className="flex items-center gap-2 pb-1.5 border-b border-slate-700/60">
          <Satellite className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
          <span className="font-bold uppercase tracking-wider text-slate-200">Satellite Orbital Radar</span>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#fbbf24]" />
            <span className="text-slate-300">High Cruise (FL320+)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#38bdf8]" />
            <span className="text-slate-300">Cruising (10k-32k)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
            <span className="text-slate-300">Approach (&lt;10k ft)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#94a3b8]" />
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
        <button
          onClick={() => triggerViewportScan(true)}
          className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-700 text-slate-300 hover:text-sky-400 hover:border-sky-400 shadow-md backdrop-blur-md transition-all flex items-center justify-center group"
          title="Scan Current Viewport Airspace"
        >
          <Scan className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Density & Zoom Level Indicator Badge (Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-950/90 backdrop-blur-md border border-slate-800 text-xs font-mono text-slate-300 shadow-xl">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>
          Showing: <strong className="text-white">{visibleCount}</strong>{" "}
          {mapZoom >= 6 ? (
            <span className="text-emerald-400 font-semibold">• All Flights in View</span>
          ) : (
            totalInViewCount > visibleCount && (
              <span className="text-slate-400">
                of {totalInViewCount.toLocaleString()} • <span className="text-sky-400 font-semibold">Zoom in for more</span>
              </span>
            )
          )}
        </span>
      </div>
    </div>
  );
};

export default LiveFlightMap;
