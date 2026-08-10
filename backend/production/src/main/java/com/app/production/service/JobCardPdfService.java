package com.app.production.service;

import com.app.cutting.dto.CutRequirement;
import com.app.cutting.service.DataExtractionService;
import com.app.production.domain.JobCard;
import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.io.ByteArrayOutputStream;
import java.util.List;

@Service
public class JobCardPdfService {

    private final TemplateEngine templateEngine;
    private final DataExtractionService dataExtractionService;
    private final ProductionService productionService;

    public JobCardPdfService(TemplateEngine templateEngine,
                             DataExtractionService dataExtractionService,
                             ProductionService productionService) {
        this.templateEngine = templateEngine;
        this.dataExtractionService = dataExtractionService;
        this.productionService = productionService;
    }

    @Transactional(readOnly = true)
    public byte[] generateJobCardPdf(java.util.UUID jobCardId) {
        JobCard jobCard = productionService.getJobCard(jobCardId);
        List<CutRequirement> cuts = dataExtractionService.extractCutRequirements(jobCard.getSalesOrderId());

        Context context = new Context();
        context.setVariable("jobCardNumber", jobCard.getJobCardNumber());
        context.setVariable("salesOrderId", jobCard.getSalesOrderId());
        context.setVariable("stage", jobCard.getStage());
        context.setVariable("worker", jobCard.getAssignedWorker());
        context.setVariable("cuts", cuts);

        String html = templateEngine.process("jobcard-template", context);

        try (ByteArrayOutputStream os = new ByteArrayOutputStream()) {
            PdfRendererBuilder builder = new PdfRendererBuilder();
            builder.useFastMode();
            builder.withHtmlContent(html, "");
            builder.toStream(os);
            builder.run();
            return os.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate PDF", e);
        }
    }
}
