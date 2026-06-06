package com.evgo.filter;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.Logger;
import ch.qos.logback.classic.LoggerContext;
import ch.qos.logback.classic.spi.LoggingEvent;
import com.fasterxml.jackson.core.JsonGenerator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.io.StringWriter;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

/**
 * Unit tests for {@link MaskingMessageJsonProvider}.
 *
 * <p>Verifies that the JSON provider correctly masks sensitive data when
 * writing the message field to the JSON output.
 *
 * <p>Requirements: 22.4 (sensitive data masking in JSON logs)
 */
class MaskingMessageJsonProviderTest {

    private MaskingMessageJsonProvider provider;
    private LoggerContext loggerContext;
    private Logger logger;

    @BeforeEach
    void setUp() {
        provider = new MaskingMessageJsonProvider();
        loggerContext = new LoggerContext();
        logger = loggerContext.getLogger("test");
    }

    @Test
    void defaultFieldNameIsMessage() {
        assertThat(provider.getFieldName())
                .as("Default field name must be 'message'")
                .isEqualTo(MaskingMessageJsonProvider.FIELD_MESSAGE);
    }

    @Test
    void writeTo_masksPasswordInMessage() throws IOException {
        String rawMessage = "Login attempt: password=s3cr3t";
        LoggingEvent event = createEvent(rawMessage);

        StringWriter sw = new StringWriter();
        JsonGenerator generator = new com.fasterxml.jackson.core.JsonFactory()
                .createGenerator(sw);
        generator.writeStartObject();
        provider.writeTo(generator, event);
        generator.writeEndObject();
        generator.flush();

        String json = sw.toString();
        assertThat(json).contains("\"message\"");
        assertThat(json).contains("***");
        assertThat(json).doesNotContain("s3cr3t");
    }

    @Test
    void writeTo_masksTokenInMessage() throws IOException {
        String rawMessage = "Token refresh: token=eyJhbGciOiJIUzI1NiJ9";
        LoggingEvent event = createEvent(rawMessage);

        StringWriter sw = new StringWriter();
        JsonGenerator generator = new com.fasterxml.jackson.core.JsonFactory()
                .createGenerator(sw);
        generator.writeStartObject();
        provider.writeTo(generator, event);
        generator.writeEndObject();
        generator.flush();

        String json = sw.toString();
        assertThat(json).doesNotContain("eyJhbGciOiJIUzI1NiJ9");
        assertThat(json).contains("***");
    }

    @Test
    void writeTo_preservesNonSensitiveMessage() throws IOException {
        String rawMessage = "Booking 42 confirmed for user alice@example.com";
        LoggingEvent event = createEvent(rawMessage);

        StringWriter sw = new StringWriter();
        JsonGenerator generator = new com.fasterxml.jackson.core.JsonFactory()
                .createGenerator(sw);
        generator.writeStartObject();
        provider.writeTo(generator, event);
        generator.writeEndObject();
        generator.flush();

        String json = sw.toString();
        assertThat(json).contains("Booking 42 confirmed");
        assertThat(json).contains("alice@example.com");
    }

    @Test
    void writeTo_handlesNullMessage() throws IOException {
        LoggingEvent event = createEvent(null);

        StringWriter sw = new StringWriter();
        JsonGenerator generator = new com.fasterxml.jackson.core.JsonFactory()
                .createGenerator(sw);
        generator.writeStartObject();
        provider.writeTo(generator, event);
        generator.writeEndObject();
        generator.flush();

        // Null message produces no field or null field — should not throw
        // This is acceptable: Logback does not emit null-message events in practice
        String json = sw.toString();
        assertThat(json).isNotNull();
    }

    // ── helpers ───────────────────────────────────────────────────────────────

    private LoggingEvent createEvent(String message) {
        LoggingEvent event = new LoggingEvent();
        event.setLoggerContext(loggerContext);
        event.setLoggerName("test");
        event.setLevel(Level.INFO);
        if (message != null) {
            event.setMessage(message);
        } else {
            event.setMessage(null);
        }
        return event;
    }
}
