const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org";

function normalizeLocationItem(item) {
  return {
    displayName: item.display_name,
    lat: Number(item.lat),
    lon: Number(item.lon),
  };
}

export async function searchLocations(query) {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return [];
  }

  const response = await fetch(
    `${NOMINATIM_BASE_URL}/search?format=jsonv2&q=${encodeURIComponent(
      trimmedQuery
    )}&addressdetails=1&limit=5&countrycodes=hu`
  );

  if (!response.ok) {
    throw new Error("Nem sikerült lekérni a címjavaslatokat.");
  }

  const data = await response.json();
  return Array.isArray(data) ? data.map(normalizeLocationItem) : [];
}

export async function reverseGeocode(lat, lon) {
  const response = await fetch(
    `${NOMINATIM_BASE_URL}/reverse?format=jsonv2&lat=${encodeURIComponent(
      lat
    )}&lon=${encodeURIComponent(lon)}&zoom=18&addressdetails=1`
  );

  if (!response.ok) {
    throw new Error("Nem sikerült visszafejteni a címet a koordinátákból.");
  }

  const data = await response.json();

  return {
    displayName: data.display_name || "",
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