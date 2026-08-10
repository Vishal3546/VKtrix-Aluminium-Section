package com.app.audit;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@Aspect
@Component
public class AuditLoggingAspect {

    private final AuditLogRepository auditLogRepository;
    
    // Default tenant & user for MVP logic (in real life extract from JWT)
    private final UUID DEFAULT_TENANT_ID = UUID.fromString("11111111-1111-1111-1111-111111111111");
    private final UUID DEFAULT_USER_ID = UUID.fromString("22222222-2222-2222-2222-222222222222");

    public AuditLoggingAspect(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @Around("execution(* com.app.inventory.service.InventoryService.stockOut(..)) || " +
            "execution(* com.app.profile.service.DesignService.updatePanel(..))")
    public Object logAuditActivity(ProceedingJoinPoint joinPoint) throws Throwable {
        
        // Execute the actual method
        Object result = joinPoint.proceed();
        
        // Extract context safely
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UUID userId = DEFAULT_USER_ID; // Fallback
        
        if (authentication != null && authentication.getName() != null) {
            try {
                userId = UUID.fromString(authentication.getName());
            } catch (IllegalArgumentException ignored) {
                // If it's an email or something else, handle accordingly
            }
        }

        String methodName = joinPoint.getSignature().getName();
        String action = methodName.equals("stockOut") ? "STOCK_ADJUSTMENT" : "DESIGN_EDIT";

        // Build details string (JSON structure ideally)
        String details = "Method: " + methodName + 
                         ", Args: " + Arrays.toString(joinPoint.getArgs());

        // Save asynchronously so it doesn't block
        final UUID finalUserId = userId;
        CompletableFuture.runAsync(() -> {
            AuditLog auditLog = new AuditLog();
            auditLog.setTenantId(DEFAULT_TENANT_ID);
            auditLog.setUserId(finalUserId);
            auditLog.setAction(action);
            auditLog.setDetails(details);
            auditLogRepository.save(auditLog);
        });

        return result;
    }
}
