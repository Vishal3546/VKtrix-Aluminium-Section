package com.app.production.repository;

import com.app.production.domain.JobCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface JobCardRepository extends JpaRepository<JobCard, UUID> {
    List<JobCard> findByStageNotOrderByCreatedAtDesc(String stage);
}
