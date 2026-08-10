package com.app.quotation.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public class QuotationRequest {
    private UUID projectId;
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
}
