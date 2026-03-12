package hu.szakdolgozat.backend.repository;

import hu.szakdolgozat.backend.entity.EmergencyUnit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmergencyUnitRepository extends JpaRepository<EmergencyUnit, Long> {

    List<EmergencyUnit> findByIsActiveTrue();

    List<EmergencyUnit> findByServiceType_CodeAndIsActiveTrue(String serviceTypeCode);
}