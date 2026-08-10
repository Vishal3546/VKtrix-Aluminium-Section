package com.app.inventory.service;

import com.app.inventory.domain.InventoryItem;
import com.app.inventory.domain.InventoryTransaction;
import com.app.inventory.repository.InventoryItemRepository;
import com.app.inventory.repository.InventoryTransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class InventoryService {

    private final InventoryItemRepository inventoryItemRepository;
    private final InventoryTransactionRepository inventoryTransactionRepository;

    // Default tenant for MVP
    private final UUID DEFAULT_TENANT_ID = UUID.fromString("11111111-1111-1111-1111-111111111111");

    public InventoryService(InventoryItemRepository inventoryItemRepository,
                            InventoryTransactionRepository inventoryTransactionRepository) {
        this.inventoryItemRepository = inventoryItemRepository;
        this.inventoryTransactionRepository = inventoryTransactionRepository;
    }

    @Transactional
    public InventoryTransaction stockIn(UUID itemId, Double quantity, String referenceType, String referenceId, String documentUrl) {
        InventoryItem item = inventoryItemRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("Inventory item not found"));

        item.setQuantity(item.getQuantity() + quantity);
        inventoryItemRepository.save(item);

        InventoryTransaction tx = new InventoryTransaction();
        tx.setTenantId(DEFAULT_TENANT_ID);
        tx.setInventoryItemId(itemId);
        tx.setType("IN");
        tx.setQuantity(quantity);
        tx.setReferenceType(referenceType);
        tx.setReferenceId(referenceId);
        tx.setDocumentUrl(documentUrl);

        return inventoryTransactionRepository.save(tx);
    }

    @Transactional
    public InventoryTransaction stockOut(UUID itemId, Double quantity, String referenceType, String referenceId) {
        InventoryItem item = inventoryItemRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("Inventory item not found"));

        if (item.getQuantity() < quantity) {
            throw new IllegalArgumentException("Insufficient stock for item: " + itemId);
        }

        item.setQuantity(item.getQuantity() - quantity);
        inventoryItemRepository.save(item);

        InventoryTransaction tx = new InventoryTransaction();
        tx.setTenantId(DEFAULT_TENANT_ID);
        tx.setInventoryItemId(itemId);
        tx.setType("OUT");
        tx.setQuantity(quantity);
        tx.setReferenceType(referenceType);
        tx.setReferenceId(referenceId);

        return inventoryTransactionRepository.save(tx);
    }

    @Transactional(readOnly = true)
    public List<InventoryItem> getLowStockAlerts() {
        return inventoryItemRepository.findItemsBelowThreshold();
    }

    /**
     * Hook to be called by the Production Module when a job moves to ASSEMBLY or similar stage.
     */
    @Transactional
    public void autoDeductForProductionJob(UUID jobId, Map<UUID, Double> itemsUsed) {
        for (Map.Entry<UUID, Double> entry : itemsUsed.entrySet()) {
            // Depending on strictness, we might want to catch Insufficient stock exceptions
            // or let the whole transaction roll back. We will let it roll back for safety.
            stockOut(entry.getKey(), entry.getValue(), "PRODUCTION_JOB", jobId.toString());
        }
    }
}
