package hu.szakdolgozat.backend.repository;

import hu.szakdolgozat.backend.entity.ScenarioCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ScenarioCategoryRepository extends JpaRepository<ScenarioCategory, Long> {

    Optional<ScenarioCategory> findByName(String name);

    List<ScenarioCategory> findAllByOrderByNameAsc();
}