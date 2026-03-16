package hu.szakdolgozat.backend.service.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import hu.szakdolgozat.backend.dto.simulation.ConferenceSummaryRequest;
import hu.szakdolgozat.backend.dto.simulation.ConferenceSummaryResponse;
import hu.szakdolgozat.backend.entity.EmergencyUnit;
import hu.szakdolgozat.backend.repository.EmergencyUnitRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class AiConferenceSummaryService {

    private static final String RESPONSES_URL = "https://api.openai.com/v1/responses";
    private static final String SPEECH_URL = "https://api.openai.com/v1/audio/speech";

    private static final String TEXT_MODEL = "gpt-5.4";
    private static final String TTS_MODEL = "gpt-4o-mini-tts";
    private static final String TTS_VOICE = "marin";

    private static final String TTS_INSTRUCTIONS =
            "Beszélj természetes, nyugodt, határozott magyar diszpécserhangon. " +
                    "A stílus legyen rövid, tárgyszerű, rádióforgalmazási jellegű, de ne legyen robotikus. " +
                    "Közepesnél kissé lassabb tempóban beszélj, tiszta hangsúlyokkal, természetes hanglejtéssel. " +
                    "Úgy szólalj meg, mint egy ügyeletes készenléti szerv munkatársa telefonos konferenciában.";

    private final EmergencyUnitRepository emergencyUnitRepository;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;

    public AiConferenceSummaryService(
            EmergencyUnitRepository emergencyUnitRepository,
            ObjectMapper objectMapper
    ) {
        this.emergencyUnitRepository = emergencyUnitRepository;
        this.objectMapper = objectMapper;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(20))
                .build();
    }

    @Transactional(readOnly = true)
    public ConferenceSummaryResponse generateConferenceSummary(ConferenceSummaryRequest request) {
        String apiKey = System.getenv("OPENAI_API_KEY");

        if (!StringUtils.hasText(apiKey)) {
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Az AI konferencia összefoglalóhoz nincs beállítva OPENAI_API_KEY."
            );
        }

        List<EmergencyUnit> selectedUnits = emergencyUnitRepository.findAllById(request.getSelectedUnitIds());

        if (selectedUnits.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Nem található egyetlen kiválasztott készenléti szerv sem."
            );
        }

        if (selectedUnits.size() != request.getSelectedUnitIds().size()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "A kiválasztott szervek között érvénytelen azonosító szerepel."
            );
        }

        EmergencyUnit selectedUnit = selectedUnits.get(
                ThreadLocalRandom.current().nextInt(selectedUnits.size())
        );

        String serviceLabel = resolveServiceLabel(selectedUnit);
        String speakerTitle = resolveSpeakerTitle(selectedUnit);
        String introText = resolveIntroText(selectedUnit);
        String summaryText = generateSummaryText(apiKey, request, selectedUnit, serviceLabel);
        String spokenText = introText + " " + summaryText;
        String audioBase64 = generateSpeechBase64(apiKey, spokenText);

        return new ConferenceSummaryResponse(
                selectedUnit.getDisplayName(),
                serviceLabel,
                speakerTitle,
                "Csatlakozva",
                introText,
                summaryText,
                spokenText,
                "audio/mpeg",
                audioBase64
        );
    }

    private String generateSummaryText(
            String apiKey,
            ConferenceSummaryRequest request,
            EmergencyUnit selectedUnit,
            String serviceLabel
    ) {
        String prompt = buildPrompt(request, selectedUnit, serviceLabel);

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("model", TEXT_MODEL);
        body.put("input", prompt);

        try {
            HttpRequest httpRequest = HttpRequest.newBuilder()
                    .uri(URI.create(RESPONSES_URL))
                    .timeout(Duration.ofSeconds(60))
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(body)))
                    .build();

            HttpResponse<String> response = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 400) {
                String errorBody = response.body();
                throw new ResponseStatusException(
                        HttpStatus.BAD_GATEWAY,
                        "Az AI szöveges összefoglaló generálása sikertelen volt. OpenAI válasz: " + errorBody
                );
            }

            JsonNode root = objectMapper.readTree(response.body());
            String outputText = extractOutputText(root);

            if (!StringUtils.hasText(outputText)) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_GATEWAY,
                        "Az AI nem adott vissza használható összefoglalót."
                );
            }

            return cleanupModelText(outputText);
        } catch (IOException exception) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "Nem sikerült lekérni az AI konferencia összefoglalót: " + exception.getMessage()
            );
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "Az AI konferencia összefoglaló lekérése megszakadt."
            );
        }
    }

    private String generateSpeechBase64(String apiKey, String spokenText) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("model", TTS_MODEL);
        body.put("voice", TTS_VOICE);
        body.put("input", spokenText);
        body.put("instructions", TTS_INSTRUCTIONS);

        try {
            HttpRequest httpRequest = HttpRequest.newBuilder()
                    .uri(URI.create(SPEECH_URL))
                    .timeout(Duration.ofSeconds(60))
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(body)))
                    .build();

            HttpResponse<byte[]> response = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofByteArray());

            if (response.statusCode() >= 400) {
                String errorBody = new String(response.body());
                throw new ResponseStatusException(
                        HttpStatus.BAD_GATEWAY,
                        "Az AI hanggenerálás sikertelen volt. OpenAI válasz: " + errorBody
                );
            }

            return Base64.getEncoder().encodeToString(response.body());
        } catch (IOException exception) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "Nem sikerült létrehozni az AI konferencia hangját: " + exception.getMessage()
            );
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "Az AI hanggenerálás megszakadt."
            );
        }
    }

    private String buildPrompt(
            ConferenceSummaryRequest request,
            EmergencyUnit selectedUnit,
            String serviceLabel
    ) {
        return """
                Feladat:
                Készíts rövid, természetes, hivatalos magyar nyelvű továbbjelentési összefoglalót a kijelölt készenléti szerv részére.

                Stílus:
                - 2-3 mondatban fogalmazz.
                - Legyen rövid, tárgyszerű, de természetes hangzású.
                - Olyan legyen, mintha a 112 operátor röviden átadná az információt a kapcsolt ügyeletesnek.
                - Ne legyen robotikus, ne legyen túl formális.
                - Ne használj felsorolást.
                - Ne írj megszólítást.
                - Ne említs szituációazonosítót.
                - Ne említs telefonszámot.
                - A bejelentő nevét csak akkor említsd, ha feltétlenül szükséges, egyébként hagyd ki.
                - Csak a megadott adatokból dolgozz.
                - Ne találj ki új tényeket.

                Fókusz:
                - Helyszín
                - Esemény típusa
                - A jegyzetből a legfontosabb operatív információk
                - Miért indokolt a kijelölt szerv bevonása

                Kijelölt szerv típusa:
                %s

                Kijelölt konkrét egység:
                %s

                Bejelentés adatai:
                - Helyszín: %s
                - Esemény típusa / kategória: %s
                - Operátori jegyzet: %s
                """.formatted(
                serviceLabel,
                selectedUnit.getDisplayName(),
                safeText(request.getLocationText()),
                safeText(request.getEventDescription()),
                safeText(request.getUserNote())
        );
    }

    private String extractOutputText(JsonNode root) {
        JsonNode outputTextNode = root.get("output_text");
        if (outputTextNode != null && outputTextNode.isTextual() && StringUtils.hasText(outputTextNode.asText())) {
            return outputTextNode.asText().trim();
        }

        StringBuilder builder = new StringBuilder();

        JsonNode outputArray = root.path("output");
        if (outputArray.isArray()) {
            for (JsonNode outputItem : outputArray) {
                JsonNode contentArray = outputItem.path("content");
                if (!contentArray.isArray()) {
                    continue;
                }

                for (JsonNode contentItem : contentArray) {
                    String text = contentItem.path("text").asText("");
                    if (StringUtils.hasText(text)) {
                        if (!builder.isEmpty()) {
                            builder.append(' ');
                        }
                        builder.append(text.trim());
                    }
                }
            }
        }

        return builder.toString().trim();
    }

    private String cleanupModelText(String text) {
        String cleaned = text.trim();

        if (cleaned.startsWith("\"") && cleaned.endsWith("\"") && cleaned.length() > 1) {
            cleaned = cleaned.substring(1, cleaned.length() - 1).trim();
        }

        cleaned = cleaned.replaceAll("\\s+", " ").trim();

        cleaned = cleaned.replace("112 operátor:", "").trim();
        cleaned = cleaned.replace("Operátor:", "").trim();

        if (!cleaned.endsWith(".") && !cleaned.endsWith("!") && !cleaned.endsWith("?")) {
            cleaned = cleaned + ".";
        }

        return cleaned;
    }

    private String resolveServiceLabel(EmergencyUnit unit) {
        String serviceCode = unit.getServiceType() != null ? unit.getServiceType().getCode() : "";

        return switch (serviceCode) {
            case "AMBULANCE" -> "mentőszolgálat";
            case "FIRE" -> "tűzoltóság";
            case "POLICE" -> "rendőrség";
            default -> "készenléti szerv";
        };
    }

    private String resolveSpeakerTitle(EmergencyUnit unit) {
        String serviceCode = unit.getServiceType() != null ? unit.getServiceType().getCode() : "";

        return switch (serviceCode) {
            case "AMBULANCE" -> "mentőszolgálati ügyelet";
            case "FIRE" -> "tűzoltósági ügyelet";
            case "POLICE" -> "rendőrségi ügyelet";
            default -> "készenléti szerv ügyeletese";
        };
    }

    private String resolveIntroText(EmergencyUnit unit) {
        String displayName = safeText(unit.getDisplayName());
        String serviceCode = unit.getServiceType() != null ? unit.getServiceType().getCode() : "";

        return switch (serviceCode) {
            case "AMBULANCE" -> "Vonalban a " + displayName + " ügyeletese.";
            case "FIRE" -> "Vonalban a " + displayName + " ügyeletese.";
            case "POLICE" -> "Vonalban a " + displayName + " ügyeletese.";
            default -> "Vonalban a " + displayName + " ügyeletese.";
        };
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }
}