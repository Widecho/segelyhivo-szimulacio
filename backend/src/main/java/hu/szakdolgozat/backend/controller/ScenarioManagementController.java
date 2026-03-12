package hu.szakdolgozat.backend.controller;

import hu.szakdolgozat.backend.entity.Scenario;
import hu.szakdolgozat.backend.entity.ScenarioRequiredUnit;
import hu.szakdolgozat.backend.repository.ScenarioRepository;
import hu.szakdolgozat.backend.repository.ScenarioRequiredUnitRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
public class ScenarioManagementController {

    private final ScenarioRepository scenarioRepository;
    private final ScenarioRequiredUnitRepository scenarioRequiredUnitRepository;

    public ScenarioManagementController(
            ScenarioRepository scenarioRepository,
            ScenarioRequiredUnitRepository scenarioRequiredUnitRepository
    ) {
        this.scenarioRepository = scenarioRepository;
        this.scenarioRequiredUnitRepository = scenarioRequiredUnitRepository;
    }

    @GetMapping("/api/scenarios/summary")
    public Map<String, Object> getScenarioSummary() {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("totalScenarioCount", scenarioRepository.count());
        response.put("activeScenarioCount", scenarioRepository.countByIsActiveTrue());
        response.put("fireScenarioCount", scenarioRepository.findByCategory_Name("Tűzeset").size());
        response.put("medicalScenarioCount", scenarioRepository.findByCategory_Name("Egészségügyi eset").size());
        return response;
    }

    @Transactional(readOnly = true)
    @GetMapping("/api/scenarios/list")
    public List<Map<String, Object>> getScenarios() {
        return scenarioRepository.findAll()
                .stream()
                .map(this::mapScenario)
                .toList();
    }

    @Transactional(readOnly = true)
    @GetMapping("/api/scenarios/required-units")
    public List<Map<String, Object>> getScenarioRequiredUnits() {
        return scenarioRequiredUnitRepository.findAll()
                .stream()
                .map(this::mapScenarioRequiredUnit)
                .toList();
    }

    private Map<String, Object> mapScenario(Scenario scenario) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("id", scenario.getId());
        result.put("title", scenario.getTitle());
        result.put("category", scenario.getCategory().getName());
        result.put("audioFileName", scenario.getAudioFileName());
        result.put("geoAddress", scenario.getGeoAddress());
        result.put("latitude", scenario.getLatitude());
        result.put("longitude", scenario.getLongitude());
        result.put("expectedNote", scenario.getExpectedNote());
        result.put("createdBy", scenario.getCreatedByUser().getUsername());
        result.put("isActive", scenario.getIsActive());
        result.put("requiredUnitCount", scenarioRequiredUnitRepository.countByScenario_Id(scenario.getId()));
        return result;
    }

    private Map<String, Object> mapScenarioRequiredUnit(ScenarioRequiredUnit item) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("id", item.getId());
        result.put("scenarioId", item.getScenario().getId());
        result.put("scenarioTitle", item.getScenario().getTitle());
        result.put("emergencyUnitId", item.getEmergencyUnit().getId());
        result.put("emergencyUnitName", item.getEmergencyUnit().getDisplayName());
        result.put("serviceType", item.getEmergencyUnit().getServiceType().getCode());
        return result;
    }
}