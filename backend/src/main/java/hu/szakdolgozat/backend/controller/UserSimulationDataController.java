package hu.szakdolgozat.backend.controller;

import hu.szakdolgozat.backend.dto.simulation.CurrentSimulationScenarioResponse;
import hu.szakdolgozat.backend.dto.simulation.SimulationUnitOptionResponse;
import hu.szakdolgozat.backend.dto.simulation.SimulationUnitsResponse;
import hu.szakdolgozat.backend.entity.EmergencyUnit;
import hu.szakdolgozat.backend.entity.Scenario;
import hu.szakdolgozat.backend.repository.EmergencyUnitRepository;
import hu.szakdolgozat.backend.repository.ScenarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.Comparator;
import java.util.List;

@RestController
public class UserSimulationDataController {

    private final ScenarioRepository scenarioRepository;
    private final EmergencyUnitRepository emergencyUnitRepository;

    public UserSimulationDataController(
            ScenarioRepository scenarioRepository,
            EmergencyUnitRepository emergencyUnitRepository
    ) {
        this.scenarioRepository = scenarioRepository;
        this.emergencyUnitRepository = emergencyUnitRepository;
    }

    @Transactional(readOnly = true)
    @GetMapping("/api/me/simulation/current")
    public CurrentSimulationScenarioResponse getCurrentSimulationScenario() {
        Scenario scenario = scenarioRepository.findFirstByIsActiveTrueOrderByCreatedAtDesc()
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Nem található aktív szituáció."
                ));

        return new CurrentSimulationScenarioResponse(
                scenario.getId(),
                scenario.getTitle(),
                scenario.getCategory().getName(),
                scenario.getGeoAddress(),
                scenario.getAudioFileName()
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

    private List<SimulationUnitOptionResponse> mapUnits(List<EmergencyUnit> units) {
        return units.stream()
                .sorted(Comparator.comparing(EmergencyUnit::getDisplayName))
                .map(unit -> new SimulationUnitOptionResponse(unit.getId(), unit.getDisplayName()))
                .toList();
    }
}