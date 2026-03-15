import { apiRequest } from "./apiClient";

export async function getCurrentSimulationScenario() {
  return apiRequest("/me/simulation/current", {
    method: "GET",
  });
}

export async function getSimulationUnits() {
  return apiRequest("/me/simulation/units", {
    method: "GET",
  });
}