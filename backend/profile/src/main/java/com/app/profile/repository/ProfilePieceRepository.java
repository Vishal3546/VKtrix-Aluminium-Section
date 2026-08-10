package com.app.profile.repository;

import com.app.profile.domain.ProfilePiece;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProfilePieceRepository extends JpaRepository<ProfilePiece, UUID> {
    List<ProfilePiece> findBySystemId(UUID systemId);
}
