function SimulationHeader({ availabilityLabel, isAvailable, scenarioTitle }) {
  return (
    <div className="simulation-topbar">
      <div className="simulation-topbar-left">
        <h2>112 Operátori felület</h2>
        <p>
          Aktív szituáció: <strong>{scenarioTitle}</strong>
        </p>
      </div>

      <div className="simulation-topbar-right">
        <div
          className={`simulation-status-chip ${
            isAvailable ? "available" : "busy"
          }`}
        >
          Operátori státusz: {availabilityLabel}
        </div>
      </div>
    </div>
  );
}

export default SimulationHeader;