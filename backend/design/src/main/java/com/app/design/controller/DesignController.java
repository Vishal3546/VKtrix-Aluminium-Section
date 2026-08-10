package com.app.design.controller;

import com.app.design.dto.DesignCalculationRequest;
import com.app.design.dto.DesignCalculationResponse;
import com.app.design.service.DesignCalculationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;
import java.util.List;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/v1/designs")
@CrossOrigin(origins = "*") // For local next.js dev
public class DesignController {

    @Autowired
    private DesignCalculationService calculationService;

    @PostMapping("/calculate")
    public ResponseEntity<DesignCalculationResponse> calculateDesign(@RequestBody DesignCalculationRequest request) {
        DesignCalculationResponse response = calculationService.calculateDesign(request);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping
    public ResponseEntity<Map<String, String>> saveDesign(@RequestBody Map<String, Object> payload) {
        // Here we would extract partyId, projectId, designName, etc., and save to DB
        System.out.println("Saving design payload: " + payload.get("designName"));
        
        return ResponseEntity.ok(Map.of(
            "status", "success",
            "message", "Design saved successfully",
            "designId", UUID.randomUUID().toString()
        ));
    }
    
    // Mock endpoints for the UI Dropdowns
    @GetMapping("/profiles")
    public ResponseEntity<List<Map<String, String>>> getProfiles() {
        List<Map<String, String>> profiles = new ArrayList<>();
        profiles.add(Map.of("id", "REGAL_26_3", "name", "26 MM 3 TRACK FRAME REGAL"));
        profiles.add(Map.of("id", "REGAL_26_2", "name", "26 MM 2 TRACK SHUTTER REGAL"));
        return ResponseEntity.ok(profiles);
    }
    
    @GetMapping("/glass-types")
    public ResponseEntity<List<Map<String, String>>> getGlassTypes() {
        List<Map<String, String>> glass = new ArrayList<>();
        glass.add(Map.of("id", "MODI", "name", "Modi Glass"));
        glass.add(Map.of("id", "SAINT", "name", "Saint Gobain Glass"));
        glass.add(Map.of("id", "GALAXY", "name", "galaxy"));
        return ResponseEntity.ok(glass);
    }
}
