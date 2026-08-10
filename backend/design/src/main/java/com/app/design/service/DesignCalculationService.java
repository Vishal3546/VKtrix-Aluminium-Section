package com.app.design.service;

import com.app.design.dto.DesignCalculationRequest;
import com.app.design.dto.DesignCalculationResponse;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class DesignCalculationService {

    public DesignCalculationResponse calculateDesign(DesignCalculationRequest request) {
        DesignCalculationResponse response = new DesignCalculationResponse();
        response.setDesignId(UUID.randomUUID().toString());
        response.setCalculatedTotalWidth(request.getWidthMm());
        response.setCalculatedTotalHeight(request.getHeightMm());
        
        List<DesignCalculationResponse.CuttingDetail> cuttingDetails = new ArrayList<>();
        
        // --- 1. Shutter Frame Calculation Logic ---
        double shutterHeightMm = request.getHeightMm();
        if (request.isShutterLessFromTotalHeight()) {
            shutterHeightMm -= 30; // standard mock deduction for 26mm profile
        }
        shutterHeightMm += request.getShutterAddToInnerTrackHeight();
        
        double shutterWidthMm = request.getWidthMm();
        if (request.isShutterLessFromTotalWidth()) {
            shutterWidthMm -= 30; // mock deduction
        }
        if (request.isShutterLessFromInnerTrackWidth()) {
            shutterWidthMm -= 15; // mock inner track deduction
        }
        shutterWidthMm += request.getShutterAddToInnerTrackWidth();

        // --- 2. Glass Calculation Logic ---
        double glassHeightMm = shutterHeightMm;
        if (request.isGlassLessFromFrameHeight()) {
            glassHeightMm -= 50; 
        }
        glassHeightMm += request.getGlassAddToFrameHeight();
        
        double glassWidthMm = shutterWidthMm;
        if (request.isGlassLessFromFrameWidth()) {
            glassWidthMm -= 50;
        }
        glassWidthMm += request.getGlassAddToFrameWidth();
        
        // Add cutting details (mock BOM)
        DesignCalculationResponse.CuttingDetail topShutter = new DesignCalculationResponse.CuttingDetail();
        topShutter.setPartName("Top Shutter (" + request.getTopShutterFrameId() + ")");
        topShutter.setQty(1);
        topShutter.setLengthMm(shutterWidthMm);
        cuttingDetails.add(topShutter);
        
        DesignCalculationResponse.CuttingDetail glassDetail = new DesignCalculationResponse.CuttingDetail();
        glassDetail.setPartName(String.format("Glass %s", request.getGlassProfile()));
        glassDetail.setQty(1); // Depending on layout cols
        glassDetail.setLengthMm(glassHeightMm);
        glassDetail.setRemarks(String.format("W: %.1f mm, H: %.1f mm", glassWidthMm, glassHeightMm));
        cuttingDetails.add(glassDetail);
        
        response.setCuttingDetails(cuttingDetails);
        
        // --- 3. UI Layout Generation ---
        DesignCalculationResponse.CanvasLayout layout = generateCanvasLayout(request);
        response.setLayout(layout);
        
        return response;
    }
    
    private DesignCalculationResponse.CanvasLayout generateCanvasLayout(DesignCalculationRequest request) {
        DesignCalculationResponse.CanvasLayout layout = new DesignCalculationResponse.CanvasLayout();
        layout.setLayoutType(request.getLayoutType());
        
        int cols = 1;
        String type = "FIXED";
        if (request.getLayoutType() != null) {
            if (request.getLayoutType().contains("Slider")) {
                try {
                    cols = Integer.parseInt(request.getLayoutType().split("-")[0]);
                } catch (NumberFormatException e) {
                    cols = 2;
                }
                type = "SLIDING";
            } else if (request.getLayoutType().contains("Casement")) {
                type = "CASEMENT";
            }
        }
        layout.setGridCols(cols);
        
        List<DesignCalculationResponse.CanvasPanel> panels = new ArrayList<>();
        double panelWidth = request.getWidthMm() / cols;
        
        for (int i = 0; i < cols; i++) {
            DesignCalculationResponse.CanvasPanel panel = new DesignCalculationResponse.CanvasPanel();
            panel.setId("p" + (i + 1));
            panel.setPanelIndex(i + 1);
            panel.setPanelType(type);
            panel.setWidthMm(panelWidth);
            panel.setHeightMm(request.getHeightMm());
            panel.setX(i * panelWidth);
            panel.setY(0);
            
            // Generate part labels (red numbers on canvas)
            int startIdx = (i * 4) + 2;
            panel.setTopLabel(String.valueOf(startIdx));
            panel.setBottomLabel(String.valueOf(startIdx + 1));
            panel.setLeftLabel(String.valueOf(startIdx + 2));
            panel.setRightLabel(String.valueOf(startIdx + 3));
            panel.setCenterLabel(String.valueOf(60 + (i + 1))); // e.g. 61, 62
            
            panels.add(panel);
        }
        layout.setPanels(panels);
        return layout;
    }
}
