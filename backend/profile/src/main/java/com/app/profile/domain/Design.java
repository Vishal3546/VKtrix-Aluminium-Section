package com.app.profile.domain;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity(name = "ProfileModuleDesign")
@Table(name = "designs")
public class Design {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "tenant_id")
    private UUID tenantId;

    @Column(name = "project_id")
    private UUID projectId;

    @Column(name = "name")
    private String name;

    @Column(name = "system_id")
    private UUID systemId;

    @Column(name = "width_mm", nullable = false)
    private Double widthMm;

    @Column(name = "height_mm", nullable = false)
    private Double heightMm;

    @Column(name = "layout_type")
    private String layoutType;

    @Column(name = "grid_rows", nullable = false)
    private Integer gridRows;

    @Column(name = "grid_cols", nullable = false)
    private Integer gridCols;

    @Column(name = "has_door")
    private Boolean hasDoor;

    @Column(name = "door_position")
    private Integer doorPosition;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    @OneToMany(mappedBy = "design", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DesignPanel> panels = new ArrayList<>();

    public Design() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getTenantId() { return tenantId; }
    public void setTenantId(UUID tenantId) { this.tenantId = tenantId; }

    public UUID getProjectId() { return projectId; }
    public void setProjectId(UUID projectId) { this.projectId = projectId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public UUID getSystemId() { return systemId; }
    public void setSystemId(UUID systemId) { this.systemId = systemId; }

    public Double getWidthMm() { return widthMm; }
    public void setWidthMm(Double widthMm) { this.widthMm = widthMm; }

    public Double getHeightMm() { return heightMm; }
    public void setHeightMm(Double heightMm) { this.heightMm = heightMm; }

    public String getLayoutType() { return layoutType; }
    public void setLayoutType(String layoutType) { this.layoutType = layoutType; }

    public Integer getGridRows() { return gridRows; }
    public void setGridRows(Integer gridRows) { this.gridRows = gridRows; }

    public Integer getGridCols() { return gridCols; }
    public void setGridCols(Integer gridCols) { this.gridCols = gridCols; }

    public Boolean getHasDoor() { return hasDoor; }
    public void setHasDoor(Boolean hasDoor) { this.hasDoor = hasDoor; }

    public Integer getDoorPosition() { return doorPosition; }
    public void setDoorPosition(Integer doorPosition) { this.doorPosition = doorPosition; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }

    public List<DesignPanel> getPanels() { return panels; }
    public void setPanels(List<DesignPanel> panels) { this.panels = panels; }
    public void addPanel(DesignPanel panel) {
        panels.add(panel);
        panel.setDesign(this);
    }
    public void removePanel(DesignPanel panel) {
        panels.remove(panel);
        panel.setDesign(null);
    }
}
