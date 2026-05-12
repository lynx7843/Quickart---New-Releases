package com.example.backend.service;

import com.example.backend.dto.TryOnRequest;
import com.example.backend.dto.TryOnResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.MessageDigest;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class TryOnService {

    private String replicateToken;

    @Value("${cloudinary.cloud.name}")
    private String cloudName;

    @Value("${cloudinary.api.key}")
    private String cloudApiKey;

    @Value("${cloudinary.api.secret}")
    private String cloudApiSecret;

    private final GeminiImageGenerationService geminiImageGenerationService;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public TryOnService(GeminiImageGenerationService geminiImageGenerationService) {
        this.geminiImageGenerationService = geminiImageGenerationService;
        loadReplicateTokenFromEnv();
    }

    private void loadReplicateTokenFromEnv() {
        try {
            Path envPath = Paths.get(".env");
            if (!Files.exists(envPath)) {
                envPath = Paths.get("../.env");
            }
            if (Files.exists(envPath)) {
                List<String> lines = Files.readAllLines(envPath);
                for (String line : lines) {
                    line = line.trim();
                    if (line.startsWith("REPLICATE_API_TOKEN=")) {
                        this.replicateToken = line.substring("REPLICATE_API_TOKEN=".length()).trim();
                        break;
                    }
                }
            }
        } catch (IOException e) {
            System.err.println("[TryOnService] Failed to load .env file: " + e.getMessage());
        }
    }

    public TryOnResponse process(TryOnRequest req) {
        if (req == null) {
            return TryOnResponse.error("Request body is missing.");
        }
        if (isBlank(req.userImageBase64()) || isBlank(req.clothImageBase64())) {
            return TryOnResponse.error("Both user image and cloth image are required.");
        }

        try {
            return processWithReplicate(req);
        } catch (Exception e) {
            System.err.println("[TryOnService] Replicate failed: " + e.getMessage());
            return TryOnResponse.error("Virtual try-on failed: " + e.getMessage());
        }
    }

    private TryOnResponse processWithReplicate(TryOnRequest req) throws Exception {
        if (isBlank(replicateToken) || isBlank(cloudName) || isBlank(cloudApiKey) || isBlank(cloudApiSecret)) {
            throw new IllegalStateException("Replicate or Cloudinary configuration missing");
        }

        String personB64 = stripDataUriPrefix(req.userImageBase64());
        String garmentB64 = stripDataUriPrefix(req.clothImageBase64());

        byte[] personBytes = Base64.getDecoder().decode(personB64);
        byte[] garmentBytes = Base64.getDecoder().decode(garmentB64);

        System.out.println("[TryOnService] Uploading person image to Cloudinary...");
        String personUrl = uploadToCloudinary(personBytes, "person_" + System.currentTimeMillis());

        System.out.println("[TryOnService] Uploading garment image to Cloudinary...");
        String garmentUrl = uploadToCloudinary(garmentBytes, "garment_" + System.currentTimeMillis());

        System.out.println("[TryOnService] Person URL:  " + personUrl);
        System.out.println("[TryOnService] Garment URL: " + garmentUrl);

        Map<String, Object> input = new LinkedHashMap<>();
        input.put("human_img", personUrl);
        input.put("garm_img", garmentUrl);
        input.put("garment_des", "clothing item");
        input.put("is_checked", true);
        input.put("is_checked_crop", true);
        input.put("denoise_steps", 30);
        input.put("seed", 42);

        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("version", MODEL_VERSION);
        payload.put("input", input);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(replicateToken);

        HttpEntity<Map<String, Object>> httpReq = new HttpEntity<>(payload, headers);

        ResponseEntity<String> startResp = restTemplate.postForEntity(REPLICATE_API_URL, httpReq, String.class);

        if (!startResp.getStatusCode().is2xxSuccessful() || startResp.getBody() == null) {
            throw new RuntimeException("Replicate returned HTTP " + startResp.getStatusCode());
        }

        JsonNode startJson = objectMapper.readTree(startResp.getBody());
        String predictionId = startJson.path("id").asText();
        String pollUrl = startJson.path("urls").path("get").asText();

        if (predictionId.isEmpty() || pollUrl.isEmpty()) {
            throw new RuntimeException("Could not get prediction ID from Replicate.");
        }

        System.out.println("[TryOnService] Prediction started: " + predictionId);

        HttpHeaders pollHeaders = new HttpHeaders();
        pollHeaders.setBearerAuth(replicateToken);
        HttpEntity<Void> pollReq = new HttpEntity<>(pollHeaders);

        String status = "starting";
        JsonNode resultJson = null;
        int maxAttempts = 36; // 3 minutes timeout (36 * 5s)

        for (int i = 0; i < maxAttempts; i++) {
            Thread.sleep(5000);

            ResponseEntity<String> pollResp = restTemplate.exchange(pollUrl, HttpMethod.GET, pollReq, String.class);
            resultJson = objectMapper.readTree(pollResp.getBody());
            status = resultJson.path("status").asText();

            System.out.println("[TryOnService] Poll " + (i + 1) + " -> status: " + status);

            if (status.equals("succeeded") || status.equals("failed") || status.equals("canceled")) {
                break;
            }
        }

        if (!"succeeded".equals(status)) {
            String errMsg = resultJson != null ? resultJson.path("error").asText("Unknown error") : "Prediction timed out";
            throw new RuntimeException("Replicate prediction failed: " + errMsg);
        }

        JsonNode output = resultJson.path("output");
        String imageUrl;

        if (output.isArray() && !output.isEmpty()) {
            imageUrl = output.get(0).asText();
        } else if (output.isTextual()) {
            imageUrl = output.asText();
        } else {
            throw new RuntimeException("No output image returned from Replicate.");
        }

        String base64Image = downloadImageAsBase64(imageUrl);
        FitResult fit = deriveFit(req.selectedSize());

        return TryOnResponse.success(
                fit.match(),
                fit.reason(),
                fit.score(),
                "data:image/png;base64," + base64Image
        );
    }

    private String uploadToCloudinary(byte[] imageBytes, String publicId) throws Exception {
        String uploadUrl = "https://api.cloudinary.com/v1_1/" + cloudName + "/image/upload";
        long timestamp = System.currentTimeMillis() / 1000;

        String toSign = "public_id=" + publicId + "&timestamp=" + timestamp + cloudApiSecret;
        String signature = sha1Hex(toSign);

        ByteArrayResource fileResource = new ByteArrayResource(imageBytes) {
            @Override
            public String getFilename() {
                return publicId + ".jpg";
            }
        };

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", fileResource);
        body.add("public_id", publicId);
        body.add("timestamp", String.valueOf(timestamp));
        body.add("api_key", cloudApiKey);
        body.add("signature", signature);

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(uploadUrl, requestEntity, String.class);

        if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
            throw new RuntimeException("Cloudinary upload failed: " + response.getBody());
        }

        JsonNode json = objectMapper.readTree(response.getBody());
        String secureUrl = json.path("secure_url").asText();

        if (secureUrl.isEmpty()) {
            throw new RuntimeException("Cloudinary did not return a URL: " + response.getBody());
        }

        return secureUrl;
    }

    private String downloadImageAsBase64(String imageUrl) {
        ResponseEntity<byte[]> imageResp = restTemplate.exchange(imageUrl, HttpMethod.GET, new HttpEntity<>(new HttpHeaders()), byte[].class);

        if (!imageResp.getStatusCode().is2xxSuccessful() || imageResp.getBody() == null) {
            throw new RuntimeException("Failed to download result image from Replicate.");
        }

        return Base64.getEncoder().encodeToString(imageResp.getBody());
    }

    private static String sha1Hex(String input) throws Exception {
        MessageDigest md = MessageDigest.getInstance("SHA-1");
        byte[] hash = md.digest(input.getBytes("UTF-8"));
        StringBuilder sb = new StringBuilder();
        for (byte b : hash) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }

    private static String stripDataUriPrefix(String input) {
        if (input == null) return "";
        int comma = input.indexOf(',');
        return (comma >= 0) ? input.substring(comma + 1) : input;
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    private FitResult deriveFit(String size) {
        if (size == null) size = "M";
        return switch (size.toUpperCase()) {
            case "XS" -> new FitResult("Tight",
                    "XS is the smallest cut. The garment fits very close to the body — " +
                    "great for a form-fitting look, but allow for limited movement.", 72);
            case "S" -> new FitResult("Perfect",
                    "S provides a slim, tailored silhouette with comfortable mobility. " +
                    "An ideal choice for most body types looking for a modern fit.", 91);
            case "M" -> new FitResult("Perfect",
                    "M is the universal mid-range size. The garment drapes naturally " +
                    "with a balanced, relaxed fit suitable for everyday wear.", 95);
            case "L" -> new FitResult("Perfect",
                    "L offers a slightly relaxed silhouette. Comfortable for layering " +
                    "and everyday casual styling without feeling oversized.", 88);
            case "XL" -> new FitResult("Loose",
                    "XL gives a loose, oversized aesthetic. Perfect for layered looks " +
                    "or if you prefer extra room — may feel roomy on smaller frames.", 75);
            default -> new FitResult("Loose",
                    "XXL is generously cut for maximum comfort. Best for oversized " +
                    "streetwear styling or if you need a relaxed, baggy silhouette.", 68);
        };
    }

    private record DecodedImage(String metadata, byte[] bytes) {
    }

    private record FitResult(String match, String reason, int score) {
    }
}
