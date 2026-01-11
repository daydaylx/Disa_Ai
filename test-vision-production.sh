#!/bin/bash
# Test /api/vision endpoint in PRODUCTION
# Usage: ./test-vision-production.sh

DOMAIN="${1:-https://disaai.de}"

echo "🚀 Testing /api/vision endpoint (Production: $DOMAIN)..."
echo ""

# Minimal 1x1px transparent PNG as base64
SMALL_IMAGE="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="

curl -X POST "$DOMAIN/api/vision" \
  -H "Content-Type: application/json" \
  -H "Origin: $DOMAIN" \
  -d "{
    \"prompt\": \"Beschreibe dieses Bild.\",
    \"imageDataUrl\": \"$SMALL_IMAGE\",
    \"mimeType\": \"image/png\"
  }" | jq '.'

echo ""
echo "✅ SUCCESS if response contains 'text' field"
echo "❌ FAIL if response contains 'MISSING_API_KEY' error"
