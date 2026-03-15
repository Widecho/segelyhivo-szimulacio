package hu.szakdolgozat.backend.controller;

import hu.szakdolgozat.backend.entity.ScenarioCategory;
import hu.szakdolgozat.backend.repository.EmergencyServiceTypeRepository;
import hu.szakdolgozat.backend.repository.EmergencyUnitRepository;
import hu.szakdolgozat.backend.repository.RegionRepository;
import hu.szakdolgozat.backend.repository.RoleRepository;
import hu.szakdolgozat.backend.repository.ScenarioCategoryRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
public class ReferenceDataController {

    private final RoleRepository roleRepository;
    private final ScenarioCategoryRepository scenarioCategoryRepository;
    private final EmergencyServiceTypeRepository emergencyServiceTypeRepository;
    private final RegionRepository regionRepository;
    private final EmergencyUnitRepository emergencyUnitRepository;

    public ReferenceDataController(
            RoleRepository roleRepository,
            ScenarioCategoryRepository scenarioCategoryRepository,
            EmergencyServiceTypeRepository emergencyServiceTypeRepository,
            RegionRepository regionRepository,
            EmergencyUnitRepository emergencyUnitRepository
    ) {
        this.roleRepository = roleRepository;
        this.scenarioCategoryRepository = scenarioCategoryRepository;
        this.emergencyServiceTypeRepository = emergencyServiceTypeRepository;
        this.regionRepository = regionRepository;
        this.emergencyUnitRepository = emergencyUnitRepository;
    }

    @GetMapping("/api/reference/summary")
    public Map<String, Object> getReferenceSummary() {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("roleCount", roleRepository.count());
        response.put("scenarioCategoryCount", scenarioCategoryRepository.count());
        response.put("serviceTypeCount", emergencyServiceTypeRepository.count());
        response.put("regionCount", regionRepository.count());
        response.put("emergencyUnitCount", emergencyUnitRepository.count());
        response.put("activeFireUnitCount", emergencyUnitRepository.findByServiceType_CodeAndIsActiveTrue("FIRE").size());
        response.put("activeAmbulanceUnitCount", emergencyUnitRepository.findByServiceType_CodeAndIsActiveTrue("AMBULANCE").size());
        response.put("activePoliceUnitCount", emergencyUnitRepository.findByServiceType_CodeAndIsActiveTrue("POLICE").size());
        return response;
    }

    @GetMapping("/api/reference/scenario-categories")
    public List<Map<String, Object>> getScenarioCategories() {
        return scenarioCategoryRepository.findAllByOrderByNameAsc()
                .stream()
                .map(this::mapCategory)
                .toList();
    }

    private Map<String, Object> mapCategory(ScenarioCategory category) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("id", category.getId());
        result.put("name", category.getName());
        return result;
    }
}