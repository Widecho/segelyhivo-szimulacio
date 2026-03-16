import { useEffect, useState } from "react";
import {
  deleteAdminScenario,
  getAdminScenarios,
  updateAdminScenarioStatus,
} from "../services/adminService";
import { Link } from "react-router-dom";

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
      <div className="page-header-row">
        <div>
          <h2 className="page-title">Szituációk</h2>
          <p className="page-description">
            Itt láthatók a backendből betöltött szituációk, azok állapota és főbb adatai.
          </p>
        </div>

        <Link to="/admin/scenarios/new" className="primary-button">
          Új szituáció
        </Link>
      </div>

      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}
      {isLoading && <div className="loading-message">Betöltés...</div>}

      {!isLoading && scenarios.length === 0 && !error && (
        <div className="empty-message">Jelenleg nincs megjeleníthető szituáció.</div>
      )}

      {!isLoading && scenarios.length > 0 && (
        <div className="card-grid two-col">
          {scenarios.map((scenario) => (
            <div key={scenario.id} className="panel-card">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "12px",
                  flexWrap: "wrap",
                  marginBottom: "12px",
                }}
              >
                <h3 style={{ margin: 0 }}>{scenario.title}</h3>

                <span className={`badge ${scenario.isActive ? "active" : "inactive"}`}>
                  {scenario.isActive ? "Aktív" : "Inaktív"}
                </span>
              </div>

              <div className="data-list">
                <div className="data-row">
                  <div className="data-label">Azonosító</div>
                  <div className="data-value">{scenario.id}</div>
                </div>

                <div className="data-row">
                  <div className="data-label">Kategória</div>
                  <div className="data-value">{scenario.category}</div>
                </div>

                <div className="data-row">
                  <div className="data-label">Helyszín</div>
                  <div className="data-value">{scenario.geoAddress}</div>
                </div>

                <div className="data-row">
                  <div className="data-label">Hangfájl</div>
                  <div className="data-value">{scenario.audioFileName || "-"}</div>
                </div>

                <div className="data-row">
                  <div className="data-label">Létrehozó</div>
                  <div className="data-value">{scenario.createdBy || "-"}</div>
                </div>

                <div className="data-row">
                  <div className="data-label">Elvárt egységek</div>
                  <div className="data-value">{scenario.requiredUnitCount}</div>
                </div>

                <div className="data-row">
                  <div className="data-label">Elvárt jegyzet</div>
                  <div className="data-value">{scenario.expectedNote}</div>
                </div>
              </div>

              <div
                style={{
                  marginTop: "16px",
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
                <Link to={`/admin/scenarios/${scenario.id}`} className="secondary-button">
                  Részletek
                </Link>

                <Link to={`/admin/scenarios/${scenario.id}/edit`} className="primary-button">
                  Szerkesztés
                </Link>

                {scenario.isActive ? (
                  <button
                    type="button"
                    className="danger-button"
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
                    className="success-button"
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
                  className="danger-button"
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