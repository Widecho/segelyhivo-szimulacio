package hu.szakdolgozat.backend.dto.scenario;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class CreateScenarioRequest {

    @NotBlank(message = "A cím megadása kötelező.")
    private String title;

    @NotBlank(message = "A kategória megadása kötelező.")
    private String categoryName;

    @NotBlank(message = "A helyszín megadása kötelező.")
    private String address;

    @NotBlank(message = "A hangfájl neve kötelező.")
    private String audioFileName;

    @NotBlank(message = "Az elvárt jegyzet megadása kötelező.")
    private String expectedNote;

    @NotEmpty(message = "Legalább egy elvárt egységet ki kell választani.")
    private List<Long> selectedUnitIds;
}