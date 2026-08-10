package com.app.design.domain;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.TenantId;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "design_panel_glass")
public class PanelGlass {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @TenantId
    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    @Column(name = "panel_id", nullable = false)
    private UUID panelId;

    @Column(name = "glass_id", nullable = false)
    private UUID glassId;

    @Column(name = "pane_number", nullable = false)
    private Integer paneNumber;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    public PanelGlass() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getTenantId() { return tenantId; }
    public void setTenantId(UUID tenantId) { this.tenantId = tenantId; }

    public UUID getPanelId() { return panelId; }
    public void setPanelId(UUID panelId) { this.panelId = panelId; }

    public UUID getGlassId() { return glassId; }
    public void setGlassId(UUID glassId) { this.glassId = glassId; }

    public Integer getPaneNumber() { return paneNumber; }
    public void setPaneNumber(Integer paneNumber) { this.paneNumber = paneNumber; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
}
