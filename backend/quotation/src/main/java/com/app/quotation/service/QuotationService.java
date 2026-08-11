package com.app.quotation.service;

import com.app.profile.domain.Design;
import com.app.profile.domain.DesignPanel;
import com.app.profile.repository.DesignRepository;
import com.app.quotation.domain.Quotation;
import com.app.quotation.domain.QuotationItem;
import com.app.quotation.dto.QuotationRequest;
import com.app.quotation.dto.QuotationResponse;
import com.app.quotation.repository.QuotationItemRepository;
import com.app.quotation.repository.QuotationRepository;
import com.app.profile.service.CalculationService;
import com.app.profile.dto.CalculationResultDto;
import com.app.profile.dto.RequiredProfileDto;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@Service
public class QuotationService {

    private final QuotationRepository quotationRepository;
    private final QuotationItemRepository quotationItemRepository;
    private final DesignRepository designRepository;
    private final PdfGeneratorService pdfGeneratorService;
    private final SupabaseStorageService supabaseStorageService;
    private final com.app.party.repository.TenantRepository tenantRepository;
    private final CalculationService calculationService;

    // Default tenant for testing
    private final UUID DEFAULT_TENANT_ID = UUID.fromString("00000000-0000-0000-0000-000000000000");

    public QuotationService(QuotationRepository quotationRepository, 
                            QuotationItemRepository quotationItemRepository,
                            DesignRepository designRepository, 
                            PdfGeneratorService pdfGeneratorService,
                            SupabaseStorageService supabaseStorageService,
                            com.app.party.repository.TenantRepository tenantRepository,
                            CalculationService calculationService) {
        this.quotationRepository = quotationRepository;
        this.quotationItemRepository = quotationItemRepository;
        this.designRepository = designRepository;
        this.pdfGeneratorService = pdfGeneratorService;
        this.supabaseStorageService = supabaseStorageService;
        this.tenantRepository = tenantRepository;
        this.calculationService = calculationService;
    }

    public List<Quotation> getAllQuotations() {
        return quotationRepository.findAll();
    }

    @Transactional
    public QuotationResponse createQuotation(QuotationRequest request) {
        Quotation quotation = new Quotation();
        quotation.setTenantId(DEFAULT_TENANT_ID);
        quotation.setProjectId(request.getProjectId());
        quotation.setStatus("DRAFT");
        
        String quoteNo = "Q-" + System.currentTimeMillis();
        quotation.setQuotationNumber(quoteNo);

        BigDecimal totalAmount = BigDecimal.ZERO;
        List<Map<String, Object>> templateItems = new ArrayList<>();

        Quotation savedQuotation = quotationRepository.save(quotation);

        for (UUID designId : request.getDesignIds()) {
            Design design = designRepository.findById(designId)
                    .orElseThrow(() -> new IllegalArgumentException("Design not found: " + designId));

            for (DesignPanel panel : design.getPanels()) {
                Double glassSqFt = panel.getGlassSqFt();
                double sqFt = glassSqFt != null ? glassSqFt : 0.0;
                BigDecimal panelAmount = request.getRatePerSqFt().multiply(BigDecimal.valueOf(sqFt));
                totalAmount = totalAmount.add(panelAmount);

                QuotationItem item = new QuotationItem();
                item.setTenantId(DEFAULT_TENANT_ID);
                item.setQuotationId(savedQuotation.getId());
                item.setDesignId(designId);
                item.setAmount(panelAmount);
                quotationItemRepository.save(item);

                // Add to template map
                Map<String, Object> tItem = new HashMap<>();
                tItem.put("code", "D-" + designId.toString().substring(0, 4) + "-P" + panel.getPanelIndex());
                tItem.put("width", panel.getWidthMm());
                tItem.put("height", panel.getHeightMm());
                tItem.put("profileType", panel.getPanelType());
                tItem.put("glass", panel.getGlassType() != null ? panel.getGlassType() : "N/A");
                tItem.put("mesh", panel.getMeshType() != null ? panel.getMeshType() : "N/A");
                tItem.put("sqFt", sqFt);
                tItem.put("rate", request.getRatePerSqFt());
                tItem.put("qty", 1);
                tItem.put("value", panelAmount);
                tItem.put("weightKg", sqFt * 1.5); // mock weight
                tItem.put("unitPrice", panelAmount);
                tItem.put("profileSystem", "R40 Casement Window");
                tItem.put("glassSpec", "(1) 5mm Clear Toughened");
                tItem.put("location", "Master Bedroom");
                tItem.put("remarks", "Standard finish.");
                
                // Use CalculationService for real profiles
                List<Map<String, String>> profiles = new ArrayList<>();
                try {
                    if (request.getSystemId() != null) {
                        CalculationResultDto result = calculationService.calculateMaterials(designId, request.getSystemId());
                        for(RequiredProfileDto profile : result.getRequiredProfiles()) {
                            profiles.add(Map.of("type", profile.getPieceType(), "code", profile.getProfileName() + " (L:" + profile.getCutLengthMm() + "x" + profile.getQuantity() + ")"));
                        }
                    } else {
                        profiles.add(Map.of("type", "Outer Frame", "code", "V-4034"));
                    }
                } catch (Exception e) {
                    profiles.add(Map.of("type", "Error calculating", "code", e.getMessage()));
                }
                
                tItem.put("profiles", profiles);
                
                // Mock Sashes and Accessories
                List<Map<String, Object>> sashes = new ArrayList<>();
                List<Map<String, Object>> accessories = new ArrayList<>();
                accessories.add(Map.of("name", "Hivik Handle", "qty", 1));
                accessories.add(Map.of("name", "2d Hinge", "qty", 2));
                sashes.add(Map.of("name", "S1", "accessories", accessories));
                tItem.put("sashes", sashes);
                templateItems.add(tItem);
            }
        }

        // Set advanced cost parameters
        BigDecimal discount = request.getDiscountPercent() != null ? request.getDiscountPercent() : BigDecimal.ZERO;
        BigDecimal transport = request.getTransportationCost() != null ? request.getTransportationCost() : BigDecimal.ZERO;
        BigDecimal loading = request.getLoadingUnloadingCost() != null ? request.getLoadingUnloadingCost() : BigDecimal.ZERO;
        BigDecimal gst = request.getGstPercent() != null ? request.getGstPercent() : new BigDecimal("18.00");

        savedQuotation.setDiscountPercent(discount);
        savedQuotation.setTransportationCost(transport);
        savedQuotation.setLoadingUnloadingCost(loading);
        savedQuotation.setGstPercent(gst);

        // Apply advanced formula chain
        BigDecimal subTotal = totalAmount.subtract(totalAmount.multiply(discount).divide(BigDecimal.valueOf(100)));
        BigDecimal totalProjectCost = subTotal.add(transport).add(loading);
        BigDecimal grandTotal = totalProjectCost.add(totalProjectCost.multiply(gst).divide(BigDecimal.valueOf(100)));

        savedQuotation.setTotalAmount(grandTotal);

        // Advanced Document Template Variables
        Map<String, Object> variables = new HashMap<>();
        
        com.app.party.domain.Tenant tenant = tenantRepository.findById(DEFAULT_TENANT_ID).orElse(null);
        if (tenant != null) {
            variables.put("tenantBranding", tenant.getQuoteFooterBranding() != null ? tenant.getQuoteFooterBranding() : "Aluminium Section SaaS");
            variables.put("termsAndConditions", tenant.getTermsAndConditions());
            variables.put("preRequisites", tenant.getPreRequisitesChecklist());
        } else {
            variables.put("tenantBranding", "Aluminium Section SaaS");
            variables.put("termsAndConditions", "<p>Default terms and conditions.</p>");
            variables.put("preRequisites", "<p>Default pre-requisites.</p>");
        }

        variables.put("quotationNumber", quoteNo);
        variables.put("date", LocalDate.now().toString());
        variables.put("projectName", "Project ID: " + request.getProjectId());
        variables.put("customerName", "Client (ID: " + request.getProjectId() + ")");
        variables.put("items", templateItems);
        
        variables.put("totalComponents", templateItems.size());
        
        double totalArea = templateItems.stream().mapToDouble(i -> (double) i.get("sqFt")).sum();
        variables.put("totalAreaSqFt", totalArea);
        
        variables.put("basicValue", totalAmount);
        variables.put("discountPercent", discount);
        variables.put("discountValue", totalAmount.multiply(discount).divide(BigDecimal.valueOf(100)));
        variables.put("subTotal", subTotal);
        variables.put("transportationCost", transport);
        variables.put("loadingCost", loading);
        variables.put("totalProjectCost", totalProjectCost);
        variables.put("gstPercent", gst);
        variables.put("gstValue", totalProjectCost.multiply(gst).divide(BigDecimal.valueOf(100)));
        variables.put("grandTotal", grandTotal);
        
        if (totalArea > 0) {
            variables.put("avgPriceExcl", totalProjectCost.divide(BigDecimal.valueOf(totalArea), 2, java.math.RoundingMode.HALF_UP));
            variables.put("avgPriceIncl", grandTotal.divide(BigDecimal.valueOf(totalArea), 2, java.math.RoundingMode.HALF_UP));
        } else {
            variables.put("avgPriceExcl", BigDecimal.ZERO);
            variables.put("avgPriceIncl", BigDecimal.ZERO);
        }

        byte[] pdfData = pdfGeneratorService.generatePdf("quotation-template", variables);
        String pdfUrl = supabaseStorageService.uploadPdf(quoteNo + ".pdf", pdfData);

        savedQuotation.setPdfUrl(pdfUrl);
        quotationRepository.save(savedQuotation);

        QuotationResponse response = new QuotationResponse();
        response.setId(savedQuotation.getId());
        response.setQuotationNumber(savedQuotation.getQuotationNumber());
        response.setProjectId(savedQuotation.getProjectId());
        response.setTotalAmount(savedQuotation.getTotalAmount());
        response.setStatus(savedQuotation.getStatus());
        response.setPdfUrl(savedQuotation.getPdfUrl());
        return response;
    }
}
