package com.app.project.dto;

import java.util.UUID;

public class ProjectRequest {
    private String name;
    private UUID partyId;
    private String status;
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public UUID getPartyId() { return partyId; }
    public void setPartyId(UUID partyId) { this.partyId = partyId; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
