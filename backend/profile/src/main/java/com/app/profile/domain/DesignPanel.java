package com.app.profile.domain;

import jakarta.persistence.*;
import java.util.UUID;

@Entity(name = "ProfileModuleDesignPanel")
@Table(name = "design_panels")
public class DesignPanel {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "design_id", nullable = false)
    private Design design;

    @Column(name = "panel_index", nullable = false)
    private Integer panelIndex;

    @Column(name = "panel_type", nullable = false)
    private String panelType = "GLASS";

    @Column(name = "width_mm", nullable = false)
    private Double widthMm;

    @Column(name = "height_mm", nullable = false)
    private Double heightMm;

    @Column(name = "frame_length")
    private Double frameLength;

    @Column(name = "mullion_length")
    private Double mullionLength;

    @Column(name = "glass_sqft")
    private Double glassSqFt;

    @Column(name = "glass_type")
    private String glassType;

    @Column(name = "mesh_type")
    private String meshType;

    public DesignPanel() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Design getDesign() { return design; }
    public void setDesign(Design design) { this.design = design; }

    public Integer getPanelIndex() { return panelIndex; }
    public void setPanelIndex(Integer panelIndex) { this.panelIndex = panelIndex; }

    public String getPanelType() { return panelType; }
    public void setPanelType(String panelType) { this.panelType = panelType; }

    public Double getWidthMm() { return widthMm; }
    public void setWidthMm(Double widthMm) { this.widthMm = widthMm; }

    public Double getHeightMm() { return heightMm; }
    public void setHeightMm(Double heightMm) { this.heightMm = heightMm; }

    public Double getFrameLength() { return frameLength; }
    public void setFrameLength(Double frameLength) { this.frameLength = frameLength; }

    public Double getMullionLength() { return mullionLength; }
    public void setMullionLength(Double mullionLength) { this.mullionLength = mullionLength; }

    public Double getGlassSqFt() { return glassSqFt; }
    public void setGlassSqFt(Double glassSqFt) { this.glassSqFt = glassSqFt; }

    public String getGlassType() { return glassType; }
    public void setGlassType(String glassType) { this.glassType = glassType; }

    public String getMeshType() { return meshType; }
    public void setMeshType(String meshType) { this.meshType = meshType; }
}
