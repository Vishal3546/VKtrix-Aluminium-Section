package com.app.profile.repository;

import com.app.profile.domain.FormulaMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
@Deprecated
public interface FormulaMasterRepository extends JpaRepository<FormulaMaster, UUID> {
}
