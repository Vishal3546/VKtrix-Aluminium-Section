package com.app.inventory.controller;

import com.app.inventory.domain.InventoryItem;
import com.app.inventory.domain.InventoryTransaction;
import com.app.inventory.dto.InventoryTransactionRequest;
import com.app.inventory.service.InventoryService;
import com.app.inventory.service.InventoryStorageService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/inventory")
@PreAuthorize("hasAnyRole('ADMIN', 'PRODUCTION')")
public class InventoryController {

    private final InventoryService inventoryService;
    private final InventoryStorageService inventoryStorageService;

    public InventoryController(InventoryService inventoryService, InventoryStorageService inventoryStorageService) {
        this.inventoryService = inventoryService;
        this.inventoryStorageService = inventoryStorageService;
    }

    @PostMapping(value = "/in", consumes = {"multipart/form-data"})
    public ResponseEntity<InventoryTransaction> stockIn(
            @RequestPart("data") InventoryTransactionRequest request,
            @RequestPart(value = "document", required = false) MultipartFile document) {
        
        String documentUrl = null;
        if (document != null && !document.isEmpty()) {
            try {
                String filename = UUID.randomUUID() + "_" + document.getOriginalFilename();
                documentUrl = inventoryStorageService.uploadDocument(
                        filename,
                        document.getBytes(),
                        document.getContentType()
                );
            } catch (Exception e) {
                return ResponseEntity.status(500).build();
            }
        }

        InventoryTransaction tx = inventoryService.stockIn(
                request.getInventoryItemId(),
                request.getQuantity(),
                request.getReferenceType(),
                request.getReferenceId(),
                documentUrl
        );

        return ResponseEntity.ok(tx);
    }

    @PostMapping("/out")
    public ResponseEntity<InventoryTransaction> stockOut(@RequestBody InventoryTransactionRequest request) {
        try {
            InventoryTransaction tx = inventoryService.stockOut(
                    request.getInventoryItemId(),
                    request.getQuantity(),
                    request.getReferenceType(),
                    request.getReferenceId()
            );
            return ResponseEntity.ok(tx);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/alerts")
    public ResponseEntity<List<InventoryItem>> getLowStockAlerts() {
        return ResponseEntity.ok(inventoryService.getLowStockAlerts());
    }
}
