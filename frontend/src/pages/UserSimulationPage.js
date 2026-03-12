import { useState } from "react";
import "../styles/auth.css";

function UserSimulationPage() {
  const [availabilityStatus, setAvailabilityStatus] = useState("NOT_READY");
  const [callState, setCallState] = useState("IDLE");
  const [formData, setFormData] = useState({
    callerName: "",
    callerPhone: "",
    location: "",
    eventDescription: "",
    note: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const handleSetAvailable = () => {
    setAvailabilityStatus("AVAILABLE");
    setCallState("WAITING");
    setMessage("");
  };

  const handleSetUnavailable = () => {
    setAvailabilityStatus("NOT_READY");
    setCallState("IDLE");
    setMessage("");
    setErrors({});
  };

  const handleMockIncomingCall = () => {
    setCallState("RINGING");
    setMessage("");
  };

  const handleAcceptCall = () => {
    setCallState("ACCEPTED");
    setMessage("");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setMessage("");
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.callerName.trim()) {
      newErrors.callerName = "A bejelentő nevének megadása kötelező.";
    }

    if (!formData.callerPhone.trim()) {
      newErrors.callerPhone = "A telefonszám megadása kötelező.";
    }

    if (!formData.location.trim()) {
      newErrors.location = "A helyszín megadása kötelező.";
    }

    if (!formData.eventDescription.trim()) {
      newErrors.eventDescription = "Az esemény leírása kötelező.";
    }

    if (!formData.note.trim()) {
      newErrors.note = "A jegyzet megadása kötelező.";
    }

    return newErrors;
  };

  const handleSubmitSimulation = (event) => {
    event.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setMessage("");
      return;
    }

    setErrors({});
    setMessage(
      "Mock beküldés sikeres. A következő lépésben itt fog megjelenni a készenléti szervek kiválasztása."
    );
  };

  return (
    <div>
      <h2>Szituáció indítása</h2>
      <p>
        Itt fog a felhasználó szabad állapotba kerülni, várni a bejövő hívásra,
        majd kitölteni a szimulációhoz tartozó adatlapot.
      </p>

      <div
        style={{
          marginTop: "24px",
          padding: "20px",
          border: "1px solid #dcdcdc",
          borderRadius: "12px",
          backgroundColor: "#ffffff",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
        }}
      >
        <h3 style={{ marginTop: 0 }}>Operátori állapot</h3>

        <p>
          <strong>Jelenlegi státusz:</strong>{" "}
          {availabilityStatus === "AVAILABLE" ? "Szabad" : "Nem szabad"}
        </p>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button
            type="button"
            className="admin-action-button"
            onClick={handleSetAvailable}
          >
            Szabad állapot
          </button>

          <button
            type="button"
            className="admin-action-button"
            onClick={handleSetUnavailable}
          >
            Nem szabad állapot
          </button>
        </div>
      </div>

      <div
        style={{
          marginTop: "20px",
          padding: "20px",
          border: "1px solid #dcdcdc",
          borderRadius: "12px",
          backgroundColor: "#ffffff",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
        }}
      >
        <h3 style={{ marginTop: 0 }}>Hívásállapot</h3>

        {callState === "IDLE" && (
          <p>A felhasználó jelenleg nem vár bejövő hívásra.</p>
        )}

        {callState === "WAITING" && (
          <>
            <p>
              A felhasználó szabad állapotban van. Itt később random idő után
              fog megérkezni a szituációhoz tartozó hívás.
            </p>

            <button
              type="button"
              className="admin-action-button"
              onClick={handleMockIncomingCall}
            >
              Mock bejövő hívás
            </button>
          </>
        )}

        {callState === "RINGING" && (
          <>
            <p>
              Bejövő hívás érkezett. Itt később csörgés és szituációindítás fog
              történni.
            </p>

            <button
              type="button"
              className="admin-action-button"
              onClick={handleAcceptCall}
            >
              Hívás fogadása
            </button>
          </>
        )}

        {callState === "ACCEPTED" && (
          <>
            <p>
              A hívás fogadva lett. Töltsd ki a szimulációhoz tartozó adatlapot.
            </p>

            <form
              className="auth-form"
              onSubmit={handleSubmitSimulation}
              style={{ marginTop: "20px" }}
            >
              <div className="auth-form-group">
                <label htmlFor="callerName">Bejelentő neve</label>
                <input
                  id="callerName"
                  name="callerName"
                  type="text"
                  placeholder="Add meg a bejelentő nevét"
                  value={formData.callerName}
                  onChange={handleChange}
                />
                {errors.callerName && (
                  <p className="auth-error">{errors.callerName}</p>
                )}
              </div>

              <div className="auth-form-group">
                <label htmlFor="callerPhone">Telefonszám</label>
                <input
                  id="callerPhone"
                  name="callerPhone"
                  type="text"
                  placeholder="Add meg a telefonszámot"
                  value={formData.callerPhone}
                  onChange={handleChange}
                />
                {errors.callerPhone && (
                  <p className="auth-error">{errors.callerPhone}</p>
                )}
              </div>

              <div className="auth-form-group">
                <label htmlFor="location">Helyszín</label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  placeholder="Add meg a helyszínt"
                  value={formData.location}
                  onChange={handleChange}
                />
                {errors.location && (
                  <p className="auth-error">{errors.location}</p>
                )}
              </div>

              <div className="auth-form-group">
                <label htmlFor="eventDescription">Esemény leírása</label>
                <input
                  id="eventDescription"
                  name="eventDescription"
                  type="text"
                  placeholder="Röviden írd le az eseményt"
                  value={formData.eventDescription}
                  onChange={handleChange}
                />
                {errors.eventDescription && (
                  <p className="auth-error">{errors.eventDescription}</p>
                )}
              </div>

              <div className="auth-form-group">
                <label htmlFor="note">Jegyzet</label>
                <textarea
                  id="note"
                  name="note"
                  rows="5"
                  placeholder="Írd le a hívás lényegét"
                  value={formData.note}
                  onChange={handleChange}
                  style={{ resize: "vertical" }}
                />
                {errors.note && <p className="auth-error">{errors.note}</p>}
              </div>

              {message && <div className="form-message">{message}</div>}

              <button type="submit" className="auth-form-button">
                Adatlap beküldése
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default UserSimulationPage;