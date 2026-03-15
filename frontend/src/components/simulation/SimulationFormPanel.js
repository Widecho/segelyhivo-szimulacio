function fieldErrorStyle() {
  return {
    color: "crimson",
    fontSize: "14px",
    marginTop: "6px",
  };
}

function helperStyle() {
  return {
    fontSize: "13px",
    color: "#475467",
    marginTop: "6px",
  };
}

function inputStyle(hasError) {
  return {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "8px",
    border: hasError ? "1px solid crimson" : "1px solid #d0d5dd",
    backgroundColor: "#fff",
    boxSizing: "border-box",
  };
}

function dropdownItemStyle(isActive) {
  return {
    padding: "10px 12px",
    borderBottom: "1px solid #eaecf0",
    cursor: "pointer",
    backgroundColor: isActive ? "#eef4ff" : "#fff",
  };
}

function SimulationFormPanel({
  formData = {
    callerName: "",
    callerPhone: "",
    location: "",
    note: "",
  },
  errors = {},
  onChange,
  onSubmit,
  selectedCoordinates,
  locationSearchText,
  onLocationSearchTextChange,
  locationSuggestions,
  onSelectLocationSuggestion,
  isSearchingLocation,
  coordinateInput,
  onCoordinateInputChange,
}) {
  return (
    <form onSubmit={onSubmit} style={{ display: "grid", gap: "14px" }}>
      <div>
        <label htmlFor="callerName">Bejelentő neve</label>
        <input
          id="callerName"
          name="callerName"
          type="text"
          value={formData.callerName}
          onChange={onChange}
          style={inputStyle(Boolean(errors.callerName))}
        />
        {errors.callerName && (
          <div style={fieldErrorStyle()}>{errors.callerName}</div>
        )}
      </div>

      <div>
        <label htmlFor="callerPhone">Telefonszám</label>
        <input
          id="callerPhone"
          name="callerPhone"
          type="text"
          value={formData.callerPhone}
          onChange={onChange}
          style={inputStyle(Boolean(errors.callerPhone))}
        />
        {errors.callerPhone && (
          <div style={fieldErrorStyle()}>{errors.callerPhone}</div>
        )}
      </div>

      <div style={{ position: "relative" }}>
        <label htmlFor="locationSearch">Helyszín</label>
        <input
          id="locationSearch"
          name="locationSearch"
          type="text"
          value={locationSearchText}
          onChange={(event) => onLocationSearchTextChange(event.target.value)}
          placeholder="Kezdj el címet írni..."
          autoComplete="off"
          style={inputStyle(Boolean(errors.location))}
        />

        <div style={helperStyle()}>
          A helyszín írás közben OpenStreetMap alapú találatokból választható ki.
        </div>

        {isSearchingLocation && (
          <div style={helperStyle()}>Címkeresés folyamatban...</div>
        )}

        {locationSuggestions.length > 0 && (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: "100%",
              zIndex: 20,
              marginTop: "6px",
              border: "1px solid #d0d5dd",
              borderRadius: "10px",
              overflow: "hidden",
              backgroundColor: "#fff",
              boxShadow: "0 8px 24px rgba(16,24,40,0.12)",
              maxHeight: "220px",
              overflowY: "auto",
            }}
          >
            {locationSuggestions.map((item, index) => (
              <div
                key={`${item.displayName}-${index}`}
                style={dropdownItemStyle(false)}
                onMouseDown={() => onSelectLocationSuggestion(item)}
              >
                <div style={{ fontWeight: 600 }}>{item.shortDisplayName}</div>
                <div style={{ fontSize: "12px", color: "#667085", marginTop: "2px" }}>
                  {item.displayName}
                </div>
              </div>
            ))}
          </div>
        )}

        {errors.location && (
          <div style={fieldErrorStyle()}>{errors.location}</div>
        )}
      </div>

      <div>
        <label htmlFor="coordinateInput">Koordináták</label>
        <input
          id="coordinateInput"
          name="coordinateInput"
          type="text"
          value={coordinateInput}
          onChange={(event) => onCoordinateInputChange(event.target.value)}
          placeholder="Pl.: 48.103415, 20.752698"
          autoComplete="off"
          style={inputStyle(Boolean(errors.location))}
        />

        <div style={helperStyle()}>
          Ide közvetlenül koordinátát is írhatsz. Ha érvényes, a rendszer automatikusan kitölti a hozzá tartozó címet.
        </div>

        {selectedCoordinates && (
          <div style={helperStyle()}>
            Aktuális koordináták: {selectedCoordinates.lat.toFixed(6)},{" "}
            {selectedCoordinates.lon.toFixed(6)}
          </div>
        )}
      </div>

      <div>
        <label htmlFor="note">Jegyzet</label>
        <textarea
          id="note"
          name="note"
          rows="5"
          value={formData.note}
          onChange={onChange}
          style={inputStyle(Boolean(errors.note))}
        />
        {errors.note && <div style={fieldErrorStyle()}>{errors.note}</div>}
      </div>

      <div>
        <button type="submit" className="auth-form-button">
          Tovább a készenléti szervekhez
        </button>
      </div>
    </form>
  );
}

export default SimulationFormPanel;