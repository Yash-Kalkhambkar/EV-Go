package com.evgo.filter;

import ch.qos.logback.classic.pattern.MessageConverter;
import ch.qos.logback.classic.spi.ILoggingEvent;

import java.util.regex.Pattern;

/**
 * Custom Logback {@link MessageConverter} that masks sensitive data in log messages.
 *
 * <p>Registered in {@code logback-spring.xml} as a conversion rule named
 * {@code maskedMessage}. The encoder uses this converter in place of the default
 * {@code %msg} pattern.
 *
 * <p>Masked patterns:
 * <ul>
 *   <li>Password fields: {@code password=...}, {@code passwd=...}, {@code pwd=...}</li>
 *   <li>Token fields: {@code token=...}, {@code access_token=...}, {@code refresh_token=...}</li>
 *   <li>Authorization headers: {@code Authorization: Bearer <token>}</li>
 *   <li>Razorpay payment IDs: {@code razorpay_payment_id=pay_...}</li>
 *   <li>Razorpay signatures: {@code razorpay_signature=...}</li>
 *   <li>16-digit card numbers (basic PAN pattern)</li>
 *   <li>JSON password fields: {@code "password":"..."}</li>
 * </ul>
 *
 * <p>Requirements: 22.3 (log masking), 22.4 (sensitive field masking), 22.5 (PAN masking)
 */
public class SensitiveDataMaskingConverter extends MessageConverter {

    private static final String MASKED = "***";

    /**
     * Compiled patterns for sensitive data detection.
     * Patterns are compiled once at class load time for performance.
     */
    private static final Pattern[] PATTERNS = {
            // password=<value> (query params, form data, log statements)
            Pattern.compile("(?i)(password|passwd|pwd)\\s*[=:]\\s*\\S+",
                    Pattern.CASE_INSENSITIVE),

            // token=<value> (access_token, refresh_token, token)
            Pattern.compile("(?i)(access_token|refresh_token|token)\\s*[=:]\\s*\\S+",
                    Pattern.CASE_INSENSITIVE),

            // Authorization: Bearer <token>
            Pattern.compile("(?i)(Authorization\\s*:\\s*Bearer\\s+)\\S+",
                    Pattern.CASE_INSENSITIVE),

            // razorpay_payment_id=pay_<value>
            Pattern.compile("(?i)(razorpay_payment_id\\s*[=:]\\s*)\\S+",
                    Pattern.CASE_INSENSITIVE),

            // razorpay_signature=<value>
            Pattern.compile("(?i)(razorpay_signature\\s*[=:]\\s*)\\S+",
                    Pattern.CASE_INSENSITIVE),

            // JSON "password":"<value>" or "password" : "<value>"
            Pattern.compile("(?i)(\"(?:password|passwd|pwd|token|secret)\"\\s*:\\s*\")([^\"]+)(\")",
                    Pattern.CASE_INSENSITIVE),

            // 16-digit card numbers (basic PAN: groups of 4 digits, optionally separated by spaces/dashes)
            Pattern.compile("\\b(\\d{4}[\\s\\-]?\\d{4}[\\s\\-]?\\d{4}[\\s\\-]?\\d{4})\\b"),
    };

    /**
     * Replacement strings corresponding to each pattern.
     * For patterns with capture groups, the replacement preserves the key and masks the value.
     */
    private static final String[] REPLACEMENTS = {
            "$1=" + MASKED,                 // password=***
            "$1=" + MASKED,                 // token=***
            "$1" + MASKED,                  // Authorization: Bearer ***
            "$1" + MASKED,                  // razorpay_payment_id=***
            "$1" + MASKED,                  // razorpay_signature=***
            "$1" + MASKED + "$3",           // "password":"***"
            MASKED,                         // card number → ***
    };

    /**
     * Converts the log message by applying all masking patterns.
     *
     * @param event the logging event whose message will be masked
     * @return the masked message string
     */
    @Override
    public String convert(ILoggingEvent event) {
        String message = event.getFormattedMessage();
        if (message == null || message.isEmpty()) {
            return message;
        }
        return mask(message);
    }

    /**
     * Applies all masking patterns to the given string.
     *
     * @param input the raw log message
     * @return the message with sensitive data replaced by {@code ***}
     */
    public static String mask(String input) {
        if (input == null || input.isEmpty()) {
            return input;
        }
        String result = input;
        for (int i = 0; i < PATTERNS.length; i++) {
            result = PATTERNS[i].matcher(result).replaceAll(REPLACEMENTS[i]);
        }
        return result;
    }
}
