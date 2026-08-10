package com.app.cutting.controller;

import com.app.cutting.domain.OptimizationJob;
import com.app.cutting.dto.CutRequirement;
import com.app.cutting.dto.OptimizationResult;
import com.app.cutting.repository.OptimizationJobRepository;
import com.app.cutting.service.DataExtractionService;
import com.app.cutting.service.FFDOptimizationService;
import com.app.cutting.service.ORToolsOptimizationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/cutting/optimize")
@PreAuthorize("hasAnyRole('ADMIN', 'PRODUCTION')")
public class CuttingOptimizationController {

    private final DataExtractionService dataExtractionService;
    private final FFDOptimizationService ffdOptimizationService;
    private final ORToolsOptimizationService orToolsOptimizationService;
    private final OptimizationJobRepository optimizationJobRepository;

    public CuttingOptimizationController(DataExtractionService dataExtractionService,
                                         FFDOptimizationService ffdOptimizationService,
                                         ORToolsOptimizationService orToolsOptimizationService,
                                         OptimizationJobRepository optimizationJobRepository) {
        this.dataExtractionService = dataExtractionService;
        this.ffdOptimizationService = ffdOptimizationService;
        this.orToolsOptimizationService = orToolsOptimizationService;
        this.optimizationJobRepository = optimizationJobRepository;
    }

    @PostMapping("/estimate/{salesOrderId}")
    public ResponseEntity<OptimizationResult> estimateOptimization(@PathVariable UUID salesOrderId) {
        List<CutRequirement> requirements = dataExtractionService.extractCutRequirements(salesOrderId);
        OptimizationResult result = ffdOptimizationService.estimateOptimization(requirements);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/exact/{salesOrderId}")
    public ResponseEntity<OptimizationJob> exactOptimization(@PathVariable UUID salesOrderId) {
        List<CutRequirement> requirements = dataExtractionService.extractCutRequirements(salesOrderId);

        // Create tracking job
        OptimizationJob job = new OptimizationJob();
        job.setTenantId(UUID.fromString("11111111-1111-1111-1111-111111111111")); // Default tenant
        job.setSalesOrderId(salesOrderId);
        job.setStatus("PENDING");
        OptimizationJob savedJob = optimizationJobRepository.save(job);

        // Trigger Async processing
        orToolsOptimizationService.optimizeExact(savedJob, requirements);

        return ResponseEntity.accepted().body(savedJob);
    }
    
    @GetMapping("/jobs/{jobId}")
    public ResponseEntity<OptimizationJob> getJobStatus(@PathVariable UUID jobId) {
        return optimizationJobRepository.findById(jobId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
