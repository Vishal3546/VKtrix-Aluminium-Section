package com.app.profile.controller;

import com.app.profile.dto.CalculationResultDto;
import com.app.profile.service.CalculationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/calculations")
public class CalculationController {

    private final CalculationService calculationService;

    @Autowired
    public CalculationController(CalculationService calculationService) {
        this.calculationService = calculationService;
    }

    @GetMapping("/design/{designId}/system/{systemId}")
    public ResponseEntity<CalculationResultDto> calculateForDesign(
            @PathVariable UUID designId,
            @PathVariable UUID systemId) {
        CalculationResultDto result = calculationService.calculateMaterials(designId, systemId);
        return ResponseEntity.ok(result);
    }
}
