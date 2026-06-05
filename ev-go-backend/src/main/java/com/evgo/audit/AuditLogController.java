package com.evgo.audit;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;

/**
 * Admin-only endpoint for querying audit logs.
 * Requirements: 32.7
 */
@RestController
@RequestMapping("/api/admin/audit-logs")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AuditLogController {

    private final AuditLogRepository auditLogRepository;

    /**
     * Returns a paginated, filtered list of audit log entries.
     *
     * @param entityType filter by entity type (e.g. BOOKING, PAYMENT)
     * @param entityId   filter by entity ID
     * @param actorId    filter by actor (user) ID
     * @param from       filter entries after this timestamp (ISO-8601)
     * @param to         filter entries before this timestamp (ISO-8601)
     * @param page       zero-based page number (default 0)
     * @param size       page size (default 50, max 200)
     */
    @GetMapping
    public ResponseEntity<Page<AuditLog>> getAuditLogs(
            @RequestParam(required = false) String entityType,
            @RequestParam(required = false) Long entityId,
            @RequestParam(required = false) Long actorId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant to,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "50") int size) {

        int safeSize = Math.min(size, 200);
        PageRequest pageable = PageRequest.of(page, safeSize, Sort.by("createdAt").descending());
        Page<AuditLog> results = auditLogRepository.findFiltered(
                entityType, entityId, actorId, from, to, pageable);
        return ResponseEntity.ok(results);
    }
}
