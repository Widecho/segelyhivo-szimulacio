import { useEffect, useState } from "react";
import { getAdminScenarios } from "../services/adminService";
import { Link } from "react-router-dom";

function AdminScenariosPage() {
  const [scenarios, setScenarios] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadScenarios() {
      setIsLoading(true);
      setError("");

      try {
        const response = await getAdminScenarios();

        if (isMounted) {
          setScenarios(Array.isArray(response) ? response : []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Nem sikerült betölteni a szituációkat.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadScenarios();

    return () => {
      isMounted = false;
    };
  }, []);

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

      {isLoading && <p>Betöltés...</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {!isLoading && !error && scenarios.length === 0 && (
        <p>Jelenleg nincs megjeleníthető szituáció.</p>
      )}

      {!isLoading && !error && scenarios.length > 0 && (
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminScenariosPage;