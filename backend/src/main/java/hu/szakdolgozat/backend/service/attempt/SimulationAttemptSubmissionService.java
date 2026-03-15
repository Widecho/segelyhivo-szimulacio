package hu.szakdolgozat.backend.service.attempt;

import hu.szakdolgozat.backend.dto.attempt.SubmitSimulationAttemptRequest;
import hu.szakdolgozat.backend.dto.attempt.SubmitSimulationAttemptResponse;
import hu.szakdolgozat.backend.entity.AppUser;
import hu.szakdolgozat.backend.entity.EmergencyUnit;
import hu.szakdolgozat.backend.entity.Scenario;
import hu.szakdolgozat.backend.entity.ScenarioRequiredUnit;
import hu.szakdolgozat.backend.entity.SimulationAttempt;
import hu.szakdolgozat.backend.entity.SimulationAttemptFeedbackItem;
import hu.szakdolgozat.backend.entity.SimulationAttemptSelectedUnit;
import hu.szakdolgozat.backend.repository.AppUserRepository;
import hu.szakdolgozat.backend.repository.EmergencyUnitRepository;
import hu.szakdolgozat.backend.repository.ScenarioRepository;
import hu.szakdolgozat.backend.repository.ScenarioRequiredUnitRepository;
import hu.szakdolgozat.backend.repository.SimulationAttemptFeedbackItemRepository;
import hu.szakdolgozat.backend.repository.SimulationAttemptRepository;
import hu.szakdolgozat.backend.repository.SimulationAttemptSelectedUnitRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class SimulationAttemptSubmissionService {

    private final AppUserRepository appUserRepository;
    private final ScenarioRepository scenarioRepository;
    private final ScenarioRequiredUnitRepository scenarioRequiredUnitRepository;
    private final EmergencyUnitRepository emergencyUnitRepository;
    private final SimulationAttemptRepository simulationAttemptRepository;
    private final SimulationAttemptSelectedUnitRepository simulationAttemptSelectedUnitRepository;
    private final SimulationAttemptFeedbackItemRepository simulationAttemptFeedbackItemRepository;

    public SimulationAttemptSubmissionService(
            AppUserRepository appUserRepository,
            ScenarioRepository scenarioRepository,
            ScenarioRequiredUnitRepository scenarioRequiredUnitRepository,
            EmergencyUnitRepository emergencyUnitRepository,
            SimulationAttemptRepository simulationAttemptRepository,
            SimulationAttemptSelectedUnitRepository simulationAttemptSelectedUnitRepository,
            SimulationAttemptFeedbackItemRepository simulationAttemptFeedbackItemRepository
    ) {
        this.appUserRepository = appUserRepository;
        this.scenarioRepository = scenarioRepository;
        this.scenarioRequiredUnitRepository = scenarioRequiredUnitRepository;
        this.emergencyUnitRepository = emergencyUnitRepository;
        this.simulationAttemptRepository = simulationAttemptRepository;
        this.simulationAttemptSelectedUnitRepository = simulationAttemptSelectedUnitRepository;
        this.simulationAttemptFeedbackItemRepository = simulationAttemptFeedbackItemRepository;
    }

    @Transactional
    public SubmitSimulationAttemptResponse submit(String username, SubmitSimulationAttemptRequest request) {
        AppUser user = appUserRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "A felhasználó nem található."
                ));

        Scenario scenario = scenarioRepository.findById(request.getScenarioId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "A szituáció nem található."
                ));

        List<ScenarioRequiredUnit> requiredUnits = scenarioRequiredUnitRepository.findByScenario_Id(scenario.getId());

        Set<Long> expectedUnitIds = requiredUnits.stream()
                .map(item -> item.getEmergencyUnit().getId())
                .collect(java.util.stream.Collectors.toSet());

        Set<Long> selectedUnitIds = new HashSet<>(request.getSelectedUnitIds());

        List<EmergencyUnit> selectedUnits = emergencyUnitRepository.findAllById(selectedUnitIds);

        if (selectedUnits.size() != selectedUnitIds.size()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "A kiválasztott egységek között érvénytelen azonosító szerepel."
            );
        }

        int matchedUnitCount = (int) selectedUnitIds.stream()
                .filter(expectedUnitIds::contains)
                .count();

        int missingUnitCount = (int) expectedUnitIds.stream()
                .filter(expectedId -> !selectedUnitIds.contains(expectedId))
                .count();

        int incorrectUnitCount = (int) selectedUnitIds.stream()
                .filter(selectedId -> !expectedUnitIds.contains(selectedId))
                .count();

        int score = Math.max(
                0,
                100 - (missingUnitCount * 20) - (incorrectUnitCount * 15)
        );

        String evaluationStatus;
        if (score >= 80) {
            evaluationStatus = "SUCCESS";
        } else if (score >= 50) {
            evaluationStatus = "PARTIAL_SUCCESS";
        } else {
            evaluationStatus = "FAILED";
        }

        String noteEvaluationStatus = evaluateNote(request.getUserNote(), scenario.getExpectedNote());

        String evaluatorSummary = buildEvaluatorSummary(
                matchedUnitCount,
                missingUnitCount,
                incorrectUnitCount,
                noteEvaluationStatus
        );

        SimulationAttempt attempt = new SimulationAttempt();
        attempt.setScenario(scenario);
        attempt.setUser(user);
        attempt.setCallerName(request.getCallerName());
        attempt.setCallerPhone(request.getCallerPhone());
        attempt.setLocationText(request.getLocationText());
        attempt.setEventDescription(request.getEventDescription());
        attempt.setUserNote(request.getUserNote());
        attempt.setStartedAt(LocalDateTime.now());
        attempt.setSubmittedAt(LocalDateTime.now());
        attempt.setEvaluationStatus(evaluationStatus);
        attempt.setScore(score);
        attempt.setMatchedUnitCount(matchedUnitCount);
        attempt.setMissingUnitCount(missingUnitCount);
        attempt.setIncorrectUnitCount(incorrectUnitCount);
        attempt.setNoteEvaluationStatus(noteEvaluationStatus);
        attempt.setEvaluatorSummary(evaluatorSummary);

        SimulationAttempt savedAttempt = simulationAttemptRepository.save(attempt);

        for (EmergencyUnit unit : selectedUnits) {
            SimulationAttemptSelectedUnit selectedUnit = new SimulationAttemptSelectedUnit();
            selectedUnit.setSimulationAttempt(savedAttempt);
            selectedUnit.setEmergencyUnit(unit);
            simulationAttemptSelectedUnitRepository.save(selectedUnit);
        }

        createFeedbackItems(savedAttempt, matchedUnitCount, missingUnitCount, incorrectUnitCount, noteEvaluationStatus);

        return new SubmitSimulationAttemptResponse(
                savedAttempt.getId(),
                evaluationStatus,
                score,
                matchedUnitCount,
                missingUnitCount,
                incorrectUnitCount,
                noteEvaluationStatus,
                evaluatorSummary
        );
    }

    private String evaluateNote(String userNote, String expectedNote) {
        String normalizedUserNote = normalize(userNote);
        String normalizedExpectedNote = normalize(expectedNote);

        if (normalizedUserNote.isBlank() || normalizedExpectedNote.isBlank()) {
            return "NOT_EVALUATED";
        }

        int commonWordCount = countCommonWords(normalizedUserNote, normalizedExpectedNote);

        if (commonWordCount >= 5) {
            return "MATCHED";
        }

        if (commonWordCount >= 2) {
            return "PARTIAL_MATCH";
        }

        return "NOT_MATCHED";
    }

    private int countCommonWords(String first, String second) {
        Set<String> firstWords = new HashSet<>(List.of(first.split("\\s+")));
        Set<String> secondWords = new HashSet<>(List.of(second.split("\\s+")));
        firstWords.retainAll(secondWords);
        firstWords.removeIf(word -> word.length() < 3);
        return firstWords.size();
    }

    private String normalize(String text) {
        return text == null
                ? ""
                : text.toLowerCase()
                .replaceAll("[^\\p{L}\\p{N}\\s]", " ")
                .trim();
    }

    private String buildEvaluatorSummary(
            int matchedUnitCount,
            int missingUnitCount,
            int incorrectUnitCount,
            String noteEvaluationStatus
    ) {
        return "Talált egységek: " + matchedUnitCount
                + ", hiányzó egységek: " + missingUnitCount
                + ", hibás egységek: " + incorrectUnitCount
                + ", jegyzetellenőrzés: " + noteEvaluationStatus + ".";
    }

    private void createFeedbackItems(
            SimulationAttempt attempt,
            int matchedUnitCount,
            int missingUnitCount,
            int incorrectUnitCount,
            String noteEvaluationStatus
    ) {
        if (matchedUnitCount > 0) {
            saveFeedback(attempt, "SUCCESS", "A kiválasztott egységek között volt helyes találat.");
        }

        if (missingUnitCount > 0) {
            saveFeedback(attempt, "ERROR", "Hiányzik legalább egy elvárt készenléti szerv.");
        }

        if (incorrectUnitCount > 0) {
            saveFeedback(attempt, "ERROR", "Nem elvárt egység is kijelölésre került.");
        }

        if ("MATCHED".equals(noteEvaluationStatus)) {
            saveFeedback(attempt, "SUCCESS", "A jegyzet jól lefedi az elvárt tartalmat.");
        } else if ("PARTIAL_MATCH".equals(noteEvaluationStatus)) {
            saveFeedback(attempt, "INFO", "A jegyzet részben lefedi az elvárt tartalmat.");
        } else {
            saveFeedback(attempt, "ERROR", "A jegyzet nem fedi le megfelelően az elvárt tartalmat.");
        }
    }

    private void saveFeedback(SimulationAttempt attempt, String type, String message) {
        SimulationAttemptFeedbackItem item = new SimulationAttemptFeedbackItem();
        item.setSimulationAttempt(attempt);
        item.setFeedbackType(type);
        item.setMessage(message);
        simulationAttemptFeedbackItemRepository.save(item);
    }
}