package com.app.profile.domain;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.TenantId;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "profile_pieces")
public class ProfilePiece {

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

    @Column(nullable = false)
    private String type;

    @Column(name = "weight_per_meter")
    private BigDecimal weightPerMeter;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    public ProfilePiece() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getTenantId() { return tenantId; }
    public void setTenantId(UUID tenantId) { this.tenantId = tenantId; }

    public UUID getSystemId() { return systemId; }
    public void setSystemId(UUID systemId) { this.systemId = systemId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public BigDecimal getWeightPerMeter() { return weightPerMeter; }
    public void setWeightPerMeter(BigDecimal weightPerMeter) { this.weightPerMeter = weightPerMeter; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }

    @Column(name = "width_mm")
    private BigDecimal widthMm;

    @Column(name = "height_mm")
    private BigDecimal heightMm;

    @Column(name = "outer_deep_mm")
    private BigDecimal outerDeepMm;

    @Column(name = "inner_deep_mm")
    private BigDecimal innerDeepMm;

    @Column(name = "wall_thickness")
    private BigDecimal wallThickness;

    @Column(name = "angle_degrees")
    private Integer angleDegrees = 45;

    @Enumerated(EnumType.STRING)
    @Column(name = "piece_type")
    private PieceType pieceType;

    public BigDecimal getWidthMm() { return widthMm; }
    public void setWidthMm(BigDecimal widthMm) { this.widthMm = widthMm; }

    public BigDecimal getHeightMm() { return heightMm; }
    public void setHeightMm(BigDecimal heightMm) { this.heightMm = heightMm; }

    public BigDecimal getOuterDeepMm() { return outerDeepMm; }
    public void setOuterDeepMm(BigDecimal outerDeepMm) { this.outerDeepMm = outerDeepMm; }

    public BigDecimal getInnerDeepMm() { return innerDeepMm; }
    public void setInnerDeepMm(BigDecimal innerDeepMm) { this.innerDeepMm = innerDeepMm; }

    public BigDecimal getWallThickness() { return wallThickness; }
    public void setWallThickness(BigDecimal wallThickness) { this.wallThickness = wallThickness; }

    public Integer getAngleDegrees() { return angleDegrees; }
    public void setAngleDegrees(Integer angleDegrees) { this.angleDegrees = angleDegrees; }

    public PieceType getPieceType() { return pieceType; }
    public void setPieceType(PieceType pieceType) { this.pieceType = pieceType; }
}

