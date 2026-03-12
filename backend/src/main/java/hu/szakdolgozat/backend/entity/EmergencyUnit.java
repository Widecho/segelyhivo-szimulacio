package hu.szakdolgozat.backend.entity;

import jakarta.persistence.Column;
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
        name = "emergency_unit",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uq_emergency_unit_service_region",
                        columnNames = {"service_type_id", "region_id"}
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
public class EmergencyUnit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "service_type_id", nullable = false)
    private EmergencyServiceType serviceType;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "region_id", nullable = false)
    private Region region;

    @Column(name = "display_name", nullable = false, unique = true, length = 150)
    private String displayName;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive;
}