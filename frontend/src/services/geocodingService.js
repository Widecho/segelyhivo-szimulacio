const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org";

function firstNonEmpty(...values) {
  return values.find((value) => typeof value === "string" && value.trim()) || "";
}

function normalizeWhitespace(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function extractRoadAndKm(query) {
  const normalized = normalizeWhitespace(query).toUpperCase();

  const motorwayMatch = normalized.match(/\b(M\d+)\b/);
  const mainRoadMatch = normalized.match(/\b(\d{1,3})-?ES\b/);
  const kmMatch = normalized.match(/(\d+(?:[.,]\d+)?)\s*(?:KM|KILOMÉTER|KILOMETER)/i);

  const roadCode = motorwayMatch
    ? motorwayMatch[1]
    : mainRoadMatch
    ? `${mainRoadMatch[1]}-es főút`
    : "";

  const kmValue = kmMatch ? kmMatch[1].replace(",", ".") : "";

  return {
    roadCode,
    kmValue,
    isRoadKmQuery: Boolean(roadCode && kmValue),
  };
}

function buildCompactAddress(item) {
  const address = item.address || {};
  const displayName = normalizeWhitespace(item.display_name || "");

  const postcode = firstNonEmpty(address.postcode);
  const city = firstNonEmpty(
    address.city,
    address.town,
    address.village,
    address.municipality,
    address.suburb
  );

  const road = firstNonEmpty(
    address.road,
    address.pedestrian,
    address.footway,
    address.cycleway,
    address.path,
    address.highway,
    address.route
  );

  const houseNumber = firstNonEmpty(address.house_number);

  if (postcode && city && road && houseNumber) {
    return `${postcode} ${city}, ${road} ${houseNumber}.`;
  }

  if (postcode && city && road) {
    return `${postcode} ${city}, ${road}`;
  }

  if (road && houseNumber) {
    return `${road} ${houseNumber}.`;
  }

  if (road && city) {
    return `${city}, ${road}`;
  }

  const displayParts = displayName
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  if (displayParts.length >= 2) {
    return `${displayParts[0]}, ${displayParts[1]}`;
  }

  if (displayParts.length === 1) {
    return displayParts[0];
  }

  return displayName;
}

function buildRoadKmLabel(query, item) {
  const { roadCode, kmValue, isRoadKmQuery } = extractRoadAndKm(query);

  if (!isRoadKmQuery) {
    return "";
  }

  const address = item.address || {};
  const locality = firstNonEmpty(
    address.city,
    address.town,
    address.village,
    address.municipality,
    address.county,
    address.state_district
  );

  if (locality) {
    return `${roadCode} ${kmValue} km, ${locality}`;
  }

  return `${roadCode} ${kmValue} km`;
}

function normalizeLocationItem(item, originalQuery = "") {
  const roadKmLabel = buildRoadKmLabel(originalQuery, item);
  const formattedAddress = roadKmLabel || buildCompactAddress(item);

  return {
    displayName: normalizeWhitespace(item.display_name),
    formattedAddress,
    lat: Number(item.lat),
    lon: Number(item.lon),
  };
}

function uniqueByCoordinates(items) {
  const seen = new Set();

  return items.filter((item) => {
    const key = `${item.lat.toFixed(6)}|${item.lon.toFixed(6)}`;

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function buildSearchQueries(query) {
  const trimmed = normalizeWhitespace(query);
  const lower = trimmed.toLowerCase();
  const { roadCode, kmValue, isRoadKmQuery } = extractRoadAndKm(trimmed);

  const queries = [trimmed];

  if (isRoadKmQuery) {
    queries.push(
      `${roadCode} ${kmValue} km Magyarország`,
      `${roadCode} ${kmValue} km Hungary`,
      `${roadCode} kilométer ${kmValue} Magyarország`,
      `${roadCode} ${kmValue} km szelvény`,
      `${roadCode} ${kmValue} km marker`
    );
  }

  if (/\bautópálya\b/i.test(lower) || /\bautout\b/i.test(lower) || /\bautóút\b/i.test(lower)) {
    queries.push(trimmed.replace(/autópálya/gi, "").replace(/autóút/gi, "").trim());
  }

  return [...new Set(queries.map(normalizeWhitespace).filter(Boolean))];
}

async function runNominatimSearch(query) {
  const response = await fetch(
    `${NOMINATIM_BASE_URL}/search?format=jsonv2&q=${encodeURIComponent(
      query
    )}&addressdetails=1&limit=6&countrycodes=hu`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Nem sikerült lekérni a címjavaslatokat.");
  }

  return response.json();
}

export async function searchLocations(query) {
  const trimmedQuery = normalizeWhitespace(query);

  if (!trimmedQuery) {
    return [];
  }

  const searchQueries = buildSearchQueries(trimmedQuery);
  let collected = [];

  for (const searchQuery of searchQueries) {
    const data = await runNominatimSearch(searchQuery);

    if (Array.isArray(data) && data.length > 0) {
      collected = collected.concat(
        data.map((item) => normalizeLocationItem(item, trimmedQuery))
      );

      if (collected.length >= 6) {
        break;
      }
    }
  }

  return uniqueByCoordinates(collected).slice(0, 6);
}

export async function reverseGeocode(lat, lon) {
  const response = await fetch(
    `${NOMINATIM_BASE_URL}/reverse?format=jsonv2&lat=${encodeURIComponent(
      lat
    )}&lon=${encodeURIComponent(lon)}&zoom=18&addressdetails=1`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Nem sikerült visszafejteni a címet a koordinátákból.");
  }

  const data = await response.json();

  return {
    displayName: normalizeWhitespace(data.display_name || ""),
    formattedAddress: buildCompactAddress(data),
    lat: Number(data.lat),
    lon: Number(data.lon),
  };
}

export function parseCoordinateInput(input) {
  const trimmed = input.trim();

  if (!trimmed) {
    return null;
  }

  const normalized = trimmed.replace(/\s+/g, "");
  const parts = normalized.split(",");

  if (parts.length !== 2) {
    return null;
  }

  const lat = Number(parts[0]);
  const lon = Number(parts[1]);

  if (Number.isNaN(lat) || Number.isNaN(lon)) {
    return null;
  }

  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    return null;
  }

  return { lat, lon };
}