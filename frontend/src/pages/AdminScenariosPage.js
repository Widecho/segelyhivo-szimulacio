import { useMemo, useState } from "react";
import InfoCard from "../components/InfoCard";
import mockScenarios from "../utils/mockScenarios";
import {
  deleteCustomScenarioById,
  loadCustomScenarios,
} from "../utils/scenarioStorage";
import "../styles/auth.css";

function AdminScenariosPage() {
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [message, setMessage] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const customScenarios = useMemo(() => loadCustomScenarios(), [refreshKey]);
  const allScenarios = [...customScenarios, ...mockScenarios];

  const handleShowDetails = (scenario) => {
    setSelectedScenario(scenario);
    setMessage("");
  };

  const handleEditScenario = (scenario) => {
    setSelectedScenario(scenario);
    setMessage(`Mock művelet: "${scenario.title}" szerkesztése előkészítve.`);
  };

  const handleDeleteScenario = (scenario) => {
    deleteCustomScenarioById(scenario.id);

    if (selectedScenario?.id === scenario.id) {
      setSelectedScenario(null);
    }

    setMessage(`Mock művelet: "${scenario.title}" törölve lett a saját szituációk közül.`);
    setRefreshKey((prev) => prev + 1);
  };

  const isCustomScenario = (scenarioId) =>
    customScenarios.some((scenario) => scenario.id === scenarioId);

  return (
    <div>
      <h2>Szituációk kezelése</h2>
      <p>
        Itt jelenik meg az összes létrehozott szituáció. Később innen lehet majd
        részletesen megnyitni, szerkeszteni és ellenőrizni őket.
      </p>

      {message && (
        <div
          style={{
            marginTop: "16px",
            marginBottom: "20px",
            padding: "12px 16px",
            borderRadius: "10px",
            backgroundColor: "#eef4fb",
            border: "1px solid #c9d9ee",
          }}
        >
          {message}
        </div>
      )}

      {selectedScenario && (
        <div
          style={{
            marginTop: "16px",
            marginBottom: "20px",
            padding: "16px",
            borderRadius: "12px",
            backgroundColor: "#f8f8f8",
            border: "1px solid #dddddd",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Kiválasztott szituáció</h3>
          <p><strong>Azonosító:</strong> {selectedScenario.id}</p>
          <p><strong>Cím:</strong> {selectedScenario.title}</p>
          <p><strong>Kategória:</strong> {selectedScenario.category}</p>
          <p><strong>Hanganyag:</strong> {selectedScenario.audioFileName}</p>
          <p><strong>Cím / helyszín:</strong> {selectedScenario.address}</p>
          <p><strong>Elvárt jegyzet:</strong> {selectedScenario.expectedNote}</p>
          <p>
            <strong>Elvárt készenléti szervek:</strong>{" "}
            {selectedScenario.requiredUnits.join(", ")}
          </p>
        </div>
      )}

      <div style={{ marginTop: "24px" }}>
        {allScenarios.map((scenario) => {
          const custom = isCustomScenario(scenario.id);

          return (
            <InfoCard
              key={scenario.id}
              title={`${scenario.title} (${scenario.category})`}
              footer={
                <div className="admin-action-row">
                  <button
                    type="button"
                    className="admin-action-button"
                    onClick={() => handleShowDetails(scenario)}
                  >
                    Részletek
                  </button>

                  <button
                    type="button"
                    className="admin-action-button"
                    onClick={() => handleEditScenario(scenario)}
                  >
                    Szerkesztés
                  </button>

                  {custom && (
                    <button
                      type="button"
                      className="admin-action-button"
                      onClick={() => handleDeleteScenario(scenario)}
                    >
                      Törlés
                    </button>
                  )}
                </div>
              }
            >
              <p><strong>Azonosító:</strong> {scenario.id}</p>
              <p><strong>Hanganyag:</strong> {scenario.audioFileName}</p>
              <p><strong>Helyszín:</strong> {scenario.address}</p>
              <p>
                <strong>Típus:</strong>{" "}
                {custom ? "Saját létrehozott mock szituáció" : "Alap mock szituáció"}
              </p>
            </InfoCard>
          );
        })}
      </div>
    </div>
  );
}

export default AdminScenariosPage;