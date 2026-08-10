package com.app.profile.dto;

import java.util.UUID;

public class RequiredProfileDto {
    private UUID profilePieceId;
    private String profileName;
    private String pieceType;
    private int quantity;
    private double cutLengthMm;

    public RequiredProfileDto() {}

    public RequiredProfileDto(UUID profilePieceId, String profileName, String pieceType, int quantity, double cutLengthMm) {
        this.profilePieceId = profilePieceId;
        this.profileName = profileName;
        this.pieceType = pieceType;
        this.quantity = quantity;
        this.cutLengthMm = cutLengthMm;
    }

    public UUID getProfilePieceId() {
        return profilePieceId;
    }

    public void setProfilePieceId(UUID profilePieceId) {
        this.profilePieceId = profilePieceId;
    }

    public String getProfileName() {
        return profileName;
    }

    public void setProfileName(String profileName) {
        this.profileName = profileName;
    }

    public String getPieceType() {
        return pieceType;
    }

    public void setPieceType(String pieceType) {
        this.pieceType = pieceType;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public double getCutLengthMm() {
        return cutLengthMm;
    }

    public void setCutLengthMm(double cutLengthMm) {
        this.cutLengthMm = cutLengthMm;
    }
}
