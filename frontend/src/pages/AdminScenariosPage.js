import { useMemo, useState } from "react";
import InfoCard from "../components/InfoCard";
import mockScenarios from "../utils/mockScenarios";
import {
  deleteCustomScenarioById,
  loadCustomScenarios,
  updateCustomScenario,
} from "../utils/scenarioStorage";
import "../styles/auth.css";

function AdminScenariosPage() {
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [editingScenario, setEditingScenario] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    category: "",
    audioFileName: "",
    address: "",
    expectedNote: "",
  });
  const [message, setMessage] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const customScenarios = useMemo(() => loadCustomScenarios(), [refreshKey]);
  const allScenarios = [...customScenarios, ...mockScenarios];

  const isCustomScenario = (scenarioId) =>
    customScenarios.some((scenario) => scenario.id === scenarioId);

  const handleShowDetails = (scenario) => {
    setSelectedScenario(scenario);
    setEditingScenario(null);
    setMessage("");
  };

  const handleStartEditScenario = (scenario) => {
    if (!isCustomScenario(scenario.id)) {
      setSelectedScenario(scenario);
      setEditingScenario(null);
      setMessage("Az alap mock szituációk ebben a fázisban még nem szerkeszthetők.");
      return;
    }

    setSelectedScenario(scenario);
    setEditingScenario(scenario);
    setEditFormData({
      title: scenario.title,
      category: scenario.category,
      audioFileName: scenario.audioFileName,
      address: scenario.address,
      expectedNote: scenario.expectedNote,
    });
    setMessage("");
  };

  const handleDeleteScenario = (scenario) => {
    deleteCustomScenarioById(scenario.id);

    if (selectedScenario?.id === scenario.id) {
      setSelectedScenario(null);
    }

    if (editingScenario?.id === scenario.id) {
      setEditingScenario(null);
    }

    setMessage(`Mock művelet: "${scenario.title}" törölve lett a saját szituációk közül.`);
    setRefreshKey((prev) => prev + 1);
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;

    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveEdit = (event) => {
    event.preventDefault();

    if (!editingScenario) {
      return;
    }

    const updatedScenario = {
      ...editingScenario,
      title: editFormData.title,
      category: editFormData.category,
      audioFileName: editFormData.audioFileName,
      address: editFormData.address,
      expectedNote: editFormData.expectedNote,
    };

    updateCustomScenario(updatedScenario);
    setSelectedScenario(updatedScenario);
    setEditingScenario(updatedScenario);
    setMessage(`Mock művelet: "${updatedScenario.title}" módosításai elmentve.`);
    setRefreshKey((prev) => prev + 1);
  };

  const handleCancelEdit = () => {
    setEditingScenario(null);
    setMessage("A szerkesztés megszakítva.");
  };

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

      {editingScenario && (
        <div
          style={{
            marginTop: "16px",
            marginBottom: "24px",
            padding: "16px",
            borderRadius: "12px",
            backgroundColor: "#ffffff",
            border: "1px solid #dcdcdc",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Saját mock szituáció szerkesztése</h3>

          <form className="auth-form" onSubmit={handleSaveEdit}>
            <div className="auth-form-group">
              <label htmlFor="title">Cím</label>
              <input
                id="title"
                name="title"
                type="text"
                value={editFormData.title}
                onChange={handleEditChange}
              />
            </div>

            <div className="auth-form-group">
              <label htmlFor="category">Kategória</label>
              <input
                id="category"
                name="category"
                type="text"
                value={editFormData.category}
                onChange={handleEditChange}
              />
            </div>

            <div className="auth-form-group">
              <label htmlFor="audioFileName">Hanganyag</label>
              <input
                id="audioFileName"
                name="audioFileName"
                type="text"
                value={editFormData.audioFileName}
                onChange={handleEditChange}
              />
            </div>

            <div className="auth-form-group">
              <label htmlFor="address">Helyszín</label>
              <input
                id="address"
                name="address"
                type="text"
                value={editFormData.address}
                onChange={handleEditChange}
              />
            </div>

            <div className="auth-form-group">
              <label htmlFor="expectedNote">Elvárt jegyzet</label>
              <textarea
                id="expectedNote"
                name="expectedNote"
                rows="5"
                value={editFormData.expectedNote}
                onChange={handleEditChange}
                style={{ resize: "vertical" }}
              />
            </div>

            <div className="admin-action-row">
              <button type="submit" className="auth-form-button">
                Módosítások mentése
              </button>

              <button
                type="button"
                className="admin-action-button"
                onClick={handleCancelEdit}
              >
                Mégse
              </button>
            </div>
          </form>
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
                    onClick={() => handleStartEditScenario(scenario)}
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