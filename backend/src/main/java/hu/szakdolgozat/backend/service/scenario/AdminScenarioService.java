package hu.szakdolgozat.backend.service.scenario;

import hu.szakdolgozat.backend.dto.scenario.CreateScenarioRequest;
import hu.szakdolgozat.backend.dto.scenario.CreateScenarioResponse;
import hu.szakdolgozat.backend.entity.AppUser;
import hu.szakdolgozat.backend.entity.EmergencyUnit;
import hu.szakdolgozat.backend.entity.Scenario;
import hu.szakdolgozat.backend.entity.ScenarioCategory;
import hu.szakdolgozat.backend.entity.ScenarioRequiredUnit;
import hu.szakdolgozat.backend.repository.AppUserRepository;
import hu.szakdolgozat.backend.repository.EmergencyUnitRepository;
import hu.szakdolgozat.backend.repository.ScenarioCategoryRepository;
import hu.szakdolgozat.backend.repository.ScenarioRepository;
import hu.szakdolgozat.backend.repository.ScenarioRequiredUnitRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AdminScenarioService {

    private final ScenarioRepository scenarioRepository;
    private final ScenarioCategoryRepository scenarioCategoryRepository;
    private final EmergencyUnitRepository emergencyUnitRepository;
    private final ScenarioRequiredUnitRepository scenarioRequiredUnitRepository;
    private final AppUserRepository appUserRepository;

    public AdminScenarioService(
            ScenarioRepository scenarioRepository,
            ScenarioCategoryRepository scenarioCategoryRepository,
            EmergencyUnitRepository emergencyUnitRepository,
            ScenarioRequiredUnitRepository scenarioRequiredUnitRepository,
            AppUserRepository appUserRepository
    ) {
        this.scenarioRepository = scenarioRepository;
        this.scenarioCategoryRepository = scenarioCategoryRepository;
        this.emergencyUnitRepository = emergencyUnitRepository;
        this.scenarioRequiredUnitRepository = scenarioRequiredUnitRepository;
        this.appUserRepository = appUserRepository;
    }

    @Transactional
    public CreateScenarioResponse createScenario(String username, CreateScenarioRequest request) {
        AppUser creator = appUserRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "A létrehozó felhasználó nem található."
                ));

        ScenarioCategory category = scenarioCategoryRepository.findByName(request.getCategoryName())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "A megadott kategória nem található."
                ));

        List<EmergencyUnit> selectedUnits = emergencyUnitRepository.findAllById(request.getSelectedUnitIds());

        if (selectedUnits.size() != request.getSelectedUnitIds().size()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "A kiválasztott egységek között érvénytelen azonosító szerepel."
            );
        }

        Scenario scenario = new Scenario();
        scenario.setId(generateScenarioId());
        scenario.setTitle(request.getTitle().trim());
        scenario.setCategory(category);
        scenario.setAudioFileName(request.getAudioFileName().trim());
        scenario.setGeoAddress(request.getAddress().trim());
        scenario.setLatitude(BigDecimal.ZERO);
        scenario.setLongitude(BigDecimal.ZERO);
        scenario.setExpectedNote(request.getExpectedNote().trim());
        scenario.setCreatedByUser(creator);
        scenario.setIsActive(true);
        scenario.setCreatedAt(LocalDateTime.now());
        scenario.setUpdatedAt(LocalDateTime.now());

        Scenario savedScenario = scenarioRepository.save(scenario);

        for (EmergencyUnit unit : selectedUnits) {
            ScenarioRequiredUnit requiredUnit = new ScenarioRequiredUnit();
            requiredUnit.setScenario(savedScenario);
            requiredUnit.setEmergencyUnit(unit);
            scenarioRequiredUnitRepository.save(requiredUnit);
        }

        return new CreateScenarioResponse(
                savedScenario.getId(),
                savedScenario.getTitle(),
                savedScenario.getCategory().getName(),
                savedScenario.getGeoAddress(),
                selectedUnits.size(),
                "A szituáció sikeresen létrejött."
        );
    }

    private String generateScenarioId() {
        return "112" + System.currentTimeMillis();
    }
}