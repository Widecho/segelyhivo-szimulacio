import { apiRequest } from "./apiClient";

export async function getAdminUsers() {
  return apiRequest("/users/list");
}

export async function getAdminScenarios() {
  return apiRequest("/admin/scenarios/list");
}

export async function getAdminScenarioDetails(scenarioId) {
  return apiRequest(`/admin/scenarios/${scenarioId}`);
}

export async function createAdminScenario(payload) {
  return apiRequest("/admin/scenarios", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateAdminScenario(scenarioId, payload) {
  return apiRequest(`/admin/scenarios/${scenarioId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function updateAdminScenarioStatus(scenarioId, isActive) {
  return apiRequest(`/admin/scenarios/${scenarioId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ isActive }),
  });
}

export async function deleteAdminScenario(scenarioId) {
  return apiRequest(`/admin/scenarios/${scenarioId}`, {
    method: "DELETE",
  });
}

export async function getAdminAttempts() {
  return apiRequest("/attempts/list");
}

export async function getAdminUnits() {
  return apiRequest("/reference/units/grouped");
}