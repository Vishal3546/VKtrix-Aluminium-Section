package com.app.profile.dto;

import java.util.List;
import java.util.UUID;

public class CalculationResultDto {
    private UUID designId;
    private List<RequiredProfileDto> requiredProfiles;

    public CalculationResultDto() {}

    public CalculationResultDto(UUID designId, List<RequiredProfileDto> requiredProfiles) {
        this.designId = designId;
        this.requiredProfiles = requiredProfiles;
    }

    public UUID getDesignId() {
        return designId;
    }

    public void setDesignId(UUID designId) {
        this.designId = designId;
    }

    public List<RequiredProfileDto> getRequiredProfiles() {
        return requiredProfiles;
    }

    public void setRequiredProfiles(List<RequiredProfileDto> requiredProfiles) {
        this.requiredProfiles = requiredProfiles;
    }
}
