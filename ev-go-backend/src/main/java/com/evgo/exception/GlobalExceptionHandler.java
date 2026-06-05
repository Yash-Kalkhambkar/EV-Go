package com.evgo.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

/**
 * Centralised exception handler for all REST controllers.
 *
 * <p>Maps application exceptions to consistent HTTP error responses with the shape:
 * <pre>{@code
 * {
 *   "code":      "SLOT_UNAVAILABLE",
 *   "message":   "Slot is being booked by another user",
 *   "timestamp": "2025-01-15T10:30:00Z"
 * }
 * }</pre>
 *
 * <p>Validation errors include an additional {@code fieldErrors} map:
 * <pre>{@code
 * {
 *   "code":        "VALIDATION_ERROR",
 *   "message":     "Request validation failed",
 *   "fieldErrors": { "slotId": "must not be null" },
 *   "timestamp":   "2025-01-15T10:30:00Z"
 * }
 * }</pre>
 *
 * Requirements: 18.2 (validation errors), 11.3 (state transition errors)
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    // ── 409 Conflict ──────────────────────────────────────────────────────────

    @ExceptionHandler(SlotUnavailableException.class)
    public ResponseEntity<ErrorResponse> handleSlotUnavailable(SlotUnavailableException ex) {
        log.warn("Slot unavailable: code={}, message={}", ex.getErrorCode(), ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new ErrorResponse(ex.getErrorCode(), ex.getMessage()));
    }

    // ── 400 Bad Request ───────────────────────────────────────────────────────

    @ExceptionHandler(InvalidStateTransitionException.class)
    public ResponseEntity<ErrorResponse> handleInvalidTransition(InvalidStateTransitionException ex) {
        log.warn("Invalid state transition: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse(ex.getErrorCode(), ex.getMessage()));
    }

    @ExceptionHandler(PaymentFailedException.class)
    public ResponseEntity<ErrorResponse> handlePaymentFailed(PaymentFailedException ex) {
        log.warn("Payment failed: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("PAYMENT_FAILED", ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ValidationErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> fieldErrors = new HashMap<>();
        for (FieldError fe : ex.getBindingResult().getFieldErrors()) {
            fieldErrors.put(fe.getField(), fe.getDefaultMessage());
        }
        log.warn("Validation failed: {}", fieldErrors);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ValidationErrorResponse("VALIDATION_ERROR", "Request validation failed", fieldErrors));
    }

    // ── 404 Not Found ─────────────────────────────────────────────────────────

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex) {
        log.warn("Resource not found: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ErrorResponse("NOT_FOUND", ex.getMessage()));
    }

    // ── 403 Forbidden ─────────────────────────────────────────────────────────

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDenied(AccessDeniedException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(new ErrorResponse("FORBIDDEN", "Access denied"));
    }

    // ── 500 Internal Server Error ─────────────────────────────────────────────

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneric(Exception ex) {
        log.error("Unhandled exception: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("INTERNAL_ERROR", "Something went wrong"));
    }

    // ── Response records ──────────────────────────────────────────────────────

    public record ErrorResponse(String code, String message, Instant timestamp) {
        public ErrorResponse(String code, String message) {
            this(code, message, Instant.now());
        }
    }

    public record ValidationErrorResponse(
            String code,
            String message,
            Map<String, String> fieldErrors,
            Instant timestamp) {
        public ValidationErrorResponse(String code, String message, Map<String, String> fieldErrors) {
            this(code, message, fieldErrors, Instant.now());
        }
    }
}
