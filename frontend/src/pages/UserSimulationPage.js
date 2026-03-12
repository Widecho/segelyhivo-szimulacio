import { useState } from "react";
import "../styles/auth.css";
import "../styles/simulation.css";

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

  const availabilityLabel =
    availabilityStatus === "AVAILABLE" ? "Szabad" : "Nem szabad";

  const callStateLabelMap = {
    IDLE: "Nincs aktív várakozás",
    WAITING: "Várakozás bejövő hívásra",
    RINGING: "Bejövő hívás",
    ACCEPTED: "Hívás fogadva",
  };

  return (
    <div className="simulation-page">
      <div className="simulation-topbar">
        <div>
          <h2 className="simulation-topbar-title">112 Operátori felület</h2>
          <p className="simulation-topbar-subtitle">
            Szimulációs híváskezelés és adatlapkitöltés
          </p>
        </div>

        <div
          className={`simulation-status-badge ${
            availabilityStatus === "AVAILABLE" ? "available" : "busy"
          }`}
        >
          Operátori státusz: {availabilityLabel}
        </div>
      </div>

      <div className="simulation-layout">
        <div>
          <div className="simulation-panel">
            <h3>Híváskezelés</h3>

            <div className="simulation-action-row" style={{ marginBottom: "16px" }}>
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

            <div
              className={`simulation-call-box ${
                callState === "RINGING"
                  ? "ringing"
                  : callState === "ACCEPTED"
                  ? "accepted"
                  : ""
              }`}
            >
              {callState === "IDLE" && (
                <p className="simulation-note">
                  A felhasználó jelenleg nem vár bejövő hívásra.
                </p>
              )}

              {callState === "WAITING" && (
                <>
                  <p className="simulation-note">
                    A felhasználó szabad állapotban van. Itt később random idő után
                    fog megérkezni a szituációhoz tartozó hívás.
                  </p>

                  <div style={{ marginTop: "14px" }}>
                    <button
                      type="button"
                      className="admin-action-button"
                      onClick={handleMockIncomingCall}
                    >
                      Mock bejövő hívás
                    </button>
                  </div>
                </>
              )}

              {callState === "RINGING" && (
                <>
                  <p className="simulation-note">
                    Bejövő hívás érkezett. Itt később csörgés, hanganyag és
                    időzített szituációindítás fog történni.
                  </p>

                  <div style={{ marginTop: "14px" }}>
                    <button
                      type="button"
                      className="admin-action-button"
                      onClick={handleAcceptCall}
                    >
                      Hívás fogadása
                    </button>
                  </div>
                </>
              )}

              {callState === "ACCEPTED" && (
                <p className="simulation-note">
                  A hívás fogadva lett. Töltsd ki a híváskezelési adatlapot az
                  alábbi mezők segítségével.
                </p>
              )}
            </div>
          </div>

          <div className="simulation-panel">
            <h3>Bejelentési adatlap</h3>

            {callState !== "ACCEPTED" ? (
              <p className="simulation-note">
                Az adatlap a hívás fogadása után válik aktívvá.
              </p>
            ) : (
              <form className="auth-form" onSubmit={handleSubmitSimulation}>
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
                    rows="6"
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
            )}
          </div>
        </div>

        <div className="simulation-side-stack">
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
                <p className="simulation-info-label">Forrás</p>
                <p className="simulation-info-value">Mock szituáció</p>
              </div>

              <div className="simulation-info-card">
                <p className="simulation-info-label">Mód</p>
                <p className="simulation-info-value">Gyakorlás</p>
              </div>
            </div>
          </div>

          <div className="simulation-panel">
            <h3>Operátori információk</h3>
            <p className="simulation-note">
              A végleges felületen itt jelenhet meg például a hívás időtartama,
              a generált esetszám, a hanganyag állapota és a kapcsolódó
              kiegészítő információk.
            </p>

            <hr className="simulation-divider" />

            <div className="simulation-highlight">
              <p>
                <strong>Következő lépés:</strong> az adatlap sikeres beküldése után
                a készenléti szervek kiválasztása fog következni.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserSimulationPage;