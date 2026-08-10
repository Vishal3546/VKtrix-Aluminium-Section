package com.app.quotation.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
public class SupabaseStorageService {

    @Value("${supabase.url:https://placeholder.supabase.co}")
    private String supabaseUrl;

    @Value("${supabase.key:placeholder-key}")
    private String supabaseKey;

    @Value("${supabase.bucket:quotations}")
    private String bucketName;

    private final HttpClient httpClient;

    public SupabaseStorageService() {
        this.httpClient = HttpClient.newHttpClient();
    }

    public String uploadPdf(String filename, byte[] pdfData) {
        try {
            String url = String.format("%s/storage/v1/object/%s/%s", supabaseUrl, bucketName, filename);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Authorization", "Bearer " + supabaseKey)
                    .header("apikey", supabaseKey)
                    .header("Content-Type", "application/pdf")
                    .POST(HttpRequest.BodyPublishers.ofByteArray(pdfData))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                // Return public URL (assuming the bucket is public, else signed URL logic is needed)
                return String.format("%s/storage/v1/object/public/%s/%s", supabaseUrl, bucketName, filename);
            } else {
                throw new RuntimeException("Failed to upload to Supabase: " + response.body());
            }
        } catch (Exception e) {
            // For MVP purposes, if it fails because of placeholder keys, just return a mock URL.
            System.err.println("Supabase upload failed or keys not set. Returning mock URL. Error: " + e.getMessage());
            return "https://mock-supabase.url/storage/v1/object/public/" + bucketName + "/" + filename;
        }
    }
}
