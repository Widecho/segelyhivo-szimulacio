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
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Service
public class AdminScenarioService {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyyMMdd");
    private static final Path AUDIO_UPLOAD_DIRECTORY = Paths.get("uploads", "audio");

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

    @Transactional(readOnly = true)
    public List<ScenarioDetailsResponse> getAllScenarios() {
        return scenarioRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapScenarioToDetailsResponse)
                .toList();
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

        validateCoordinates(request.getLatitude(), request.getLongitude());

        String storedAudioFileName = storeAudioFileForCreate(request.getAudioFile());

        Scenario scenario = new Scenario();
        scenario.setId(generateScenarioId());
        scenario.setTitle(request.getTitle().trim());
        scenario.setCategory(category);
        scenario.setAudioFileName(storedAudioFileName);
        scenario.setGeoAddress(request.getAddress().trim());
        scenario.setLatitude(normalizeCoordinate(request.getLatitude()));
        scenario.setLongitude(normalizeCoordinate(request.getLongitude()));
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

        return mapScenarioToDetailsResponse(scenario);
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

        validateCoordinates(request.getLatitude(), request.getLongitude());

        String storedAudioFileName = resolveAudioFileNameForUpdate(scenario, request);

        scenario.setTitle(request.getTitle().trim());
        scenario.setCategory(category);
        scenario.setAudioFileName(storedAudioFileName);
        scenario.setGeoAddress(request.getAddress().trim());
        scenario.setLatitude(normalizeCoordinate(request.getLatitude()));
        scenario.setLongitude(normalizeCoordinate(request.getLongitude()));
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

    private ScenarioDetailsResponse mapScenarioToDetailsResponse(Scenario scenario) {
        List<ScenarioRequiredUnit> requiredUnits = scenarioRequiredUnitRepository.findByScenario_Id(scenario.getId());

        List<Long> selectedUnitIds = requiredUnits.stream()
                .map(item -> item.getEmergencyUnit().getId())
                .toList();

        List<String> selectedUnitNames = requiredUnits.stream()
                .map(item -> item.getEmergencyUnit().getDisplayName())
                .sorted()
                .toList();

        return new ScenarioDetailsResponse(
                scenario.getId(),
                scenario.getTitle(),
                scenario.getCategory().getName(),
                scenario.getGeoAddress(),
                scenario.getAudioFileName(),
                scenario.getExpectedNote(),
                scenario.getIsActive(),
                selectedUnitIds,
                selectedUnitNames,
                scenario.getCreatedByUser() != null ? scenario.getCreatedByUser().getUsername() : null,
                scenario.getCreatedAt(),
                scenario.getUpdatedAt(),
                scenario.getLatitude(),
                scenario.getLongitude()
        );
    }

    private void saveRequiredUnits(Scenario scenario, List<EmergencyUnit> selectedUnits) {
        for (EmergencyUnit unit : selectedUnits) {
            ScenarioRequiredUnit requiredUnit = new ScenarioRequiredUnit();
            requiredUnit.setScenario(scenario);
            requiredUnit.setEmergencyUnit(unit);
            scenarioRequiredUnitRepository.save(requiredUnit);
        }
    }

    private void validateCoordinates(BigDecimal latitude, BigDecimal longitude) {
        if (latitude == null || longitude == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "A helyszínhez tartozó koordináták megadása kötelező."
            );
        }
    }

    private BigDecimal normalizeCoordinate(BigDecimal coordinate) {
        return coordinate.stripTrailingZeros();
    }

    private String storeAudioFileForCreate(MultipartFile audioFile) {
        if (audioFile == null || audioFile.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "MP3 hangfájl feltöltése kötelező."
            );
        }

        validateMp3File(audioFile);
        return saveAudioFile(audioFile);
    }

    private String resolveAudioFileNameForUpdate(Scenario scenario, CreateScenarioRequest request) {
        MultipartFile audioFile = request.getAudioFile();

        if (audioFile != null && !audioFile.isEmpty()) {
            validateMp3File(audioFile);
            String savedFileName = saveAudioFile(audioFile);

            if (scenario.getAudioFileName() != null && !scenario.getAudioFileName().isBlank()) {
                deleteAudioFileQuietly(scenario.getAudioFileName());
            }

            return savedFileName;
        }

        String existingAudioFileName = request.getExistingAudioFileName();

        if (existingAudioFileName != null && !existingAudioFileName.isBlank()) {
            return existingAudioFileName.trim();
        }

        if (scenario.getAudioFileName() != null && !scenario.getAudioFileName().isBlank()) {
            return scenario.getAudioFileName();
        }

        throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "MP3 hangfájl feltöltése kötelező."
        );
    }

    private void validateMp3File(MultipartFile audioFile) {
        String originalFilename = StringUtils.cleanPath(audioFile.getOriginalFilename() == null ? "" : audioFile.getOriginalFilename());

        if (originalFilename.isBlank() || !originalFilename.toLowerCase().endsWith(".mp3")) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Csak MP3 formátumú hangfájl tölthető fel."
            );
        }
    }

    private String saveAudioFile(MultipartFile audioFile) {
        try {
            Files.createDirectories(AUDIO_UPLOAD_DIRECTORY);

            String originalFilename = StringUtils.cleanPath(audioFile.getOriginalFilename() == null ? "" : audioFile.getOriginalFilename());
            String extension = ".mp3";

            if (originalFilename.toLowerCase().endsWith(".mp3")) {
                extension = originalFilename.substring(originalFilename.length() - 4);
            }

            String storedFileName = UUID.randomUUID() + extension;
            Path targetPath = AUDIO_UPLOAD_DIRECTORY.resolve(storedFileName);

            Files.copy(audioFile.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            return storedFileName;
        } catch (IOException exception) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Nem sikerült elmenteni a hangfájlt."
            );
        }
    }

    private void deleteAudioFileQuietly(String fileName) {
        try {
            if (fileName == null || fileName.isBlank()) {
                return;
            }

            Files.deleteIfExists(AUDIO_UPLOAD_DIRECTORY.resolve(fileName));
        } catch (IOException ignored) {
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