import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import mockEmergencyUnits from "../utils/mockEmergencyUnits";
import { saveLatestSimulationResult } from "../utils/simulationResultStorage";
import { submitSimulationAttempt } from "../services/userService";
import { getCurrentSimulationScenario, getSimulationUnits } from "../services/simulationService";
import {
  parseCoordinateInput,
  reverseGeocode,
  searchLocations,
} from "../services/geocodingService";
import SimulationHeader from "../components/simulation/SimulationHeader";
import SimulationCallPanel from "../components/simulation/SimulationCallPanel";
import SimulationFormPanel from "../components/simulation/SimulationFormPanel";
import SimulationUnitsPanel from "../components/simulation/SimulationUnitsPanel";
import SimulationEvaluationPanel from "../components/simulation/SimulationEvaluationPanel";
import SimulationStatusPanel from "../components/simulation/SimulationStatusPanel";
import SimulationMapPanel from "../components/simulation/SimulationMapPanel";
import "../styles/auth.css";
import "../styles/simulation.css";

const fallbackScenario = {
  id: "112202603120000000001",
  title: "Bejövő segélyhívás kezelése",
  category: "Tűzeset",
  address: "",
  audioFileName: "tuzeset_01.mp3",
};

function shortenText(text, maxLength = 70) {
  if (!text) {
    return "";
  }

  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength - 3)}...`;
}

function formatCoordinates(lat, lon) {
  return `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
}

function UserSimulationPage() {
  const navigate = useNavigate();

  const [activeScenario, setActiveScenario] = useState(fallbackScenario);
  const [availableUnits, setAvailableUnits] = useState(mockEmergencyUnits);
  const [dataLoadMessage, setDataLoadMessage] = useState("");

  const [availabilityStatus, setAvailabilityStatus] = useState("NOT_READY");
  const [callState, setCallState] = useState("IDLE");
  const [simulationStep, setSimulationStep] = useState("FORM");
  const [selectedUnits, setSelectedUnits] = useState([]);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [isSubmittingAttempt, setIsSubmittingAttempt] = useState(false);
  const [isReloadingScenario, setIsReloadingScenario] = useState(false);

  const [formData, setFormData] = useState({
    callerName: "",
    callerPhone: "",
    location: "",
    note: "",
  });

  const [selectedCoordinates, setSelectedCoordinates] = useState(null);
  const [locationSearchText, setLocationSearchText] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [coordinateInput, setCoordinateInput] = useState("");
  const [mapMessage, setMapMessage] = useState("");

  const resetSimulationState = useCallback((availability = "NOT_READY", call = "IDLE") => {
    setAvailabilityStatus(availability);
    setCallState(call);
    setSimulationStep("FORM");
    setFormData({
      callerName: "",
      callerPhone: "",
      location: "",
      note: "",
    });
    setSelectedCoordinates(null);
    setLocationSearchText("");
    setLocationSuggestions([]);
    setCoordinateInput("");
    setMapMessage("");
    setSelectedUnits([]);
    setErrors({});
    setMessage("");
    setEvaluationResult(null);
    setIsSubmittingAttempt(false);
  }, []);

  const applyChosenLocation = useCallback((locationItem, infoMessage = "") => {
    const formattedAddress =
      locationItem.formattedAddress || locationItem.displayName || "";

    setFormData((prev) => ({
      ...prev,
      location: formattedAddress,
    }));

    setSelectedCoordinates({
      lat: locationItem.lat,
      lon: locationItem.lon,
    });

    setLocationSearchText(formattedAddress);
    setCoordinateInput(formatCoordinates(locationItem.lat, locationItem.lon));
    setLocationSuggestions([]);
    setMapMessage(infoMessage || "A helyszín sikeresen kiválasztva.");

    setErrors((prev) => ({
      ...prev,
      location: "",
    }));
  }, []);

  const loadSimulationData = useCallback(async () => {
    try {
      const [scenarioResponse, unitsResponse] = await Promise.all([
        getCurrentSimulationScenario(),
        getSimulationUnits(),
      ]);

      const nextScenario = {
        id: scenarioResponse.id,
        title: scenarioResponse.title,
        category: scenarioResponse.category,
        address: "",
        audioFileName: scenarioResponse.audioFileName,
      };

      const nextUnits = {
        fire: Array.isArray(unitsResponse?.fire) ? unitsResponse.fire : [],
        ambulance: Array.isArray(unitsResponse?.ambulance) ? unitsResponse.ambulance : [],
        police: Array.isArray(unitsResponse?.police) ? unitsResponse.police : [],
      };

      setActiveScenario(nextScenario);
      setAvailableUnits(nextUnits);
      setDataLoadMessage("");

      return nextScenario;
    } catch (err) {
      setAvailableUnits(mockEmergencyUnits);
      setDataLoadMessage(
        "A szituációs adatok most nem érhetők el backendről, ezért az oldal tartalék adatokkal működik."
      );

      return fallbackScenario;
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function initializePage() {
      await loadSimulationData();

      if (!isMounted) {
        return;
      }

      resetSimulationState();
    }

    initializePage();

    return () => {
      isMounted = false;
    };
  }, [loadSimulationData, resetSimulationState]);

  useEffect(() => {
    if (simulationStep !== "FORM") {
      return;
    }

    const trimmed = locationSearchText.trim();

    if (!trimmed) {
      setLocationSuggestions([]);
      setIsSearchingLocation(false);
      return;
    }

    if (selectedCoordinates && formData.location && trimmed === formData.location.trim()) {
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
              68
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
  }, [locationSearchText, formData.location, selectedCoordinates, simulationStep]);

  useEffect(() => {
    if (simulationStep !== "FORM") {
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
        applyChosenLocation(
          reversed,
          "A koordináták alapján a cím automatikusan kitöltődött."
        );
      } catch (err) {
        setMapMessage(err.message || "Nem sikerült a koordinátákhoz címet találni.");
      }
    }, 450);

    return () => clearTimeout(timeoutId);
  }, [coordinateInput, selectedCoordinates, applyChosenLocation, simulationStep]);

  const availabilityLabel =
    availabilityStatus === "AVAILABLE" ? "Szabad" : "Nem szabad";

  const handleLocationSearchTextChange = (value) => {
    setLocationSearchText(value);
    setMapMessage("");

    if (!value.trim()) {
      setFormData((prev) => ({
        ...prev,
        location: "",
      }));
      setSelectedCoordinates(null);
      setCoordinateInput("");
      setLocationSuggestions([]);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      location: "",
    }));
    setSelectedCoordinates(null);
  };

  const handleCoordinateInputChange = (value) => {
    setCoordinateInput(value);
    setMapMessage("");

    if (!value.trim()) {
      setSelectedCoordinates(null);
      setFormData((prev) => ({
        ...prev,
        location: "",
      }));
    }
  };

  const handleSelectLocationSuggestion = (result) => {
    applyChosenLocation(result, "A helyszín sikeresen kiválasztva.");
  };

  const handleMapRightClick = async (latlng) => {
    setMapMessage("Új cím meghatározása a térképi pontról...");

    try {
      const reversed = await reverseGeocode(latlng.lat, latlng.lng);
      applyChosenLocation(reversed, "A cím áthelyezése sikeres volt.");
    } catch (err) {
      setMapMessage(err.message || "Nem sikerült a cím áthelyezése.");
    }
  };

  const handleSetAvailable = () => {
    resetSimulationState("AVAILABLE", "WAITING");
  };

  const handleSetUnavailable = () => {
    resetSimulationState("NOT_READY", "IDLE");
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
      location: "",
      selectedUnits: "",
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

    if (!formData.location.trim() || !selectedCoordinates) {
      newErrors.location = "Érvényes helyszín vagy koordináta kiválasztása kötelező.";
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

  const handleUnitToggle = (unit) => {
    setSelectedUnits((prev) => {
      const alreadySelected = prev.some((selected) => selected.id === unit.id);

      if (alreadySelected) {
        return prev.filter((selected) => selected.id !== unit.id);
      }

      if (prev.length >= 3) {
        return prev;
      }

      return [...prev, unit];
    });

    setErrors((prev) => ({
      ...prev,
      selectedUnits: "",
    }));

    setMessage("");
  };

  const handleSubmitUnits = async () => {
    if (selectedUnits.length < 1) {
      setErrors((prev) => ({
        ...prev,
        selectedUnits: "Legalább egy készenléti szerv kiválasztása kötelező.",
      }));
      setMessage("");
      return;
    }

    setIsSubmittingAttempt(true);
    setMessage("");
    setErrors((prev) => ({
      ...prev,
      selectedUnits: "",
    }));

    try {
      const response = await submitSimulationAttempt({
        scenarioId: activeScenario.id,
        callerName: formData.callerName,
        callerPhone: formData.callerPhone,
        locationText: formData.location,
        eventDescription: formData.note,
        userNote: formData.note,
        selectedUnitIds: selectedUnits.map((unit) => unit.id),
      });

      const resultPayload = {
        id: response.attemptId,
        scenarioId: activeScenario.id,
        title: activeScenario.title,
        date: new Date().toLocaleString("hu-HU"),
        location: formData.location,
        callerName: formData.callerName,
        selectedUnits: selectedUnits.map((unit) => unit.name),
        matchedUnits: response.matchedUnits || [],
        missingUnits: response.missingUnits || [],
        incorrectUnits: response.incorrectUnits || [],
        score: response.score,
        status: response.evaluationStatus,
      };

      saveLatestSimulationResult(resultPayload);

      setEvaluationResult(response);
      setSimulationStep("EVALUATION");
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        selectedUnits: err.message || "Nem sikerült menteni a próbálkozást.",
      }));
    } finally {
      setIsSubmittingAttempt(false);
    }
  };

  const handleRestartSimulation = async () => {
    setIsReloadingScenario(true);
    setErrors({});
    setMessage("");

    await loadSimulationData();
    resetSimulationState("NOT_READY", "IDLE");

    setIsReloadingScenario(false);
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard/user");
  };

  const renderStageContent = () => {
    if (callState !== "ACCEPTED") {
      return (
        <p className="simulation-note">
          Az adatlap a hívás fogadása után válik aktívvá.
        </p>
      );
    }

    if (simulationStep === "FORM") {
      return (
        <SimulationFormPanel
          formData={formData}
          errors={errors}
          onChange={handleChange}
          onSubmit={handleSubmitSimulation}
          selectedCoordinates={selectedCoordinates}
          locationSearchText={locationSearchText}
          onLocationSearchTextChange={handleLocationSearchTextChange}
          locationSuggestions={locationSuggestions}
          onSelectLocationSuggestion={handleSelectLocationSuggestion}
          isSearchingLocation={isSearchingLocation}
          coordinateInput={coordinateInput}
          onCoordinateInputChange={handleCoordinateInputChange}
        />
      );
    }

    if (simulationStep === "UNITS") {
      return (
        <>
          <SimulationUnitsPanel
            units={availableUnits}
            selectedUnits={selectedUnits}
            onToggleUnit={handleUnitToggle}
            onSubmitUnits={handleSubmitUnits}
            error={errors.selectedUnits}
          />

          {isSubmittingAttempt && (
            <p style={{ marginTop: "12px" }}>Próbálkozás mentése folyamatban...</p>
          )}
        </>
      );
    }

    return (
      <>
        <SimulationEvaluationPanel
          matchedUnits={evaluationResult?.matchedUnits || []}
          missingUnits={evaluationResult?.missingUnits || []}
          incorrectUnits={evaluationResult?.incorrectUnits || []}
          evaluationStatus={evaluationResult?.evaluationStatus}
          score={evaluationResult?.score}
          noteEvaluationStatus={evaluationResult?.noteEvaluationStatus}
          evaluatorSummary={evaluationResult?.evaluatorSummary}
          onRestart={handleRestartSimulation}
          onBackToDashboard={handleBackToDashboard}
        />

        {isReloadingScenario && (
          <p style={{ marginTop: "12px" }}>Új szituáció betöltése folyamatban...</p>
        )}
      </>
    );
  };

  const getStageTitle = () => {
    if (simulationStep === "FORM") {
      return "Bejelentési adatlap";
    }

    if (simulationStep === "UNITS") {
      return "Készenléti szervek kiválasztása";
    }

    return "Kiértékelés";
  };

  return (
    <div className="simulation-shell">
      <SimulationHeader
        availabilityLabel={availabilityLabel}
        isAvailable={availabilityStatus === "AVAILABLE"}
        scenarioTitle={activeScenario?.title || "Bejövő segélyhívás kezelése"}
      />

      <div
        className="simulation-main-grid"
        style={{
          gridTemplateColumns: "minmax(0, 1.9fr) minmax(320px, 0.95fr)",
          alignItems: "start",
          gap: "14px",
        }}
      >
        <div className="simulation-left-column" style={{ minWidth: 0 }}>
          <SimulationCallPanel
            callState={callState}
            onSetAvailable={handleSetAvailable}
            onSetUnavailable={handleSetUnavailable}
            onMockIncomingCall={handleMockIncomingCall}
            onAcceptCall={handleAcceptCall}
          />

          <div
            className="simulation-panel simulation-stage-panel"
            style={{
              minHeight: "auto",
              height: "auto",
              overflow: "visible",
            }}
          >
            <h3>{getStageTitle()}</h3>

            {dataLoadMessage && (
              <div className="simulation-highlight" style={{ marginBottom: "12px" }}>
                <p>{dataLoadMessage}</p>
              </div>
            )}

            <div
              className="simulation-stage-content"
              style={{
                overflow: "visible",
                minHeight: "auto",
                height: "auto",
              }}
            >
              {renderStageContent()}
              {message && <div className="form-message">{message}</div>}
            </div>
          </div>
        </div>

        <div className="simulation-right-column" style={{ minWidth: 0 }}>
          <SimulationStatusPanel
            availabilityLabel={availabilityLabel}
            callState={callState}
            simulationStep={simulationStep}
          />

          <SimulationMapPanel
            location={formData.location}
            selectedCoordinates={selectedCoordinates}
            mapMessage={mapMessage}
            selectedUnits={selectedUnits}
            onMapRightClick={handleMapRightClick}
          />
        </div>
      </div>
    </div>
  );
}

export default UserSimulationPage;