package hu.szakdolgozat.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(
        name = "scenario_required_unit",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uq_scenario_required_unit",
                        columnNames = {"scenario_id", "emergency_unit_id"}
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
public class ScenarioRequiredUnit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "scenario_id", nullable = false)
    private Scenario scenario;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "emergency_unit_id", nullable = false)
    private EmergencyUnit emergencyUnit;
}