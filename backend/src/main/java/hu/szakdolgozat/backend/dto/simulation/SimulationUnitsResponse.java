package hu.szakdolgozat.backend.dto.simulation;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class SimulationUnitsResponse {

    private List<SimulationUnitOptionResponse> fire;
    private List<SimulationUnitOptionResponse> ambulance;
    private List<SimulationUnitOptionResponse> police;
}