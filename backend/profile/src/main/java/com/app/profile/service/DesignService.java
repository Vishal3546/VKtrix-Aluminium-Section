package com.app.profile.service;

import com.app.profile.domain.Design;
import com.app.profile.domain.DesignPanel;
import com.app.profile.dto.DesignPanelResponse;
import com.app.profile.dto.DesignRequest;
import com.app.profile.dto.AutoDesignRequest;
import com.app.profile.dto.DesignResponse;
import com.app.profile.repository.DesignRepository;
import com.app.profile.dto.DesignPanelUpdateRequest;
import com.app.profile.repository.DesignPanelRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@SuppressWarnings("deprecation")
public class DesignService {

    private final DesignRepository designRepository;
    private final DesignPanelRepository designPanelRepository;
    private final FormulaEngineService formulaEngineService;

    // Hardcoded for testing since authentication context isn't provided
    private final UUID DEFAULT_TENANT_ID = UUID.fromString("00000000-0000-0000-0000-000000000000");

    public DesignService(DesignRepository designRepository, DesignPanelRepository designPanelRepository, FormulaEngineService formulaEngineService) {
        this.designRepository = designRepository;
        this.designPanelRepository = designPanelRepository;
        this.formulaEngineService = formulaEngineService;
    }

    @Transactional
    public DesignResponse updatePanel(UUID designId, UUID panelId, DesignPanelUpdateRequest request) {
        Design design = designRepository.findById(designId)
                .orElseThrow(() -> new IllegalArgumentException("Design not found"));

        DesignPanel panel = designPanelRepository.findById(panelId)
                .orElseThrow(() -> new IllegalArgumentException("Panel not found"));

        if (!panel.getDesign().getId().equals(designId)) {
            throw new IllegalArgumentException("Panel does not belong to the design");
        }

        if (request.getPanelType() != null) panel.setPanelType(request.getPanelType());
        if (request.getGlassType() != null) panel.setGlassType(request.getGlassType());
        if (request.getMeshType() != null) panel.setMeshType(request.getMeshType());
        if (request.getWidthMm() != null) panel.setWidthMm(request.getWidthMm());
        if (request.getHeightMm() != null) panel.setHeightMm(request.getHeightMm());

        // Recalculate
        Map<String, Double> variables = new HashMap<>();
        variables.put("W", panel.getWidthMm());
        variables.put("H", panel.getHeightMm());

        double frameLength = formulaEngineService.evaluate("(W + H) * 2", variables);
        double mullionLength = formulaEngineService.evaluate("0", variables);
        double glassSqFt = formulaEngineService.evaluate("(W * H) / 92903.04", variables);

        panel.setFrameLength(frameLength);
        panel.setMullionLength(mullionLength);
        panel.setGlassSqFt(glassSqFt);

        designPanelRepository.save(panel);
        return mapToResponse(design);
    }

    @Transactional
    public DesignResponse generateDesign(DesignRequest request) {
        Design design = new Design();
        design.setTenantId(DEFAULT_TENANT_ID);
        design.setWidthMm(request.getWidthMm());
        design.setHeightMm(request.getHeightMm());
        design.setLayoutType(request.getLayoutType());
        design.setGridRows(request.getGridRows());
        design.setGridCols(request.getGridCols());
        design.setHasDoor(request.getHasDoor());
        design.setDoorPosition(request.getDoorPosition());

        int totalPanels = request.getGridRows() * request.getGridCols();
        double panelWidth = request.getWidthMm() / request.getGridCols();
        double panelHeight = request.getHeightMm() / request.getGridRows();

        for (int i = 1; i <= totalPanels; i++) {
            DesignPanel panel = new DesignPanel();
            panel.setPanelIndex(i);
            
            boolean isDoor = request.getHasDoor() != null && request.getHasDoor() && 
                             request.getDoorPosition() != null && request.getDoorPosition() == i;
            
            panel.setPanelType(isDoor ? "DOOR" : "FIXED");
            panel.setWidthMm(panelWidth);
            panel.setHeightMm(panelHeight);

            Map<String, Double> variables = new HashMap<>();
            variables.put("W", panelWidth);
            variables.put("H", panelHeight);

            // Using simple fallback formulas
            double frameLength = formulaEngineService.evaluate("(W + H) * 2", variables);
            double mullionLength = formulaEngineService.evaluate("0", variables); // Simplified
            double glassSqFt = formulaEngineService.evaluate("(W * H) / 92903.04", variables); // mm^2 to sq ft

            panel.setFrameLength(frameLength);
            panel.setMullionLength(mullionLength);
            panel.setGlassSqFt(glassSqFt);

            design.addPanel(panel);
        }

        Design savedDesign = designRepository.save(design);
        return mapToResponse(savedDesign);
    }

    @Transactional
    public DesignResponse autoGenerateDesign(AutoDesignRequest request) {
        Design design = new Design();
        design.setTenantId(DEFAULT_TENANT_ID);
        design.setWidthMm(request.getWidthMm());
        design.setHeightMm(request.getHeightMm());
        design.setLayoutType(request.getType());
        design.setGridRows(1);
        Integer shutterCount = request.getShutterCount();
        design.setGridCols(shutterCount != null ? shutterCount : 1);
        design.setProjectId(request.getProjectId());
        design.setName(request.getType() != null ? request.getType() + " Design" : "Auto Generated Design");
        design.setSystemId(request.getProfileSystemId());
        
        // You would typically link the partyId and projectId to this design in a real system
        // But for now we just process the design panels.

        int totalPanels = design.getGridCols();
        double panelWidth = request.getWidthMm() / design.getGridCols();
        double panelHeight = request.getHeightMm();

        for (int i = 1; i <= totalPanels; i++) {
            DesignPanel panel = new DesignPanel();
            panel.setPanelIndex(i);
            panel.setPanelType("SLIDER"); // Or whatever fits the Auto Design logic
            panel.setWidthMm(panelWidth);
            panel.setHeightMm(panelHeight);

            Map<String, Double> variables = new HashMap<>();
            variables.put("W", panelWidth);
            variables.put("H", panelHeight);

            double frameLength = formulaEngineService.evaluate("(W + H) * 2", variables);
            double mullionLength = formulaEngineService.evaluate("0", variables);
            double glassSqFt = formulaEngineService.evaluate("(W * H) / 92903.04", variables);

            panel.setFrameLength(frameLength);
            panel.setMullionLength(mullionLength);
            panel.setGlassSqFt(glassSqFt);
            
            if (request.getHasMosquitoNet() != null && request.getHasMosquitoNet()) {
                panel.setMeshType("FIBER");
            }

            design.addPanel(panel);
        }

        Design savedDesign = designRepository.save(design);
        return mapToResponse(savedDesign);
    }

    private DesignResponse mapToResponse(Design design) {
        DesignResponse response = new DesignResponse();
        response.setId(design.getId());
        response.setWidthMm(design.getWidthMm());
        response.setHeightMm(design.getHeightMm());
        response.setLayoutType(design.getLayoutType());
        response.setGridRows(design.getGridRows());
        response.setGridCols(design.getGridCols());
        response.setHasDoor(design.getHasDoor());
        response.setDoorPosition(design.getDoorPosition());
        response.setCreatedAt(design.getCreatedAt());

        List<DesignPanelResponse> panelResponses = design.getPanels().stream().map(p -> {
            DesignPanelResponse pr = new DesignPanelResponse();
            pr.setId(p.getId());
            pr.setPanelIndex(p.getPanelIndex());
            pr.setPanelType(p.getPanelType());
            pr.setWidthMm(p.getWidthMm());
            pr.setHeightMm(p.getHeightMm());
            pr.setFrameLength(p.getFrameLength());
            pr.setMullionLength(p.getMullionLength());
            pr.setGlassSqFt(p.getGlassSqFt());
            pr.setGlassType(p.getGlassType());
            pr.setMeshType(p.getMeshType());
            return pr;
        }).collect(Collectors.toList());

        response.setPanels(panelResponses);
        return response;
    }
}
