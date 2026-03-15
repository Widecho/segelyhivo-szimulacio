import { loadAuth, clearAuth } from "../utils/authStorage";

const API_BASE_URL = "http://localhost:8081/api";

async function safeParseJson(response) {
  try {
    return await response.json();
  } catch (error) {
    return null;
  }
}

export async function apiRequest(path, options = {}) {
  const auth = loadAuth();

  const headers = {
    ...(options.headers || {}),
  };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = headers["Content-Type"] || "application/json";
  }

  if (auth?.token) {
    headers.Authorization = `Bearer ${auth.token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await safeParseJson(response);

  if (response.status === 401) {
    clearAuth();
    throw new Error("A munkamenet lejárt vagy érvénytelen. Jelentkezz be újra.");
  }

  if (response.status === 403) {
    throw new Error("Nincs jogosultságod a művelethez.");
  }

  if (!response.ok) {
    throw new Error(data?.message || "Sikertelen kérés a backend felé.");
  }

  return data;
}