package com.app.profile.dto;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public class DesignResponse {
    private UUID id;
    private Double widthMm;
    private Double heightMm;
    private String layoutType;
    private Integer gridRows;
    private Integer gridCols;
    private Boolean hasDoor;
    private Integer doorPosition;
    private OffsetDateTime createdAt;
    private List<DesignPanelResponse> panels;

    public DesignResponse() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Double getWidthMm() { return widthMm; }
    public void setWidthMm(Double widthMm) { this.widthMm = widthMm; }

    public Double getHeightMm() { return heightMm; }
    public void setHeightMm(Double heightMm) { this.heightMm = heightMm; }

    public String getLayoutType() { return layoutType; }
    public void setLayoutType(String layoutType) { this.layoutType = layoutType; }

    public Integer getGridRows() { return gridRows; }
    public void setGridRows(Integer gridRows) { this.gridRows = gridRows; }

    public Integer getGridCols() { return gridCols; }
    public void setGridCols(Integer gridCols) { this.gridCols = gridCols; }

    public Boolean getHasDoor() { return hasDoor; }
    public void setHasDoor(Boolean hasDoor) { this.hasDoor = hasDoor; }

    public Integer getDoorPosition() { return doorPosition; }
    public void setDoorPosition(Integer doorPosition) { this.doorPosition = doorPosition; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    public List<DesignPanelResponse> getPanels() { return panels; }
    public void setPanels(List<DesignPanelResponse> panels) { this.panels = panels; }
}
