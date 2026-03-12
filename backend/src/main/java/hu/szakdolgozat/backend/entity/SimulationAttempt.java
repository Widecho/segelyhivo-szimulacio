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
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "simulation_attempt")
@Getter
@Setter
@NoArgsConstructor
public class SimulationAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "scenario_id", nullable = false)
    private Scenario scenario;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private AppUser user;

    @Column(name = "caller_name", nullable = false, length = 150)
    private String callerName;

    @Column(name = "caller_phone", nullable = false, length = 50)
    private String callerPhone;

    @Column(name = "location_text", nullable = false, length = 255)
    private String locationText;

    @Column(name = "event_description", nullable = false, length = 255)
    private String eventDescription;

    @Column(name = "user_note", nullable = false, columnDefinition = "TEXT")
    private String userNote;

    @Column(name = "started_at", nullable = false)
    private LocalDateTime startedAt;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @Column(name = "evaluation_status", nullable = false, length = 30)
    private String evaluationStatus;

    @Column(name = "score")
    private Integer score;

    @Column(name = "matched_unit_count", nullable = false)
    private Integer matchedUnitCount = 0;

    @Column(name = "missing_unit_count", nullable = false)
    private Integer missingUnitCount = 0;

    @Column(name = "incorrect_unit_count", nullable = false)
    private Integer incorrectUnitCount = 0;

    @Column(name = "note_evaluation_status", length = 30)
    private String noteEvaluationStatus;

    @Column(name = "evaluator_summary", columnDefinition = "TEXT")
    private String evaluatorSummary;
}