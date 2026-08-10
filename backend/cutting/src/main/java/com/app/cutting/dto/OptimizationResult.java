package com.app.cutting.dto;

import java.util.List;
import java.util.UUID;

public class OptimizationResult {
    private UUID jobId;
    private int stockBarsUsed;
    private int offcutsUsed;
    private double scrapPercentage;
    private List<Double> newOffcuts;

    public OptimizationResult() {}

    public UUID getJobId() { return jobId; }
    public void setJobId(UUID jobId) { this.jobId = jobId; }

    public int getStockBarsUsed() { return stockBarsUsed; }
    public void setStockBarsUsed(int stockBarsUsed) { this.stockBarsUsed = stockBarsUsed; }

    public int getOffcutsUsed() { return offcutsUsed; }
    public void setOffcutsUsed(int offcutsUsed) { this.offcutsUsed = offcutsUsed; }

    public double getScrapPercentage() { return scrapPercentage; }
    public void setScrapPercentage(double scrapPercentage) { this.scrapPercentage = scrapPercentage; }

    public List<Double> getNewOffcuts() { return newOffcuts; }
    public void setNewOffcuts(List<Double> newOffcuts) { this.newOffcuts = newOffcuts; }
}
