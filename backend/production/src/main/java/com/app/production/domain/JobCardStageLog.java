package com.app.production.domain;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.TenantId;

@Entity
@Table(name = "job_card_stage_logs")
public class JobCardStageLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @TenantId
    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    @Column(name = "job_card_id", nullable = false)
    private UUID jobCardId;

    @Column(name = "previous_stage", length = 50)
    private String previousStage;

    @Column(name = "new_stage", nullable = false, length = 50)
    private String newStage;

    @Column(name = "changed_by", length = 100)
    private String changedBy;

    @CreationTimestamp
    @Column(name = "changed_at", updatable = false)
    private OffsetDateTime changedAt;

    public JobCardStageLog() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getTenantId() { return tenantId; }
    public void setTenantId(UUID tenantId) { this.tenantId = tenantId; }

    public UUID getJobCardId() { return jobCardId; }
    public void setJobCardId(UUID jobCardId) { this.jobCardId = jobCardId; }

    public String getPreviousStage() { return previousStage; }
    public void setPreviousStage(String previousStage) { this.previousStage = previousStage; }

    public String getNewStage() { return newStage; }
    public void setNewStage(String newStage) { this.newStage = newStage; }

    public String getChangedBy() { return changedBy; }
    public void setChangedBy(String changedBy) { this.changedBy = changedBy; }

    public OffsetDateTime getChangedAt() { return changedAt; }
    public void setChangedAt(OffsetDateTime changedAt) { this.changedAt = changedAt; }
}
