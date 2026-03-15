package hu.szakdolgozat.backend.dto.scenario;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UpdateScenarioStatusRequest {

    private Boolean isActive;
}