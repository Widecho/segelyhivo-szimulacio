package hu.szakdolgozat.backend.controller;

import hu.szakdolgozat.backend.dto.scenario.CreateScenarioRequest;
import hu.szakdolgozat.backend.dto.scenario.CreateScenarioResponse;
import hu.szakdolgozat.backend.dto.scenario.ScenarioDetailsResponse;
import hu.szakdolgozat.backend.dto.scenario.UpdateScenarioStatusRequest;
import hu.szakdolgozat.backend.service.scenario.AdminScenarioService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/scenarios")
public class AdminScenarioController {

    private final AdminScenarioService adminScenarioService;

    public AdminScenarioController(AdminScenarioService adminScenarioService) {
        this.adminScenarioService = adminScenarioService;
    }

    @GetMapping("/list")
    public List<ScenarioDetailsResponse> getScenarios() {
        return adminScenarioService.getAllScenarios();
    }

    @PostMapping
    public CreateScenarioResponse createScenario(
            Authentication authentication,
            @Valid @RequestBody CreateScenarioRequest request
    ) {
        return adminScenarioService.createScenario(authentication.getName(), request);
    }

    @GetMapping("/{scenarioId}")
    public ScenarioDetailsResponse getScenarioDetails(@PathVariable String scenarioId) {
        return adminScenarioService.getScenarioDetails(scenarioId);
    }

    @PutMapping("/{scenarioId}")
    public CreateScenarioResponse updateScenario(
            @PathVariable String scenarioId,
            @Valid @RequestBody CreateScenarioRequest request
    ) {
        return adminScenarioService.updateScenario(scenarioId, request);
    }

    @PatchMapping("/{scenarioId}/status")
    public CreateScenarioResponse updateScenarioStatus(
            @PathVariable String scenarioId,
            @RequestBody UpdateScenarioStatusRequest request
    ) {
        return adminScenarioService.updateScenarioStatus(scenarioId, request);
    }

    @DeleteMapping("/{scenarioId}")
    public Map<String, String> deleteScenario(@PathVariable String scenarioId) {
        String message = adminScenarioService.deleteScenario(scenarioId);
        return Map.of("message", message);
    }
}