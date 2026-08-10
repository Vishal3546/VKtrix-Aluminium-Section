package com.app.profile.dto;

import java.util.UUID;

public class AutoDesignRequest {
    private UUID partyId;
    private UUID projectId;
    private UUID profileSystemId;
    private String type;
    private Double widthMm;
    private Double heightMm;
    private Integer shutterCount;
    private Boolean hasMosquitoNet;
    private Boolean hasGrill;
    private String designSelection;
    private String designFor;

    public AutoDesignRequest() {}

    public UUID getPartyId() { return partyId; }
    public void setPartyId(UUID partyId) { this.partyId = partyId; }

    public UUID getProjectId() { return projectId; }
    public void setProjectId(UUID projectId) { this.projectId = projectId; }

    public UUID getProfileSystemId() { return profileSystemId; }
    public void setProfileSystemId(UUID profileSystemId) { this.profileSystemId = profileSystemId; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Double getWidthMm() { return widthMm; }
    public void setWidthMm(Double widthMm) { this.widthMm = widthMm; }

    public Double getHeightMm() { return heightMm; }
    public void setHeightMm(Double heightMm) { this.heightMm = heightMm; }

    public Integer getShutterCount() { return shutterCount; }
    public void setShutterCount(Integer shutterCount) { this.shutterCount = shutterCount; }

    public Boolean getHasMosquitoNet() { return hasMosquitoNet; }
    public void setHasMosquitoNet(Boolean hasMosquitoNet) { this.hasMosquitoNet = hasMosquitoNet; }

    public Boolean getHasGrill() { return hasGrill; }
    public void setHasGrill(Boolean hasGrill) { this.hasGrill = hasGrill; }

    public String getDesignSelection() { return designSelection; }
    public void setDesignSelection(String designSelection) { this.designSelection = designSelection; }

    public String getDesignFor() { return designFor; }
    public void setDesignFor(String designFor) { this.designFor = designFor; }
}
