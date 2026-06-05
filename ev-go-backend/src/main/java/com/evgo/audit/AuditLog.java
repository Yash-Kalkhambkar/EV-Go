package com.evgo.audit;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

/**
 * Immutable audit log entry. No updates or deletes — append-only.
 * Requirements: 32.1, 32.5
 */
@Entity
@Table(name = "audit_logs")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "entity_type", nullable = false, length = 50)
    private String entityType;

    @Column(name = "entity_id", nullable = false)
    private Long entityId;

    @Column(nullable = false, length = 50)
    private String action;

    @Column(name = "actor_id")
    private Long actorId;

    @Column(name = "actor_type", nullable = false, length = 20)
    private String actorType;

    @Column(name = "old_state", columnDefinition = "jsonb")
    private String oldState;

    @Column(name = "new_state", columnDefinition = "jsonb")
    private String newState;

    @Column(columnDefinition = "jsonb")
    private String metadata;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
}
