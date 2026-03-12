const CUSTOM_SCENARIOS_STORAGE_KEY = "custom-scenarios";

export function loadCustomScenarios() {
  const rawValue = localStorage.getItem(CUSTOM_SCENARIOS_STORAGE_KEY);

  if (!rawValue) {
    return [];
  }

  try {
    const parsedValue = JSON.parse(rawValue);
    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch (error) {
    return [];
  }
}

export function saveCustomScenario(scenario) {
  const existingScenarios = loadCustomScenarios();
  const updatedScenarios = [scenario, ...existingScenarios];

  localStorage.setItem(
    CUSTOM_SCENARIOS_STORAGE_KEY,
    JSON.stringify(updatedScenarios)
  );
}

export function deleteCustomScenarioById(scenarioId) {
  const existingScenarios = loadCustomScenarios();
  const updatedScenarios = existingScenarios.filter(
    (scenario) => scenario.id !== scenarioId
  );

  localStorage.setItem(
    CUSTOM_SCENARIOS_STORAGE_KEY,
    JSON.stringify(updatedScenarios)
  );
}

export function updateCustomScenario(updatedScenario) {
  const existingScenarios = loadCustomScenarios();

  const updatedScenarios = existingScenarios.map((scenario) =>
    scenario.id === updatedScenario.id ? updatedScenario : scenario
  );

  localStorage.setItem(
    CUSTOM_SCENARIOS_STORAGE_KEY,
    JSON.stringify(updatedScenarios)
  );
}