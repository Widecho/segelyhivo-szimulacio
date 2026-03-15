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

function SimulationFormPanel({
  formData = {
    callerName: "",
    callerPhone: "",
    location: "",
    eventDescription: "",
    note: "",
  },
  errors = {},
  onChange,
  onSubmit,
  selectedCoordinates,
}) {
  return (
    <form onSubmit={onSubmit} style={{ display: "grid", gap: "16px" }}>
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
        <label htmlFor="location">Helyszín</label>
        <input
          id="location"
          name="location"
          type="text"
          value={formData.location}
          onChange={onChange}
          readOnly
          style={{
            ...inputStyle(Boolean(errors.location)),
            backgroundColor: "#f8fafc",
          }}
        />
        <div style={helperStyle()}>
          A helyszínt a jobb oldali térképes panelen kell kiválasztani
          OpenStreetMap alapú kereséssel vagy a térképen.
        </div>
        {selectedCoordinates && (
          <div style={helperStyle()}>
            Koordináták: {selectedCoordinates.lat.toFixed(6)},{" "}
            {selectedCoordinates.lon.toFixed(6)}
          </div>
        )}
        {errors.location && (
          <div style={fieldErrorStyle()}>{errors.location}</div>
        )}
      </div>

      <div>
        <label htmlFor="eventDescription">Esemény leírása</label>
        <textarea
          id="eventDescription"
          name="eventDescription"
          rows="4"
          value={formData.eventDescription}
          onChange={onChange}
          style={inputStyle(Boolean(errors.eventDescription))}
        />
        {errors.eventDescription && (
          <div style={fieldErrorStyle()}>{errors.eventDescription}</div>
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