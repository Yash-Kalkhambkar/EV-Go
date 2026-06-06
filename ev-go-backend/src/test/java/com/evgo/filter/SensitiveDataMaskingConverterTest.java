package com.evgo.filter;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Unit tests for {@link SensitiveDataMaskingConverter}.
 *
 * <p>Verifies that all sensitive-data patterns defined in the converter are
 * correctly masked and that non-sensitive content is left unchanged.
 *
 * <p>Requirements: 22.4 (sensitive field masking), 22.3 (log masking)
 */
class SensitiveDataMaskingConverterTest {

    private static final String MASKED = "***";

    // ── null / empty guards ──────────────────────────────────────────────────

    @Test
    void mask_nullInput_returnsNull() {
        assertThat(SensitiveDataMaskingConverter.mask(null)).isNull();
    }

    @Test
    void mask_emptyInput_returnsEmpty() {
        assertThat(SensitiveDataMaskingConverter.mask("")).isEmpty();
    }

    // ── password fields ──────────────────────────────────────────────────────

    @ParameterizedTest(name = "password key ''{0}'' is masked")
    @CsvSource({
            "password=secret123,         password=***",
            "Password=MyP@ssw0rd,        Password=***",
            "passwd=hunter2,             passwd=***",
            "pwd=abc,                    pwd=***",
            "password : secret,          password=***",
    })
    void mask_passwordField_isReplaced(String input, String expected) {
        assertThat(SensitiveDataMaskingConverter.mask(input.strip()))
                .isEqualTo(expected.strip());
    }

    // ── token fields ─────────────────────────────────────────────────────────

    @ParameterizedTest(name = "token key ''{0}'' is masked")
    @CsvSource({
            "token=eyJhbGciOiJIUzI1NiJ9.abc,   token=***",
            "access_token=abc123,               access_token=***",
            "refresh_token=def456,              refresh_token=***",
    })
    void mask_tokenField_isReplaced(String input, String expected) {
        assertThat(SensitiveDataMaskingConverter.mask(input.strip()))
                .isEqualTo(expected.strip());
    }

    // ── Authorization header ──────────────────────────────────────────────────

    @Test
    void mask_authorizationBearerHeader_isReplaced() {
        String input = "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.payload.signature";
        String result = SensitiveDataMaskingConverter.mask(input);
        assertThat(result).isEqualTo("Authorization: Bearer ***");
    }

    @Test
    void mask_authorizationBearerHeader_caseInsensitive() {
        String input = "AUTHORIZATION: BEARER token123";
        String result = SensitiveDataMaskingConverter.mask(input);
        assertThat(result).contains(MASKED);
        assertThat(result).doesNotContain("token123");
    }

    // ── Razorpay payment fields ───────────────────────────────────────────────

    @Test
    void mask_razorpayPaymentId_isReplaced() {
        String input = "razorpay_payment_id=pay_1234567890abcde";
        String result = SensitiveDataMaskingConverter.mask(input);
        assertThat(result).isEqualTo("razorpay_payment_id=***");
        assertThat(result).doesNotContain("pay_1234567890abcde");
    }

    @Test
    void mask_razorpaySignature_isReplaced() {
        String input = "razorpay_signature=abc123def456ghi789";
        String result = SensitiveDataMaskingConverter.mask(input);
        assertThat(result).isEqualTo("razorpay_signature=***");
        assertThat(result).doesNotContain("abc123def456ghi789");
    }

    // ── JSON sensitive fields ─────────────────────────────────────────────────

    @Test
    void mask_jsonPasswordField_isReplaced() {
        String input = "{\"username\":\"alice\",\"password\":\"secret123\"}";
        String result = SensitiveDataMaskingConverter.mask(input);
        assertThat(result).contains("\"password\":\"***\"");
        assertThat(result).doesNotContain("secret123");
        assertThat(result).contains("\"username\":\"alice\""); // non-sensitive preserved
    }

    @Test
    void mask_jsonTokenField_isReplaced() {
        String input = "{\"token\":\"eyJhbGci.abc.xyz\",\"userId\":42}";
        String result = SensitiveDataMaskingConverter.mask(input);
        assertThat(result).contains("\"token\":\"***\"");
        assertThat(result).doesNotContain("eyJhbGci");
        assertThat(result).contains("\"userId\":42");
    }

    @Test
    void mask_jsonSecretField_isReplaced() {
        String input = "{\"secret\":\"my-secret-value\"}";
        String result = SensitiveDataMaskingConverter.mask(input);
        assertThat(result).contains("\"secret\":\"***\"");
        assertThat(result).doesNotContain("my-secret-value");
    }

    // ── Card numbers (PAN masking) ────────────────────────────────────────────

    @Test
    void mask_16DigitCardNumber_isReplaced() {
        String input = "Card: 4111111111111111";
        String result = SensitiveDataMaskingConverter.mask(input);
        assertThat(result).isEqualTo("Card: ***");
    }

    @Test
    void mask_cardNumberWithSpaces_isReplaced() {
        String input = "Payment card 4111 1111 1111 1111 charged";
        String result = SensitiveDataMaskingConverter.mask(input);
        assertThat(result).doesNotContain("4111");
        assertThat(result).contains(MASKED);
    }

    @Test
    void mask_cardNumberWithDashes_isReplaced() {
        String input = "Card: 4111-1111-1111-1111";
        String result = SensitiveDataMaskingConverter.mask(input);
        assertThat(result).doesNotContain("4111");
        assertThat(result).contains(MASKED);
    }

    // ── Non-sensitive data preserved ──────────────────────────────────────────

    @Test
    void mask_normalLogMessage_isUnchanged() {
        String input = "User alice@example.com logged in from 192.168.1.1";
        assertThat(SensitiveDataMaskingConverter.mask(input)).isEqualTo(input);
    }

    @Test
    void mask_bookingLogMessage_isUnchanged() {
        String input = "Booking 42 confirmed for station 7 at 2025-01-01T10:00:00Z";
        assertThat(SensitiveDataMaskingConverter.mask(input)).isEqualTo(input);
    }

    @Test
    void mask_jsonNonSensitiveFields_areUnchanged() {
        String input = "{\"status\":\"CONFIRMED\",\"amount\":500.00}";
        assertThat(SensitiveDataMaskingConverter.mask(input)).isEqualTo(input);
    }

    // ── Multiple sensitive fields in one message ───────────────────────────────

    @Test
    void mask_multiplePatterns_allAreReplaced() {
        String input = "Login: password=secret token=abc123 card=4111111111111111";
        String result = SensitiveDataMaskingConverter.mask(input);
        assertThat(result).doesNotContain("secret");
        assertThat(result).doesNotContain("abc123");
        assertThat(result).doesNotContain("4111111111111111");
        // Each sensitive value replaced with ***
        assertThat(result).contains(MASKED);
    }
}
