package hu.szakdolgozat.backend.controller;

import hu.szakdolgozat.backend.dto.scenario.CreateScenarioRequest;
import hu.szakdolgozat.backend.dto.scenario.CreateScenarioResponse;
import hu.szakdolgozat.backend.dto.scenario.UpdateScenarioStatusRequest;
import hu.szakdolgozat.backend.service.scenario.AdminScenarioService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/scenarios")
public class AdminScenarioController {

    private final AdminScenarioService adminScenarioService;

    public AdminScenarioController(AdminScenarioService adminScenarioService) {
        this.adminScenarioService = adminScenarioService;
    }

    @PostMapping
    public CreateScenarioResponse createScenario(
            Authentication authentication,
            @Valid @RequestBody CreateScenarioRequest request
    ) {
        return adminScenarioService.createScenario(authentication.getName(), request);
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