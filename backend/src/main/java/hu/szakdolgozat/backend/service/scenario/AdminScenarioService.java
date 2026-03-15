package hu.szakdolgozat.backend.service.scenario;

import hu.szakdolgozat.backend.dto.scenario.CreateScenarioRequest;
import hu.szakdolgozat.backend.dto.scenario.CreateScenarioResponse;
import hu.szakdolgozat.backend.dto.scenario.ScenarioDetailsResponse;
import hu.szakdolgozat.backend.dto.scenario.UpdateScenarioStatusRequest;
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
import hu.szakdolgozat.backend.repository.SimulationAttemptRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class AdminScenarioService {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyyMMdd");

    private final ScenarioRepository scenarioRepository;
    private final ScenarioCategoryRepository scenarioCategoryRepository;
    private final EmergencyUnitRepository emergencyUnitRepository;
    private final ScenarioRequiredUnitRepository scenarioRequiredUnitRepository;
    private final AppUserRepository appUserRepository;
    private final SimulationAttemptRepository simulationAttemptRepository;

    public AdminScenarioService(
            ScenarioRepository scenarioRepository,
            ScenarioCategoryRepository scenarioCategoryRepository,
            EmergencyUnitRepository emergencyUnitRepository,
            ScenarioRequiredUnitRepository scenarioRequiredUnitRepository,
            AppUserRepository appUserRepository,
            SimulationAttemptRepository simulationAttemptRepository
    ) {
        this.scenarioRepository = scenarioRepository;
        this.scenarioCategoryRepository = scenarioCategoryRepository;
        this.emergencyUnitRepository = emergencyUnitRepository;
        this.scenarioRequiredUnitRepository = scenarioRequiredUnitRepository;
        this.appUserRepository = appUserRepository;
        this.simulationAttemptRepository = simulationAttemptRepository;
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

        saveRequiredUnits(savedScenario, selectedUnits);

        return new CreateScenarioResponse(
                savedScenario.getId(),
                savedScenario.getTitle(),
                savedScenario.getCategory().getName(),
                savedScenario.getGeoAddress(),
                selectedUnits.size(),
                "A szituáció sikeresen létrejött."
        );
    }

    @Transactional(readOnly = true)
    public ScenarioDetailsResponse getScenarioDetails(String scenarioId) {
        Scenario scenario = scenarioRepository.findById(scenarioId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "A szituáció nem található."
                ));

        List<Long> selectedUnitIds = scenarioRequiredUnitRepository.findByScenario_Id(scenarioId)
                .stream()
                .map(item -> item.getEmergencyUnit().getId())
                .toList();

        return new ScenarioDetailsResponse(
                scenario.getId(),
                scenario.getTitle(),
                scenario.getCategory().getName(),
                scenario.getGeoAddress(),
                scenario.getAudioFileName(),
                scenario.getExpectedNote(),
                scenario.getIsActive(),
                selectedUnitIds
        );
    }

    @Transactional
    public CreateScenarioResponse updateScenario(String scenarioId, CreateScenarioRequest request) {
        Scenario scenario = scenarioRepository.findById(scenarioId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "A szituáció nem található."
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

        scenario.setTitle(request.getTitle().trim());
        scenario.setCategory(category);
        scenario.setAudioFileName(request.getAudioFileName().trim());
        scenario.setGeoAddress(request.getAddress().trim());
        scenario.setExpectedNote(request.getExpectedNote().trim());
        scenario.setUpdatedAt(LocalDateTime.now());

        Scenario savedScenario = scenarioRepository.save(scenario);

        scenarioRequiredUnitRepository.deleteByScenario_Id(savedScenario.getId());
        scenarioRequiredUnitRepository.flush();

        saveRequiredUnits(savedScenario, selectedUnits);

        return new CreateScenarioResponse(
                savedScenario.getId(),
                savedScenario.getTitle(),
                savedScenario.getCategory().getName(),
                savedScenario.getGeoAddress(),
                selectedUnits.size(),
                "A szituáció sikeresen frissítve lett."
        );
    }

    @Transactional
    public CreateScenarioResponse updateScenarioStatus(String scenarioId, UpdateScenarioStatusRequest request) {
        if (request.getIsActive() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Az isActive mező megadása kötelező."
            );
        }

        Scenario scenario = scenarioRepository.findById(scenarioId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "A szituáció nem található."
                ));

        scenario.setIsActive(request.getIsActive());
        scenario.setUpdatedAt(LocalDateTime.now());

        Scenario savedScenario = scenarioRepository.save(scenario);

        long requiredUnitCount = scenarioRequiredUnitRepository.countByScenario_Id(savedScenario.getId());

        return new CreateScenarioResponse(
                savedScenario.getId(),
                savedScenario.getTitle(),
                savedScenario.getCategory().getName(),
                savedScenario.getGeoAddress(),
                (int) requiredUnitCount,
                savedScenario.getIsActive()
                        ? "A szituáció aktiválása sikeres."
                        : "A szituáció inaktiválása sikeres."
        );
    }

    @Transactional
    public String deleteScenario(String scenarioId) {
        Scenario scenario = scenarioRepository.findById(scenarioId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "A szituáció nem található."
                ));

        long attemptCount = simulationAttemptRepository.countByScenario_Id(scenarioId);

        if (attemptCount > 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "A szituáció nem törölhető, mert már tartozik hozzá kitöltött próbálkozás. Állítsd inaktívra."
            );
        }

        scenarioRequiredUnitRepository.deleteByScenario_Id(scenarioId);
        scenarioRequiredUnitRepository.flush();
        scenarioRepository.delete(scenario);

        return "A szituáció sikeresen törölve lett.";
    }

    private void saveRequiredUnits(Scenario scenario, List<EmergencyUnit> selectedUnits) {
        for (EmergencyUnit unit : selectedUnits) {
            ScenarioRequiredUnit requiredUnit = new ScenarioRequiredUnit();
            requiredUnit.setScenario(scenario);
            requiredUnit.setEmergencyUnit(unit);
            scenarioRequiredUnitRepository.save(requiredUnit);
        }
    }

    private String generateScenarioId() {
        String datePart = LocalDate.now().format(DATE_FORMATTER);
        long nextSequence = getNextGlobalSequence();
        return "112" + datePart + String.format("%010d", nextSequence);
    }

    private long getNextGlobalSequence() {
        return scenarioRepository.findTopByOrderByIdDesc()
                .map(Scenario::getId)
                .filter(id -> id != null && id.length() == 21)
                .map(id -> id.substring(11))
                .map(Long::parseLong)
                .map(lastSequence -> lastSequence + 1)
                .orElse(1L);
    }
}