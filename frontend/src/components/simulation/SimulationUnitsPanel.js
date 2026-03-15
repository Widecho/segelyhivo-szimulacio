function panelStyle(borderColor, backgroundColor) {
  return {
    border: `1px solid ${borderColor}`,
    backgroundColor,
    borderRadius: "12px",
    padding: "12px",
    minWidth: 0,
  };
}

function itemStyle() {
  return {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "6px 8px",
    borderRadius: "8px",
    backgroundColor: "#fff",
    border: "1px solid #e4e7ec",
    fontSize: "13px",
    lineHeight: 1.3,
  };
}

function renderGroup(title, units, selectedUnits, onToggleUnit, borderColor, backgroundColor) {
  return (
    <div style={panelStyle(borderColor, backgroundColor)}>
      <h4 style={{ marginTop: 0, marginBottom: "10px", fontSize: "15px" }}>{title}</h4>

      <div
        style={{
          display: "grid",
          gap: "7px",
          maxHeight: "520px",
          overflowY: "auto",
          paddingRight: "3px",
        }}
      >
        {units.map((unit) => {
          const checked = selectedUnits.some((selected) => selected.id === unit.id);

          return (
            <label key={unit.id} style={itemStyle()}>
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggleUnit(unit)}
              />
              <span>{unit.name}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

function SimulationUnitsPanel({
  units,
  selectedUnits,
  onToggleUnit,
  onSubmitUnits,
  onClose,
  error,
}) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "12px",
          alignItems: "center",
          marginBottom: "10px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h3 style={{ margin: 0 }}>Készenléti szervek kiválasztása</h3>
          <p style={{ margin: "6px 0 0 0", color: "#475467", fontSize: "14px" }}>
            Válaszd ki a szükséges szerveket. Összesen legfeljebb három egység jelölhető ki.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          style={{
            padding: "8px 12px",
            borderRadius: "8px",
            border: "1px solid #d0d5dd",
            backgroundColor: "#fff",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Bezárás
        </button>
      </div>

      {error && (
        <div style={{ color: "crimson", marginBottom: "10px", fontWeight: 600 }}>
          {error}
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: "14px",
        }}
      >
        {renderGroup(
          "Tűzoltóság",
          units.fire || [],
          selectedUnits,
          onToggleUnit,
          "#f3c7c4",
          "#fff7f7"
        )}
        {renderGroup(
          "Mentőszolgálat",
          units.ambulance || [],
          selectedUnits,
          onToggleUnit,
          "#c7e7d0",
          "#f7fffa"
        )}
        {renderGroup(
          "Rendőrség",
          units.police || [],
          selectedUnits,
          onToggleUnit,
          "#c9d8f2",
          "#f8fbff"
        )}
      </div>

      <div
        style={{
          marginTop: "14px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ color: "#344054", fontWeight: 600 }}>
          Kijelölt egységek:{" "}
          {selectedUnits.length > 0
            ? selectedUnits.map((unit) => unit.name).join(", ")
            : "Még nincs kijelölés"}
        </div>

        <button
          type="button"
          onClick={onSubmitUnits}
          className="auth-form-button"
          style={{ minWidth: "220px" }}
        >
          Készenléti szervek beküldése
        </button>
      </div>
    </div>
  );
}

export default SimulationUnitsPanel;