package com.app.profile.domain;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "piece_deduction_rules")
public class PieceDeductionRule {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_piece_id", nullable = false)
    private ProfilePiece profilePiece;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Dimension dimension;

    @Enumerated(EnumType.STRING)
    @Column(name = "reference_base", nullable = false)
    private ReferenceBase referenceBase;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Operation operation;

    @Column(name = "deduction_value_mm", nullable = false)
    private BigDecimal deductionValueMm;

    public PieceDeductionRule() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public ProfilePiece getProfilePiece() { return profilePiece; }
    public void setProfilePiece(ProfilePiece profilePiece) { this.profilePiece = profilePiece; }

    public Dimension getDimension() { return dimension; }
    public void setDimension(Dimension dimension) { this.dimension = dimension; }

    public ReferenceBase getReferenceBase() { return referenceBase; }
    public void setReferenceBase(ReferenceBase referenceBase) { this.referenceBase = referenceBase; }

    public Operation getOperation() { return operation; }
    public void setOperation(Operation operation) { this.operation = operation; }

    public BigDecimal getDeductionValueMm() { return deductionValueMm; }
    public void setDeductionValueMm(BigDecimal deductionValueMm) { this.deductionValueMm = deductionValueMm; }
}
