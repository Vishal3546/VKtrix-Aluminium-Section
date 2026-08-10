package com.app.profile.dto;

public class DesignPanelUpdateRequest {
    private String panelType;
    private Double widthMm;
    private Double heightMm;
    private String glassType;
    private String meshType;

    public DesignPanelUpdateRequest() {}

    public String getPanelType() { return panelType; }
    public void setPanelType(String panelType) { this.panelType = panelType; }

    public Double getWidthMm() { return widthMm; }
    public void setWidthMm(Double widthMm) { this.widthMm = widthMm; }

    public Double getHeightMm() { return heightMm; }
    public void setHeightMm(Double heightMm) { this.heightMm = heightMm; }

    public String getGlassType() { return glassType; }
    public void setGlassType(String glassType) { this.glassType = glassType; }

    public String getMeshType() { return meshType; }
    public void setMeshType(String meshType) { this.meshType = meshType; }
}
