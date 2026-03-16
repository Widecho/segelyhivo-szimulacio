package hu.szakdolgozat.backend.dto.scenario;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@AllArgsConstructor
public class ScenarioDetailsResponse {

    private String id;
    private String title;
    private String categoryName;
    private String address;
    private String audioFileName;
    private String expectedNote;
    private Boolean isActive;
    private List<Long> selectedUnitIds;
    private List<String> selectedUnitNames;
    private String createdByUsername;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private BigDecimal latitude;
    private BigDecimal longitude;
}