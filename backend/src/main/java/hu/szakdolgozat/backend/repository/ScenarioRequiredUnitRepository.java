package hu.szakdolgozat.backend.repository;

import hu.szakdolgozat.backend.entity.ScenarioRequiredUnit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ScenarioRequiredUnitRepository extends JpaRepository<ScenarioRequiredUnit, Long> {

    List<ScenarioRequiredUnit> findByScenario_Id(String scenarioId);

    long countByScenario_Id(String scenarioId);
}