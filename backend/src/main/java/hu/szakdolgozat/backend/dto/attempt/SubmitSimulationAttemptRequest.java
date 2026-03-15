package hu.szakdolgozat.backend.dto.attempt;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class SubmitSimulationAttemptRequest {

    @NotBlank(message = "A scenarioId megadása kötelező.")
    private String scenarioId;

    @NotBlank(message = "A bejelentő neve kötelező.")
    private String callerName;

    @NotBlank(message = "A telefonszám kötelező.")
    private String callerPhone;

    @NotBlank(message = "A helyszín kötelező.")
    private String locationText;

    @NotBlank(message = "Az esemény leírása kötelező.")
    private String eventDescription;

    @NotBlank(message = "A jegyzet kötelező.")
    private String userNote;

    @NotEmpty(message = "Legalább egy egységet ki kell választani.")
    private List<Long> selectedUnitIds;
}