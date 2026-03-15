const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org";

function firstNonEmpty(...values) {
  return values.find((value) => typeof value === "string" && value.trim()) || "";
}

function buildCompactAddress(item) {
  const address = item.address || {};

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

  const displayParts = String(item.display_name || "")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  if (displayParts.length >= 2) {
    return `${displayParts[0]} ${displayParts[1]}`;
  }

  if (displayParts.length === 1) {
    return displayParts[0];
  }

  return item.display_name || "";
}

function normalizeLocationItem(item) {
  const formattedAddress = buildCompactAddress(item);

  return {
    displayName: item.display_name,
    formattedAddress,
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
    )}&addressdetails=1&limit=6&countrycodes=hu`
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