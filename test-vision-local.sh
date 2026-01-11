#!/bin/bash
# Test /api/vision endpoint locally
# Usage: ./test-vision-local.sh

echo "🧪 Testing /api/vision endpoint (localhost)..."
echo ""

# Minimal 1x1px transparent PNG as base64
SMALL_IMAGE="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="

curl -X POST http://localhost:8788/api/vision \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:5173" \
  -d "{
    \"prompt\": \"Was siehst du auf diesem Bild?\",
    \"imageDataUrl\": \"$SMALL_IMAGE\",
    \"mimeType\": \"image/png\"
  }" | jq '.'

echo ""
echo "✅ Check: Response should contain 'text' field with analysis"
