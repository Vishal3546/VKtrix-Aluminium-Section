package com.app.quotation.controller;

import com.app.quotation.dto.QuotationRequest;
import com.app.quotation.dto.QuotationResponse;
import com.app.quotation.service.QuotationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.app.quotation.domain.Quotation;
import java.util.List;

@RestController
@RequestMapping("/api/quotations")
// @PreAuthorize("hasAnyRole('ADMIN', 'SALES', 'ACCOUNTS')")
public class QuotationController {

    private final QuotationService quotationService;

    public QuotationController(QuotationService quotationService) {
        this.quotationService = quotationService;
    }

    @GetMapping
    public ResponseEntity<List<Quotation>> getAllQuotations() {
        return ResponseEntity.ok(quotationService.getAllQuotations());
    }

    @PostMapping("/generate")
    public ResponseEntity<QuotationResponse> generateQuotation(@RequestBody QuotationRequest request) {
        QuotationResponse response = quotationService.createQuotation(request);
        return ResponseEntity.ok(response);
    }
}
