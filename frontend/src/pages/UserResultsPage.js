import { useEffect, useState } from "react";
import { getMyAttempts } from "../services/userService";

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
    backgroundColor: "#eff8ff",
    border: "1px solid #b2ddff",
    color: "#175cd3",
  };
}

function UserResultsPage() {
  const [attempts, setAttempts] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadAttempts() {
      setIsLoading(true);
      setError("");

      try {
        const response = await getMyAttempts();

        if (isMounted) {
          setAttempts(Array.isArray(response) ? response : []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Nem sikerült betölteni a saját eredményeket.");
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
      <div className="page-header-row">
        <div>
          <h2 className="page-title">Korábbi eredmények</h2>
          <p className="page-description">
            Itt láthatók a saját próbálkozásaid és a részletes kiértékeléseid.
          </p>
        </div>
      </div>

      {isLoading && <div className="loading-message">Betöltés...</div>}
      {error && <div className="error-message">{error}</div>}

      {!isLoading && !error && attempts.length === 0 && (
        <div className="empty-message">Jelenleg nincs megjeleníthető eredmény.</div>
      )}

      {!isLoading && !error && attempts.length > 0 && (
        <div className="card-grid two-col">
          {attempts.map((attempt) => (
            <div key={attempt.id} className="panel-card">
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
                <h3 style={{ margin: 0 }}>{attempt.scenarioTitle}</h3>
                <span className="badge active">{attempt.evaluationStatus || "Értékelt"}</span>
              </div>

              <div className="data-list">
                <div className="data-row">
                  <div className="data-label">Bejelentő neve</div>
                  <div className="data-value">{attempt.callerName || "-"}</div>
                </div>

                <div className="data-row">
                  <div className="data-label">Telefonszám</div>
                  <div className="data-value">{attempt.callerPhone || "-"}</div>
                </div>

                <div className="data-row">
                  <div className="data-label">Helyszín</div>
                  <div className="data-value">{attempt.locationText || "-"}</div>
                </div>

                <div className="data-row">
                  <div className="data-label">Kategória / esemény</div>
                  <div className="data-value">{attempt.eventDescription || "-"}</div>
                </div>

                <div className="data-row">
                  <div className="data-label">Pontszám</div>
                  <div className="data-value">{attempt.score ?? "-"}</div>
                </div>

                <div className="data-row">
                  <div className="data-label">Talált egységek</div>
                  <div className="data-value">{attempt.matchedUnitCount}</div>
                </div>

                <div className="data-row">
                  <div className="data-label">Hiányzó egységek</div>
                  <div className="data-value">{attempt.missingUnitCount}</div>
                </div>

                <div className="data-row">
                  <div className="data-label">Hibás egységek</div>
                  <div className="data-value">{attempt.incorrectUnitCount}</div>
                </div>

                <div className="data-row">
                  <div className="data-label">Jegyzetellenőrzés</div>
                  <div className="data-value">{attempt.noteEvaluationStatus || "-"}</div>
                </div>

                <div className="data-row">
                  <div className="data-label">Kezdés</div>
                  <div className="data-value">{attempt.startedAt || "-"}</div>
                </div>

                <div className="data-row">
                  <div className="data-label">Beküldés</div>
                  <div className="data-value">{attempt.submittedAt || "-"}</div>
                </div>
              </div>

              {attempt.evaluatorSummary && (
                <div
                  style={{
                    marginTop: "14px",
                    padding: "14px",
                    borderRadius: "12px",
                    backgroundColor: "#f8fafc",
                    border: "1px solid #e4e7ec",
                  }}
                >
                  <strong>Összegzés</strong>
                  <p style={{ margin: "8px 0 0 0", lineHeight: 1.5 }}>
                    {attempt.evaluatorSummary}
                  </p>
                </div>
              )}

              {Array.isArray(attempt.feedbackItems) && attempt.feedbackItems.length > 0 && (
                <div style={{ marginTop: "14px" }}>
                  <strong>Részletes visszajelzések</strong>

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
                          borderRadius: "12px",
                          padding: "12px 14px",
                        }}
                      >
                        <div style={{ fontWeight: 800, marginBottom: "4px" }}>
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

export default UserResultsPage;