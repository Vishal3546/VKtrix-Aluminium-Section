package com.app.profile.repository;

import com.app.profile.domain.PieceDeductionRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PieceDeductionRuleRepository extends JpaRepository<PieceDeductionRule, UUID> {
    List<PieceDeductionRule> findByProfilePieceId(UUID profilePieceId);
}
