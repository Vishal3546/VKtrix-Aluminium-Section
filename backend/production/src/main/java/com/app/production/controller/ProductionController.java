package com.app.production.controller;

import com.app.production.domain.JobCard;
import com.app.production.dto.StageUpdateRequest;
import com.app.production.service.JobCardPdfService;
import com.app.production.service.ProductionService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/production")
@PreAuthorize("hasAnyRole('ADMIN', 'PRODUCTION')")
public class ProductionController {

    private final ProductionService productionService;
    private final JobCardPdfService jobCardPdfService;

    public ProductionController(ProductionService productionService, JobCardPdfService jobCardPdfService) {
        this.productionService = productionService;
        this.jobCardPdfService = jobCardPdfService;
    }

    @PostMapping("/jobs/{salesOrderId}")
    public ResponseEntity<JobCard> createJobCard(@PathVariable UUID salesOrderId) {
        return ResponseEntity.ok(productionService.createJobCard(salesOrderId));
    }

    @PatchMapping("/jobs/{id}/stage")
    public ResponseEntity<JobCard> updateStage(@PathVariable UUID id, @RequestBody StageUpdateRequest request) {
        JobCard updated = productionService.updateStage(id, request.getNewStage(), request.getWorkerName());
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/dashboard")
    public ResponseEntity<List<JobCard>> getDashboardJobs() {
        return ResponseEntity.ok(productionService.getActiveJobCards());
    }

    @GetMapping("/jobs/{id}/pdf")
    public ResponseEntity<byte[]> getJobCardPdf(@PathVariable UUID id) {
        byte[] pdfBytes = jobCardPdfService.generateJobCardPdf(id);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("filename", "JobCard-" + id + ".pdf");

        return ResponseEntity.ok()
                .headers(headers)
                .body(pdfBytes);
    }
}
