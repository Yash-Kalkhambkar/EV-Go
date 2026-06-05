package com.evgo.audit;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;

/**
 * Repository for audit log entries.
 * Requirements: 32.7
 */
@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    @Query("""
        SELECT a FROM AuditLog a
        WHERE (:entityType IS NULL OR a.entityType = :entityType)
          AND (:entityId   IS NULL OR a.entityId   = :entityId)
          AND (:actorId    IS NULL OR a.actorId    = :actorId)
          AND (:from       IS NULL OR a.createdAt >= :from)
          AND (:to         IS NULL OR a.createdAt <= :to)
        ORDER BY a.createdAt DESC
        """)
    Page<AuditLog> findFiltered(
            @Param("entityType") String entityType,
            @Param("entityId")   Long entityId,
            @Param("actorId")    Long actorId,
            @Param("from")       Instant from,
            @Param("to")         Instant to,
            Pageable pageable);
}
