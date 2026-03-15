import { apiRequest } from "./apiClient";

export async function getScenarioCategories() {
  return apiRequest("/reference/scenario-categories", {
    method: "GET",
  });
}