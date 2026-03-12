package hu.szakdolgozat.backend.controller;

import hu.szakdolgozat.backend.entity.SimulationAttempt;
import hu.szakdolgozat.backend.entity.SimulationAttemptFeedbackItem;
import hu.szakdolgozat.backend.entity.SimulationAttemptSelectedUnit;
import hu.szakdolgozat.backend.repository.SimulationAttemptFeedbackItemRepository;
import hu.szakdolgozat.backend.repository.SimulationAttemptRepository;
import hu.szakdolgozat.backend.repository.SimulationAttemptSelectedUnitRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
public class SimulationAttemptController {

    private final SimulationAttemptRepository simulationAttemptRepository;
    private final SimulationAttemptSelectedUnitRepository simulationAttemptSelectedUnitRepository;
    private final SimulationAttemptFeedbackItemRepository simulationAttemptFeedbackItemRepository;

    public SimulationAttemptController(
            SimulationAttemptRepository simulationAttemptRepository,
            SimulationAttemptSelectedUnitRepository simulationAttemptSelectedUnitRepository,
            SimulationAttemptFeedbackItemRepository simulationAttemptFeedbackItemRepository
    ) {
        this.simulationAttemptRepository = simulationAttemptRepository;
        this.simulationAttemptSelectedUnitRepository = simulationAttemptSelectedUnitRepository;
        this.simulationAttemptFeedbackItemRepository = simulationAttemptFeedbackItemRepository;
    }

    @GetMapping("/api/attempts/summary")
    public Map<String, Object> getAttemptSummary() {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("totalAttemptCount", simulationAttemptRepository.count());
        response.put("successCount", simulationAttemptRepository.countByEvaluationStatus("SUCCESS"));
        response.put("partialSuccessCount", simulationAttemptRepository.countByEvaluationStatus("PARTIAL_SUCCESS"));
        response.put("failedCount", simulationAttemptRepository.countByEvaluationStatus("FAILED"));
        response.put("selectedUnitRecordCount", simulationAttemptSelectedUnitRepository.count());
        response.put("feedbackItemCount", simulationAttemptFeedbackItemRepository.count());
        return response;
    }

    @Transactional(readOnly = true)
    @GetMapping("/api/attempts/list")
    public List<Map<String, Object>> getAttempts() {
        return simulationAttemptRepository.findAll()
                .stream()
                .map(this::mapAttempt)
                .toList();
    }

    @Transactional(readOnly = true)
    @GetMapping("/api/attempts/selected-units")
    public List<Map<String, Object>> getSelectedUnits() {
        return simulationAttemptSelectedUnitRepository.findAll()
                .stream()
                .map(this::mapSelectedUnit)
                .toList();
    }

    @Transactional(readOnly = true)
    @GetMapping("/api/attempts/feedback")
    public List<Map<String, Object>> getFeedbackItems() {
        return simulationAttemptFeedbackItemRepository.findAll()
                .stream()
                .map(this::mapFeedbackItem)
                .toList();
    }

    private Map<String, Object> mapAttempt(SimulationAttempt attempt) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("id", attempt.getId());
        result.put("scenarioId", attempt.getScenario().getId());
        result.put("scenarioTitle", attempt.getScenario().getTitle());
        result.put("username", attempt.getUser().getUsername());
        result.put("callerName", attempt.getCallerName());
        result.put("callerPhone", attempt.getCallerPhone());
        result.put("locationText", attempt.getLocationText());
        result.put("eventDescription", attempt.getEventDescription());
        result.put("evaluationStatus", attempt.getEvaluationStatus());
        result.put("score", attempt.getScore());
        result.put("matchedUnitCount", attempt.getMatchedUnitCount());
        result.put("missingUnitCount", attempt.getMissingUnitCount());
        result.put("incorrectUnitCount", attempt.getIncorrectUnitCount());
        result.put("noteEvaluationStatus", attempt.getNoteEvaluationStatus());
        result.put("startedAt", attempt.getStartedAt());
        result.put("submittedAt", attempt.getSubmittedAt());
        return result;
    }

    private Map<String, Object> mapSelectedUnit(SimulationAttemptSelectedUnit item) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("id", item.getId());
        result.put("attemptId", item.getSimulationAttempt().getId());
        result.put("scenarioTitle", item.getSimulationAttempt().getScenario().getTitle());
        result.put("username", item.getSimulationAttempt().getUser().getUsername());
        result.put("emergencyUnitName", item.getEmergencyUnit().getDisplayName());
        result.put("serviceType", item.getEmergencyUnit().getServiceType().getCode());
        return result;
    }

    private Map<String, Object> mapFeedbackItem(SimulationAttemptFeedbackItem item) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("id", item.getId());
        result.put("attemptId", item.getSimulationAttempt().getId());
        result.put("scenarioTitle", item.getSimulationAttempt().getScenario().getTitle());
        result.put("username", item.getSimulationAttempt().getUser().getUsername());
        result.put("feedbackType", item.getFeedbackType());
        result.put("message", item.getMessage());
        return result;
    }
}