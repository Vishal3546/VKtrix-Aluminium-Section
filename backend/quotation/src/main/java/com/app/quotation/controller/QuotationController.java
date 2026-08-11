package com.app.quotation.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.quotation.domain.Quotation;
import com.app.quotation.dto.QuotationRequest;
import com.app.quotation.dto.QuotationResponse;
import com.app.quotation.service.QuotationService;

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
