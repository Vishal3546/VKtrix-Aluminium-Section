package com.app.production.service;

import com.app.inventory.service.InventoryService;
import com.app.production.domain.JobCard;
import com.app.production.domain.JobCardStageLog;
import com.app.production.repository.JobCardRepository;
import com.app.production.repository.JobCardStageLogRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class ProductionService {

    private final JobCardRepository jobCardRepository;
    private final JobCardStageLogRepository jobCardStageLogRepository;
    private final InventoryService inventoryService;

    private final UUID DEFAULT_TENANT_ID = UUID.fromString("11111111-1111-1111-1111-111111111111");

    public ProductionService(JobCardRepository jobCardRepository,
                             JobCardStageLogRepository jobCardStageLogRepository,
                             InventoryService inventoryService) {
        this.jobCardRepository = jobCardRepository;
        this.jobCardStageLogRepository = jobCardStageLogRepository;
        this.inventoryService = inventoryService;
    }

    @Transactional
    public JobCard createJobCard(UUID salesOrderId) {
        JobCard jobCard = new JobCard();
        jobCard.setTenantId(DEFAULT_TENANT_ID);
        jobCard.setSalesOrderId(salesOrderId);
        jobCard.setJobCardNumber("JC-" + System.currentTimeMillis());
        jobCard.setStage("PENDING");
        
        return jobCardRepository.save(jobCard);
    }

    @Transactional
    public JobCard updateStage(UUID jobCardId, String newStage, String workerName) {
        JobCard jobCard = jobCardRepository.findById(jobCardId)
                .orElseThrow(() -> new IllegalArgumentException("Job Card not found"));

        String previousStage = jobCard.getStage();
        jobCard.setStage(newStage);
        jobCard.setAssignedWorker(workerName);

        if ("CUTTING".equals(newStage) && jobCard.getStartedAt() == null) {
            jobCard.setStartedAt(OffsetDateTime.now());
        } else if ("DISPATCH".equals(newStage)) {
            jobCard.setCompletedAt(OffsetDateTime.now());
        }

        JobCard updated = jobCardRepository.save(jobCard);

        JobCardStageLog log = new JobCardStageLog();
        log.setTenantId(DEFAULT_TENANT_ID);
        log.setJobCardId(jobCardId);
        log.setPreviousStage(previousStage);
        log.setNewStage(newStage);
        log.setChangedBy(workerName);
        jobCardStageLogRepository.save(log);

        // Auto-deduct inventory if moving to ASSEMBLY
        if ("ASSEMBLY".equals(newStage) && !newStage.equals(previousStage)) {
            // In a real application, we would compute exact items needed from the design.
            // For MVP, we invoke the method with an empty map (or dummy items).
            Map<UUID, Double> itemsUsed = new HashMap<>();
            // Example: itemsUsed.put(UUID.fromString("..."), 10.5);
            try {
                inventoryService.autoDeductForProductionJob(jobCardId, itemsUsed);
            } catch (Exception e) {
                System.err.println("Inventory auto-deduction failed: " + e.getMessage());
                // In production, you might want to fail the transaction here depending on strictness.
            }
        }

        return updated;
    }

    @Transactional(readOnly = true)
    public List<JobCard> getActiveJobCards() {
        return jobCardRepository.findByStageNotOrderByCreatedAtDesc("DISPATCH");
    }
    
    @Transactional(readOnly = true)
    public JobCard getJobCard(UUID id) {
        return jobCardRepository.findById(id).orElseThrow();
    }
}
