package hu.szakdolgozat.backend.dto.scenario;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
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

    @NotEmpty(message = "Legalább egy készenléti egységet ki kell választani.")
    private List<Long> selectedUnitIds;

    @NotNull(message = "A szélességi koordináta megadása kötelező.")
    @DecimalMin(value = "-90.0", message = "A szélességi koordináta túl kicsi.")
    @DecimalMax(value = "90.0", message = "A szélességi koordináta túl nagy.")
    private BigDecimal latitude;

    @NotNull(message = "A hosszúsági koordináta megadása kötelező.")
    @DecimalMin(value = "-180.0", message = "A hosszúsági koordináta túl kicsi.")
    @DecimalMax(value = "180.0", message = "A hosszúsági koordináta túl nagy.")
    private BigDecimal longitude;
}