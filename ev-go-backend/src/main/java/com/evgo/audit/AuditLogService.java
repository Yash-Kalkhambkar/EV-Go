package com.evgo.audit;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

/**
 * Records immutable audit log entries for all state-changing operations.
 *
 * <p>Writes are async so they never block the main request thread.
 *
 * Requirements: 32.1, 32.2, 32.3, 32.4, 32.5
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    /**
     * Records a state transition for any entity.
     *
     * @param entityType e.g. "BOOKING", "SLOT", "PAYMENT"
     * @param entityId   the entity's primary key
     * @param action     e.g. "STATE_TRANSITION", "CREATE", "REFUND"
     * @param actorId    user or system ID performing the action
     * @param actorType  "USER", "ADMIN", "SYSTEM", "WEBHOOK"
     * @param oldState   JSON string of previous state (nullable)
     * @param newState   JSON string of new state (nullable)
     * @param metadata   additional context as JSON (nullable)
     */
    @Async
    public void record(String entityType, Long entityId, String action,
                       Long actorId, String actorType,
                       String oldState, String newState, String metadata) {
        try {
            AuditLog entry = AuditLog.builder()
                    .entityType(entityType)
                    .entityId(entityId)
                    .action(action)
                    .actorId(actorId)
                    .actorType(actorType)
                    .oldState(oldState)
                    .newState(newState)
                    .metadata(metadata)
                    .build();
            auditLogRepository.save(entry);
        } catch (Exception e) {
            // Audit failures must never break the main flow
            log.error("Failed to write audit log: entityType={}, entityId={}, action={}: {}",
                    entityType, entityId, action, e.getMessage());
        }
    }

    /** Convenience overload without old/new state (for simple events). */
    @Async
    public void record(String entityType, Long entityId, String action,
                       Long actorId, String actorType, String metadata) {
        record(entityType, entityId, action, actorId, actorType, null, null, metadata);
    }
}
