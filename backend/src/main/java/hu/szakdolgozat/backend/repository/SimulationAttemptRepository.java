package hu.szakdolgozat.backend.repository;

import hu.szakdolgozat.backend.entity.SimulationAttempt;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SimulationAttemptRepository extends JpaRepository<SimulationAttempt, Long> {

    List<SimulationAttempt> findByUser_Username(String username);

    List<SimulationAttempt> findByScenario_Id(String scenarioId);

    long countByEvaluationStatus(String evaluationStatus);
}