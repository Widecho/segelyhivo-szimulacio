import { useEffect, useState } from "react";
import {
  deleteAdminScenario,
  getAdminScenarios,
  updateAdminScenarioStatus,
} from "../services/adminService";
import { Link } from "react-router-dom";

function actionButtonStyle(backgroundColor) {
  return {
    display: "inline-block",
    padding: "8px 12px",
    backgroundColor,
    color: "#fff",
    textDecoration: "none",
    borderRadius: "8px",
    fontWeight: 600,
    border: "none",
    cursor: "pointer",
  };
}

function AdminScenariosPage() {
  const [scenarios, setScenarios] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [updatingScenarioId, setUpdatingScenarioId] = useState("");
  const [deletingScenarioId, setDeletingScenarioId] = useState("");

  useEffect(() => {
    loadScenarios();
  }, []);

  async function loadScenarios() {
    setIsLoading(true);
    setError("");

    try {
      const response = await getAdminScenarios();
      setScenarios(Array.isArray(response) ? response : []);
    } catch (err) {
      setError(err.message || "Nem sikerült betölteni a szituációkat.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleStatusChange(scenarioId, nextStatus) {
    setUpdatingScenarioId(scenarioId);
    setError("");
    setMessage("");

    try {
      const response = await updateAdminScenarioStatus(scenarioId, nextStatus);
      setMessage(response.message || "A szituáció állapota frissült.");
      await loadScenarios();
    } catch (err) {
      setError(err.message || "Nem sikerült frissíteni a szituáció állapotát.");
    } finally {
      setUpdatingScenarioId("");
    }
  }

  async function handleDelete(scenario) {
    const confirmed = window.confirm(
      `Biztosan törölni szeretnéd ezt a szituációt?\n\n${scenario.title}`
    );

    if (!confirmed) {
      return;
    }

    setDeletingScenarioId(scenario.id);
    setError("");
    setMessage("");

    try {
      const response = await deleteAdminScenario(scenario.id);
      setMessage(response.message || "A szituáció törlése sikeres.");
      await loadScenarios();
    } catch (err) {
      setError(err.message || "Nem sikerült törölni a szituációt.");
    } finally {
      setDeletingScenarioId("");
    }
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h2>Szituációk</h2>
          <p>Itt láthatók a backendből betöltött szituációk.</p>
        </div>

        <Link
          to="/admin/scenarios/new"
          style={{
            display: "inline-block",
            padding: "10px 14px",
            backgroundColor: "#1f3c88",
            color: "#fff",
            textDecoration: "none",
            borderRadius: "8px",
            fontWeight: 600,
          }}
        >
          Új szituáció
        </Link>
      </div>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      {isLoading && <p>Betöltés...</p>}

      {!isLoading && scenarios.length === 0 && !error && (
        <p>Jelenleg nincs megjeleníthető szituáció.</p>
      )}

      {!isLoading && scenarios.length > 0 && (
        <div
          style={{
            marginTop: "20px",
            display: "grid",
            gap: "14px",
          }}
        >
          {scenarios.map((scenario) => (
            <div
              key={scenario.id}
              style={{
                border: "1px solid #d9d9d9",
                borderRadius: "12px",
                padding: "16px",
                backgroundColor: "#fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              <h3 style={{ marginTop: 0, marginBottom: "10px" }}>
                {scenario.title}
              </h3>

              <p style={{ margin: "4px 0" }}>
                <strong>Azonosító:</strong> {scenario.id}
              </p>
              <p style={{ margin: "4px 0" }}>
                <strong>Kategória:</strong> {scenario.category}
              </p>
              <p style={{ margin: "4px 0" }}>
                <strong>Helyszín:</strong> {scenario.geoAddress}
              </p>
              <p style={{ margin: "4px 0" }}>
                <strong>Hangfájl:</strong> {scenario.audioFileName}
              </p>
              <p style={{ margin: "4px 0" }}>
                <strong>Létrehozó:</strong> {scenario.createdBy}
              </p>
              <p style={{ margin: "4px 0" }}>
                <strong>Aktív:</strong> {scenario.isActive ? "Igen" : "Nem"}
              </p>
              <p style={{ margin: "4px 0" }}>
                <strong>Elvárt egységek száma:</strong> {scenario.requiredUnitCount}
              </p>
              <p style={{ margin: "10px 0 0 0" }}>
                <strong>Elvárt jegyzet:</strong> {scenario.expectedNote}
              </p>

              <div
                style={{
                  marginTop: "14px",
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
                <Link
                  to={`/admin/scenarios/${scenario.id}/edit`}
                  style={actionButtonStyle("#1f3c88")}
                >
                  Szerkesztés
                </Link>

                {scenario.isActive ? (
                  <button
                    type="button"
                    style={actionButtonStyle("#b42318")}
                    disabled={
                      updatingScenarioId === scenario.id ||
                      deletingScenarioId === scenario.id
                    }
                    onClick={() => handleStatusChange(scenario.id, false)}
                  >
                    {updatingScenarioId === scenario.id ? "Mentés..." : "Inaktiválás"}
                  </button>
                ) : (
                  <button
                    type="button"
                    style={actionButtonStyle("#137333")}
                    disabled={
                      updatingScenarioId === scenario.id ||
                      deletingScenarioId === scenario.id
                    }
                    onClick={() => handleStatusChange(scenario.id, true)}
                  >
                    {updatingScenarioId === scenario.id ? "Mentés..." : "Aktiválás"}
                  </button>
                )}

                <button
                  type="button"
                  style={actionButtonStyle("#8f1d1d")}
                  disabled={
                    updatingScenarioId === scenario.id ||
                    deletingScenarioId === scenario.id
                  }
                  onClick={() => handleDelete(scenario)}
                >
                  {deletingScenarioId === scenario.id ? "Törlés..." : "Törlés"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminScenariosPage;