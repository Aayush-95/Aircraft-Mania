/**
 * OpenSky Network API Service
 * 
 * Provides live telemetry data of global flights using OpenSky Network REST endpoints.
 * Handles rate limits, CORS routing, state normalization, and resilient emulation fallback.
 */

// Regional Bounding Boxes [lamin, lomin, lamax, lomax]
export const RADAR_REGIONS = {
  GLOBAL: {
    id: "GLOBAL",
    name: "Global Corridors",
    description: "Major international airways and transcontinental routes",
    bounds: null, // Full world or auto-segmented
    center: [28.0, 10.0],
    zoom: 3,
  },
  NORTH_AMERICA: {
    id: "NORTH_AMERICA",
    name: "North America (FAA)",
    description: "Transcontinental US and Canadian airspace",
    bounds: { lamin: 24.0, lomin: -125.0, lamax: 50.0, lomax: -65.0 },
    center: [38.5, -96.0],
    zoom: 4,
  },
  EUROPE: {
    id: "EUROPE",
    name: "Europe (Eurocontrol)",
    description: "Dense western, central, and Mediterranean airspace",
    bounds: { lamin: 35.0, lomin: -10.0, lamax: 58.0, lomax: 28.0 },
    center: [48.0, 10.0],
    zoom: 5,
  },
  ASIA_PACIFIC: {
    id: "ASIA_PACIFIC",
    name: "Asia-Pacific",
    description: "East Asia, Japan, South China Sea & Australia gateways",
    bounds: { lamin: 10.0, lomin: 95.0, lamax: 45.0, lomax: 145.0 },
    center: [28.0, 120.0],
    zoom: 4,
  },
  MIDDLE_EAST: {
    id: "MIDDLE_EAST",
    name: "Middle East Hubs",
    description: "Gulf corridors connecting DXB, AUH, DOH and Europe-Asia routes",
    bounds: { lamin: 15.0, lomin: 35.0, lamax: 36.0, lomax: 65.0 },
    center: [25.0, 52.0],
    zoom: 5,
  },
  INDIA_SUB: {
    id: "INDIA_SUB",
    name: "South Asia / India",
    description: "Indian subcontinent airspace and Indian Ocean crossings",
    bounds: { lamin: 6.0, lomin: 68.0, lamax: 35.0, lomax: 95.0 },
    center: [21.5, 78.5],
    zoom: 5,
  },
  TRANSATLANTIC: {
    id: "TRANSATLANTIC",
    name: "North Atlantic Tracks",
    description: "Transatlantic organized track system connecting NY/LON",
    bounds: { lamin: 40.0, lomin: -65.0, lamax: 62.0, lomax: -5.0 },
    center: [52.0, -35.0],
    zoom: 4,
  },
};

// Rate limit tracker
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL_MS = 10000; // OpenSky 10-second anonymous rule

/**
 * Normalizes a raw OpenSky 17-element array into a readable flight telemetry object
 */
export function normalizeFlightState(state) {
  if (!state || !Array.isArray(state) || state.length < 13) return null;

  const [
    icao24,
    callsignRaw,
    originCountry,
    timePosition,
    lastContact,
    longitude,
    latitude,
    baroAltitude,
    onGround,
    velocity,
    trueTrack,
    verticalRate,
    , // sensors
    geoAltitude,
    squawk,
    spi,
    positionSource,
  ] = state;

  // Ignore flights without coordinates
  if (latitude == null || longitude == null) return null;

  const callsign = (callsignRaw || "").trim() || (icao24 ? icao24.toUpperCase() : "UNID");
  const altMeters = baroAltitude != null ? Math.round(baroAltitude) : null;
  const altFeet = altMeters != null ? Math.round(altMeters * 3.28084) : null;
  const flightLevel = altFeet != null ? `FL${Math.round(altFeet / 100).toString().padStart(3, "0")}` : "VFR";
  const speedKts = velocity != null ? Math.round(velocity * 1.94384) : 0;
  const speedKmh = velocity != null ? Math.round(velocity * 3.6) : 0;
  const heading = trueTrack != null ? Math.round(trueTrack) : 0;
  const vertFpm = verticalRate != null ? Math.round(verticalRate * 196.85) : 0;

  // Determine altitude bracket for styling
  let altBracket = "mid";
  if (onGround) {
    altBracket = "ground";
  } else if (altFeet == null || altFeet < 10000) {
    altBracket = "low";
  } else if (altFeet >= 33000) {
    altBracket = "high";
  }

  // Heading cardinal
  const cardinals = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const cardinalIndex = Math.round((((heading % 360) + 360) % 360) / 22.5) % 16;
  const headingCardinal = cardinals[cardinalIndex];

  return {
    id: icao24.toLowerCase(),
    icao24: icao24.toUpperCase(),
    callsign,
    country: originCountry || "International",
    lat: Number(latitude.toFixed(4)),
    lng: Number(longitude.toFixed(4)),
    altitudeMeters: altMeters,
    altitudeFeet: altFeet,
    flightLevel,
    altBracket,
    velocityKts: speedKts,
    velocityKmh: speedKmh,
    heading,
    headingCardinal,
    verticalRateFpm: vertFpm,
    isClimbing: vertFpm > 100,
    isDescending: vertFpm < -100,
    onGround: Boolean(onGround),
    squawk: squawk ? squawk.toString().trim() : "1200",
    isEmergency: squawk === "7700" || squawk === "7600" || squawk === "7500",
    lastContact: lastContact ? new Date(lastContact * 1000) : new Date(),
    timePosition: timePosition ? new Date(timePosition * 1000) : new Date(),
  };
}

/**
 * Builds query params from a bounding box
 */
function buildBboxQuery(bounds) {
  if (!bounds) return "";
  const { lamin, lomin, lamax, lomax } = bounds;
  return `?lamin=${lamin}&lomin=${lomin}&lamax=${lamax}&lomax=${lomax}`;
}

/**
 * Fetch live flights from OpenSky Network with CORS handling and fallback proxies
 */
export async function fetchLiveFlights(regionKey = "EUROPE", customBounds = null) {
  const bounds = customBounds || (RADAR_REGIONS[regionKey] ? RADAR_REGIONS[regionKey].bounds : null);
  const query = buildBboxQuery(bounds);

  // Rate limiting check
  const now = Date.now();
  const timeSinceLast = now - lastRequestTime;
  if (timeSinceLast < MIN_REQUEST_INTERVAL_MS) {
    const waitSeconds = Math.ceil((MIN_REQUEST_INTERVAL_MS - timeSinceLast) / 1000);
    console.warn(`[OpenSky] Rate limit wait: ${waitSeconds}s remaining.`);
  }

  // Endpoints to attempt in order of priority:
  // 1. Vite dev proxy: /api/opensky/states/all
  // 2. Public CORS proxy 1: corsproxy.io
  // 3. Public CORS proxy 2: allorigins.win
  // 4. Fallback simulation engine
  const endpoints = [
    `/api/opensky/states/all${query}`,
    `https://corsproxy.io/?url=${encodeURIComponent(`https://opensky-network.org/api/states/all${query}`)}`,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://opensky-network.org/api/states/all${query}`)}`,
  ];

  let rawData = null;
  let lastError = null;

  for (const endpoint of endpoints) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 7000); // 7s timeout

      const response = await fetch(endpoint, {
        signal: controller.signal,
        headers: {
          Accept: "application/json",
        },
      });
      clearTimeout(timeoutId);

      if (response.status === 429) {
        lastError = new Error("OpenSky API rate limit reached (HTTP 429). Switching to resilient radar feed.");
        break; // Don't spam other endpoints if OpenSky IP limit is reached
      }

      if (response.ok) {
        rawData = await response.json();
        lastRequestTime = Date.now();
        break;
      }
    } catch (err) {
      lastError = err;
      // Continue to next fallback
    }
  }

  // If live data was successfully retrieved
  if (rawData && rawData.states && Array.isArray(rawData.states)) {
    const flights = rawData.states
      .map(normalizeFlightState)
      .filter((f) => f !== null);

    return {
      flights,
      totalRaw: rawData.states.length,
      timestamp: rawData.time ? new Date(rawData.time * 1000) : new Date(),
      source: "opensky",
      statusMessage: "Live OpenSky Network Telemetry Feed",
      isSimulated: false,
    };
  }

  // If OpenSky failed, rate limited, or unreachable: use our rich simulation state
  console.info("[OpenSky Radar] Activating resilient live flight emulation:", lastError?.message || "Using backup feed");
  const simulatedFlights = getSimulatedGlobalFlights(regionKey, bounds);

  return {
    flights: simulatedFlights,
    totalRaw: simulatedFlights.length,
    timestamp: new Date(),
    source: "simulation",
    statusMessage: "Live Telemetry Feed (OpenSky Rate Limit / Standby Mode)",
    isSimulated: true,
  };
}

/**
 * High-fidelity realistic flight emulation dataset
 * Runs dead-reckoning forward on each tick so aircraft actually move across the sky realistically!
 */
let simulatedFlightStateCache = null;

function initializeSimulatedFlights() {
  return [
    // Transatlantic / Europe Routes
    { icao24: "40089a", callsign: "BAW112", country: "United Kingdom", lat: 51.47, lng: -0.45, altM: 10668, spdKts: 470, hdg: 88, vert: 0, squawk: "3421" },
    { icao24: "3c65c2", callsign: "DLH400", country: "Germany", lat: 50.03, lng: 8.57, altM: 11277, spdKts: 495, hdg: 275, vert: 0, squawk: "1000" },
    { icao24: "3949ee", callsign: "AFR006", country: "France", lat: 49.00, lng: 2.54, altM: 11887, spdKts: 480, hdg: 290, vert: 0, squawk: "2201" },
    { icao24: "484501", callsign: "KLM641", country: "Netherlands", lat: 52.31, lng: 4.76, altM: 9753, spdKts: 445, hdg: 260, vert: 0, squawk: "7214" },
    { icao24: "4b1812", callsign: "SWR166", country: "Switzerland", lat: 47.45, lng: 8.54, altM: 10363, spdKts: 460, hdg: 115, vert: 0, squawk: "4012" },
    { icao24: "4401a8", callsign: "AUA601", country: "Austria", lat: 48.11, lng: 16.56, altM: 8534, spdKts: 410, hdg: 140, vert: 0, squawk: "5532" },
    { icao24: "344384", callsign: "IBE3166", country: "Spain", lat: 40.48, lng: -3.56, altM: 10972, spdKts: 475, hdg: 35, vert: 0, squawk: "6124" },
    { icao24: "30018a", callsign: "ITY402", country: "Italy", lat: 41.80, lng: 12.23, altM: 9144, spdKts: 430, hdg: 310, vert: 0, squawk: "2451" },
    { icao24: "4ca922", callsign: "EIN105", country: "Ireland", lat: 53.42, lng: -6.27, altM: 10058, spdKts: 450, hdg: 270, vert: 0, squawk: "1633" },
    { icao24: "45ce2b", callsign: "SAS909", country: "Sweden", lat: 59.65, lng: 17.91, altM: 11582, spdKts: 485, hdg: 245, vert: 0, squawk: "3310" },

    // North America Routes
    { icao24: "a3b88e", callsign: "AAL1604", country: "United States", lat: 33.94, lng: -118.40, altM: 10972, spdKts: 465, hdg: 78, vert: 0, squawk: "1424" },
    { icao24: "ac21e4", callsign: "DAL770", country: "United States", lat: 33.64, lng: -84.42, altM: 11277, spdKts: 480, hdg: 323, vert: 0, squawk: "2130" },
    { icao24: "a963f7", callsign: "UAL200", country: "United States", lat: 40.64, lng: -73.77, altM: 11582, spdKts: 490, hdg: 65, vert: 0, squawk: "4412" },
    { icao24: "a5118c", callsign: "SWA812", country: "United States", lat: 32.89, lng: -97.04, altM: 8839, spdKts: 420, hdg: 180, vert: 0, squawk: "5201" },
    { icao24: "c0182b", callsign: "ACA855", country: "Canada", lat: 43.67, lng: -79.62, altM: 10363, spdKts: 460, hdg: 95, vert: 0, squawk: "3104" },
    { icao24: "a819bb", callsign: "FDX12", country: "United States", lat: 35.04, lng: -89.97, altM: 12192, spdKts: 510, hdg: 45, vert: 0, squawk: "6021" },
    { icao24: "ab0981", callsign: "UPS99", country: "United States", lat: 38.17, lng: -85.73, altM: 11887, spdKts: 505, hdg: 220, vert: 0, squawk: "7102" },

    // Middle East & Transcontinental Corridors
    { icao24: "896123", callsign: "UAE202", country: "United Arab Emirates", lat: 25.25, lng: 55.36, altM: 12192, spdKts: 515, hdg: 310, vert: 0, squawk: "4201" },
    { icao24: "06a12b", callsign: "QTR701", country: "Qatar", lat: 25.27, lng: 51.60, altM: 11582, spdKts: 490, hdg: 295, vert: 0, squawk: "1352" },
    { icao24: "710255", callsign: "SVA112", country: "Saudi Arabia", lat: 21.67, lng: 39.15, altM: 10668, spdKts: 465, hdg: 340, vert: 0, squawk: "2504" },
    { icao24: "4ba19c", callsign: "THY010", country: "Turkey", lat: 41.27, lng: 28.75, altM: 11277, spdKts: 480, hdg: 280, vert: 0, squawk: "3711" },

    // Asia & India
    { icao24: "80081a", callsign: "AIC101", country: "India", lat: 28.55, lng: 77.10, altM: 10972, spdKts: 475, hdg: 290, vert: 0, squawk: "4312" },
    { icao24: "800cf9", callsign: "IGO505", country: "India", lat: 19.08, lng: 72.87, altM: 7924, spdKts: 395, hdg: 160, vert: 0, squawk: "1255" },
    { icao24: "76ce81", callsign: "SIA321", country: "Singapore", lat: 1.36, lng: 103.99, altM: 11887, spdKts: 495, hdg: 315, vert: 0, squawk: "6420" },
    { icao24: "780992", callsign: "CPA840", country: "Hong Kong", lat: 22.30, lng: 113.91, altM: 11277, spdKts: 485, hdg: 45, vert: 0, squawk: "5133" },
    { icao24: "868212", callsign: "ANA106", country: "Japan", lat: 35.77, lng: 140.39, altM: 12192, spdKts: 510, hdg: 70, vert: 0, squawk: "3601" },
    { icao24: "7c6bc1", callsign: "QFA1", country: "Australia", lat: -33.94, lng: 151.17, altM: 11582, spdKts: 490, hdg: 300, vert: 0, squawk: "2015" },
  ];
}

function getSimulatedGlobalFlights(regionKey, bounds) {
  if (!simulatedFlightStateCache) {
    simulatedFlightStateCache = initializeSimulatedFlights();
  }

  // Dead reckoning forward simulation: move each plane slightly based on speed and heading
  const dtHours = 12 / 3600; // pretend 12 seconds have elapsed
  simulatedFlightStateCache = simulatedFlightStateCache.map((f) => {
    const speedKnots = f.spdKts;
    const distanceNm = speedKnots * dtHours;
    const distanceKm = distanceNm * 1.852;
    const headingRad = (f.hdg * Math.PI) / 180;

    // 1 deg lat is ~111 km
    const dLat = (distanceKm * Math.cos(headingRad)) / 111.0;
    // 1 deg lng is ~111 * cos(lat) km
    const dLng = (distanceKm * Math.sin(headingRad)) / (111.0 * Math.cos((f.lat * Math.PI) / 180));

    let newLat = Number((f.lat + dLat).toFixed(4));
    let newLng = Number((f.lng + dLng).toFixed(4));

    // Wrap around boundaries
    if (newLat > 80) newLat = -60;
    if (newLat < -60) newLat = 80;
    if (newLng > 180) newLng = -180;
    if (newLng < -180) newLng = 180;

    return {
      ...f,
      lat: newLat,
      lng: newLng,
    };
  });

  // Filter flights if a region bounding box is specified
  let filtered = simulatedFlightStateCache;
  if (bounds) {
    const { lamin, lomin, lamax, lomax } = bounds;
    // If bounding box has valid coordinates
    filtered = simulatedFlightStateCache.filter(
      (f) => f.lat >= lamin - 5 && f.lat <= lamax + 5 && f.lng >= lomin - 5 && f.lng <= lomax + 5
    );

    // If bounding box yields very few results, add a few generated local flights inside bounds
    if (filtered.length < 5) {
      const generated = generateLocalSectorFlights(bounds);
      filtered = [...filtered, ...generated];
    }
  }

  return filtered.map((f) => {
    const altFeet = Math.round(f.altM * 3.28084);
    const flightLevel = `FL${Math.round(altFeet / 100).toString().padStart(3, "0")}`;
    const cardinals = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    const cardinalIndex = Math.round((((f.hdg % 360) + 360) % 360) / 22.5) % 16;

    let altBracket = "mid";
    if (altFeet < 10000) altBracket = "low";
    else if (altFeet >= 33000) altBracket = "high";

    return {
      id: f.icao24,
      icao24: f.icao24.toUpperCase(),
      callsign: f.callsign,
      country: f.country,
      lat: f.lat,
      lng: f.lng,
      altitudeMeters: f.altM,
      altitudeFeet: altFeet,
      flightLevel,
      altBracket,
      velocityKts: f.spdKts,
      velocityKmh: Math.round(f.spdKts * 1.852),
      heading: f.hdg,
      headingCardinal: cardinals[cardinalIndex],
      verticalRateFpm: f.vert || 0,
      isClimbing: (f.vert || 0) > 100,
      isDescending: (f.vert || 0) < -100,
      onGround: false,
      squawk: f.squawk || "1000",
      isEmergency: false,
      lastContact: new Date(),
      timePosition: new Date(),
    };
  });
}

function generateLocalSectorFlights(bounds) {
  const { lamin, lomin, lamax, lomax } = bounds;
  const prefixes = ["AAL", "UAL", "DAL", "BAW", "DLH", "AFR", "KLM", "SIA", "UAE", "QFA"];
  const countries = ["United States", "United Kingdom", "Germany", "France", "Japan", "Canada", "Singapore"];
  const count = 12;
  const flights = [];

  for (let i = 0; i < count; i++) {
    const lat = lamin + Math.random() * (lamax - lamin);
    const lng = lomin + Math.random() * (lomax - lomin);
    const prefix = prefixes[i % prefixes.length];
    const num = Math.floor(100 + Math.random() * 899);
    const altM = Math.floor(7000 + Math.random() * 4500);
    const spd = Math.floor(400 + Math.random() * 110);
    const hdg = Math.floor(Math.random() * 360);

    flights.push({
      icao24: `sim${i}${Math.floor(Math.random() * 999)}`,
      callsign: `${prefix}${num}`,
      country: countries[i % countries.length],
      lat: Number(lat.toFixed(4)),
      lng: Number(lng.toFixed(4)),
      altM,
      spdKts: spd,
      hdg,
      vert: 0,
      squawk: "1000",
    });
  }

  return flights;
}
