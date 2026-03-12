function SimulationUnitsPanel({
  units,
  selectedUnits,
  onToggleUnit,
  onSubmitUnits,
  error,
}) {
  const renderUnitColumn = (title, unitList, className) => (
    <div className={`simulation-unit-column ${className}`}>
      <h4>{title}</h4>

      <div className="simulation-unit-list">
        {unitList.map((unit) => (
          <label key={unit} className="simulation-unit-item">
            <input
              type="checkbox"
              checked={selectedUnits.includes(unit)}
              onChange={() => onToggleUnit(unit)}
            />
            <span>{unit}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <p className="simulation-note">
        Válaszd ki a szükséges készenléti szerveket. Összesen legfeljebb három
        egység jelölhető ki.
      </p>

      <div className="simulation-unit-columns">
        {renderUnitColumn("Tűzoltóság", units.fire, "fire")}
        {renderUnitColumn("Mentőszolgálat", units.ambulance, "ambulance")}
        {renderUnitColumn("Rendőrség", units.police, "police")}
      </div>

      {error && (
        <p className="auth-error" style={{ marginTop: "10px" }}>
          {error}
        </p>
      )}

      <div className="simulation-submit-row">
        <button
          type="button"
          className="auth-form-button"
          onClick={onSubmitUnits}
        >
          Készenléti szervek beküldése
        </button>
      </div>
    </>
  );
}

export default SimulationUnitsPanel;