package hu.szakdolgozat.backend.repository;

import hu.szakdolgozat.backend.entity.Scenario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ScenarioRepository extends JpaRepository<Scenario, String> {

    List<Scenario> findByIsActiveTrue();

    List<Scenario> findByIsActiveTrueOrderByCreatedAtDesc();

    List<Scenario> findByCategory_Name(String categoryName);

    long countByIsActiveTrue();

    Optional<Scenario> findFirstByIsActiveTrueOrderByCreatedAtDesc();

    Optional<Scenario> findTopByOrderByIdDesc();

    List<Scenario> findAllByOrderByCreatedAtDesc();
}