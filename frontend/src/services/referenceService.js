import { apiRequest } from "./apiClient";

export async function getScenarioCategories() {
  return apiRequest("/reference/categories");
}

export async function getReferenceSummary() {
  return apiRequest("/reference/summary");
}