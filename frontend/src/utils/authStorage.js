const AUTH_STORAGE_KEY = "segelyhivo-auth";

export function saveAuth(authData) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
}

export function loadAuth() {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
}

export function clearAuth() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}