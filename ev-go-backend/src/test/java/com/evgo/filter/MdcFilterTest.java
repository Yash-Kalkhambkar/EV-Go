package com.evgo.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.slf4j.MDC;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import jakarta.servlet.http.HttpServlet;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicReference;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Unit tests for {@link MdcFilter}.
 *
 * <p>Verifies that:
 * <ul>
 *   <li>MDC keys trace_id, span_id, user_id, correlation_id are set per request – Req 22.2</li>
 *   <li>correlation_id is echoed in the response header</li>
 *   <li>X-Correlation-ID from the request is re-used when present</li>
 *   <li>MDC is cleared after the request completes – Req 22.6</li>
 *   <li>copyMdcContext() returns a usable snapshot for async propagation – Req 22.6</li>
 * </ul>
 *
 * <p>Requirements: 22.2, 22.6
 */
class MdcFilterTest {

    private final MdcFilter filter = new MdcFilter();

    @AfterEach
    void cleanup() {
        MDC.clear();
        SecurityContextHolder.clearContext();
    }

    // ── correlation_id ────────────────────────────────────────────────────────

    @Test
    void shouldGenerateCorrelationIdWhenHeaderAbsent() throws Exception {
        AtomicReference<String> capturedCorrelationId = new AtomicReference<>();
        MockFilterChain chain = captureChain(() ->
                capturedCorrelationId.set(MDC.get(MdcFilter.MDC_CORRELATION_ID)));

        filter.doFilterInternal(new MockHttpServletRequest(), new MockHttpServletResponse(), chain);

        assertThat(capturedCorrelationId.get())
                .as("A correlation_id UUID must be generated when header is absent")
                .isNotNull()
                .isNotBlank();
    }

    @Test
    void shouldReuseCorrelationIdFromRequestHeader() throws Exception {
        String existingId = "test-correlation-id-123";
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("X-Correlation-ID", existingId);
        AtomicReference<String> capturedId = new AtomicReference<>();
        MockFilterChain chain = captureChain(() ->
                capturedId.set(MDC.get(MdcFilter.MDC_CORRELATION_ID)));

        filter.doFilterInternal(request, new MockHttpServletResponse(), chain);

        assertThat(capturedId.get())
                .as("Incoming X-Correlation-ID header must be re-used")
                .isEqualTo(existingId);
    }

    @Test
    void shouldEchoCorrelationIdInResponseHeader() throws Exception {
        MockHttpServletResponse response = new MockHttpServletResponse();

        filter.doFilterInternal(new MockHttpServletRequest(), response, new MockFilterChain());

        assertThat(response.getHeader("X-Correlation-ID"))
                .as("X-Correlation-ID must be echoed back in the response")
                .isNotNull()
                .isNotBlank();
    }

    // ── trace_id / span_id ────────────────────────────────────────────────────

    @Test
    void shouldPopulateTraceIdFromB3Header() throws Exception {
        String traceId = "abc123def456";
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("X-B3-TraceId", traceId);
        AtomicReference<String> captured = new AtomicReference<>();
        MockFilterChain chain = captureChain(() -> captured.set(MDC.get(MdcFilter.MDC_TRACE_ID)));

        filter.doFilterInternal(request, new MockHttpServletResponse(), chain);

        assertThat(captured.get()).isEqualTo(traceId);
    }

    @Test
    void shouldPopulateSpanIdFromB3Header() throws Exception {
        String spanId = "span-xyz-789";
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("X-B3-SpanId", spanId);
        AtomicReference<String> captured = new AtomicReference<>();
        MockFilterChain chain = captureChain(() -> captured.set(MDC.get(MdcFilter.MDC_SPAN_ID)));

        filter.doFilterInternal(request, new MockHttpServletResponse(), chain);

        assertThat(captured.get()).isEqualTo(spanId);
    }

    @Test
    void shouldNotSetTraceIdWhenHeaderAbsent() throws Exception {
        AtomicReference<String> captured = new AtomicReference<>("sentinel");
        MockFilterChain chain = captureChain(() -> captured.set(MDC.get(MdcFilter.MDC_TRACE_ID)));

        filter.doFilterInternal(new MockHttpServletRequest(), new MockHttpServletResponse(), chain);

        assertThat(captured.get())
                .as("trace_id must not be set when X-B3-TraceId header is absent")
                .isNull();
    }

    // ── user_id ───────────────────────────────────────────────────────────────

    @Test
    void shouldPopulateUserIdForAuthenticatedUser() throws Exception {
        setAuthenticatedUser("alice@example.com");
        AtomicReference<String> captured = new AtomicReference<>();
        MockFilterChain chain = captureChain(() -> captured.set(MDC.get(MdcFilter.MDC_USER_ID)));

        filter.doFilterInternal(new MockHttpServletRequest(), new MockHttpServletResponse(), chain);

        assertThat(captured.get()).isEqualTo("alice@example.com");
    }

    @Test
    void shouldSetEmptyUserIdForUnauthenticatedRequest() throws Exception {
        // No SecurityContext set – anonymous request
        AtomicReference<String> captured = new AtomicReference<>("sentinel");
        MockFilterChain chain = captureChain(() -> captured.set(MDC.get(MdcFilter.MDC_USER_ID)));

        filter.doFilterInternal(new MockHttpServletRequest(), new MockHttpServletResponse(), chain);

        assertThat(captured.get())
                .as("user_id must be empty string for unauthenticated requests")
                .isEmpty();
    }

    // ── MDC cleanup ───────────────────────────────────────────────────────────

    @Test
    void shouldClearMdcAfterRequestCompletion() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("X-B3-TraceId", "trace-to-clear");
        request.addHeader("X-B3-SpanId", "span-to-clear");

        filter.doFilterInternal(request, new MockHttpServletResponse(), new MockFilterChain());

        assertThat(MDC.get(MdcFilter.MDC_CORRELATION_ID))
                .as("MDC correlation_id must be cleared after request")
                .isNull();
        assertThat(MDC.get(MdcFilter.MDC_TRACE_ID))
                .as("MDC trace_id must be cleared after request")
                .isNull();
        assertThat(MDC.get(MdcFilter.MDC_SPAN_ID))
                .as("MDC span_id must be cleared after request")
                .isNull();
        assertThat(MDC.get(MdcFilter.MDC_USER_ID))
                .as("MDC user_id must be cleared after request")
                .isNull();
    }

    @Test
    void shouldClearMdcEvenWhenFilterChainThrows() throws Exception {
        // Build a filter chain that throws mid-processing
        OncePerRequestFilter throwingFilter = new OncePerRequestFilter() {
            @Override
            protected void doFilterInternal(HttpServletRequest req,
                                             HttpServletResponse res,
                                             FilterChain chain) throws ServletException, IOException {
                throw new RuntimeException("simulated downstream failure");
            }
        };
        MockFilterChain chain = new MockFilterChain(
                new HttpServlet() {}, throwingFilter);

        try {
            filter.doFilterInternal(new MockHttpServletRequest(), new MockHttpServletResponse(), chain);
        } catch (RuntimeException | ServletException ignored) {
            // expected
        }

        assertThat(MDC.get(MdcFilter.MDC_CORRELATION_ID))
                .as("MDC must be cleared even when the filter chain throws")
                .isNull();
    }

    // ── async MDC copy ────────────────────────────────────────────────────────

    @Test
    void copyMdcContext_returnsCopyOfCurrentMdc() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("X-B3-TraceId", "trace-async-test");
        AtomicReference<Map<String, String>> captured = new AtomicReference<>();
        MockFilterChain chain = captureChain(() -> captured.set(MdcFilter.copyMdcContext()));

        filter.doFilterInternal(request, new MockHttpServletResponse(), chain);

        assertThat(captured.get())
                .as("copyMdcContext must return a non-null map while request is active")
                .isNotNull()
                .containsKey(MdcFilter.MDC_TRACE_ID);
        assertThat(captured.get().get(MdcFilter.MDC_TRACE_ID)).isEqualTo("trace-async-test");
    }

    @Test
    void copyMdcContext_returnsEmptyMapWhenNoMdcSet() {
        MDC.clear();
        Map<String, String> result = MdcFilter.copyMdcContext();
        assertThat(result)
                .as("copyMdcContext must return an empty map when no MDC is active")
                .isNotNull()
                .isEmpty();
    }

    // ── helpers ───────────────────────────────────────────────────────────────

    /**
     * Builds a MockFilterChain that runs the given action during filter processing.
     * Uses a no-op servlet as the target and wraps the action in a Filter.
     */
    private MockFilterChain captureChain(Runnable action) {
        OncePerRequestFilter capturingFilter = new OncePerRequestFilter() {
            @Override
            protected void doFilterInternal(HttpServletRequest req,
                                             HttpServletResponse res,
                                             FilterChain chain) throws ServletException, IOException {
                action.run();
                chain.doFilter(req, res);
            }
        };
        return new MockFilterChain(new HttpServlet() {}, capturingFilter);
    }

    private void setAuthenticatedUser(String username) {
        User userDetails = new User(username, "", List.of());
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        SecurityContext ctx = SecurityContextHolder.createEmptyContext();
        ctx.setAuthentication(auth);
        SecurityContextHolder.setContext(ctx);
    }
}
