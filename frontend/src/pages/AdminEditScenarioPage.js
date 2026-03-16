import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap, useMapEvents } from "react-leaflet";
import {
  getAdminScenarioDetails,
  getAdminUnits,
  updateAdminScenario,
} from "../services/adminService";
import { getScenarioCategories } from "../services/referenceService";
import {
  parseCoordinateInput,
  reverseGeocode,
  searchLocations,
} from "../services/geocodingService";

function FlyToLocation({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo([position.lat, position.lon], 16, {
        animate: true,
        duration: 0.8,
      });
    }
  }, [map, position]);

  return null;
}

function RightClickHandler({ onMapRightClick }) {
  useMapEvents({
    contextmenu(event) {
      onMapRightClick(event.latlng);
    },
  });

  return null;
}

function formatCoordinates(lat, lon) {
  return `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
}

function shortenText(text, maxLength = 72) {
  if (!text) {
    return "";
  }

  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength - 3)}...`;
}

function inputStyle(hasError) {
  return {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "8px",
    border: hasError ? "1px solid crimson" : "1px solid #d0d5dd",
    boxSizing: "border-box",
    backgroundColor: "#fff",
  };
}

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

function sectionStyle() {
  return {
    border: "1px solid #d9d9d9",
    borderRadius: "12px",
    padding: "16px",
    backgroundColor: "#fff",
  };
}

function groupCardStyle(borderColor, backgroundColor) {
  return {
    border: `1px solid ${borderColor}`,
    borderRadius: "12px",
    backgroundColor,
    padding: "14px",
    minWidth: 0,
  };
}

function unitItemStyle() {
  return {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "7px 9px",
    borderRadius: "8px",
    border: "1px solid #e4e7ec",
    backgroundColor: "#fff",
    fontSize: "14px",
  };
}

function renderUnitGroup(title, units, selectedUnitIds, onToggleUnit, borderColor, backgroundColor) {
  return (
    <div style={groupCardStyle(borderColor, backgroundColor)}>
      <h4 style={{ marginTop: 0, marginBottom: "10px" }}>{title}</h4>

      <div style={{ display: "grid", gap: "8px", maxHeight: "260px", overflowY: "auto" }}>
        {units.map((unit) => (
          <label key={unit.id} style={unitItemStyle()}>
            <input
              type="checkbox"
              checked={selectedUnitIds.includes(unit.id)}
              onChange={() => onToggleUnit(unit.id)}
            />
            <span>{unit.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function AdminEditScenarioPage() {
  const navigate = useNavigate();
  const { scenarioId } = useParams();

  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState({ fire: [], ambulance: [], police: [] });
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    categoryName: "",
    address: "",
    audioFileName: "",
    expectedNote: "",
    selectedUnitIds: [],
    latitude: "",
    longitude: "",
  });

  const [locationSearchText, setLocationSearchText] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [coordinateInput, setCoordinateInput] = useState("");
  const [selectedCoordinates, setSelectedCoordinates] = useState(null);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);

      try {
        const [categoriesResponse, unitsResponse, scenarioResponse] = await Promise.all([
          getScenarioCategories(),
          getAdminUnits(),
          getAdminScenarioDetails(scenarioId),
        ]);

        setCategories(Array.isArray(categoriesResponse) ? categoriesResponse : []);
        setUnits({
          fire: Array.isArray(unitsResponse?.fire) ? unitsResponse.fire : [],
          ambulance: Array.isArray(unitsResponse?.ambulance) ? unitsResponse.ambulance : [],
          police: Array.isArray(unitsResponse?.police) ? unitsResponse.police : [],
        });

        const latitude = scenarioResponse.latitude != null ? Number(scenarioResponse.latitude) : "";
        const longitude = scenarioResponse.longitude != null ? Number(scenarioResponse.longitude) : "";

        setFormData({
          title: scenarioResponse.title || "",
          categoryName: scenarioResponse.categoryName || "",
          address: scenarioResponse.address || "",
          audioFileName: scenarioResponse.audioFileName || "",
          expectedNote: scenarioResponse.expectedNote || "",
          selectedUnitIds: Array.isArray(scenarioResponse.selectedUnitIds)
            ? scenarioResponse.selectedUnitIds
            : [],
          latitude: latitude === "" ? "" : String(latitude),
          longitude: longitude === "" ? "" : String(longitude),
        });

        setLocationSearchText(scenarioResponse.address || "");

        if (latitude !== "" && longitude !== "") {
          setCoordinateInput(formatCoordinates(latitude, longitude));
          setSelectedCoordinates({ lat: latitude, lon: longitude });
        }
      } catch (err) {
        setMessage(err.message || "Nem sikerült betölteni a szituáció adatait.");
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [scenarioId]);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const trimmed = locationSearchText.trim();

    if (!trimmed) {
      setLocationSuggestions([]);
      setIsSearchingLocation(false);
      return;
    }

    if (selectedCoordinates && formData.address && trimmed === formData.address.trim()) {
      setLocationSuggestions([]);
      setIsSearchingLocation(false);
      return;
    }

    const parsedCoordinates = parseCoordinateInput(trimmed);

    if (parsedCoordinates) {
      setLocationSuggestions([]);
      setIsSearchingLocation(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsSearchingLocation(true);

      try {
        const results = await searchLocations(trimmed);

        setLocationSuggestions(
          results.map((item) => ({
            ...item,
            shortDisplayName: shortenText(
              item.formattedAddress || item.displayName,
              72
            ),
          }))
        );
      } catch (err) {
        setLocationSuggestions([]);
      } finally {
        setIsSearchingLocation(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [locationSearchText, formData.address, selectedCoordinates, isLoading]);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const trimmed = coordinateInput.trim();

    if (!trimmed) {
      return;
    }

    const parsed = parseCoordinateInput(trimmed);

    if (!parsed) {
      return;
    }

    if (
      selectedCoordinates &&
      Math.abs(selectedCoordinates.lat - parsed.lat) < 0.000001 &&
      Math.abs(selectedCoordinates.lon - parsed.lon) < 0.000001
    ) {
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        const reversed = await reverseGeocode(parsed.lat, parsed.lon);
        applyChosenLocation(reversed);
      } catch (err) {
        setMessage(err.message || "Nem sikerült a koordináták alapján címet találni.");
      }
    }, 450);

    return () => clearTimeout(timeoutId);
  }, [coordinateInput, selectedCoordinates, isLoading]);

  function applyChosenLocation(locationItem) {
    const formattedAddress =
      locationItem.formattedAddress || locationItem.displayName || "";

    setFormData((prev) => ({
      ...prev,
      address: formattedAddress,
      latitude: String(locationItem.lat),
      longitude: String(locationItem.lon),
    }));

    setSelectedCoordinates({
      lat: locationItem.lat,
      lon: locationItem.lon,
    });

    setLocationSearchText(formattedAddress);
    setCoordinateInput(formatCoordinates(locationItem.lat, locationItem.lon));
    setLocationSuggestions([]);
    setErrors((prev) => ({
      ...prev,
      address: "",
      latitude: "",
      longitude: "",
    }));
    setMessage("");
  }

  function handleChange(event) {
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
  }

  function handleLocationSearchChange(value) {
    setLocationSearchText(value);

    if (!value.trim()) {
      setFormData((prev) => ({
        ...prev,
        address: "",
        latitude: "",
        longitude: "",
      }));
      setSelectedCoordinates(null);
      setCoordinateInput("");
      setLocationSuggestions([]);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      address: "",
      latitude: "",
      longitude: "",
    }));
    setSelectedCoordinates(null);
    setMessage("");
  }

  function handleCoordinateInputChange(value) {
    setCoordinateInput(value);

    if (!value.trim()) {
      setSelectedCoordinates(null);
      setFormData((prev) => ({
        ...prev,
        address: "",
        latitude: "",
        longitude: "",
      }));
    }

    setMessage("");
  }

  function handleSelectLocationSuggestion(item) {
    applyChosenLocation(item);
  }

  async function handleMapRightClick(latlng) {
    try {
      const reversed = await reverseGeocode(latlng.lat, latlng.lng);
      applyChosenLocation(reversed);
      setMessage("A cím áthelyezése sikeres volt.");
    } catch (err) {
      setMessage(err.message || "Nem sikerült a cím áthelyezése.");
    }
  }

  function handleToggleUnit(unitId) {
    setFormData((prev) => {
      const alreadySelected = prev.selectedUnitIds.includes(unitId);

      return {
        ...prev,
        selectedUnitIds: alreadySelected
          ? prev.selectedUnitIds.filter((id) => id !== unitId)
          : [...prev.selectedUnitIds, unitId],
      };
    });

    setErrors((prev) => ({
      ...prev,
      selectedUnitIds: "",
    }));
  }

  function validateForm() {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "A cím megadása kötelező.";
    }

    if (!formData.categoryName.trim()) {
      newErrors.categoryName = "A kategória kiválasztása kötelező.";
    }

    if (!formData.address.trim()) {
      newErrors.address = "A helyszín kiválasztása kötelező.";
    }

    if (!formData.latitude || !formData.longitude || !selectedCoordinates) {
      newErrors.address = "Érvényes helyszín és koordináta kiválasztása kötelező.";
    }

    if (!formData.audioFileName.trim()) {
      newErrors.audioFileName = "A hangfájl neve kötelező.";
    }

    if (!formData.expectedNote.trim()) {
      newErrors.expectedNote = "Az elvárt jegyzet megadása kötelező.";
    }

    if (formData.selectedUnitIds.length < 1) {
      newErrors.selectedUnitIds = "Legalább egy egységet ki kell választani.";
    }

    return newErrors;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await updateAdminScenario(scenarioId, {
        ...formData,
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
      });

      navigate("/admin/scenarios", {
        state: {
          successMessage: response.message || "A szituáció sikeresen frissítve lett.",
        },
      });
    } catch (err) {
      setMessage(err.message || "Nem sikerült frissíteni a szituációt.");
    }
  }

  const defaultCenter = { lat: 47.1625, lon: 19.5033 };
  const currentCenter = selectedCoordinates || defaultCenter;

  if (isLoading) {
    return <p>Betöltés...</p>;
  }

  return (
    <div style={{ display: "grid", gap: "16px" }}>
      <div>
        <h2>Szituáció szerkesztése</h2>
        <p>Itt módosíthatod a kiválasztott szituáció adatait.</p>
      </div>

      {message && (
        <div style={{ color: message.includes("sikeres") ? "green" : "#b42318" }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "16px" }}>
        <div style={sectionStyle()}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label htmlFor="title">Cím</label>
              <input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                style={inputStyle(Boolean(errors.title))}
              />
              {errors.title && <div style={fieldErrorStyle()}>{errors.title}</div>}
            </div>

            <div>
              <label htmlFor="categoryName">Kategória</label>
              <select
                id="categoryName"
                name="categoryName"
                value={formData.categoryName}
                onChange={handleChange}
                style={inputStyle(Boolean(errors.categoryName))}
              >
                <option value="">Válassz kategóriát</option>
                {categories.map((category) => (
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
              marginTop: "12px",
              display: "grid",
              gridTemplateColumns: "1.4fr 1fr",
              gap: "12px",
              alignItems: "start",
            }}
          >
            <div style={{ position: "relative" }}>
              <label htmlFor="locationSearch">Helyszín</label>
              <input
                id="locationSearch"
                value={locationSearchText}
                onChange={(event) => handleLocationSearchChange(event.target.value)}
                placeholder="Kezdj el címet írni..."
                autoComplete="off"
                style={inputStyle(Boolean(errors.address))}
              />

              <div style={helperStyle()}>
                OpenStreetMap alapú találatlistából válassz helyszínt.
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
                      style={{
                        padding: "10px 12px",
                        borderBottom: "1px solid #eaecf0",
                        cursor: "pointer",
                        backgroundColor: "#fff",
                      }}
                      onMouseDown={() => handleSelectLocationSuggestion(item)}
                    >
                      <div style={{ fontWeight: 600 }}>{item.shortDisplayName}</div>
                      <div style={{ fontSize: "12px", color: "#667085", marginTop: "2px" }}>
                        {item.displayName}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {errors.address && <div style={fieldErrorStyle()}>{errors.address}</div>}
            </div>

            <div>
              <label htmlFor="coordinateInput">Koordináták</label>
              <input
                id="coordinateInput"
                value={coordinateInput}
                onChange={(event) => handleCoordinateInputChange(event.target.value)}
                placeholder="Pl.: 47.902300, 20.377200"
                autoComplete="off"
                style={inputStyle(Boolean(errors.address))}
              />
              <div style={helperStyle()}>
                Ide közvetlenül koordináta is írható.
              </div>
            </div>
          </div>

          <div style={{ marginTop: "12px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label htmlFor="audioFileName">Hangfájl neve</label>
              <input
                id="audioFileName"
                name="audioFileName"
                value={formData.audioFileName}
                onChange={handleChange}
                style={inputStyle(Boolean(errors.audioFileName))}
              />
              {errors.audioFileName && (
                <div style={fieldErrorStyle()}>{errors.audioFileName}</div>
              )}
            </div>

            <div>
              <label>Mentett koordináták</label>
              <input
                value={
                  selectedCoordinates
                    ? `${selectedCoordinates.lat.toFixed(6)}, ${selectedCoordinates.lon.toFixed(6)}`
                    : ""
                }
                readOnly
                style={{
                  ...inputStyle(false),
                  backgroundColor: "#f8fafc",
                }}
              />
            </div>
          </div>

          <div style={{ marginTop: "12px" }}>
            <label htmlFor="expectedNote">Elvárt jegyzet</label>
            <textarea
              id="expectedNote"
              name="expectedNote"
              value={formData.expectedNote}
              onChange={handleChange}
              rows="5"
              style={{
                ...inputStyle(Boolean(errors.expectedNote)),
                resize: "vertical",
              }}
            />
            {errors.expectedNote && (
              <div style={fieldErrorStyle()}>{errors.expectedNote}</div>
            )}
          </div>
        </div>

        <div style={sectionStyle()}>
          <h3 style={{ marginTop: 0 }}>Térkép</h3>
          <div
            style={{
              borderRadius: "12px",
              overflow: "hidden",
              border: "1px solid #d9d9d9",
            }}
          >
            <MapContainer
              center={[currentCenter.lat, currentCenter.lon]}
              zoom={7}
              style={{ height: "320px", width: "100%" }}
            >
              <TileLayer
                attribution="&copy; OpenStreetMap közreműködők"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <FlyToLocation position={selectedCoordinates} />
              <RightClickHandler onMapRightClick={handleMapRightClick} />

              {selectedCoordinates && (
                <CircleMarker
                  center={[selectedCoordinates.lat, selectedCoordinates.lon]}
                  radius={9}
                  pathOptions={{
                    color: "#1f3c88",
                    fillColor: "#1f3c88",
                    fillOpacity: 0.7,
                  }}
                >
                  <Popup>
                    <div>
                      <strong>Kiválasztott helyszín</strong>
                      <br />
                      {formData.address || "Nincs cím"}
                    </div>
                  </Popup>
                </CircleMarker>
              )}
            </MapContainer>
          </div>
        </div>

        <div style={sectionStyle()}>
          <h3 style={{ marginTop: 0 }}>Elvárt egységek</h3>

          {errors.selectedUnitIds && (
            <div style={{ ...fieldErrorStyle(), marginBottom: "10px" }}>
              {errors.selectedUnitIds}
            </div>
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: "14px",
            }}
          >
            {renderUnitGroup(
              "Tűzoltóság",
              units.fire,
              formData.selectedUnitIds,
              handleToggleUnit,
              "#f3c7c4",
              "#fff7f7"
            )}
            {renderUnitGroup(
              "Mentőszolgálat",
              units.ambulance,
              formData.selectedUnitIds,
              handleToggleUnit,
              "#c7e7d0",
              "#f7fffa"
            )}
            {renderUnitGroup(
              "Rendőrség",
              units.police,
              formData.selectedUnitIds,
              handleToggleUnit,
              "#c9d8f2",
              "#f8fbff"
            )}
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button type="submit" className="auth-form-button">
            Szituáció mentése
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/scenarios")}
            style={{
              padding: "10px 14px",
              borderRadius: "8px",
              border: "1px solid #d0d5dd",
              backgroundColor: "#fff",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Vissza
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminEditScenarioPage;