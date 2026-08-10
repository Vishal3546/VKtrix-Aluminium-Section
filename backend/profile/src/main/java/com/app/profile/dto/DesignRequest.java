package com.app.profile.dto;

public class DesignRequest {
    private Double widthMm;
    private Double heightMm;
    private String layoutType;
    private Integer gridRows;
    private Integer gridCols;
    private Boolean hasDoor;
    private Integer doorPosition;

    public DesignRequest() {}

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
}
