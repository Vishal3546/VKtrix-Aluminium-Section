package com.app.profile.service;

import com.app.profile.dto.DesignRequest;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

@Service
public class AiParsingService {

    @Value("${openai.api.key:dummy_key}")
    private String openAiApiKey;

    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;

    public AiParsingService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
    }

    public DesignRequest parseFromText(String text) {
        try {
            String systemPrompt = "You are an assistant that extracts dimensions and layout for an aluminium window/door design.\\n" +
                    "Return ONLY a JSON object matching this schema, with no markdown formatting:\\n" +
                    "{\\n" +
                    "  \\\"widthMm\\\": number,\\n" +
                    "  \\\"heightMm\\\": number,\\n" +
                    "  \\\"layoutType\\\": string (e.g. \\\"GRID\\\", \\\"SLIDER\\\", \\\"FIXED\\\"),\\n" +
                    "  \\\"gridRows\\\": number,\\n" +
                    "  \\\"gridCols\\\": number,\\n" +
                    "  \\\"hasDoor\\\": boolean,\\n" +
                    "  \\\"doorPosition\\\": number (1-based index)\\n" +
                    "}\\n" +
                    "Extract from this user input: " + text;

            String requestBody = objectMapper.createObjectNode()
                    .put("model", "gpt-4o-mini")
                    .set("messages", objectMapper.createArrayNode()
                            .add(objectMapper.createObjectNode()
                                    .put("role", "system")
                                    .put("content", systemPrompt))
                    ).toString();

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.openai.com/v1/chat/completions"))
                    .header("Authorization", "Bearer " + openAiApiKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            
            JsonNode root = objectMapper.readTree(response.body());
            String content = root.path("choices").path(0).path("message").path("content").asText();
            
            // Clean markdown block if any
            if (content.startsWith("```json")) {
                content = content.replace("```json", "").replace("```", "").trim();
            }

            return objectMapper.readValue(content, DesignRequest.class);

        } catch (Exception e) {
            throw new RuntimeException("Failed to parse design from text using AI: " + e.getMessage(), e);
        }
    }

    public DesignRequest parseFromImage(String imageUrl) {
        try {
            String systemPrompt = "You are an assistant that analyzes an image of a window or door.\\n" +
                    "Estimate the dimensions and layout, and return ONLY a JSON object matching this schema:\\n" +
                    "{\\n" +
                    "  \\\"widthMm\\\": number,\\n" +
                    "  \\\"heightMm\\\": number,\\n" +
                    "  \\\"layoutType\\\": string (e.g. \\\"GRID\\\", \\\"SLIDER\\\", \\\"FIXED\\\"),\\n" +
                    "  \\\"gridRows\\\": number,\\n" +
                    "  \\\"gridCols\\\": number,\\n" +
                    "  \\\"hasDoor\\\": boolean,\\n" +
                    "  \\\"doorPosition\\\": number\\n" +
                    "}";

            String requestBody = objectMapper.createObjectNode()
                    .put("model", "gpt-4o-mini")
                    .set("messages", objectMapper.createArrayNode()
                            .add(objectMapper.createObjectNode()
                                    .put("role", "system")
                                    .put("content", systemPrompt))
                            .add(objectMapper.createObjectNode()
                                    .put("role", "user")
                                    .set("content", objectMapper.createArrayNode()
                                            .add(objectMapper.createObjectNode()
                                                    .put("type", "text")
                                                    .put("text", "Parse this design"))
                                            .add(objectMapper.createObjectNode()
                                                    .put("type", "image_url")
                                                    .set("image_url", objectMapper.createObjectNode()
                                                            .put("url", imageUrl)))
                                    ))
                    ).toString();

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.openai.com/v1/chat/completions"))
                    .header("Authorization", "Bearer " + openAiApiKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            
            JsonNode root = objectMapper.readTree(response.body());
            String content = root.path("choices").path(0).path("message").path("content").asText();
            
            if (content.startsWith("```json")) {
                content = content.replace("```json", "").replace("```", "").trim();
            }

            return objectMapper.readValue(content, DesignRequest.class);

        } catch (Exception e) {
            throw new RuntimeException("Failed to parse design from image using AI: " + e.getMessage(), e);
        }
    }
}
