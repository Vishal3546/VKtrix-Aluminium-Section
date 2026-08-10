package com.app.inventory.dto;

import java.util.UUID;

public class InventoryTransactionRequest {
    private UUID inventoryItemId;
    private Double quantity;
    private String referenceType;
    private String referenceId;

    public InventoryTransactionRequest() {}

    public UUID getInventoryItemId() { return inventoryItemId; }
    public void setInventoryItemId(UUID inventoryItemId) { this.inventoryItemId = inventoryItemId; }

    public Double getQuantity() { return quantity; }
    public void setQuantity(Double quantity) { this.quantity = quantity; }

    public String getReferenceType() { return referenceType; }
    public void setReferenceType(String referenceType) { this.referenceType = referenceType; }

    public String getReferenceId() { return referenceId; }
    public void setReferenceId(String referenceId) { this.referenceId = referenceId; }
}
