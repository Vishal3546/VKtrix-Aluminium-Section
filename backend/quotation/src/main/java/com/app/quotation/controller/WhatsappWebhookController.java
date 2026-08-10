package com.app.quotation.controller;

import com.app.profile.dto.DesignRequest;
import com.app.profile.dto.DesignResponse;
import com.app.profile.service.AiParsingService;
import com.app.profile.service.DesignService;
import com.app.quotation.dto.QuotationRequest;
import com.app.quotation.dto.QuotationResponse;
import com.app.quotation.service.QuotationService;
import com.app.quotation.service.PdfGeneratorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/whatsapp")
public class WhatsappWebhookController {

    private final AiParsingService aiParsingService;
    private final DesignService designService;
    private final QuotationService quotationService;
    private final PdfGeneratorService pdfGeneratorService;

    public WhatsappWebhookController(AiParsingService aiParsingService,
                                     DesignService designService,
                                     QuotationService quotationService,
                                     PdfGeneratorService pdfGeneratorService) {
        this.aiParsingService = aiParsingService;
        this.designService = designService;
        this.quotationService = quotationService;
        this.pdfGeneratorService = pdfGeneratorService;
    }

    @PostMapping("/webhook")
    @SuppressWarnings("unchecked")
    public ResponseEntity<String> handleWebhook(@RequestBody Map<String, Object> payload) {
        try {
            Map<String, Object> message = (Map<String, Object>) payload.get("message");
            if (message == null) return ResponseEntity.ok("No message found");

            String type = (String) message.get("type");
            String waId = (String) payload.get("wa_id");

            DesignRequest designRequest;

            if ("text".equals(type)) {
                Map<String, String> textObj = (Map<String, String>) message.get("text");
                String body = textObj.get("body");
                designRequest = aiParsingService.parseFromText(body);
            } else if ("image".equals(type)) {
                // In a real app, download the image from WhatsApp Graph API using the image ID
                // Map<String, String> imageObj = (Map<String, String>) message.get("image");
                // String imageId = imageObj.get("id");
                
                // For this demo, we assume the webhook passes a public URL or we mock it
                // In production: imageId -> Graph API -> download url -> pass to OpenAI
                String mockImageUrl = "https://example.com/mock-image.jpg"; 
                designRequest = aiParsingService.parseFromImage(mockImageUrl);
            } else {
                return ResponseEntity.ok("Unsupported message type");
            }

            // 1. Generate Design
            DesignResponse designResponse = designService.generateDesign(designRequest);

            // 2. Generate Quotation
            QuotationRequest quotationRequest = new QuotationRequest();
            quotationRequest.setDesignIds(java.util.List.of(designResponse.getId()));
            quotationRequest.setProjectId(UUID.randomUUID()); // Dummy project
            quotationRequest.setRatePerSqFt(new java.math.BigDecimal("15.00")); // Dummy rate
            
            QuotationResponse quotationResponse = quotationService.createQuotation(quotationRequest);

            // 3. Generate PDF
            // We use the HTML template to generate the PDF byte array
            Map<String, Object> variables = Map.of(
                    "quotation", quotationResponse,
                    "design", designResponse
            );
            byte[] pdfBytes = pdfGeneratorService.generatePdf("quotation-template", variables);

            // 4. Send PDF back to WhatsApp
            // Here you would call the WhatsApp Graph API to send the pdfBytes as a media message.
            sendPdfToWhatsApp(waId, pdfBytes);

            return ResponseEntity.ok("Processed successfully");
        } catch (Exception e) {
            System.err.println("Webhook processing failed: " + e.getMessage());
            return ResponseEntity.internalServerError().body("Processing failed");
        }
    }

    private void sendPdfToWhatsApp(String waId, byte[] pdfBytes) {
        // Implementation for WhatsApp Graph API messaging endpoint
        System.out.println("Mock sending PDF of size " + pdfBytes.length + " to WhatsApp number: " + waId);
    }
}
