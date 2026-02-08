# Proxy Security - Manual Testing Guide

This guide provides manual testing steps for verifying the Cloudflare Functions Chat-Proxy security measures.

## Prerequisites

1. Deploy the secured chat function to Cloudflare Pages
2. Set up required secrets (`OPENROUTER_API_KEY`, `PROXY_SHARED_SECRET`)
3. Have curl or a REST client ready

---

## Test Scenarios

### 1. Authentication Tests

#### 1.1 Request without Authentication Headers

```bash
curl -X POST https://disaai.de/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "test"}],
    "model": "meta-llama/llama-3.3-70b-instruct:free"
  }'
```

**Expected Result:** `401 Unauthorized`

```json
{
  "error": "Missing authentication headers (X-Proxy-Secret, X-Proxy-Timestamp)"
}
```

---

#### 1.2 Request with Invalid HMAC Signature

```bash
curl -X POST https://disaai.de/api/chat \
  -H "Content-Type: application/json" \
  -H "X-Proxy-Secret: invalid-hmac-signature" \
  -H "X-Proxy-Timestamp: 1234567890" \
  -H "X-Proxy-Client: disa-ai-app" \
  -d '{
    "messages": [{"role": "user", "content": "test"}],
    "model": "meta-llama/llama-3.3-70b-instruct:free"
  }'
```

**Expected Result:** `401 Unauthorized`

```json
{
  "error": "Invalid authentication signature"
}
```

---

#### 1.3 Request with Expired Timestamp (> 5 minutes)

```bash
# Get old timestamp (10 minutes ago)
OLD_TIMESTAMP=$(($(date +%s) - 600))

curl -X POST https://disaai.de/api/chat \
  -H "Content-Type: application/json" \
  -H "X-Proxy-Secret: <correct-signature>" \
  -H "X-Proxy-Timestamp: ${OLD_TIMESTAMP}" \
  -H "X-Proxy-Client: disa-ai-app" \
  -d '{
    "messages": [{"role": "user", "content": "test"}],
    "model": "meta-llama/llama-3.3-70b-instruct:free"
  }'
```

**Expected Result:** `401 Unauthorized` (timestamp validation)

---

#### 1.4 Request with Valid Authentication

```bash
# Generate correct HMAC (this would be done by the client)
BODY='{"messages":[{"role":"user","content":"test"}],"model":"meta-llama/llama-3.3-70b-instruct:free","stream":false}'
TIMESTAMP=$(date +%s)
SIGNATURE=$(echo -n "${BODY}:${TIMESTAMP}" | openssl dgst -sha256 -hmac "your-shared-secret" | awk '{print $2}')

curl -X POST https://disaai.de/api/chat \
  -H "Content-Type: application/json" \
  -H "X-Proxy-Secret: ${SIGNATURE}" \
  -H "X-Proxy-Timestamp: ${TIMESTAMP}" \
  -H "X-Proxy-Client: disa-ai-app" \
  -d "${BODY}"
```

**Expected Result:** `200 OK` (request processed successfully)

---

### 2. Origin & Referer Validation

#### 2.1 Request from Invalid Origin

```bash
curl -X POST https://disaai.de/api/chat \
  -H "Content-Type: application/json" \
  -H "Origin: https://evil.com" \
  -H "X-Proxy-Secret: <correct-signature>" \
  -H "X-Proxy-Timestamp: $(date +%s)" \
  -d '{
    "messages": [{"role": "user", "content": "test"}],
    "model": "meta-llama/llama-3.3-70b-instruct:free"
  }'
```

**Expected Result:** `403 Forbidden`

```json
{
  "error": "Forbidden origin"
}
```

---

#### 2.2 Request with Mismatched Referer

```bash
curl -X POST https://disaai.de/api/chat \
  -H "Content-Type: application/json" \
  -H "Origin: https://disaai.de" \
  -H "Referer: https://evil.com/referer" \
  -H "X-Proxy-Secret: <correct-signature>" \
  -H "X-Proxy-Timestamp: $(date +%s)" \
  -d '{
    "messages": [{"role": "user", "content": "test"}],
    "model": "meta-llama/llama-3.3-70b-instruct:free"
  }'
```

**Expected Result:** `403 Forbidden`

```json
{
  "error": "Invalid referer"
}
```

---

### 3. Rate Limiting Tests

#### 3.1 Exceed Rate Limit (60 requests/minute)

```bash
# Send 61 requests rapidly
for i in {1..61}; do
  curl -X POST https://disaai.de/api/chat \
    -H "Content-Type: application/json" \
    -H "X-Proxy-Secret: <correct-signature>" \
    -H "X-Proxy-Timestamp: $(date +%s)" \
    -d '{
      "messages": [{"role":"user","content":"'$i'"}],
      "model": "meta-llama/llama-3.3-70b-instruct:free"
    }'
  echo "Request $i"
done
```

**Expected Result:**

- First 60 requests: `200 OK`
- 61st request: `429 Too Many Requests`

```json
{
  "error": "Rate limit exceeded",
  "retryAfter": 60,
  "remaining": 0
}
```

---

#### 3.2 Respect Retry-After Header

```bash
# After hitting rate limit, check headers
curl -I -X POST https://disaai.de/api/chat \
  -H "Content-Type: application/json" \
  -H "X-Proxy-Secret: <correct-signature>" \
  -H "X-Proxy-Timestamp: $(date +%s)"
```

**Expected Headers:**

```
HTTP/1.1 429 Too Many Requests
Retry-After: 60
```

---

### 4. Request Validation Tests

#### 4.1 Invalid Model

```bash
curl -X POST https://disaai.de/api/chat \
  -H "Content-Type: application/json" \
  -H "X-Proxy-Secret: <correct-signature>" \
  -H "X-Proxy-Timestamp: $(date +%s)" \
  -d '{
    "messages": [{"role": "user", "content": "test"}],
    "model": "gpt-4-turbo-preview"
  }'
```

**Expected Result:** `400 Bad Request`

```json
{
  "error": "Invalid request: model: Model not allowed"
}
```

---

#### 4.2 Empty Messages Array

```bash
curl -X POST https://disaai.de/api/chat \
  -H "Content-Type: application/json" \
  -H "X-Proxy-Secret: <correct-signature>" \
  -H "X-Proxy-Timestamp: $(date +%s)" \
  -d '{
    "messages": [],
    "model": "meta-llama/llama-3.3-70b-instruct:free"
  }'
```

**Expected Result:** `400 Bad Request`

```json
{
  "error": "Invalid request: 'messages' array is required and must not be empty"
}
```

---

#### 4.3 Messages Exceeding Limit (> 50)

```bash
curl -X POST https://disaai.de/api/chat \
  -H "Content-Type: application/json" \
  -H "X-Proxy-Secret: <correct-signature>" \
  -H "X-Proxy-Timestamp: $(date +%s)" \
  -d '{
    "messages": [
      {"role":"user","content":"test"},
      {"role":"user","content":"test"},
      {"role":"user","content":"test"},
      {"role":"user","content":"test"},
      {"role":"user","content":"test"},
      {"role":"user","content":"test"},
      {"role":"user","content":"test"},
      {"role":"user","content":"test"},
      {"role":"user","content":"test"},
      {"role":"user","content":"test"},
      {"role":"user","content":"test"},
      {"role":"user","content":"test"},
      {"role":"user","content":"test"},
      {"role":"user","content":"test"},
      {"role":"user","content":"test"},
      {"role":"user","content":"test"},
      {"role":"user","content":"test"},
      {"role":"user","content":"test"},
      {"role":"user","content":"test"},
      {"role":"user","content":"test"},
      {"role":"user","content":"test"},
      {"role":"user","content":"test"},
      {"role":"user","content":"test"},
      {"role":"user","content":"test"},
      {"role":"user","content":"test"},
      {"role":"user","content":"test"},
      {"role":"user","content":"test"},
      {"role":"user","content":"test"},
      {"role":"user","content":"test"},
      {"role":"user","content":"test"},
      {"role":"user","content":"test"},
      {"role":"user","content":"test"},
      {"role":"user","content":"test"},
      {"role":"user","content":"test"},
      {"role":"user","content":"test"},
      {"role":"user","content":"test"},
      {"role":"user","content":"test"},
      {"role":"user","content":"test"},
      {"role":"user","content":"test"},
      {"role":"user","content":"test"},
      {"role":"user","content":"test"},
      {"role":"user","content":"test"},
      {"role":"user","content":"test"},
      {"role":"user","content":"test"},
      {"role":"user","content":"test"},
      {"role":"user","content":"test"},
      {"role":"user","content":"test"},
      {"role":"user","content":"test"},
      {"role":"user","content":"test"},
      {"role":"user","content":"test"},
      {"role":"user","content":"test"},
      {"role":"user","content":"test"},
      {"role":"user","content":"test"},
      {"role":"user","content":"test"}
    ],
    "model": "meta-llama/llama-3.3-70b-instruct:free"
  }'
```

**Expected Result:** `400 Bad Request`

```json
{
  "error": "Invalid request: messages: Array must contain at most 50 element(s)"
}
```

---

#### 4.4 Temperature Out of Range

```bash
curl -X POST https://disaai.de/api/chat \
  -H "Content-Type: application/json" \
  -H "X-Proxy-Secret: <correct-signature>" \
  -H "X-Proxy-Timestamp: $(date +%s)" \
  -d '{
    "messages": [{"role": "user", "content": "test"}],
    "model": "meta-llama/llama-3.3-70b-instruct:free",
    "temperature": 3
  }'
```

**Expected Result:** `400 Bad Request`

```json
{
  "error": "Invalid request: temperature: Number must be less than or equal to 2"
}
```

---

#### 4.5 Message Content Too Large (> 10 KB)

```bash
curl -X POST https://disaai.de/api/chat \
  -H "Content-Type: application/json" \
  -H "X-Proxy-Secret: <correct-signature>" \
  -H "X-Proxy-Timestamp: $(date +%s)" \
  -d "{
    \"messages\": [{\"role\": \"user\", \"content\": \"$(python3 -c 'print(\"x\" * 10001)')\"\"}],
    \"model\": \"meta-llama/llama-3.3-70b-instruct:free\"
  }"
```

**Expected Result:** `400 Bad Request` or `413 Payload Too Large`

```json
{
  "error": "Request size exceeds limit"
}
```

---

### 5. Abuse Control Tests

#### 5.1 Concurrent Stream Limit Exceeded

```bash
# Start 4 concurrent streaming requests
curl -X POST https://disaai.de/api/chat \
  -H "Content-Type: application/json" \
  -H "X-Proxy-Secret: <correct-signature>" \
  -H "X-Proxy-Timestamp: $(date +%s)" \
  -d '{"messages":[{"role":"user","content":"test"}],"model":"meta-llama/llama-3.3-70b-instruct:free","stream":true}' &

curl -X POST https://disaai.de/api/chat \
  -H "Content-Type: application/json" \
  -H "X-Proxy-Secret: <correct-signature>" \
  -H "X-Proxy-Timestamp: $(date +%s)" \
  -d '{"messages":[{"role":"user","content":"test"}],"model":"meta-llama/llama-3.3-70b-instruct:free","stream":true}' &

curl -X POST https://disaai.de/api/chat \
  -H "Content-Type: application/json" \
  -H "X-Proxy-Secret: <correct-signature>" \
  -H "X-Proxy-Timestamp: $(date +%s)" \
  -d '{"messages":[{"role":"user","content":"test"}],"model":"meta-llama/llama-3.3-70b-instruct:free","stream":true}' &

curl -X POST https://disaai.de/api/chat \
  -H "Content-Type: application/json" \
  -H "X-Proxy-Secret: <correct-signature>" \
  -H "X-Proxy-Timestamp: $(date +%s)" \
  -d '{"messages":[{"role":"user","content":"test"}],"model":"meta-llama/llama-3.3-70b-instruct:free","stream":true}'
```

**Expected Result:**

- First 3 requests: `200 OK` (started streaming)
- 4th request: `429 Too Many Requests`

```json
{
  "error": "Too many concurrent requests. Please wait for current requests to complete."
}
```

---

#### 5.2 Request Body Size Exceeded (> 100 KB)

```bash
# Create a request body > 100 KB
python3 -c "
import json
data = {
    'messages': [{'role': 'user', 'content': 'x' * 50000}],
    'model': 'meta-llama/llama-3.3-70b-instruct:free'
}
print(json.dumps(data))
" > large_body.json

curl -X POST https://disaai.de/api/chat \
  -H "Content-Type: application/json" \
  -H "X-Proxy-Secret: <correct-signature>" \
  -H "X-Proxy-Timestamp: $(date +%s)" \
  -d @large_body.json
```

**Expected Result:** `400 Bad Request` or `413 Payload Too Large`

---

## HTTP Status Code Summary

| Code  | Message               | Scenario                                 |
| ----- | --------------------- | ---------------------------------------- |
| `400` | Bad Request           | Invalid parameters, validation errors    |
| `401` | Unauthorized          | Missing or invalid HMAC signature        |
| `403` | Forbidden             | Invalid origin or referer                |
| `405` | Method Not Allowed    | Non-POST request                         |
| `413` | Payload Too Large     | Request body exceeds limit               |
| `429` | Too Many Requests     | Rate limit or concurrency limit exceeded |
| `500` | Internal Server Error | Server error, OpenRouter API error       |
| `503` | Service Unavailable   | OpenRouter not reachable                 |

---

## Client-Side Testing

### Testing with Browser DevTools

1. Open Chrome DevTools (F12)
2. Go to Network tab
3. Send a chat request in the app
4. Inspect request headers:
   - `X-Proxy-Secret` should be present
   - `X-Proxy-Timestamp` should be present (Unix timestamp)
   - `X-Proxy-Client` should be `"disa-ai-app"`
5. Inspect response:
   - Success: `200 OK` with streaming data
   - Error: Appropriate error message for user

### Testing Network Errors

**Simulate Network Failure:**

1. Open DevTools → Network tab
2. Enable "Offline" mode
3. Try sending a chat message
4. **Expected:** User-friendly error message, retry prompt

**Simulate Slow Connection:**

1. DevTools → Network tab → Throttling
2. Set to "Slow 3G"
3. Send a chat message
4. **Expected:** App shows loading state, handles timeout after 70s

---

## Security Checklist

- [x] HMAC authentication required
- [x] Timestamp validation (5 minute window)
- [x] Origin allowlist enforced
- [x] Referer validation enabled
- [x] Rate limiting (60 req/min)
- [x] Concurrent stream limit (3/IP)
- [x] Request validation (Zod)
- [x] Model allowlist enforced
- [x] Message size limits enforced
- [x] Stream timeout (120s)
- [x] Request body size limit (100 KB)
- [x] CORS headers properly configured

---

**Last Updated:** 2025-02-08
