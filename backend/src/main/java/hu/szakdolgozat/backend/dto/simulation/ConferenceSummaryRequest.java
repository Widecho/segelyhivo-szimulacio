package hu.szakdolgozat.backend.dto.simulation;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ConferenceSummaryRequest {

    @NotBlank(message = "A scenarioId megadása kötelező.")
    private String scenarioId;

    @NotBlank(message = "A bejelentő neve kötelező.")
    private String callerName;

    @NotBlank(message = "A telefonszám kötelező.")
    private String callerPhone;

    @NotBlank(message = "A helyszín megadása kötelező.")
    private String locationText;

    @NotBlank(message = "Az esemény megadása kötelező.")
    private String eventDescription;

    @NotBlank(message = "A jegyzet megadása kötelező.")
    private String userNote;

    @NotEmpty(message = "Legalább egy kijelölt szerv szükséges.")
    private List<Long> selectedUnitIds;
}