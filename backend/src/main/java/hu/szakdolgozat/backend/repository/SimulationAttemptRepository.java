package hu.szakdolgozat.backend.repository;

import hu.szakdolgozat.backend.entity.SimulationAttempt;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SimulationAttemptRepository extends JpaRepository<SimulationAttempt, Long> {

    List<SimulationAttempt> findByUser_Username(String username);

    List<SimulationAttempt> findByUser_UsernameOrderBySubmittedAtDesc(String username);

    List<SimulationAttempt> findByUser_UsernameAndScenario_IdIn(String username, List<String> scenarioIds);

    long countByEvaluationStatus(String evaluationStatus);

    long countByScenario_Id(String scenarioId);
}