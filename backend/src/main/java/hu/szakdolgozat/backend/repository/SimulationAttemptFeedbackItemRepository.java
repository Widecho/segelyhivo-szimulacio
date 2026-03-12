package hu.szakdolgozat.backend.repository;

import hu.szakdolgozat.backend.entity.SimulationAttemptFeedbackItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SimulationAttemptFeedbackItemRepository extends JpaRepository<SimulationAttemptFeedbackItem, Long> {

    List<SimulationAttemptFeedbackItem> findBySimulationAttempt_Id(Long simulationAttemptId);

    long countBySimulationAttempt_Id(Long simulationAttemptId);
}