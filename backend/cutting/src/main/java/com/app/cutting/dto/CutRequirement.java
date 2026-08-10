package com.app.cutting.dto;

public class CutRequirement {
    private String profileType;
    private String color;
    private Double lengthMm;

    public CutRequirement() {}

    public CutRequirement(String profileType, String color, Double lengthMm) {
        this.profileType = profileType;
        this.color = color;
        this.lengthMm = lengthMm;
    }

    public String getProfileType() { return profileType; }
    public void setProfileType(String profileType) { this.profileType = profileType; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public Double getLengthMm() { return lengthMm; }
    public void setLengthMm(Double lengthMm) { this.lengthMm = lengthMm; }
}
