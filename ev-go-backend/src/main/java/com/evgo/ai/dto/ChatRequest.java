package com.evgo.ai.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Chat request from the frontend.
 */
public record ChatRequest(@NotBlank String message) {}
