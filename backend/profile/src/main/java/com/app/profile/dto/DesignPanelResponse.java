package com.app.profile.dto;

import java.util.UUID;

public class DesignPanelResponse {
    private UUID id;
    private Integer panelIndex;
    private String panelType;
    private Double widthMm;
    private Double heightMm;
    private Double frameLength;
    private Double mullionLength;
    private Double glassSqFt;
    private String glassType;
    private String meshType;

    public DesignPanelResponse() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Integer getPanelIndex() { return panelIndex; }
    public void setPanelIndex(Integer panelIndex) { this.panelIndex = panelIndex; }

    public String getPanelType() { return panelType; }
    public void setPanelType(String panelType) { this.panelType = panelType; }

    public Double getWidthMm() { return widthMm; }
    public void setWidthMm(Double widthMm) { this.widthMm = widthMm; }

    public Double getHeightMm() { return heightMm; }
    public void setHeightMm(Double heightMm) { this.heightMm = heightMm; }

    public Double getFrameLength() { return frameLength; }
    public void setFrameLength(Double frameLength) { this.frameLength = frameLength; }

    public Double getMullionLength() { return mullionLength; }
    public void setMullionLength(Double mullionLength) { this.mullionLength = mullionLength; }

    public Double getGlassSqFt() { return glassSqFt; }
    public void setGlassSqFt(Double glassSqFt) { this.glassSqFt = glassSqFt; }

    public String getGlassType() { return glassType; }
    public void setGlassType(String glassType) { this.glassType = glassType; }

    public String getMeshType() { return meshType; }
    public void setMeshType(String meshType) { this.meshType = meshType; }
}
