package com.app.profile.service;

import com.app.profile.domain.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class DeductionCalculationServiceTest {

    private DeductionCalculationService calculationService;

    @BeforeEach
    void setUp() {
        calculationService = new DeductionCalculationService();
    }

    @Test
    void test3TrackSliderRegal26mm() {
        // Reference example: Frame 3000x3000mm, 3-Track Slider, Regal 26mm profile
        
        // 1. Setup the known reference values based on the 3000x3000mm input
        Map<ReferenceBase, BigDecimal> referenceValues = new HashMap<>();
        referenceValues.put(ReferenceBase.TOTAL_HEIGHT, new BigDecimal("3000.0"));
        referenceValues.put(ReferenceBase.TOTAL_WIDTH, new BigDecimal("3000.0"));
        // Assuming some derived inner track width and frame width for testing the logic
        referenceValues.put(ReferenceBase.INNER_TRACK_WIDTH, new BigDecimal("1000.0")); 
        referenceValues.put(ReferenceBase.FRAME_HEIGHT, new BigDecimal("2931.2"));
        referenceValues.put(ReferenceBase.FRAME_WIDTH, new BigDecimal("1080.0"));

        // 2. Test Shutter Frame Height Rule
        // Rule: subtract 68.8mm from total_height
        PieceDeductionRule shutterHeightRule = new PieceDeductionRule();
        shutterHeightRule.setDimension(Dimension.HEIGHT);
        shutterHeightRule.setReferenceBase(ReferenceBase.TOTAL_HEIGHT);
        shutterHeightRule.setOperation(Operation.SUBTRACT);
        shutterHeightRule.setDeductionValueMm(new BigDecimal("68.8"));
        
        BigDecimal shutterCutHeight = calculationService.calculateCutLength(referenceValues, shutterHeightRule);
        assertEquals(new BigDecimal("2931.2"), shutterCutHeight, "Shutter frame height should be 3000 - 68.8");

        // 3. Test Shutter Frame Width Rule
        // Rule: add 80mm to inner_track_width
        PieceDeductionRule shutterWidthRule = new PieceDeductionRule();
        shutterWidthRule.setDimension(Dimension.WIDTH);
        shutterWidthRule.setReferenceBase(ReferenceBase.INNER_TRACK_WIDTH);
        shutterWidthRule.setOperation(Operation.ADD);
        shutterWidthRule.setDeductionValueMm(new BigDecimal("80.0"));

        BigDecimal shutterCutWidth = calculationService.calculateCutLength(referenceValues, shutterWidthRule);
        assertEquals(new BigDecimal("1080.0"), shutterCutWidth, "Shutter frame width should be 1000 + 80");

        // 4. Test Glass Height Rule
        // Rule: subtract 103.5mm from frame_height
        PieceDeductionRule glassHeightRule = new PieceDeductionRule();
        glassHeightRule.setDimension(Dimension.HEIGHT);
        glassHeightRule.setReferenceBase(ReferenceBase.FRAME_HEIGHT);
        glassHeightRule.setOperation(Operation.SUBTRACT);
        glassHeightRule.setDeductionValueMm(new BigDecimal("103.5"));

        BigDecimal glassCutHeight = calculationService.calculateCutLength(referenceValues, glassHeightRule);
        assertEquals(new BigDecimal("2827.7"), glassCutHeight, "Glass height should be 2931.2 - 103.5");

        // 5. Test Glass Width Rule
        // Rule: subtract 42mm from frame_width
        PieceDeductionRule glassWidthRule = new PieceDeductionRule();
        glassWidthRule.setDimension(Dimension.WIDTH);
        glassWidthRule.setReferenceBase(ReferenceBase.FRAME_WIDTH);
        glassWidthRule.setOperation(Operation.SUBTRACT);
        glassWidthRule.setDeductionValueMm(new BigDecimal("42.0"));

        BigDecimal glassCutWidth = calculationService.calculateCutLength(referenceValues, glassWidthRule);
        assertEquals(new BigDecimal("1038.0"), glassCutWidth, "Glass width should be 1080 - 42");
    }

    @Test
    void testAutoDeriveDeduction() {
        // Formula: deduction = 2 * wall_thickness + overlap_allowance
        ProfilePiece mockPiece = new ProfilePiece();
        mockPiece.setWallThickness(new BigDecimal("2.5")); // 2.5mm wall thickness

        BigDecimal overlapAllowance = new BigDecimal("15.0"); // 15mm overlap
        
        // 2 * 2.5 + 15 = 5 + 15 = 20
        BigDecimal derivedDeduction = calculationService.autoDeriveDeduction(mockPiece, overlapAllowance);
        
        assertEquals(new BigDecimal("20.0"), derivedDeduction, "Auto derived deduction should match 20.0mm");
    }
}
