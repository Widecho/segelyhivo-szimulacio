package hu.szakdolgozat.backend.repository;

import hu.szakdolgozat.backend.entity.EmergencyServiceType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmergencyServiceTypeRepository extends JpaRepository<EmergencyServiceType, Long> {

    Optional<EmergencyServiceType> findByCode(String code);
}