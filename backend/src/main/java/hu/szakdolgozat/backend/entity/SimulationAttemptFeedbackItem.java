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

@Entity
@Table(name = "simulation_attempt_feedback_item")
@Getter
@Setter
@NoArgsConstructor
public class SimulationAttemptFeedbackItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "simulation_attempt_id", nullable = false)
    private SimulationAttempt simulationAttempt;

    @Column(name = "feedback_type", nullable = false, length = 30)
    private String feedbackType;

    @Column(name = "message", nullable = false, columnDefinition = "TEXT")
    private String message;
}