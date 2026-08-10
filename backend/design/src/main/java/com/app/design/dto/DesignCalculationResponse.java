package com.app.design.dto;

import java.util.List;

public class DesignCalculationResponse {
    private String designId;
    private double calculatedTotalWidth;
    private double calculatedTotalHeight;
    
    // Detailed BOM / Cutting list can be populated here
    private List<CuttingDetail> cuttingDetails;
    
    // UI Representation for Canvas
    private CanvasLayout layout;

    public String getDesignId() { return designId; }
    public void setDesignId(String designId) { this.designId = designId; }

    public double getCalculatedTotalWidth() { return calculatedTotalWidth; }
    public void setCalculatedTotalWidth(double calculatedTotalWidth) { this.calculatedTotalWidth = calculatedTotalWidth; }

    public double getCalculatedTotalHeight() { return calculatedTotalHeight; }
    public void setCalculatedTotalHeight(double calculatedTotalHeight) { this.calculatedTotalHeight = calculatedTotalHeight; }

    public List<CuttingDetail> getCuttingDetails() { return cuttingDetails; }
    public void setCuttingDetails(List<CuttingDetail> cuttingDetails) { this.cuttingDetails = cuttingDetails; }

    public CanvasLayout getLayout() { return layout; }
    public void setLayout(CanvasLayout layout) { this.layout = layout; }
    
    public static class CuttingDetail {
        private String partName;
        private double qty;
        private double lengthMm;
        private String remarks;

        public String getPartName() { return partName; }
        public void setPartName(String partName) { this.partName = partName; }

        public double getQty() { return qty; }
        public void setQty(double qty) { this.qty = qty; }

        public double getLengthMm() { return lengthMm; }
        public void setLengthMm(double lengthMm) { this.lengthMm = lengthMm; }

        public String getRemarks() { return remarks; }
        public void setRemarks(String remarks) { this.remarks = remarks; }
    }
    
    public static class CanvasLayout {
        private String layoutType;
        private int gridCols;
        private List<CanvasPanel> panels;

        public String getLayoutType() { return layoutType; }
        public void setLayoutType(String layoutType) { this.layoutType = layoutType; }

        public int getGridCols() { return gridCols; }
        public void setGridCols(int gridCols) { this.gridCols = gridCols; }

        public List<CanvasPanel> getPanels() { return panels; }
        public void setPanels(List<CanvasPanel> panels) { this.panels = panels; }
    }
    
    public static class CanvasPanel {
        private String id;
        private int panelIndex;
        private String panelType; // FIXED, SLIDING, CASEMENT
        private double widthMm;
        private double heightMm;
        private double x;
        private double y;
        
        // Parts for canvas display e.g. "14", "63"
        private String topLabel;
        private String bottomLabel;
        private String leftLabel;
        private String rightLabel;
        private String centerLabel;

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

        public int getPanelIndex() { return panelIndex; }
        public void setPanelIndex(int panelIndex) { this.panelIndex = panelIndex; }

        public String getPanelType() { return panelType; }
        public void setPanelType(String panelType) { this.panelType = panelType; }

        public double getWidthMm() { return widthMm; }
        public void setWidthMm(double widthMm) { this.widthMm = widthMm; }

        public double getHeightMm() { return heightMm; }
        public void setHeightMm(double heightMm) { this.heightMm = heightMm; }

        public double getX() { return x; }
        public void setX(double x) { this.x = x; }

        public double getY() { return y; }
        public void setY(double y) { this.y = y; }

        public String getTopLabel() { return topLabel; }
        public void setTopLabel(String topLabel) { this.topLabel = topLabel; }

        public String getBottomLabel() { return bottomLabel; }
        public void setBottomLabel(String bottomLabel) { this.bottomLabel = bottomLabel; }

        public String getLeftLabel() { return leftLabel; }
        public void setLeftLabel(String leftLabel) { this.leftLabel = leftLabel; }

        public String getRightLabel() { return rightLabel; }
        public void setRightLabel(String rightLabel) { this.rightLabel = rightLabel; }

        public String getCenterLabel() { return centerLabel; }
        public void setCenterLabel(String centerLabel) { this.centerLabel = centerLabel; }
    }
}
