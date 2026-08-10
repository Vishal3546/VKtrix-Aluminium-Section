package com.app.production.repository;

import com.app.production.domain.JobCardStageLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface JobCardStageLogRepository extends JpaRepository<JobCardStageLog, UUID> {
}
