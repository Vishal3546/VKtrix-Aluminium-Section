package com.app.profile.repository;

import com.app.profile.domain.ProfileSystem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ProfileSystemRepository extends JpaRepository<ProfileSystem, UUID> {
}
