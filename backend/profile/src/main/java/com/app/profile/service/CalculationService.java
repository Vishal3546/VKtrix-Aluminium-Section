package com.app.profile.service;

import com.app.profile.domain.*;
import com.app.profile.dto.CalculationResultDto;
import com.app.profile.dto.RequiredProfileDto;
import com.app.profile.repository.DesignRepository;
import com.app.profile.repository.PieceDeductionRuleRepository;
import com.app.profile.repository.ProfilePieceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class CalculationService {

    private final DesignRepository designRepository;
    private final ProfilePieceRepository profilePieceRepository;
    private final PieceDeductionRuleRepository pieceDeductionRuleRepository;

    @Autowired
    public CalculationService(DesignRepository designRepository,
                              ProfilePieceRepository profilePieceRepository,
                              PieceDeductionRuleRepository pieceDeductionRuleRepository) {
        this.designRepository = designRepository;
        this.profilePieceRepository = profilePieceRepository;
        this.pieceDeductionRuleRepository = pieceDeductionRuleRepository;
    }

    public CalculationResultDto calculateMaterials(UUID designId, UUID systemId) {
        Design design = designRepository.findById(designId)
                .orElseThrow(() -> new IllegalArgumentException("Design not found: " + designId));

        List<ProfilePiece> systemPieces = profilePieceRepository.findBySystemId(systemId);
        List<RequiredProfileDto> requiredProfiles = new ArrayList<>();

        double overallWidth = design.getWidthMm() != null ? design.getWidthMm() : 0.0;
        double overallHeight = design.getHeightMm() != null ? design.getHeightMm() : 0.0;
        
        int numberOfPanels = design.getPanels() != null && !design.getPanels().isEmpty() 
            ? design.getPanels().size() : 2;

        for (ProfilePiece piece : systemPieces) {
            List<PieceDeductionRule> rules = pieceDeductionRuleRepository.findByProfilePieceId(piece.getId());
            double cutLength = 0.0;
            int quantity = 1;

            if (piece.getPieceType() == PieceType.HORIZONTAL) {
                // If it's a sash, it might be divided by panels. For simplicity in this demo:
                boolean isSash = piece.getName().toLowerCase().contains("sash") || piece.getName().toLowerCase().contains("interlock");
                double baseLength = isSash ? overallWidth / numberOfPanels : overallWidth;
                cutLength = applyRules(baseLength, rules);
                quantity = isSash ? numberOfPanels * 2 : 2; // Top/bottom track (2), or Top/Bottom sash per panel (2 * panels)
            } else if (piece.getPieceType() == PieceType.VERTICAL) {
                boolean isSash = piece.getName().toLowerCase().contains("sash") || piece.getName().toLowerCase().contains("interlock");
                double baseLength = overallHeight;
                cutLength = applyRules(baseLength, rules);
                quantity = isSash ? numberOfPanels * 2 : 2; // Left/right track (2), or Left/Right sash per panel (2 * panels)
            } else {
                 cutLength = overallWidth;
            }

            if (cutLength > 0) {
                requiredProfiles.add(new RequiredProfileDto(
                        piece.getId(),
                        piece.getName(),
                        piece.getPieceType() != null ? piece.getPieceType().name() : "UNKNOWN",
                        quantity,
                        cutLength
                ));
            }
        }

        return new CalculationResultDto(designId, requiredProfiles);
    }

    private double applyRules(double baseLength, List<PieceDeductionRule> rules) {
        double result = baseLength;
        for (PieceDeductionRule rule : rules) {
            double deductionValue = rule.getDeductionValueMm() != null ? rule.getDeductionValueMm().doubleValue() : 0.0;
            
            if (rule.getOperation() == Operation.SUBTRACT) {
                result -= deductionValue;
            } else if (rule.getOperation() == Operation.ADD) {
                result += deductionValue;
            }
        }
        return result;
    }
}
