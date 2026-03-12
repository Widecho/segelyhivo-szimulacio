function SimulationEvaluationPanel({
  matchedUnits,
  missingUnits,
  incorrectUnits,
  onRestart,
  onBackToDashboard,
}) {
  return (
    <>
      <div className="simulation-evaluation-grid">
        <div className="simulation-evaluation-card success">
          <h4>Mi sikerült jól</h4>
          <ul className="simulation-evaluation-list">
            <li>A híváskezelési folyamat végig lett vezetve.</li>
            <li>A kötelező mezők kitöltése megtörtént.</li>
            <li>
              Helyesen kijelölt egységek:{" "}
              {matchedUnits.length > 0 ? matchedUnits.join(", ") : "nincs egyezés"}
            </li>
          </ul>
        </div>

        <div className="simulation-evaluation-card error">
          <h4>Mi hibás vagy hiányos</h4>
          <ul className="simulation-evaluation-list">
            <li>
              Hiányzó elvárt egységek:{" "}
              {missingUnits.length > 0 ? missingUnits.join(", ") : "nincs hiányzó egység"}
            </li>
            <li>
              Nem elvárt kijelölt egységek:{" "}
              {incorrectUnits.length > 0
                ? incorrectUnits.join(", ")
                : "nincs hibás kijelölés"}
            </li>
            <li>A jegyzet AI alapú ellenőrzése később kerül bekötésre.</li>
          </ul>
        </div>
      </div>

      <div className="simulation-highlight" style={{ marginTop: "12px" }}>
        <p>
          <strong>Összegzés:</strong> mock kiértékelés elkészült. A végleges
          rendszerben itt fog megjelenni a részletes visszajelzés és a tárolt
          eredmény.
        </p>
      </div>

      <div className="simulation-finish-actions">
        <button
          type="button"
          className="auth-form-button"
          onClick={onRestart}
        >
          Új szimuláció indítása
        </button>

        <button
          type="button"
          className="admin-action-button"
          onClick={onBackToDashboard}
        >
          Vissza az irányítópultra
        </button>
      </div>
    </>
  );
}

export default SimulationEvaluationPanel;