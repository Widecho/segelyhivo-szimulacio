function SimulationStatusPanel({
  availabilityLabel,
  callState,
  simulationStep,
}) {
  const callStateLabelMap = {
    IDLE: "Nincs aktív várakozás",
    WAITING: "Várakozás bejövő hívásra",
    RINGING: "Bejövő hívás",
    ACCEPTED: "Hívás fogadva",
  };

  const stepLabelMap = {
    FORM: "Adatlap",
    UNITS: "Egységkijelölés",
    EVALUATION: "Kiértékelés",
  };

  return (
    <div className="simulation-panel">
      <h3>Aktuális állapot</h3>

      <div className="simulation-info-grid">
        <div className="simulation-info-card">
          <p className="simulation-info-label">Operátor</p>
          <p className="simulation-info-value">{availabilityLabel}</p>
        </div>

        <div className="simulation-info-card">
          <p className="simulation-info-label">Hívás</p>
          <p className="simulation-info-value">{callStateLabelMap[callState]}</p>
        </div>

        <div className="simulation-info-card">
          <p className="simulation-info-label">Mód</p>
          <p className="simulation-info-value">Szimuláció</p>
        </div>

        <div className="simulation-info-card">
          <p className="simulation-info-label">Lépés</p>
          <p className="simulation-info-value">{stepLabelMap[simulationStep]}</p>
        </div>
      </div>
    </div>
  );
}

export default SimulationStatusPanel;