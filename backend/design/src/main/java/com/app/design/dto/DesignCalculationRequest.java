package com.app.design.dto;

public class DesignCalculationRequest {
    private double widthMm;
    private double heightMm;
    private String layoutType; // e.g. "4-Slider", "2-Track"
    
    // Profiles
    private String profileSeries;
    private String glassProfile;
    
    private String topShutterFrameId;
    private String leftShutterFrameId;
    private String rightShutterFrameId;
    private String bottomShutterFrameId;
    
    // Cutting Adjustments (Height)
    private boolean shutterLessFromTotalHeight;
    private double shutterAddToInnerTrackHeight;
    
    // Cutting Adjustments (Width)
    private boolean shutterLessFromTotalWidth;
    private boolean shutterLessFromInnerTrackWidth;
    private double shutterAddToInnerTrackWidth;
    
    // Glass Adjustments
    private boolean glassLessFromFrameHeight;
    private double glassAddToFrameHeight;
    private boolean glassLessFromFrameWidth;
    private double glassAddToFrameWidth;

    public double getWidthMm() { return widthMm; }
    public void setWidthMm(double widthMm) { this.widthMm = widthMm; }

    public double getHeightMm() { return heightMm; }
    public void setHeightMm(double heightMm) { this.heightMm = heightMm; }

    public String getLayoutType() { return layoutType; }
    public void setLayoutType(String layoutType) { this.layoutType = layoutType; }

    public String getProfileSeries() { return profileSeries; }
    public void setProfileSeries(String profileSeries) { this.profileSeries = profileSeries; }

    public String getGlassProfile() { return glassProfile; }
    public void setGlassProfile(String glassProfile) { this.glassProfile = glassProfile; }

    public String getTopShutterFrameId() { return topShutterFrameId; }
    public void setTopShutterFrameId(String topShutterFrameId) { this.topShutterFrameId = topShutterFrameId; }

    public String getLeftShutterFrameId() { return leftShutterFrameId; }
    public void setLeftShutterFrameId(String leftShutterFrameId) { this.leftShutterFrameId = leftShutterFrameId; }

    public String getRightShutterFrameId() { return rightShutterFrameId; }
    public void setRightShutterFrameId(String rightShutterFrameId) { this.rightShutterFrameId = rightShutterFrameId; }

    public String getBottomShutterFrameId() { return bottomShutterFrameId; }
    public void setBottomShutterFrameId(String bottomShutterFrameId) { this.bottomShutterFrameId = bottomShutterFrameId; }

    public boolean isShutterLessFromTotalHeight() { return shutterLessFromTotalHeight; }
    public void setShutterLessFromTotalHeight(boolean shutterLessFromTotalHeight) { this.shutterLessFromTotalHeight = shutterLessFromTotalHeight; }

    public double getShutterAddToInnerTrackHeight() { return shutterAddToInnerTrackHeight; }
    public void setShutterAddToInnerTrackHeight(double shutterAddToInnerTrackHeight) { this.shutterAddToInnerTrackHeight = shutterAddToInnerTrackHeight; }

    public boolean isShutterLessFromTotalWidth() { return shutterLessFromTotalWidth; }
    public void setShutterLessFromTotalWidth(boolean shutterLessFromTotalWidth) { this.shutterLessFromTotalWidth = shutterLessFromTotalWidth; }

    public boolean isShutterLessFromInnerTrackWidth() { return shutterLessFromInnerTrackWidth; }
    public void setShutterLessFromInnerTrackWidth(boolean shutterLessFromInnerTrackWidth) { this.shutterLessFromInnerTrackWidth = shutterLessFromInnerTrackWidth; }

    public double getShutterAddToInnerTrackWidth() { return shutterAddToInnerTrackWidth; }
    public void setShutterAddToInnerTrackWidth(double shutterAddToInnerTrackWidth) { this.shutterAddToInnerTrackWidth = shutterAddToInnerTrackWidth; }

    public boolean isGlassLessFromFrameHeight() { return glassLessFromFrameHeight; }
    public void setGlassLessFromFrameHeight(boolean glassLessFromFrameHeight) { this.glassLessFromFrameHeight = glassLessFromFrameHeight; }

    public double getGlassAddToFrameHeight() { return glassAddToFrameHeight; }
    public void setGlassAddToFrameHeight(double glassAddToFrameHeight) { this.glassAddToFrameHeight = glassAddToFrameHeight; }

    public boolean isGlassLessFromFrameWidth() { return glassLessFromFrameWidth; }
    public void setGlassLessFromFrameWidth(boolean glassLessFromFrameWidth) { this.glassLessFromFrameWidth = glassLessFromFrameWidth; }

    public double getGlassAddToFrameWidth() { return glassAddToFrameWidth; }
    public void setGlassAddToFrameWidth(double glassAddToFrameWidth) { this.glassAddToFrameWidth = glassAddToFrameWidth; }
}
