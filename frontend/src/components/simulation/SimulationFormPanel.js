function fieldErrorStyle() {
  return {
    color: "crimson",
    fontSize: "13px",
    marginTop: "5px",
  };
}

function helperStyle() {
  return {
    fontSize: "12px",
    color: "#475467",
    marginTop: "5px",
    lineHeight: 1.4,
  };
}

function inputStyle(hasError) {
  return {
    width: "100%",
    padding: "9px 11px",
    borderRadius: "8px",
    border: hasError ? "1px solid crimson" : "1px solid #d0d5dd",
    backgroundColor: "#fff",
    boxSizing: "border-box",
    fontSize: "14px",
  };
}

function dropdownItemStyle() {
  return {
    padding: "10px 12px",
    borderBottom: "1px solid #eaecf0",
    cursor: "pointer",
    backgroundColor: "#fff",
  };
}

function SimulationFormPanel({
  formData = {
    callerName: "",
    callerPhone: "",
    categoryName: "",
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
  scenarioCategories = [],
}) {
  return (
    <form onSubmit={onSubmit} style={{ display: "grid", gap: "14px" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr 1fr",
          gap: "12px",
        }}
      >
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

        <div>
          <label htmlFor="categoryName">Kategória</label>
          <select
            id="categoryName"
            name="categoryName"
            value={formData.categoryName}
            onChange={onChange}
            style={inputStyle(Boolean(errors.categoryName))}
          >
            <option value="">Válassz kategóriát</option>
            {scenarioCategories.map((category) => (
              <option key={category.id || category.name} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryName && (
            <div style={fieldErrorStyle()}>{errors.categoryName}</div>
          )}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.45fr 1fr",
          gap: "12px",
          alignItems: "start",
        }}
      >
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
                  style={dropdownItemStyle()}
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
            Ide közvetlenül koordinátát is írhatsz.
          </div>

          {selectedCoordinates && (
            <div style={helperStyle()}>
              Aktuális koordináták: {selectedCoordinates.lat.toFixed(6)},{" "}
              {selectedCoordinates.lon.toFixed(6)}
            </div>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="note">Jegyzet</label>
        <textarea
          id="note"
          name="note"
          rows="4"
          value={formData.note}
          onChange={onChange}
          style={{
            ...inputStyle(Boolean(errors.note)),
            resize: "vertical",
            minHeight: "110px",
          }}
        />
        {errors.note && <div style={fieldErrorStyle()}>{errors.note}</div>}
      </div>

      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <button type="submit" className="auth-form-button">
          Tovább a készenléti szervekhez
        </button>
      </div>
    </form>
  );
}

export default SimulationFormPanel;