package com.app.quotation.dto;

import java.util.UUID;

public class QuotationRequestDto {
    private UUID projectId;
    private UUID designId;
    private UUID systemId;
    private UUID partyId;

    public QuotationRequestDto() {}

    public UUID getProjectId() { return projectId; }
    public void setProjectId(UUID projectId) { this.projectId = projectId; }

    public UUID getDesignId() { return designId; }
    public void setDesignId(UUID designId) { this.designId = designId; }

    public UUID getSystemId() { return systemId; }
    public void setSystemId(UUID systemId) { this.systemId = systemId; }

    public UUID getPartyId() { return partyId; }
    public void setPartyId(UUID partyId) { this.partyId = partyId; }
}
