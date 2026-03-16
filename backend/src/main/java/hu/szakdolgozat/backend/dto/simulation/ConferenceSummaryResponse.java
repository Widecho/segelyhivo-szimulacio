package hu.szakdolgozat.backend.dto.simulation;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ConferenceSummaryResponse {

    private String unitName;
    private String serviceLabel;
    private String speakerTitle;
    private String statusText;
    private String introText;
    private String summaryText;
    private String spokenText;
    private String audioMimeType;
    private String audioBase64;
}