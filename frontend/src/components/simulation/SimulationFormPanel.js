function SimulationFormPanel({
  formData,
  errors,
  onChange,
  onSubmit,
}) {
  return (
    <form className="simulation-form-grid" onSubmit={onSubmit}>
      <div className="auth-form-group">
        <label htmlFor="callerName">Bejelentő neve</label>
        <input
          id="callerName"
          name="callerName"
          type="text"
          placeholder="Add meg a bejelentő nevét"
          value={formData.callerName}
          onChange={onChange}
        />
        {errors.callerName && <p className="auth-error">{errors.callerName}</p>}
      </div>

      <div className="auth-form-group">
        <label htmlFor="callerPhone">Telefonszám</label>
        <input
          id="callerPhone"
          name="callerPhone"
          type="text"
          placeholder="Add meg a telefonszámot"
          value={formData.callerPhone}
          onChange={onChange}
        />
        {errors.callerPhone && <p className="auth-error">{errors.callerPhone}</p>}
      </div>

      <div className="auth-form-group">
        <label htmlFor="location">Helyszín</label>
        <input
          id="location"
          name="location"
          type="text"
          placeholder="Add meg a helyszínt"
          value={formData.location}
          onChange={onChange}
        />
        {errors.location && <p className="auth-error">{errors.location}</p>}
      </div>

      <div className="auth-form-group">
        <label htmlFor="eventDescription">Esemény leírása</label>
        <input
          id="eventDescription"
          name="eventDescription"
          type="text"
          placeholder="Röviden írd le az eseményt"
          value={formData.eventDescription}
          onChange={onChange}
        />
        {errors.eventDescription && (
          <p className="auth-error">{errors.eventDescription}</p>
        )}
      </div>

      <div className="auth-form-group full-width">
        <label htmlFor="note">Jegyzet</label>
        <textarea
          id="note"
          name="note"
          rows="5"
          placeholder="Írd le a hívás lényegét"
          value={formData.note}
          onChange={onChange}
          style={{ resize: "vertical" }}
        />
        {errors.note && <p className="auth-error">{errors.note}</p>}
      </div>

      <div className="simulation-submit-row full-width">
        <button type="submit" className="auth-form-button">
          Adatlap beküldése
        </button>
      </div>
    </form>
  );
}

export default SimulationFormPanel;