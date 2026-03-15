import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import mockEmergencyUnits from "../utils/mockEmergencyUnits";
import { saveLatestSimulationResult } from "../utils/simulationResultStorage";
import { submitSimulationAttempt } from "../services/userService";
import { getCurrentSimulationScenario, getSimulationUnits } from "../services/simulationService";
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
  address: "3300 Eger, Leányka utca 4.",
  audioFileName: "tuzeset_01.mp3",
};

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

  const initialFormData = useMemo(
    () => ({
      callerName: "",
      callerPhone: "",
      location: activeScenario?.address || "",
      eventDescription: "",
      note: "",
    }),
    [activeScenario]
  );

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      location: activeScenario?.address || "",
    }));
  }, [activeScenario]);

  useEffect(() => {
    let isMounted = true;

    async function loadSimulationData() {
      try {
        const [scenarioResponse, unitsResponse] = await Promise.all([
          getCurrentSimulationScenario(),
          getSimulationUnits(),
        ]);

        if (!isMounted) {
          return;
        }

        setActiveScenario({
          id: scenarioResponse.id,
          title: scenarioResponse.title,
          category: scenarioResponse.category,
          address: scenarioResponse.address,
          audioFileName: scenarioResponse.audioFileName,
        });

        setAvailableUnits({
          fire: Array.isArray(unitsResponse?.fire) ? unitsResponse.fire : [],
          ambulance: Array.isArray(unitsResponse?.ambulance) ? unitsResponse.ambulance : [],
          police: Array.isArray(unitsResponse?.police) ? unitsResponse.police : [],
        });

        setDataLoadMessage("");
      } catch (err) {
        if (!isMounted) {
          return;
        }

        setDataLoadMessage(
          "A szituációs adatok most nem érhetők el backendről, ezért az oldal tartalék adatokkal működik."
        );
      }
    }

    loadSimulationData();

    return () => {
      isMounted = false;
    };
  }, []);

  const availabilityLabel =
    availabilityStatus === "AVAILABLE" ? "Szabad" : "Nem szabad";

  const resetSimulationState = (availability = "NOT_READY", call = "IDLE") => {
    setAvailabilityStatus(availability);
    setCallState(call);
    setSimulationStep("FORM");
    setFormData({
      callerName: "",
      callerPhone: "",
      location: activeScenario?.address || "",
      eventDescription: "",
      note: "",
    });
    setSelectedUnits([]);
    setErrors({});
    setMessage("");
    setEvaluationResult(null);
    setIsSubmittingAttempt(false);
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
        eventDescription: formData.eventDescription,
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

  const handleRestartSimulation = () => {
    resetSimulationState("NOT_READY", "IDLE");
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

      <div className="simulation-main-grid">
        <div className="simulation-left-column">
          <SimulationCallPanel
            callState={callState}
            onSetAvailable={handleSetAvailable}
            onSetUnavailable={handleSetUnavailable}
            onMockIncomingCall={handleMockIncomingCall}
            onAcceptCall={handleAcceptCall}
          />

          <div className="simulation-panel simulation-stage-panel">
            <h3>{getStageTitle()}</h3>

            {dataLoadMessage && (
              <div className="simulation-highlight" style={{ marginBottom: "12px" }}>
                <p>{dataLoadMessage}</p>
              </div>
            )}

            <div className="simulation-stage-content">
              {renderStageContent()}
              {message && <div className="form-message">{message}</div>}
            </div>
          </div>
        </div>

        <div className="simulation-right-column">
          <SimulationStatusPanel
            availabilityLabel={availabilityLabel}
            callState={callState}
            simulationStep={simulationStep}
          />

          <SimulationMapPanel
            location={formData.location}
            selectedUnits={selectedUnits}
          />
        </div>
      </div>
    </div>
  );
}

export default UserSimulationPage;