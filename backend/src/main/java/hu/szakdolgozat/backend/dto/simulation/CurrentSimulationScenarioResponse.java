package hu.szakdolgozat.backend.dto.simulation;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CurrentSimulationScenarioResponse {

    private String id;
    private String title;
    private String category;
    private String address;
    private String audioFileName;
}