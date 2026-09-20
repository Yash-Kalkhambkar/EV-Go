# EV GO — AI Integration (Claude API)

## What AI Does in v1

One feature, done well: a natural language chatbot that understands what the user wants and either answers directly or translates the request into a station search.

Examples of what it handles:
- "Find a CCS2 station near Hadapsar open after 6pm today"
- "Which station is cheapest within 5km of me right now?"
- "What's the price at Loni Kalbhor Charging Hub?"
- "Cancel my booking for tomorrow morning"
- "How long does a full charge take?"

This is not a gimmick feature bolted on — it replaces the search/filter UI for users who prefer to just describe what they need.

---

## Architecture

```
User types message
      │
      ▼
POST /api/ai/chat
      │
      ▼
AIController → AIService
      │
      ├── ConversationStore.getHistory(userId)   [Redis]
      │
      ├── Build system prompt with:
      │     - App context
      │     - User's current location (if provided)
      │     - Available connector types
      │
      ├── Call Claude API
      │     - model: claude-sonnet-4-20250514
      │     - messages: history + new user message
      │     - tools: search_stations, get_booking, cancel_booking
      │
      ├── If Claude calls a tool:
      │     └── Execute tool (call internal service)
      │         └── Return tool result to Claude
      │             └── Claude generates final reply
      │
      ├── ConversationStore.saveHistory(userId, updatedHistory)
      │
      └── Return { reply, stations? }
```

---

## System Prompt

The system prompt is the most important part. It tells Claude what it is, what it can do, and how to behave.

```
You are the EV GO assistant — a helpful AI built into the EV GO app that helps 
electric vehicle owners find charging stations and manage bookings.

The user is in India. Distances are in kilometres. Prices are in Indian Rupees (₹).
The current date and time is: {currentDateTime}
The user's location: {userLat}, {userLng} (if available)

You have access to the following tools:
- search_stations: Search for charging stations by location, connector type, and availability
- get_user_bookings: Get the user's current and upcoming bookings
- cancel_booking: Cancel a specific confirmed booking

Rules:
- Always be concise and helpful
- When the user asks to find stations, use the search_stations tool — do not make up station data
- When presenting stations, include name, distance, price per hour, and available slots
- If the user's intent is ambiguous, ask one clarifying question
- If you cannot do something (e.g. make a payment), explain that and guide the user to do it in the app
- Never make up booking IDs, station names, or prices
```

---

## Tool Definitions (Claude API Function Calling)

Claude is given three tools. When it decides to use one, the backend executes the corresponding Java service call.

```java
// AIService.java — Tool definitions sent to Claude
List<Tool> tools = List.of(
    Tool.builder()
        .name("search_stations")
        .description("Search for EV charging stations near a location")
        .inputSchema(Map.of(
            "type", "object",
            "properties", Map.of(
                "latitude",      Map.of("type", "number", "description", "Search center latitude"),
                "longitude",     Map.of("type", "number", "description", "Search center longitude"),
                "radiusKm",      Map.of("type", "integer", "description", "Search radius in km, default 10"),
                "connectorType", Map.of("type", "string", "description", "Optional: CCS2, TYPE2, CHADEMO"),
                "availableOnly", Map.of("type", "boolean", "description", "Only return stations with available slots"),
                "date",          Map.of("type", "string", "description", "Date to check availability (YYYY-MM-DD)"),
                "afterTime",     Map.of("type", "string", "description", "Only include slots starting after this time (HH:mm, e.g. '18:00')")
            ),
            "required", List.of("latitude", "longitude")
        ))
        .build(),

    Tool.builder()
        .name("get_user_bookings")
        .description("Get the current user's upcoming bookings")
        .inputSchema(Map.of(
            "type", "object",
            "properties", Map.of(
                "status", Map.of("type", "string", "description", "Filter by status: PENDING, CONFIRMED")
            )
        ))
        .build(),

    Tool.builder()
        .name("cancel_booking")
        .description("Cancel a specific booking by ID")
        .inputSchema(Map.of(
            "type", "object",
            "properties", Map.of(
                "bookingId", Map.of("type", "integer", "description", "The booking ID to cancel")
            ),
            "required", List.of("bookingId")
        ))
        .build()
);
```

---

## Tool Execution Loop

Claude sometimes needs multiple tool calls to answer one question (e.g. "Can I cancel the booking I made for tomorrow?" requires first getting bookings, then cancelling). The execution loop handles this:

```java
public ChatResponse chat(Long userId, String userMessage) {
    String systemPrompt = buildSystemPrompt(userId);
    List<ChatMessage> history = conversationStore.getHistory(userId);
    history.add(new ChatMessage("user", userMessage));

    List<StationDto> referencedStations = new ArrayList<>();

    // Loop — handles multi-turn tool use
    while (true) {
        ClaudeResponse response = claudeClient.complete(
            systemPrompt, history, tools
        );

        // If Claude finished with a text reply, we're done
        if (response.getStopReason().equals("end_turn")) {
            history.add(new ChatMessage("assistant", response.getText()));
            conversationStore.saveHistory(userId, history);

            return ChatResponse.builder()
                .reply(response.getText())
                .stations(referencedStations.isEmpty() ? null : referencedStations)
                .build();
        }

        // Claude wants to use a tool
        if (response.getStopReason().equals("tool_use")) {
            ToolUseBlock toolUse = response.getToolUseBlock();
            String toolResult = executeTool(toolUse, userId, referencedStations);

            // Add Claude's tool call + our result to the conversation
            history.add(new ChatMessage("assistant", response.getContent()));
            history.add(new ChatMessage("user", List.of(
                ToolResultBlock.of(toolUse.getId(), toolResult)
            )));
            // Loop again — Claude will process the result and either reply or call another tool
        }
    }
}

private String executeTool(ToolUseBlock toolUse, Long userId, List<StationDto> referencedStations) {
    return switch (toolUse.getName()) {
        case "search_stations" -> {
            var params = parseParams(toolUse.getInput(), StationSearchRequest.class);
            List<StationDto> stations = stationService.search(params);
            referencedStations.addAll(stations);
            yield objectMapper.writeValueAsString(stations);
        }
        case "get_user_bookings" -> {
            List<BookingDto> bookings = bookingService.getUserBookings(userId, null);
            yield objectMapper.writeValueAsString(bookings);
        }
        case "cancel_booking" -> {
            Long bookingId = toolUse.getInput().get("bookingId").asLong();
            bookingService.cancelBooking(bookingId, userId);
            yield "{\"success\": true, \"message\": \"Booking cancelled\"}";
        }
        default -> "{\"error\": \"Unknown tool\"}";
    };
}
```

---

## Conversation History

History is kept in Redis, keyed by userId, and expires after 2 hours of inactivity. The backend owns conversation state exclusively.

```java
// ConversationStore.java
@Service
public class ConversationStore {

    private final StringRedisTemplate redis;
    private final ObjectMapper objectMapper;
    private static final Duration TTL = Duration.ofHours(2);

    public List<ChatMessage> getHistory(Long userId) {
        String raw = redis.opsForValue().get("ai:history:" + userId);
        if (raw == null) return new ArrayList<>();
        return objectMapper.readValue(raw, new TypeReference<>() {});
    }

    public void saveHistory(Long userId, List<ChatMessage> history) {
        // Keep only the last 20 messages to control token count
        List<ChatMessage> trimmed = history.size() > 20
            ? history.subList(history.size() - 20, history.size())
            : history;
        redis.opsForValue().set(
            "ai:history:" + userId,
            objectMapper.writeValueAsString(trimmed),
            TTL
        );
    }
}
```

**Important:** The frontend's `chatStore` is purely a display cache (what's rendered in the chat panel). It does NOT send history back to the server. The backend calls `ConversationStore.getHistory(userId)`, appends the new user message, calls Claude, appends the assistant reply, and saves the updated history. This prevents history divergence when tool executions modify state.

---

## The `stations` Field in Chat Response

When Claude's reply references real stations (via the `search_stations` tool), the backend returns those stations alongside the text reply:

```json
{
  "reply": "Here are 3 CCS2 stations near Hadapsar with slots after 6pm...",
  "stations": [
    { "id": 2, "name": "Hadapsar EV Center", "latitude": 18.5121, "longitude": 73.9435 },
    { "id": 5, "name": "Magarpatta EV Hub",  "latitude": 18.5100, "longitude": 73.9350 }
  ]
}
```

The frontend uses the `stations` array to highlight those specific pins on the map, creating a seamless experience where the chatbot and map work together.

---

## Claude API Client

```java
// ClaudeClient.java
@Component
public class ClaudeClient {

    private final String apiKey;
    private final String model = "claude-sonnet-4-20250514";
    private final RestTemplate restTemplate;

    public ClaudeResponse complete(String systemPrompt, List<ChatMessage> messages, List<Tool> tools) {
        Map<String, Object> requestBody = Map.of(
            "model",      model,
            "max_tokens", 1000,
            "system",     systemPrompt,
            "tools",      tools,
            "messages",   messages
        );

        HttpHeaders headers = new HttpHeaders();
        headers.set("x-api-key", apiKey);
        headers.set("anthropic-version", "2023-06-01");
        headers.setContentType(MediaType.APPLICATION_JSON);

        ResponseEntity<ClaudeApiResponse> response = restTemplate.exchange(
            "https://api.anthropic.com/v1/messages",
            HttpMethod.POST,
            new HttpEntity<>(requestBody, headers),
            ClaudeApiResponse.class
        );

        return ClaudeResponse.from(response.getBody());
    }
}
```

---

## Error Handling

| Scenario | Handling |
|---|---|
| Claude API unreachable | Return fallback: "I'm having trouble connecting. Please use the search bar to find stations." |
| Claude calls an unknown tool | Log it, return tool error string, let Claude recover |
| Tool execution throws exception | Catch, return error JSON to Claude so it can explain the issue to the user |
| History deserialization fails | Start fresh history, log warning |
| Rate limit from Claude API | Return 429 to frontend with retry-after hint |

---

## What v2 Adds to AI

- **Review summarization** — after enough reviews accumulate on stations, Claude summarizes them: "Users love the fast charging but mention the parking is tight."
- **Personalized recommendations** — "Based on your past bookings, here are stations you might prefer."
- **Proactive suggestions** — "Your booking tomorrow is at 9am. Traffic on that route is usually heavy — want to leave earlier?"
