import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import mockEmergencyUnits from "../utils/mockEmergencyUnits";
import mockScenarios from "../utils/mockScenarios";
import { saveLatestSimulationResult } from "../utils/simulationResultStorage";
import { loadLatestCustomScenario } from "../utils/scenarioStorage";
import { submitSimulationAttempt } from "../services/userService";
import SimulationHeader from "../components/simulation/SimulationHeader";
import SimulationCallPanel from "../components/simulation/SimulationCallPanel";
import SimulationFormPanel from "../components/simulation/SimulationFormPanel";
import SimulationUnitsPanel from "../components/simulation/SimulationUnitsPanel";
import SimulationEvaluationPanel from "../components/simulation/SimulationEvaluationPanel";
import SimulationStatusPanel from "../components/simulation/SimulationStatusPanel";
import SimulationMapPanel from "../components/simulation/SimulationMapPanel";
import "../styles/auth.css";
import "../styles/simulation.css";

function UserSimulationPage() {
  const navigate = useNavigate();

  const activeScenario = useMemo(() => {
    return mockScenarios[0];
  }, []);

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

  const [availabilityStatus, setAvailabilityStatus] = useState("NOT_READY");
  const [callState, setCallState] = useState("IDLE");
  const [simulationStep, setSimulationStep] = useState("FORM");
  const [formData, setFormData] = useState(initialFormData);
  const [selectedUnits, setSelectedUnits] = useState([]);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [isSubmittingAttempt, setIsSubmittingAttempt] = useState(false);

  const expectedUnits = activeScenario?.requiredUnits || [
    "Heves Tűzoltóság",
    "Heves Mentőszolgálat",
    "Heves Rendőrség",
  ];

  const availabilityLabel =
    availabilityStatus === "AVAILABLE" ? "Szabad" : "Nem szabad";

  const selectedUnitNames = selectedUnits.map((unit) => unit.name);

  const matchedUnits = selectedUnitNames.filter((unit) =>
    expectedUnits.includes(unit)
  );
  const missingUnits = expectedUnits.filter((unit) => !selectedUnitNames.includes(unit));
  const incorrectUnits = selectedUnitNames.filter((unit) => !expectedUnits.includes(unit));

  const resetSimulationState = (availability = "NOT_READY", call = "IDLE") => {
    setAvailabilityStatus(availability);
    setCallState(call);
    setSimulationStep("FORM");
    setFormData(initialFormData);
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
        scenarioId: activeScenario?.id,
        callerName: formData.callerName,
        callerPhone: formData.callerPhone,
        locationText: formData.location,
        eventDescription: formData.eventDescription,
        userNote: formData.note,
        selectedUnitIds: selectedUnits.map((unit) => unit.id),
      });

      const resultPayload = {
        id: response.attemptId,
        scenarioId: activeScenario?.id || "MOCK-SCENARIO",
        title: formData.eventDescription || activeScenario?.title || "Mock szituáció",
        date: new Date().toLocaleString("hu-HU"),
        location: formData.location,
        callerName: formData.callerName,
        selectedUnits: selectedUnits.map((unit) => unit.name),
        matchedUnits,
        missingUnits,
        incorrectUnits,
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
            units={mockEmergencyUnits}
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
        matchedUnits={matchedUnits}
        missingUnits={missingUnits}
        incorrectUnits={incorrectUnits}
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
        scenarioTitle="Bejövő segélyhívás kezelése"
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