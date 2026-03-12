import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import mockEmergencyUnits from "../utils/mockEmergencyUnits";
import mockScenarios from "../utils/mockScenarios";
import { saveLatestSimulationResult } from "../utils/simulationResultStorage";
import { loadLatestCustomScenario } from "../utils/scenarioStorage";
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
    const latestCustomScenario = loadLatestCustomScenario();

    if (latestCustomScenario) {
      return latestCustomScenario;
    }

    return mockScenarios[0];
  }, []);

  const initialFormData = useMemo(
    () => ({
      callerName: "",
      callerPhone: "",
      location: activeScenario?.address || "",
      eventDescription: activeScenario?.title || "",
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

  const expectedUnits = activeScenario?.requiredUnits || [
    "Heves VMKI",
    "OMSZ Heves",
    "Heves VMRFK",
  ];

  const availabilityLabel =
    availabilityStatus === "AVAILABLE" ? "Szabad" : "Nem szabad";

  const matchedUnits = selectedUnits.filter((unit) => expectedUnits.includes(unit));
  const missingUnits = expectedUnits.filter((unit) => !selectedUnits.includes(unit));
  const incorrectUnits = selectedUnits.filter((unit) => !expectedUnits.includes(unit));

  const resetSimulationState = (availability = "NOT_READY", call = "IDLE") => {
    setAvailabilityStatus(availability);
    setCallState(call);
    setSimulationStep("FORM");
    setFormData(initialFormData);
    setSelectedUnits([]);
    setErrors({});
    setMessage("");
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
      scenarioId: activeScenario?.id || "MOCK-SCENARIO",
      title: formData.eventDescription || activeScenario?.title || "Mock szituáció",
      date: new Date().toLocaleString("hu-HU"),
      location: formData.location,
      callerName: formData.callerName,
      selectedUnits,
      matchedUnits: matchedUnitsLocal,
      missingUnits: missingUnitsLocal,
      incorrectUnits: incorrectUnitsLocal,
      score,
      status:
        score >= 80 ? "Sikeres" : score >= 50 ? "Részben sikeres" : "Sikertelen",
    };

    saveLatestSimulationResult(resultPayload);
    setErrors((prev) => ({
      ...prev,
      selectedUnits: "",
    }));
    setMessage("");
    setSimulationStep("EVALUATION");
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
        <SimulationUnitsPanel
          units={mockEmergencyUnits}
          selectedUnits={selectedUnits}
          onToggleUnit={handleUnitToggle}
          onSubmitUnits={handleSubmitUnits}
          error={errors.selectedUnits}
        />
      );
    }

    return (
      <SimulationEvaluationPanel
        matchedUnits={matchedUnits}
        missingUnits={missingUnits}
        incorrectUnits={incorrectUnits}
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
        scenarioTitle={activeScenario?.title || "Mock szituáció"}
      />

      <div className="simulation-main-grid">
        <div className="simulation-left-column">
          <SimulationCallPanel
            activeScenario={activeScenario}
            expectedUnits={expectedUnits}
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
            activeScenarioId={activeScenario?.id || "Mock szituáció"}
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