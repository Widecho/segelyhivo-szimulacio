import { useState } from "react";
import mockEmergencyUnits from "../utils/mockEmergencyUnits";
import mockScenarioCategories from "../utils/mockScenarioCategories";
import { saveCustomScenario } from "../utils/scenarioStorage";
import "../styles/auth.css";

function generateScenarioCode() {
  const now = new Date();

  const year = now.getFullYear().toString();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  const datePart = `${year}${month}${day}`;

  let randomPart = "";
  for (let i = 0; i < 10; i += 1) {
    randomPart += Math.floor(Math.random() * 10);
  }

  return `112${datePart}${randomPart}`;
}

function AdminCreateScenarioPage() {
  const [formData, setFormData] = useState({
    scenarioCode: generateScenarioCode(),
    title: "",
    category: "",
    audioFileName: "",
    geoAddress: "",
    latitude: "",
    longitude: "",
    expectedNote: "",
    selectedUnits: [],
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

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

  const handleUnitToggle = (unitName) => {
    setFormData((prev) => {
      const isAlreadySelected = prev.selectedUnits.includes(unitName);

      let updatedUnits;

      if (isAlreadySelected) {
        updatedUnits = prev.selectedUnits.filter((unit) => unit !== unitName);
      } else {
        if (prev.selectedUnits.length >= 3) {
          return prev;
        }

        updatedUnits = [...prev.selectedUnits, unitName];
      }

      return {
        ...prev,
        selectedUnits: updatedUnits,
      };
    });

    setErrors((prev) => ({
      ...prev,
      selectedUnits: "",
    }));

    setMessage("");
  };

  const validateCoordinate = (value) => {
    if (!value.trim()) {
      return false;
    }

    return !Number.isNaN(Number(value));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "A szituáció címének megadása kötelező.";
    }

    if (!formData.category.trim()) {
      newErrors.category = "A kategória kiválasztása kötelező.";
    }

    if (!formData.audioFileName.trim()) {
      newErrors.audioFileName = "A hanganyag nevének megadása kötelező.";
    }

    if (!formData.geoAddress.trim()) {
      newErrors.geoAddress = "A geokódolt cím megadása kötelező.";
    }

    if (!validateCoordinate(formData.latitude)) {
      newErrors.latitude = "A szélességi fokot számszerűen kell megadni.";
    }

    if (!validateCoordinate(formData.longitude)) {
      newErrors.longitude = "A hosszúsági fokot számszerűen kell megadni.";
    }

    if (!formData.expectedNote.trim()) {
      newErrors.expectedNote = "Az elvárt jegyzet megadása kötelező.";
    }

    if (formData.selectedUnits.length < 1) {
      newErrors.selectedUnits =
        "Legalább egy készenléti szerv kiválasztása kötelező.";
    }

    if (formData.selectedUnits.length > 3) {
      newErrors.selectedUnits =
        "Maximum három készenléti szerv választható ki.";
    }

    return newErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setMessage("");
      return;
    }

    const scenarioPayload = {
      id: formData.scenarioCode,
      title: formData.title,
      audioFileName: formData.audioFileName,
      address: formData.geoAddress,
      expectedNote: formData.expectedNote,
      requiredUnits: formData.selectedUnits,
      category: formData.category,
      latitude: formData.latitude,
      longitude: formData.longitude,
      createdAt: new Date().toLocaleString("hu-HU"),
    };

    saveCustomScenario(scenarioPayload);

    setErrors({});
    setMessage(
      `Mock mentés sikeres: "${formData.title}" szituáció rögzítve. Azonosító: ${formData.scenarioCode}`
    );

    setFormData({
      scenarioCode: generateScenarioCode(),
      title: "",
      category: "",
      audioFileName: "",
      geoAddress: "",
      latitude: "",
      longitude: "",
      expectedNote: "",
      selectedUnits: [],
    });
  };

  const renderUnitGroup = (groupTitle, units) => (
    <div className="form-section">
      <h3>{groupTitle}</h3>

      <div className="checkbox-list">
        {units.map((unit) => (
          <label key={unit} className="checkbox-item">
            <input
              type="checkbox"
              checked={formData.selectedUnits.includes(unit)}
              onChange={() => handleUnitToggle(unit)}
            />
            <span>{unit}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <h2>Új szituáció létrehozása</h2>
      <p>
        Itt adhatja meg az admin a szituáció alapadatait, az elvárt jegyzetet,
        a helyszín adatait és a kiválasztandó készenléti szerveket.
      </p>

      <form
        className="auth-form"
        onSubmit={handleSubmit}
        style={{ marginTop: "24px" }}
      >
        <div className="auth-form-group">
          <label htmlFor="scenarioCode">Generált szituációazonosító</label>
          <input
            id="scenarioCode"
            name="scenarioCode"
            type="text"
            value={formData.scenarioCode}
            readOnly
          />
        </div>

        <div className="auth-form-group">
          <label htmlFor="title">Szituáció címe</label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="Például: Családi ház tűzeset"
            value={formData.title}
            onChange={handleChange}
          />
          {errors.title && <p className="auth-error">{errors.title}</p>}
        </div>

        <div className="auth-form-group">
          <label htmlFor="category">Kategória</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="">Válassz kategóriát</option>
            {mockScenarioCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && <p className="auth-error">{errors.category}</p>}
        </div>

        <div className="auth-form-group">
          <label htmlFor="audioFileName">Hanganyag neve</label>
          <input
            id="audioFileName"
            name="audioFileName"
            type="text"
            placeholder="Például: tuzeset_01.mp3"
            value={formData.audioFileName}
            onChange={handleChange}
          />
          {errors.audioFileName && (
            <p className="auth-error">{errors.audioFileName}</p>
          )}
        </div>

        <div className="auth-form-group">
          <label htmlFor="geoAddress">Geokódolt cím</label>
          <input
            id="geoAddress"
            name="geoAddress"
            type="text"
            placeholder="Például: 3300 Eger, Kossuth Lajos utca 12."
            value={formData.geoAddress}
            onChange={handleChange}
          />
          {errors.geoAddress && (
            <p className="auth-error">{errors.geoAddress}</p>
          )}
        </div>

        <div className="auth-form-group">
          <label htmlFor="latitude">Szélességi fok</label>
          <input
            id="latitude"
            name="latitude"
            type="text"
            placeholder="Például: 47.902300"
            value={formData.latitude}
            onChange={handleChange}
          />
          {errors.latitude && <p className="auth-error">{errors.latitude}</p>}
        </div>

        <div className="auth-form-group">
          <label htmlFor="longitude">Hosszúsági fok</label>
          <input
            id="longitude"
            name="longitude"
            type="text"
            placeholder="Például: 20.377200"
            value={formData.longitude}
            onChange={handleChange}
          />
          {errors.longitude && <p className="auth-error">{errors.longitude}</p>}
        </div>

        <div className="auth-form-group">
          <label htmlFor="expectedNote">Elvárt jegyzet</label>
          <textarea
            id="expectedNote"
            name="expectedNote"
            rows="5"
            placeholder="Írd le röviden az elvárt jegyzet lényegét..."
            value={formData.expectedNote}
            onChange={handleChange}
            style={{
              resize: "vertical",
            }}
          />
          {errors.expectedNote && (
            <p className="auth-error">{errors.expectedNote}</p>
          )}
        </div>

        <div className="form-section">
          <h3>Kiválasztandó készenléti szervek</h3>
          <p className="auth-helper-text">
            Minimum 1, maximum 3 egység választható ki összesen.
          </p>
        </div>

        {renderUnitGroup("Tűzoltóság", mockEmergencyUnits.fire)}
        {renderUnitGroup("Mentőszolgálat", mockEmergencyUnits.ambulance)}
        {renderUnitGroup("Rendőrség", mockEmergencyUnits.police)}

        {errors.selectedUnits && (
          <p className="auth-error" style={{ marginTop: "10px" }}>
            {errors.selectedUnits}
          </p>
        )}

        {message && <div className="form-message">{message}</div>}

        <button type="submit" className="auth-form-button">
          Szituáció mentése
        </button>
      </form>
    </div>
  );
}

export default AdminCreateScenarioPage;