import { useState } from "react";
import { useNavigate } from "react-router-dom";
import mockEmergencyUnits from "../utils/mockEmergencyUnits";
import { saveLatestSimulationResult } from "../utils/simulationResultStorage";
import "../styles/auth.css";
import "../styles/simulation.css";

function UserSimulationPage() {
  const navigate = useNavigate();

  const initialFormData = {
    callerName: "",
    callerPhone: "",
    location: "",
    eventDescription: "",
    note: "",
  };

  const [availabilityStatus, setAvailabilityStatus] = useState("NOT_READY");
  const [callState, setCallState] = useState("IDLE");
  const [simulationStep, setSimulationStep] = useState("FORM");
  const [formData, setFormData] = useState(initialFormData);
  const [selectedUnits, setSelectedUnits] = useState([]);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const expectedUnits = ["Heves VMKI", "OMSZ Heves", "Heves VMRFK"];

  const handleSetAvailable = () => {
    setAvailabilityStatus("AVAILABLE");
    setCallState("WAITING");
    setSimulationStep("FORM");
    setMessage("");
    setSelectedUnits([]);
    setFormData(initialFormData);
    setErrors({});
  };

  const handleSetUnavailable = () => {
    setAvailabilityStatus("NOT_READY");
    setCallState("IDLE");
    setSimulationStep("FORM");
    setMessage("");
    setErrors({});
    setSelectedUnits([]);
    setFormData(initialFormData);
  };

  const handleMockIncomingCall = () => {
    setCallState("RINGING");
    setMessage("");
  };

  const handleAcceptCall = () => {
    setCallState("ACCEPTED");
    setSimulationStep("FORM");
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
    setMessage("");
    setSimulationStep("UNITS");
  };

  const handleUnitToggle = (unitName) => {
    setSelectedUnits((prev) => {
      const alreadySelected = prev.includes(unitName);

      if (alreadySelected) {
        return prev.filter((unit) => unit !== unitName);
      }

      if (prev.length >= 3) {
        return prev;
      }

      return [...prev, unitName];
    });

    setErrors((prev) => ({
      ...prev,
      selectedUnits: "",
    }));

    setMessage("");
  };

  const handleSubmitUnits = () => {
  if (selectedUnits.length < 1) {
    setErrors((prev) => ({
      ...prev,
      selectedUnits: "Legalább egy készenléti szerv kiválasztása kötelező.",
    }));
    setMessage("");
    return;
  }

  setErrors((prev) => ({
    ...prev,
    selectedUnits: "",
  }));

  const matchedUnitsLocal = selectedUnits.filter((unit) =>
    expectedUnits.includes(unit)
  );

  const missingUnitsLocal = expectedUnits.filter(
    (unit) => !selectedUnits.includes(unit)
  );

  const incorrectUnitsLocal = selectedUnits.filter(
    (unit) => !expectedUnits.includes(unit)
  );

  const score = Math.max(
    0,
    100 - missingUnitsLocal.length * 20 - incorrectUnitsLocal.length * 15
  );

  const resultPayload = {
    id: `RESULT-${Date.now()}`,
    title: formData.eventDescription || "Mock szituáció",
    date: new Date().toLocaleString("hu-HU"),
    location: formData.location,
    callerName: formData.callerName,
    selectedUnits,
    matchedUnits: matchedUnitsLocal,
    missingUnits: missingUnitsLocal,
    incorrectUnits: incorrectUnitsLocal,
    score,
    status: score >= 80 ? "Sikeres" : score >= 50 ? "Részben sikeres" : "Sikertelen",
  };

  saveLatestSimulationResult(resultPayload);

  setMessage("");
  setSimulationStep("EVALUATION");
};

  const handleRestartSimulation = () => {
    setAvailabilityStatus("NOT_READY");
    setCallState("IDLE");
    setSimulationStep("FORM");
    setFormData(initialFormData);
    setSelectedUnits([]);
    setErrors({});
    setMessage("");
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard/user");
  };

  const availabilityLabel =
    availabilityStatus === "AVAILABLE" ? "Szabad" : "Nem szabad";

  const callStateLabelMap = {
    IDLE: "Nincs aktív várakozás",
    WAITING: "Várakozás bejövő hívásra",
    RINGING: "Bejövő hívás",
    ACCEPTED: "Hívás fogadva",
  };

  const matchedUnits = selectedUnits.filter((unit) => expectedUnits.includes(unit));
  const missingUnits = expectedUnits.filter((unit) => !selectedUnits.includes(unit));
  const incorrectUnits = selectedUnits.filter((unit) => !expectedUnits.includes(unit));

  const renderUnitColumn = (title, units, className) => (
    <div className={`simulation-unit-column ${className}`}>
      <h4>{title}</h4>

      <div className="simulation-unit-list">
        {units.map((unit) => (
          <label key={unit} className="simulation-unit-item">
            <input
              type="checkbox"
              checked={selectedUnits.includes(unit)}
              onChange={() => handleUnitToggle(unit)}
            />
            <span>{unit}</span>
          </label>
        ))}
      </div>
    </div>
  );

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
                  A hívás fogadva lett. Töltsd ki a híváskezelési adatlapot, majd
                  válaszd ki a szükséges készenléti szerveket.
                </p>
              )}
            </div>
          </div>

          <div className="simulation-panel">
            <h3>
              {simulationStep === "FORM" && "Bejelentési adatlap"}
              {simulationStep === "UNITS" && "Készenléti szervek kiválasztása"}
              {simulationStep === "EVALUATION" && "Kiértékelés"}
            </h3>

            {callState !== "ACCEPTED" ? (
              <p className="simulation-note">
                Az adatlap a hívás fogadása után válik aktívvá.
              </p>
            ) : simulationStep === "FORM" ? (
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

                <button type="submit" className="auth-form-button">
                  Adatlap beküldése
                </button>
              </form>
            ) : simulationStep === "UNITS" ? (
              <>
                <p className="simulation-note">
                  Válaszd ki a szükséges készenléti szerveket. Összesen legfeljebb
                  három egység jelölhető ki.
                </p>

                <div className="simulation-unit-columns">
                  {renderUnitColumn("Tűzoltóság", mockEmergencyUnits.fire, "fire")}
                  {renderUnitColumn(
                    "Mentőszolgálat",
                    mockEmergencyUnits.ambulance,
                    "ambulance"
                  )}
                  {renderUnitColumn("Rendőrség", mockEmergencyUnits.police, "police")}
                </div>

                {errors.selectedUnits && (
                  <p className="auth-error" style={{ marginTop: "12px" }}>
                    {errors.selectedUnits}
                  </p>
                )}

                <div className="simulation-submit-box">
                  <button
                    type="button"
                    className="auth-form-button"
                    onClick={handleSubmitUnits}
                  >
                    Készenléti szervek beküldése
                  </button>
                </div>
              </>
            ) : (
              <div className="simulation-evaluation-box">
                <div className="simulation-evaluation-section">
                  <h4>Mi sikerült jól</h4>
                  <ul className="simulation-evaluation-list success">
                    <li>A híváskezelési folyamat végig lett vezetve.</li>
                    <li>A kötelező mezők kitöltése megtörtént.</li>
                    <li>
                      Helyesen kijelölt egységek:{" "}
                      {matchedUnits.length > 0 ? matchedUnits.join(", ") : "nincs egyezés"}
                    </li>
                  </ul>
                </div>

                <div className="simulation-evaluation-section">
                  <h4>Mi hibás vagy hiányos</h4>
                  <ul className="simulation-evaluation-list error">
                    <li>
                      Hiányzó elvárt egységek:{" "}
                      {missingUnits.length > 0 ? missingUnits.join(", ") : "nincs hiányzó egység"}
                    </li>
                    <li>
                      Nem elvárt kijelölt egységek:{" "}
                      {incorrectUnits.length > 0
                        ? incorrectUnits.join(", ")
                        : "nincs hibás kijelölés"}
                    </li>
                    <li>
                      A jegyzet tartalmi ellenőrzése később AI támogatással fog történni.
                    </li>
                  </ul>
                </div>

                <div className="simulation-evaluation-section">
                  <h4>Összegzés</h4>
                  <p className="simulation-note">
                    Mock kiértékelés elkészült. A végleges rendszerben itt fog
                    megjelenni a részletes visszajelzés és a tárolt eredmény.
                  </p>
                </div>

                <div className="simulation-finish-actions">
                  <button
                    type="button"
                    className="auth-form-button"
                    onClick={handleRestartSimulation}
                  >
                    Új szimuláció indítása
                  </button>

                  <button
                    type="button"
                    className="admin-action-button"
                    onClick={handleBackToDashboard}
                  >
                    Vissza az irányítópultra
                  </button>
                </div>
              </div>
            )}

            {message && <div className="form-message">{message}</div>}
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
                <p className="simulation-info-label">Lépés</p>
                <p className="simulation-info-value">
                  {simulationStep === "FORM" && "Adatlap"}
                  {simulationStep === "UNITS" && "Egységkijelölés"}
                  {simulationStep === "EVALUATION" && "Kiértékelés"}
                </p>
              </div>
            </div>
          </div>

          <div className="simulation-panel">
            <h3>Helyszín és térkép</h3>

            <div className="simulation-map-card">
              <div className="simulation-map-meta">
                <p>
                  <strong>Megadott helyszín:</strong>{" "}
                  {formData.location.trim() ? formData.location : "Még nincs megadva"}
                </p>

                <p>
                  <strong>Térképi állapot:</strong> A tényleges térképintegráció későbbi
                  lépésben kerül ide, a jobb alsó panelbe.
                </p>
              </div>

              <div className="simulation-map-placeholder">
                {formData.location.trim()
                  ? `Térkép helye – a megadott címhez tartozó nézet később itt fog megjelenni:
${formData.location}`
                  : "Térkép helye – a helyszín megadása után itt fog megjelenni a címhez tartozó térképi nézet."}
              </div>

              <div className="simulation-highlight">
                <p>
                  <strong>Kiválasztott egységek:</strong>{" "}
                  {selectedUnits.length > 0 ? selectedUnits.join(", ") : "Még nincs kijelölés"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserSimulationPage;