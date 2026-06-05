package com.evgo.ai;

import com.evgo.ai.dto.ChatRequest;
import com.evgo.ai.dto.ChatResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * REST endpoint for AI chat.
 * Requirements: 14.1, 14.2
 */
@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AIController {

    private final AIService aiService;

    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> chat(
            @AuthenticationPrincipal String userId,
            @Valid @RequestBody ChatRequest request) {
        ChatResponse response = aiService.chat(Long.parseLong(userId), request);
        return ResponseEntity.ok(response);
    }
}
