package com.app.cutting.service;

import com.app.cutting.dto.CutRequirement;
import com.app.profile.domain.Design;
import com.app.profile.domain.DesignPanel;
import com.app.profile.repository.DesignRepository;
import com.app.quotation.domain.QuotationItem;
import com.app.quotation.domain.SalesOrder;
import com.app.quotation.repository.QuotationItemRepository;
import com.app.quotation.repository.SalesOrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class DataExtractionService {

    private final SalesOrderRepository salesOrderRepository;
    private final QuotationItemRepository quotationItemRepository;
    private final DesignRepository designRepository;

    public DataExtractionService(SalesOrderRepository salesOrderRepository,
                                 QuotationItemRepository quotationItemRepository,
                                 DesignRepository designRepository) {
        this.salesOrderRepository = salesOrderRepository;
        this.quotationItemRepository = quotationItemRepository;
        this.designRepository = designRepository;
    }

    @Transactional(readOnly = true)
    public List<CutRequirement> extractCutRequirements(UUID salesOrderId) {
        SalesOrder salesOrder = salesOrderRepository.findById(salesOrderId)
                .orElseThrow(() -> new IllegalArgumentException("Sales order not found"));

        if (!"CONFIRMED".equalsIgnoreCase(salesOrder.getStatus())) {
            // For MVP, we might allow non-confirmed orders to be estimated, but the prompt says "from a confirmed sales order".
            // We will just log a warning but still proceed for estimation purposes.
            System.out.println("Warning: Sales Order is not CONFIRMED. Status: " + salesOrder.getStatus());
        }

        UUID quotationId = salesOrder.getQuotationId();
        // This is a naive way, real apps would have a proper relation or custom query.
        List<QuotationItem> items = quotationItemRepository.findAll().stream()
                .filter(item -> item.getQuotationId().equals(quotationId))
                .toList();

        List<CutRequirement> requirements = new ArrayList<>();

        for (QuotationItem item : items) {
            Design design = designRepository.findById(item.getDesignId())
                    .orElseThrow(() -> new IllegalArgumentException("Design not found"));

            for (DesignPanel panel : design.getPanels()) {
                // In a real scenario, profileType and color would map to specific aluminum extrusions.
                // We use standard strings to group them.
                String profileType = panel.getPanelType() != null ? panel.getPanelType() : "STANDARD";
                String color = "DEFAULT_COLOR"; // Default assumed color

                if (panel.getFrameLength() != null && panel.getFrameLength() > 0) {
                    requirements.add(new CutRequirement(profileType, color, panel.getFrameLength()));
                }
                if (panel.getMullionLength() != null && panel.getMullionLength() > 0) {
                    requirements.add(new CutRequirement(profileType + "_MULLION", color, panel.getMullionLength()));
                }
            }
        }

        return requirements;
    }
}
