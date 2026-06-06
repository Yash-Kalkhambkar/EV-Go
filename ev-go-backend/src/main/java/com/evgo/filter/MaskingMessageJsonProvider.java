package com.evgo.filter;

import ch.qos.logback.classic.spi.ILoggingEvent;
import com.fasterxml.jackson.core.JsonGenerator;
import net.logstash.logback.composite.AbstractFieldJsonProvider;
import net.logstash.logback.composite.JsonWritingUtils;

import java.io.IOException;

/**
 * Custom Logstash JSON provider that writes the log message field after applying
 * sensitive-data masking via {@link SensitiveDataMaskingConverter}.
 *
 * <p>Replaces the default {@code MessageJsonProvider} in the Logstash encoder
 * so that passwords, tokens, payment details, and card numbers are masked
 * before they reach any log sink.
 *
 * <p>Requirements: 22.3 (log masking), 22.4 (sensitive field masking)
 */
public class MaskingMessageJsonProvider extends AbstractFieldJsonProvider<ILoggingEvent> {

    /** JSON field name; matches the standard Logstash "message" field. */
    public static final String FIELD_MESSAGE = "message";

    public MaskingMessageJsonProvider() {
        setFieldName(FIELD_MESSAGE);
    }

    @Override
    public void writeTo(JsonGenerator generator, ILoggingEvent event) throws IOException {
        String rawMessage = event.getFormattedMessage();
        String masked = SensitiveDataMaskingConverter.mask(rawMessage);
        JsonWritingUtils.writeStringField(generator, getFieldName(), masked);
    }
}
