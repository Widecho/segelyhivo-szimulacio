package hu.szakdolgozat.backend.repository;

import hu.szakdolgozat.backend.entity.SimulationAttemptSelectedUnit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SimulationAttemptSelectedUnitRepository extends JpaRepository<SimulationAttemptSelectedUnit, Long> {

    List<SimulationAttemptSelectedUnit> findBySimulationAttempt_Id(Long simulationAttemptId);

    long countBySimulationAttempt_Id(Long simulationAttemptId);
}