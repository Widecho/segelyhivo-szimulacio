package hu.szakdolgozat.backend.dto.scenario;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CreateScenarioResponse {

    private String id;
    private String title;
    private String category;
    private String address;
    private Integer requiredUnitCount;
    private String message;
}