#!/usr/bin/env node
/**
 * Vision API Integration Test
 *
 * Tests the /api/vision endpoint with a minimal test image.
 * Usage: node test-vision-api.js [http://localhost:8788]
 */

const BASE_URL = process.argv[2] || "http://localhost:8788";
const VISION_ENDPOINT = `${BASE_URL}/api/vision`;

// Minimal 1x1 red pixel PNG as base64
const TEST_IMAGE_DATA_URL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==";

async function testVisionAPI() {
  console.log("\n🧪 Vision API Integration Test");
  console.log("================================\n");
  console.log(`📍 Endpoint: ${VISION_ENDPOINT}\n`);

  const payload = {
    prompt: "Was siehst du auf diesem Bild?",
    imageDataUrl: TEST_IMAGE_DATA_URL,
    mimeType: "image/png",
    filename: "test.png",
  };

  try {
    console.log("📤 Sending request...");
    const startTime = Date.now();

    const response = await fetch(VISION_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "http://localhost:5173",
      },
      body: JSON.stringify(payload),
    });

    const latency = Date.now() - startTime;

    console.log(`\n📊 Response Status: ${response.status} ${response.statusText}`);
    console.log(`⏱️  Latency: ${latency}ms`);
    console.log(`\n📥 Response Headers:`);
    console.log(`   Content-Type: ${response.headers.get("content-type")}`);
    console.log(`   CORS: ${response.headers.get("access-control-allow-origin")}`);

    const data = await response.json();

    if (!response.ok) {
      console.log("\n❌ Request failed:");
      console.log(JSON.stringify(data, null, 2));

      // Diagnose common errors
      if (response.status === 500 && data.error?.code === "MISSING_API_KEY") {
        console.log(
          "\n💡 Fix: Set ZAI_API_KEY in .dev.vars (local) or Cloudflare Dashboard (prod)",
        );
      } else if (response.status === 401 || response.status === 403) {
        console.log("\n💡 Fix: Check ZAI_API_KEY is valid (format: {uuid}.{secret})");
      } else if (response.status === 404) {
        console.log("\n💡 Fix: Check endpoint URL and ensure wrangler dev is running");
      }

      process.exit(1);
    }

    console.log("\n✅ Success!");
    console.log("\n📝 Response Data:");
    console.log(`   Text: ${data.text?.substring(0, 100)}${data.text?.length > 100 ? "..." : ""}`);
    console.log(`   Model: ${data.model}`);
    console.log(`   Tokens: ${data.usage?.total_tokens || "N/A"}`);

    if (data.usage) {
      console.log(`\n📊 Token Usage:`);
      console.log(`   Prompt: ${data.usage.prompt_tokens || "N/A"}`);
      console.log(`   Completion: ${data.usage.completion_tokens || "N/A"}`);
      console.log(`   Total: ${data.usage.total_tokens || "N/A"}`);
    }

    console.log("\n✅ Vision API is working correctly!\n");
    process.exit(0);
  } catch (error) {
    console.log("\n❌ Test failed:");

    if (error.code === "ECONNREFUSED") {
      console.log("   Connection refused");
      console.log("\n💡 Fix: Start wrangler dev first:");
      console.log("   npm run build");
      console.log("   npm run dev:functions");
    } else if (error.name === "AbortError" || error.message.includes("timeout")) {
      console.log("   Request timeout");
      console.log("\n💡 Fix: Check Z.AI API status or increase timeout");
    } else {
      console.log(`   ${error.message}`);
    }

    console.log("\n");
    process.exit(1);
  }
}

// Run test
testVisionAPI();
