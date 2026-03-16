package hu.szakdolgozat.backend.controller;

import hu.szakdolgozat.backend.dto.simulation.ConferenceSummaryRequest;
import hu.szakdolgozat.backend.dto.simulation.ConferenceSummaryResponse;
import hu.szakdolgozat.backend.dto.simulation.CurrentSimulationScenarioResponse;
import hu.szakdolgozat.backend.dto.simulation.SimulationUnitOptionResponse;
import hu.szakdolgozat.backend.dto.simulation.SimulationUnitsResponse;
import hu.szakdolgozat.backend.entity.EmergencyUnit;
import hu.szakdolgozat.backend.entity.Scenario;
import hu.szakdolgozat.backend.entity.SimulationAttempt;
import hu.szakdolgozat.backend.repository.EmergencyUnitRepository;
import hu.szakdolgozat.backend.repository.ScenarioRepository;
import hu.szakdolgozat.backend.repository.SimulationAttemptRepository;
import hu.szakdolgozat.backend.service.ai.AiConferenceSummaryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

@RestController
public class UserSimulationDataController {

    private final ScenarioRepository scenarioRepository;
    private final EmergencyUnitRepository emergencyUnitRepository;
    private final SimulationAttemptRepository simulationAttemptRepository;
    private final AiConferenceSummaryService aiConferenceSummaryService;

    public UserSimulationDataController(
            ScenarioRepository scenarioRepository,
            EmergencyUnitRepository emergencyUnitRepository,
            SimulationAttemptRepository simulationAttemptRepository,
            AiConferenceSummaryService aiConferenceSummaryService
    ) {
        this.scenarioRepository = scenarioRepository;
        this.emergencyUnitRepository = emergencyUnitRepository;
        this.simulationAttemptRepository = simulationAttemptRepository;
        this.aiConferenceSummaryService = aiConferenceSummaryService;
    }

    @Transactional(readOnly = true)
    @GetMapping("/api/me/simulation/current")
    public CurrentSimulationScenarioResponse getCurrentSimulationScenario(Authentication authentication) {
        String username = authentication.getName();

        List<Scenario> activeScenarios = scenarioRepository.findByIsActiveTrueOrderByCreatedAtDesc();

        if (activeScenarios.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Nem található aktív szituáció."
            );
        }

        List<String> activeScenarioIds = activeScenarios.stream()
                .map(Scenario::getId)
                .toList();

        List<SimulationAttempt> userAttempts = simulationAttemptRepository
                .findByUser_UsernameAndScenario_IdIn(username, activeScenarioIds);

        Set<String> attemptedScenarioIds = userAttempts.stream()
                .map(attempt -> attempt.getScenario().getId())
                .collect(Collectors.toSet());

        List<Scenario> notYetAttemptedScenarios = activeScenarios.stream()
                .filter(scenario -> !attemptedScenarioIds.contains(scenario.getId()))
                .toList();

        Scenario selectedScenario;

        if (!notYetAttemptedScenarios.isEmpty()) {
            int randomIndex = ThreadLocalRandom.current().nextInt(notYetAttemptedScenarios.size());
            selectedScenario = notYetAttemptedScenarios.get(randomIndex);
        } else {
            Map<String, LocalDateTime> latestAttemptByScenarioId = userAttempts.stream()
                    .collect(Collectors.toMap(
                            attempt -> attempt.getScenario().getId(),
                            this::resolveAttemptTimestamp,
                            (existing, replacement) -> replacement.isAfter(existing) ? replacement : existing
                    ));

            selectedScenario = activeScenarios.stream()
                    .min(Comparator.comparing(scenario ->
                            latestAttemptByScenarioId.getOrDefault(scenario.getId(), LocalDateTime.MIN)))
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "Nem sikerült kiválasztani a következő szituációt."
                    ));
        }

        return new CurrentSimulationScenarioResponse(
                selectedScenario.getId(),
                selectedScenario.getTitle(),
                selectedScenario.getCategory().getName(),
                selectedScenario.getGeoAddress(),
                selectedScenario.getAudioFileName()
        );
    }

    @Transactional(readOnly = true)
    @GetMapping("/api/me/simulation/units")
    public SimulationUnitsResponse getSimulationUnits() {
        return new SimulationUnitsResponse(
                mapUnits(emergencyUnitRepository.findByServiceType_CodeAndIsActiveTrue("FIRE")),
                mapUnits(emergencyUnitRepository.findByServiceType_CodeAndIsActiveTrue("AMBULANCE")),
                mapUnits(emergencyUnitRepository.findByServiceType_CodeAndIsActiveTrue("POLICE"))
        );
    }

    @PostMapping("/api/me/simulation/conference-summary")
    public ConferenceSummaryResponse generateConferenceSummary(
            @Valid @RequestBody ConferenceSummaryRequest request
    ) {
        return aiConferenceSummaryService.generateConferenceSummary(request);
    }

    private List<SimulationUnitOptionResponse> mapUnits(List<EmergencyUnit> units) {
        return units.stream()
                .sorted(Comparator.comparing(EmergencyUnit::getDisplayName))
                .map(unit -> new SimulationUnitOptionResponse(unit.getId(), unit.getDisplayName()))
                .toList();
    }

    private LocalDateTime resolveAttemptTimestamp(SimulationAttempt attempt) {
        if (attempt.getSubmittedAt() != null) {
            return attempt.getSubmittedAt();
        }

        if (attempt.getStartedAt() != null) {
            return attempt.getStartedAt();
        }

        return LocalDateTime.MIN;
    }
}