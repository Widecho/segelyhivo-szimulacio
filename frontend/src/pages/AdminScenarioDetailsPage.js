import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getAdminScenarioDetails } from "../services/adminService";

function formatDateTime(value) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("hu-HU");
}

function infoCardStyle() {
  return {
    border: "1px solid #d9d9d9",
    borderRadius: "12px",
    padding: "16px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  };
}

function AdminScenarioDetailsPage() {
  const { scenarioId } = useParams();
  const navigate = useNavigate();

  const [scenario, setScenario] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadScenario() {
      setIsLoading(true);
      setError("");

      try {
        const response = await getAdminScenarioDetails(scenarioId);

        if (isMounted) {
          setScenario(response);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Nem sikerült betölteni a szituáció részleteit.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadScenario();

    return () => {
      isMounted = false;
    };
  }, [scenarioId]);

  if (isLoading) {
    return <p>Betöltés...</p>;
  }

  if (error) {
    return <p style={{ color: "crimson" }}>{error}</p>;
  }

  if (!scenario) {
    return <p>Nincs megjeleníthető szituáció.</p>;
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
          marginBottom: "20px",
        }}
      >
        <div>
          <h2>Szituáció részletei</h2>
          <p>Itt láthatod a kiválasztott szituáció összes fontos adatát.</p>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <Link
            to={`/admin/scenarios/${scenario.id}/edit`}
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
            Szerkesztés
          </Link>

          <button
            type="button"
            onClick={() => navigate("/admin/scenarios")}
            style={{
              padding: "10px 14px",
              border: "1px solid #cfcfcf",
              borderRadius: "8px",
              backgroundColor: "#fff",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Vissza a listához
          </button>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gap: "16px",
        }}
      >
        <div style={infoCardStyle()}>
          <h3 style={{ marginTop: 0 }}>{scenario.title}</h3>

          <p style={{ margin: "6px 0" }}>
            <strong>Azonosító:</strong> {scenario.id}
          </p>
          <p style={{ margin: "6px 0" }}>
            <strong>Kategória:</strong> {scenario.categoryName}
          </p>
          <p style={{ margin: "6px 0" }}>
            <strong>Helyszín:</strong> {scenario.address}
          </p>
          <p style={{ margin: "6px 0" }}>
            <strong>Hangfájl neve:</strong> {scenario.audioFileName}
          </p>
          <p style={{ margin: "6px 0" }}>
            <strong>Aktív:</strong> {scenario.isActive ? "Igen" : "Nem"}
          </p>
          <p style={{ margin: "6px 0" }}>
            <strong>Létrehozó:</strong> {scenario.createdByUsername || "-"}
          </p>
          <p style={{ margin: "6px 0" }}>
            <strong>Létrehozva:</strong> {formatDateTime(scenario.createdAt)}
          </p>
          <p style={{ margin: "6px 0" }}>
            <strong>Utoljára módosítva:</strong> {formatDateTime(scenario.updatedAt)}
          </p>
        </div>

        <div style={infoCardStyle()}>
          <h3 style={{ marginTop: 0 }}>Elvárt jegyzet</h3>
          <p style={{ margin: 0, whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
            {scenario.expectedNote || "-"}
          </p>
        </div>

        <div style={infoCardStyle()}>
          <h3 style={{ marginTop: 0 }}>Elvárt egységek</h3>

          {Array.isArray(scenario.selectedUnitNames) && scenario.selectedUnitNames.length > 0 ? (
            <div style={{ display: "grid", gap: "8px" }}>
              {scenario.selectedUnitNames.map((unitName, index) => (
                <div
                  key={`${unitName}-${index}`}
                  style={{
                    padding: "10px 12px",
                    borderRadius: "8px",
                    backgroundColor: "#f8fafc",
                    border: "1px solid #e4e7ec",
                  }}
                >
                  {unitName}
                </div>
              ))}
            </div>
          ) : (
            <p>Nincs megadott elvárt egység.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminScenarioDetailsPage;