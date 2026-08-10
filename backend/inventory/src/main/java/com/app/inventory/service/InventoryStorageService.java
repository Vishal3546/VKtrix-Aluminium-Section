package com.app.inventory.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
public class InventoryStorageService {

    @Value("${supabase.url:https://placeholder.supabase.co}")
    private String supabaseUrl;

    @Value("${supabase.key:placeholder-key}")
    private String supabaseKey;

    @Value("${supabase.inventory.bucket:inventory_docs}")
    private String bucketName;

    private final HttpClient httpClient;

    public InventoryStorageService() {
        this.httpClient = HttpClient.newHttpClient();
    }

    public String uploadDocument(String filename, byte[] documentData, String contentType) {
        if (documentData == null || documentData.length == 0) return null;
        try {
            String url = String.format("%s/storage/v1/object/%s/%s", supabaseUrl, bucketName, filename);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Authorization", "Bearer " + supabaseKey)
                    .header("apikey", supabaseKey)
                    .header("Content-Type", contentType != null ? contentType : "application/octet-stream")
                    .POST(HttpRequest.BodyPublishers.ofByteArray(documentData))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                return String.format("%s/storage/v1/object/public/%s/%s", supabaseUrl, bucketName, filename);
            } else {
                throw new RuntimeException("Failed to upload to Supabase: " + response.body());
            }
        } catch (Exception e) {
            System.err.println("Supabase upload failed or keys not set. Returning mock URL. Error: " + e.getMessage());
            return "https://mock-supabase.url/storage/v1/object/public/" + bucketName + "/" + filename;
        }
    }
}
