package hu.szakdolgozat.backend.controller;

import hu.szakdolgozat.backend.dto.attempt.SubmitSimulationAttemptRequest;
import hu.szakdolgozat.backend.dto.attempt.SubmitSimulationAttemptResponse;
import hu.szakdolgozat.backend.entity.AppUser;
import hu.szakdolgozat.backend.entity.SimulationAttempt;
import hu.szakdolgozat.backend.repository.AppUserRepository;
import hu.szakdolgozat.backend.repository.SimulationAttemptRepository;
import hu.szakdolgozat.backend.service.attempt.SimulationAttemptSubmissionService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
public class MeController {

    private final AppUserRepository appUserRepository;
    private final SimulationAttemptRepository simulationAttemptRepository;
    private final SimulationAttemptSubmissionService simulationAttemptSubmissionService;

    public MeController(
            AppUserRepository appUserRepository,
            SimulationAttemptRepository simulationAttemptRepository,
            SimulationAttemptSubmissionService simulationAttemptSubmissionService
    ) {
        this.appUserRepository = appUserRepository;
        this.simulationAttemptRepository = simulationAttemptRepository;
        this.simulationAttemptSubmissionService = simulationAttemptSubmissionService;
    }

    @Transactional(readOnly = true)
    @GetMapping("/api/me/profile")
    public Map<String, Object> getMyProfile(Authentication authentication) {
        String username = authentication.getName();

        AppUser user = appUserRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("A felhasználó nem található."));

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("id", user.getId());
        result.put("fullName", user.getFullName());
        result.put("username", user.getUsername());
        result.put("role", user.getRole().getName());
        result.put("failedLoginAttempts", user.getFailedLoginAttempts());
        result.put("isActive", user.getIsActive());
        result.put("createdAt", user.getCreatedAt());
        result.put("updatedAt", user.getUpdatedAt());
        return result;
    }

    @Transactional(readOnly = true)
    @GetMapping("/api/me/attempts")
    public List<Map<String, Object>> getMyAttempts(Authentication authentication) {
        String username = authentication.getName();

        return simulationAttemptRepository.findByUser_Username(username)
                .stream()
                .map(this::mapAttempt)
                .toList();
    }

    @PostMapping("/api/me/attempts")
    public SubmitSimulationAttemptResponse submitMyAttempt(
            Authentication authentication,
            @Valid @RequestBody SubmitSimulationAttemptRequest request
    ) {
        return simulationAttemptSubmissionService.submit(authentication.getName(), request);
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
}