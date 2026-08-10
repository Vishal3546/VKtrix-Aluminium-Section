package com.app.production.dto;

public class StageUpdateRequest {
    private String newStage;
    private String workerName;

    public StageUpdateRequest() {}

    public String getNewStage() { return newStage; }
    public void setNewStage(String newStage) { this.newStage = newStage; }

    public String getWorkerName() { return workerName; }
    public void setWorkerName(String workerName) { this.workerName = workerName; }
}
