import { useEffect, useState } from "react";
import { getAdminAttempts } from "../services/adminService";

function feedbackStyle(type) {
  if (type === "SUCCESS") {
    return {
      backgroundColor: "#ecfdf3",
      border: "1px solid #abefc6",
      color: "#067647",
    };
  }

  if (type === "ERROR") {
    return {
      backgroundColor: "#fef3f2",
      border: "1px solid #fecdca",
      color: "#b42318",
    };
  }

  return {
    backgroundColor: "#f5faff",
    border: "1px solid #b2ddff",
    color: "#175cd3",
  };
}

function AdminUserResultsPage() {
  const [attempts, setAttempts] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadAttempts() {
      setIsLoading(true);
      setError("");

      try {
        const response = await getAdminAttempts();

        if (isMounted) {
          setAttempts(Array.isArray(response) ? response : []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Nem sikerült betölteni az eredményeket.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadAttempts();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div>
      <h2>Felhasználói eredmények</h2>
      <p>Itt láthatók a backendből betöltött próbálkozások és részletes kiértékelések.</p>

      {isLoading && <p>Betöltés...</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {!isLoading && !error && attempts.length === 0 && (
        <p>Jelenleg nincs megjeleníthető eredmény.</p>
      )}

      {!isLoading && !error && attempts.length > 0 && (
        <div
          style={{
            marginTop: "20px",
            display: "grid",
            gap: "14px",
          }}
        >
          {attempts.map((attempt) => (
            <div
              key={attempt.id}
              style={{
                border: "1px solid #d9d9d9",
                borderRadius: "12px",
                padding: "16px",
                backgroundColor: "#fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              <h3 style={{ marginTop: 0, marginBottom: "10px" }}>
                {attempt.scenarioTitle}
              </h3>

              <p style={{ margin: "4px 0" }}>
                <strong>Felhasználó:</strong> {attempt.username}
              </p>
              <p style={{ margin: "4px 0" }}>
                <strong>Bejelentő neve:</strong> {attempt.callerName}
              </p>
              <p style={{ margin: "4px 0" }}>
                <strong>Telefonszám:</strong> {attempt.callerPhone}
              </p>
              <p style={{ margin: "4px 0" }}>
                <strong>Helyszín:</strong> {attempt.locationText}
              </p>
              <p style={{ margin: "4px 0" }}>
                <strong>Esemény:</strong> {attempt.eventDescription}
              </p>
              <p style={{ margin: "4px 0" }}>
                <strong>Értékelés:</strong> {attempt.evaluationStatus}
              </p>
              <p style={{ margin: "4px 0" }}>
                <strong>Pontszám:</strong> {attempt.score}
              </p>
              <p style={{ margin: "4px 0" }}>
                <strong>Talált egységek:</strong> {attempt.matchedUnitCount}
              </p>
              <p style={{ margin: "4px 0" }}>
                <strong>Hiányzó egységek:</strong> {attempt.missingUnitCount}
              </p>
              <p style={{ margin: "4px 0" }}>
                <strong>Hibás egységek:</strong> {attempt.incorrectUnitCount}
              </p>
              <p style={{ margin: "4px 0" }}>
                <strong>Jegyzetellenőrzés:</strong> {attempt.noteEvaluationStatus || "-"}
              </p>
              <p style={{ margin: "4px 0" }}>
                <strong>Kezdés:</strong> {attempt.startedAt || "-"}
              </p>
              <p style={{ margin: "4px 0" }}>
                <strong>Beküldés:</strong> {attempt.submittedAt || "-"}
              </p>

              {attempt.evaluatorSummary && (
                <div
                  style={{
                    marginTop: "12px",
                    padding: "12px",
                    borderRadius: "10px",
                    backgroundColor: "#f8fafc",
                    border: "1px solid #e4e7ec",
                  }}
                >
                  <strong>Összegzés:</strong>
                  <p style={{ margin: "8px 0 0 0" }}>{attempt.evaluatorSummary}</p>
                </div>
              )}

              {Array.isArray(attempt.feedbackItems) && attempt.feedbackItems.length > 0 && (
                <div style={{ marginTop: "14px" }}>
                  <strong>Részletes visszajelzések:</strong>

                  <div
                    style={{
                      display: "grid",
                      gap: "10px",
                      marginTop: "10px",
                    }}
                  >
                    {attempt.feedbackItems.map((item) => (
                      <div
                        key={item.id}
                        style={{
                          ...feedbackStyle(item.feedbackType),
                          borderRadius: "10px",
                          padding: "10px 12px",
                        }}
                      >
                        <div style={{ fontWeight: 700, marginBottom: "4px" }}>
                          {item.feedbackType}
                        </div>
                        <div>{item.message}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminUserResultsPage;