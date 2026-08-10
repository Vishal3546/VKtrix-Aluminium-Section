package com.app.profile.domain;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.TenantId;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "formula_master")
@Deprecated
public class FormulaMaster {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @TenantId
    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    @Column(name = "system_id", nullable = false)
    private UUID systemId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String expression;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    @Deprecated
    public FormulaMaster() {}

    @Deprecated
    public UUID getId() { return id; }
    @Deprecated
    public void setId(UUID id) { this.id = id; }

    @Deprecated
    public UUID getTenantId() { return tenantId; }
    @Deprecated
    public void setTenantId(UUID tenantId) { this.tenantId = tenantId; }

    @Deprecated
    public UUID getSystemId() { return systemId; }
    @Deprecated
    public void setSystemId(UUID systemId) { this.systemId = systemId; }

    @Deprecated
    public String getName() { return name; }
    @Deprecated
    public void setName(String name) { this.name = name; }

    @Deprecated
    public String getExpression() { return expression; }
    @Deprecated
    public void setExpression(String expression) { this.expression = expression; }

    @Deprecated
    public OffsetDateTime getCreatedAt() { return createdAt; }
    @Deprecated
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    @Deprecated
    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    @Deprecated
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
}
