import { useState } from "react";
import mockEmergencyUnits from "../utils/mockEmergencyUnits";
import "../styles/auth.css";

function AdminCreateScenarioPage() {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    audioFileName: "",
    address: "",
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "A szituáció címének megadása kötelező.";
    }

    if (!formData.category.trim()) {
      newErrors.category = "A kategória megadása kötelező.";
    }

    if (!formData.audioFileName.trim()) {
      newErrors.audioFileName = "A hanganyag nevének megadása kötelező.";
    }

    if (!formData.address.trim()) {
      newErrors.address = "A helyszín megadása kötelező.";
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

    setErrors({});
    setMessage(
      `Mock mentés sikeres: "${formData.title}" szituáció rögzítése előkészítve.`
    );
  };

  return (
    <div>
      <h2>Új szituáció létrehozása</h2>
      <p>
        Itt adhatja meg az admin a szituáció alapadatait, az elvárt jegyzetet és
        a kiválasztandó készenléti szerveket.
      </p>

      <form className="auth-form" onSubmit={handleSubmit} style={{ marginTop: "24px" }}>
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
          <input
            id="category"
            name="category"
            type="text"
            placeholder="Például: Tűzeset"
            value={formData.category}
            onChange={handleChange}
          />
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
          <label htmlFor="address">Helyszín / geokódolt cím</label>
          <input
            id="address"
            name="address"
            type="text"
            placeholder="Például: 3300 Eger, Kossuth Lajos utca 12."
            value={formData.address}
            onChange={handleChange}
          />
          {errors.address && <p className="auth-error">{errors.address}</p>}
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
              padding: "10px 12px",
              border: "1px solid #cfcfcf",
              borderRadius: "8px",
              fontSize: "14px",
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
            Minimum 1, maximum 3 egység választható ki.
          </p>

          <div className="checkbox-list">
            {mockEmergencyUnits.map((unit) => (
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

          {errors.selectedUnits && (
            <p className="auth-error" style={{ marginTop: "10px" }}>
              {errors.selectedUnits}
            </p>
          )}
        </div>

        {message && <div className="form-message">{message}</div>}

        <button type="submit" className="auth-form-button">
          Szituáció mentése
        </button>
      </form>
    </div>
  );
}

export default AdminCreateScenarioPage;