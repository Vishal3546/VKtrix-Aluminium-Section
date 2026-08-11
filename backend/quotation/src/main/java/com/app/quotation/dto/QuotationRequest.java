package com.app.quotation.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.time.LocalDate;

public class QuotationRequest {
    private UUID projectId;
    private UUID partyId;
    private List<UUID> designIds;
    private UUID systemId;
    private BigDecimal ratePerSqFt;

    public QuotationRequest() {}

    public UUID getProjectId() { return projectId; }
    public void setProjectId(UUID projectId) { this.projectId = projectId; }

    public List<UUID> getDesignIds() { return designIds; }
    public void setDesignIds(List<UUID> designIds) { this.designIds = designIds; }

    public UUID getSystemId() { return systemId; }
    public void setSystemId(UUID systemId) { this.systemId = systemId; }

    public BigDecimal getRatePerSqFt() { return ratePerSqFt; }
    public void setRatePerSqFt(BigDecimal ratePerSqFt) { this.ratePerSqFt = ratePerSqFt; }

    private BigDecimal discountPercent;
    private BigDecimal transportationCost;
    private BigDecimal loadingUnloadingCost;
    private BigDecimal gstPercent;

    public BigDecimal getDiscountPercent() { return discountPercent; }
    public void setDiscountPercent(BigDecimal discountPercent) { this.discountPercent = discountPercent; }

    public BigDecimal getTransportationCost() { return transportationCost; }
    public void setTransportationCost(BigDecimal transportationCost) { this.transportationCost = transportationCost; }

    public BigDecimal getLoadingUnloadingCost() { return loadingUnloadingCost; }
    public void setLoadingUnloadingCost(BigDecimal loadingUnloadingCost) { this.loadingUnloadingCost = loadingUnloadingCost; }

    public BigDecimal getGstPercent() { return gstPercent; }
    public void setGstPercent(BigDecimal gstPercent) { this.gstPercent = gstPercent; }

    private LocalDate quotationDate;
    private LocalDate validUntil;
    private String pricingTier;
    private String notes;

    public UUID getPartyId() { return partyId; }
    public void setPartyId(UUID partyId) { this.partyId = partyId; }

    public LocalDate getQuotationDate() { return quotationDate; }
    public void setQuotationDate(LocalDate quotationDate) { this.quotationDate = quotationDate; }

    public LocalDate getValidUntil() { return validUntil; }
    public void setValidUntil(LocalDate validUntil) { this.validUntil = validUntil; }

    public String getPricingTier() { return pricingTier; }
    public void setPricingTier(String pricingTier) { this.pricingTier = pricingTier; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
