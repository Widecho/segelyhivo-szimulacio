const LATEST_SIMULATION_RESULT_KEY = "latest-simulation-result";

export function saveLatestSimulationResult(result) {
  localStorage.setItem(LATEST_SIMULATION_RESULT_KEY, JSON.stringify(result));
}

export function loadLatestSimulationResult() {
  const rawValue = localStorage.getItem(LATEST_SIMULATION_RESULT_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue);
  } catch (error) {
    return null;
  }
}