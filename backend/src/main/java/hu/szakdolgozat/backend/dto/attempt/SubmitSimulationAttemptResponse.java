package hu.szakdolgozat.backend.dto.attempt;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SubmitSimulationAttemptResponse {

    private Long attemptId;
    private String evaluationStatus;
    private Integer score;
    private Integer matchedUnitCount;
    private Integer missingUnitCount;
    private Integer incorrectUnitCount;
    private String noteEvaluationStatus;
    private String evaluatorSummary;
}