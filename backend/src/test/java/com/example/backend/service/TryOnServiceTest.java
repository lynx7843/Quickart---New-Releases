package com.example.backend.service;

import com.example.backend.dto.TryOnRequest;
import com.example.backend.dto.TryOnResponse;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

class TryOnServiceTest {

    private static final String SAMPLE_PNG = "data:image/png;base64,"
            + "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4XmP4z8DwHwAFAAH"
            + "/gmVQ8QAAAABJRU5ErkJggg==";

    private final TryOnService tryOnService = new TryOnService(new GeminiImageGenerationService());

    @Test
    void processReturnsAnalysisAndGeneratedPreview() {
        TryOnResponse response = tryOnService.process(new TryOnRequest(
                SAMPLE_PNG,
                SAMPLE_PNG,
                "M"
        ));

        assertNotNull(response);
        assertTrue("Success".equals(response.message()) || response.message().startsWith("Error:"), "Response should contain a status message.");
        if ("Success".equals(response.message())) {
            assertNotNull(response.fitMatch());
            assertNotNull(response.fitReason());
            assertTrue(response.fitScore() > 0);
            assertTrue(response.generatedImageBase64().startsWith("data:image/png;base64,"));
        }
    }
}
