import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getAdminScenarioDetails,
  updateAdminScenario,
} from "../services/adminService";
import { getScenarioCategories } from "../services/referenceService";
import { getSimulationUnits } from "../services/simulationService";

function AdminEditScenarioPage() {
  const navigate = useNavigate();
  const { scenarioId } = useParams();

  const [categories, setCategories] = useState([]);
  const [unitGroups, setUnitGroups] = useState({
    fire: [],
    ambulance: [],
    police: [],
  });

  const [formData, setFormData] = useState({
    title: "",
    categoryName: "",
    address: "",
    audioFileName: "",
    expectedNote: "",
  });

  const [selectedUnitIds, setSelectedUnitIds] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setIsLoading(true);
      setError("");

      try {
        const [scenarioResponse, categoryResponse, unitResponse] = await Promise.all([
          getAdminScenarioDetails(scenarioId),
          getScenarioCategories(),
          getSimulationUnits(),
        ]);

        if (!isMounted) {
          return;
        }

        setCategories(Array.isArray(categoryResponse) ? categoryResponse : []);
        setUnitGroups({
          fire: Array.isArray(unitResponse?.fire) ? unitResponse.fire : [],
          ambulance: Array.isArray(unitResponse?.ambulance) ? unitResponse.ambulance : [],
          police: Array.isArray(unitResponse?.police) ? unitResponse.police : [],
        });

        setFormData({
          title: scenarioResponse.title || "",
          categoryName: scenarioResponse.categoryName || "",
          address: scenarioResponse.address || "",
          audioFileName: scenarioResponse.audioFileName || "",
          expectedNote: scenarioResponse.expectedNote || "",
        });

        setSelectedUnitIds(
          Array.isArray(scenarioResponse.selectedUnitIds)
            ? scenarioResponse.selectedUnitIds
            : []
        );
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Nem sikerült betölteni a szituáció adatait.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [scenarioId]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setMessage("");
  };

  const handleToggleUnit = (unitId) => {
    setSelectedUnitIds((prev) => {
      if (prev.includes(unitId)) {
        return prev.filter((id) => id !== unitId);
      }

      return [...prev, unitId];
    });

    setError("");
    setMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsSubmitting(true);
    setError("");
    setMessage("");

    try {
      const response = await updateAdminScenario(scenarioId, {
        title: formData.title,
        categoryName: formData.categoryName,
        address: formData.address,
        audioFileName: formData.audioFileName,
        expectedNote: formData.expectedNote,
        selectedUnitIds,
      });

      setMessage(response.message || "A szituáció frissítése sikeres.");

      setTimeout(() => {
        navigate("/admin/scenarios");
      }, 800);
    } catch (err) {
      setError(err.message || "Nem sikerült frissíteni a szituációt.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderUnitGroup = (title, units) => (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "12px",
        padding: "14px",
        backgroundColor: "#fafafa",
      }}
    >
      <h4 style={{ marginTop: 0 }}>{title}</h4>

      <div style={{ display: "grid", gap: "10px" }}>
        {units.map((unit) => (
          <label key={unit.id} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <input
              type="checkbox"
              checked={selectedUnitIds.includes(unit.id)}
              onChange={() => handleToggleUnit(unit.id)}
            />
            <span>{unit.name}</span>
          </label>
        ))}
      </div>
    </div>
  );

  if (isLoading) {
    return <p>Betöltés...</p>;
  }

  return (
    <div>
      <h2>Szituáció szerkesztése</h2>
      <p>Itt módosíthatod a kiválasztott szituáció adatait.</p>

      {error && <p style={{ color: "crimson" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}

      <form onSubmit={handleSubmit} style={{ marginTop: "20px", display: "grid", gap: "16px" }}>
        <div>
          <label>Cím</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            style={{ width: "100%", padding: "10px", marginTop: "6px" }}
          />
        </div>

        <div>
          <label>Kategória</label>
          <select
            name="categoryName"
            value={formData.categoryName}
            onChange={handleChange}
            style={{ width: "100%", padding: "10px", marginTop: "6px" }}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Helyszín</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            style={{ width: "100%", padding: "10px", marginTop: "6px" }}
          />
        </div>

        <div>
          <label>Hangfájl neve</label>
          <input
            type="text"
            name="audioFileName"
            value={formData.audioFileName}
            onChange={handleChange}
            style={{ width: "100%", padding: "10px", marginTop: "6px" }}
          />
        </div>

        <div>
          <label>Elvárt jegyzet</label>
          <textarea
            name="expectedNote"
            value={formData.expectedNote}
            onChange={handleChange}
            rows="5"
            style={{ width: "100%", padding: "10px", marginTop: "6px" }}
          />
        </div>

        <div>
          <h3>Elvárt egységek</h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "16px",
              marginTop: "12px",
            }}
          >
            {renderUnitGroup("Tűzoltóság", unitGroups.fire)}
            {renderUnitGroup("Mentőszolgálat", unitGroups.ambulance)}
            {renderUnitGroup("Rendőrség", unitGroups.police)}
          </div>
        </div>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              padding: "12px 18px",
              border: "none",
              borderRadius: "8px",
              backgroundColor: "#1f3c88",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {isSubmitting ? "Mentés..." : "Változások mentése"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/scenarios")}
            style={{
              padding: "12px 18px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              backgroundColor: "#fff",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Mégse
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminEditScenarioPage;