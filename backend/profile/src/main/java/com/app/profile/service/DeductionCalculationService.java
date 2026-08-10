package com.app.profile.service;

import com.app.profile.domain.PieceDeductionRule;
import com.app.profile.domain.ProfilePiece;
import com.app.profile.domain.ReferenceBase;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Map;

@Service
public class DeductionCalculationService {

    /**
     * Calculates the final cut length for a given piece dimension rule.
     *
     * @param referenceValues A map containing the resolved values for various ReferenceBase enums.
     * @param rule The deduction rule to apply.
     * @return The final computed dimension in mm.
     */
    public BigDecimal calculateCutLength(Map<ReferenceBase, BigDecimal> referenceValues, PieceDeductionRule rule) {
        BigDecimal baseValue = referenceValues.get(rule.getReferenceBase());
        
        if (baseValue == null) {
            throw new IllegalArgumentException("Missing reference value for: " + rule.getReferenceBase());
        }

        BigDecimal deduction = rule.getDeductionValueMm();

        switch (rule.getOperation()) {
            case ADD:
                return baseValue.add(deduction);
            case SUBTRACT:
                return baseValue.subtract(deduction);
            default:
                throw new UnsupportedOperationException("Unknown operation: " + rule.getOperation());
        }
    }

    /**
     * Auto-derives the deduction value for a profile piece using its wall thickness and overlap allowance.
     * Formula: deduction = (2 * wall_thickness) + overlap_allowance
     *
     * @param piece The profile piece containing cross-section details.
     * @param overlapAllowance The standard overlap allowance for this dimension.
     * @return The calculated deduction value.
     */
    public BigDecimal autoDeriveDeduction(ProfilePiece piece, BigDecimal overlapAllowance) {
        if (piece.getWallThickness() == null) {
            throw new IllegalArgumentException("Profile piece is missing wall thickness for auto-derivation.");
        }
        
        BigDecimal two = new BigDecimal("2");
        BigDecimal wallDeduction = piece.getWallThickness().multiply(two);
        
        return wallDeduction.add(overlapAllowance);
    }
}
