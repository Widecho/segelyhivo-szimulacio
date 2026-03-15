import { apiRequest } from "./apiClient";

export async function getAdminUsers() {
  return apiRequest("/users/list", {
    method: "GET",
  });
}

export async function getAdminScenarios() {
  return apiRequest("/scenarios/list", {
    method: "GET",
  });
}

export async function getAdminAttempts() {
  return apiRequest("/attempts/list", {
    method: "GET",
  });
}

export async function createAdminScenario(payload) {
  return apiRequest("/admin/scenarios", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getAdminScenarioDetails(scenarioId) {
  return apiRequest(`/admin/scenarios/${scenarioId}`, {
    method: "GET",
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