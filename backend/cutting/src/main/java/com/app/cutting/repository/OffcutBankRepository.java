package com.app.cutting.repository;

import com.app.cutting.domain.OffcutBank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface OffcutBankRepository extends JpaRepository<OffcutBank, UUID> {
    List<OffcutBank> findByIsUsedFalseAndProfileTypeAndColorOrderByLengthMmDesc(String profileType, String color);
}
