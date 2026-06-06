package com.evgo.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.core.annotation.Order;
import org.springframework.lang.NonNull;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

/**
 * Servlet filter that populates the SLF4J MDC (Mapped Diagnostic Context) for
 * every incoming HTTP request.
 *
 * <p>MDC fields set per request:
 * <ul>
 *   <li>{@code correlation_id} – UUID generated per request, or the value of the
 *       {@code X-Correlation-ID} request header if present (allows end-to-end tracing
 *       across services).</li>
 *   <li>{@code trace_id} – OpenTelemetry trace ID extracted from the
 *       {@code X-B3-TraceId} header (populated by the OTel Java agent).</li>
 *   <li>{@code span_id} – OpenTelemetry span ID from {@code X-B3-SpanId}.</li>
 *   <li>{@code user_id} – authenticated user's ID extracted from the Spring Security
 *       context (empty string if unauthenticated).</li>
 * </ul>
 *
 * <p>The {@code correlation_id} is also echoed back in the response as
 * {@code X-Correlation-ID} so clients can correlate their requests with server logs.
 *
 * <p>MDC is cleared in the {@code finally} block to prevent context leakage between
 * requests on pooled threads. For async processing, the MDC context map is copied
 * via {@link MDC#getCopyOfContextMap()} before handing off to worker threads.
 *
 * <p>Requirements: 22.2 (correlation ID propagation), 22.6 (MDC async propagation)
 */
@Component
@Order(1)
public class MdcFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(MdcFilter.class);

    public static final String MDC_CORRELATION_ID = "correlation_id";
    public static final String MDC_TRACE_ID       = "trace_id";
    public static final String MDC_SPAN_ID        = "span_id";
    public static final String MDC_USER_ID        = "user_id";

    private static final String HEADER_CORRELATION_ID = "X-Correlation-ID";
    private static final String HEADER_TRACE_ID       = "X-B3-TraceId";
    private static final String HEADER_SPAN_ID        = "X-B3-SpanId";

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        try {
            // ── Correlation ID ────────────────────────────────────────────────
            String correlationId = request.getHeader(HEADER_CORRELATION_ID);
            if (correlationId == null || correlationId.isBlank()) {
                correlationId = UUID.randomUUID().toString();
            }
            MDC.put(MDC_CORRELATION_ID, correlationId);

            // Echo correlation ID back to the caller
            response.setHeader(HEADER_CORRELATION_ID, correlationId);

            // ── Distributed trace IDs (OTel / B3 propagation) ─────────────────
            String traceId = request.getHeader(HEADER_TRACE_ID);
            if (traceId != null && !traceId.isBlank()) {
                MDC.put(MDC_TRACE_ID, traceId);
            }

            String spanId = request.getHeader(HEADER_SPAN_ID);
            if (spanId != null && !spanId.isBlank()) {
                MDC.put(MDC_SPAN_ID, spanId);
            }

            // ── Authenticated user ID ─────────────────────────────────────────
            String userId = extractUserId();
            MDC.put(MDC_USER_ID, userId);

            filterChain.doFilter(request, response);

        } finally {
            // Always clear MDC to prevent context leakage on pooled threads
            MDC.clear();
        }
    }

    /**
     * Extracts the authenticated user's ID from the Spring Security context.
     *
     * <p>Returns an empty string for unauthenticated requests so that the MDC
     * field is always present (avoids null checks in log patterns).
     *
     * @return user ID string, or empty string if not authenticated
     */
    private String extractUserId() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated()) {
                return "";
            }
            Object principal = auth.getPrincipal();
            if (principal instanceof UserDetails userDetails) {
                return userDetails.getUsername();
            }
            if (principal instanceof String str && !"anonymousUser".equals(str)) {
                return str;
            }
        } catch (Exception e) {
            log.debug("Could not extract user ID from SecurityContext: {}", e.getMessage());
        }
        return "";
    }

    /**
     * Returns a copy of the current MDC context map for propagation to async threads.
     *
     * <p>Usage in async tasks:
     * <pre>{@code
     * Map<String, String> mdcContext = MdcFilter.copyMdcContext();
     * executor.submit(() -> {
     *     MDC.setContextMap(mdcContext);
     *     try {
     *         // async work with full MDC context
     *     } finally {
     *         MDC.clear();
     *     }
     * });
     * }</pre>
     *
     * Requirements: 22.6
     *
     * @return snapshot of the current MDC context map (never null)
     */
    public static Map<String, String> copyMdcContext() {
        Map<String, String> context = MDC.getCopyOfContextMap();
        return context != null ? context : Map.of();
    }
}
