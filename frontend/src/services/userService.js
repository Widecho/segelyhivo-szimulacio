import { apiRequest } from "./apiClient";

export async function getMyProfile() {
  return apiRequest("/me/profile", {
    method: "GET",
  });
}

export async function getMyAttempts() {
  return apiRequest("/me/attempts", {
    method: "GET",
  });
}

export async function submitSimulationAttempt(payload) {
  return apiRequest("/me/attempts", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}