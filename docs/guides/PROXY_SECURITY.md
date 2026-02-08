# Proxy Security - Chat API

Dieses Dokument beschreibt die Sicherheitsmaßnahmen für den Chat-Proxy.

## Architektur

Der Chat-Proxy ist ein Cloudflare Pages Function, der als sicherer Wrapper um die OpenRouter API fungiert.

### Security Layers

```
┌─────────────────────────────────────────────────────────────┐
│ Client (Disa AI App)                                   │
└────────────────────┬────────────────────────────────────────┘
                     │ 1. Request mit HMAC-Signatur
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ Cloudflare Pages Function (/api/chat)                     │
│  ├─ 2. Auth: HMAC-Verifikation                         │
│  ├─ 3. Origin/Referer-Check                             │
│  ├─ 4. Rate Limit (Client-IP)                            │
│  ├─ 5. Request Validation (Zod)                           │
│  └─ 6. Abuse Controls                                      │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ OpenRouter API (mit server-seitigem API Key)              │
└─────────────────────────────────────────────────────────────┘
```

---

## 1. Authentifizierung (HMAC-basiert)

### Konzept

- **Shared Secret**: Ein gemeinsames Geheimnis zwischen Client und Server
- **HMAC-Signatur**: Client signiert Request-Body mit Secret
- **Server-Verifikation**: Server verifiziert Signatur vor Bearbeitung

### Implementation

**Client-Request Header:**

```http
POST /api/chat HTTP/1.1
Content-Type: application/json
X-Proxy-Secret: <hmac-sha256-hex>
X-Proxy-Timestamp: <unix-timestamp>
X-Proxy-Client: <client-identifier>
```

**HMAC-Berechnung:**

```typescript
import { createHmac } from 'crypto';

function generateProxySignature(
  body: string,
  secret: string,
  timestamp: number
): string {
  const data = `${body}:${timestamp}`;
  const hmac = createHmac('sha256', secret);
  hmac.update(data);
  return hmac.digest('hex');
}
```

### Timing-Attack-Schutz

- Timestamp muss innerhalb von 5 Minuten sein
- Veraltete Requests werden abgelehnt (401 Unauthorized)

---

## 2. Origin & Referer Validation

### Allowed Origins

```typescript
const ALLOWED_ORIGINS = [
  'https://disaai.de',
  'https://disa-ai.pages.dev',
];
```

### Validation Rules

1. **Origin Header** muss matchen (bei CORS-Anfragen)
2. **Referer Header** muss zu erlaubtem Origin gehören
3. **Strict Matching** - keine Wildcards, keine Subdomain-Allowlist

---

## 3. Rate Limiting

### Implementation

- **Storage**: In-Memory (Pages Functions sind stateless)
- **Key**: Client-IP-Adresse (aus `CF-Connecting-IP` Header)
- **Window**: 60 Sekunden (Sliding Window)
- **Limit**: 60 Requests pro Minute

### Rate Limit Rules

| Resource | Limit | Window | Error |
|----------|-------|--------|--------|
| Chat Requests | 60/min | 60s | 429 Too Many Requests |
| Tokens | 10k/min | 60s | 429 Too Many Requests |
| Concurrent Streams | 3/IP | aktiv | 429 Too Many Requests |

---

## 4. Request Validation (Zod)

### Validated Fields

| Parameter | Typ | Range/Konstraints |
|-----------|-----|-------------------|
| `model` | string | Must be in ALLOWED_MODELS |
| `messages` | array | 1-50 messages |
| `max_tokens` | number | 1-8192 |
| `temperature` | number | 0-2 |
| `top_p` | number | 0-1 |
| `presence_penalty` | number | -2-2 |

### Allowed Models

```typescript
const ALLOWED_MODELS = [
  'meta-llama/llama-3.3-70b-instruct:free',
  'google/gemma-2-9b-it:free',
  'mistralai/mistral-7b-instruct:free',
  // ... weitere free models
];
```

---

## 5. Abuse Controls

### Request Size Limits

| Parameter | Limit | Reason |
|-----------|-------|--------|
| Request Body | 100 KB | Verhindert Überlastung |
| Message Content | 10 KB per message | Verhindert Injection |
| Total Messages | 50 | Verhindert Kontext-Bombing |

### Stream Duration

- **Max Stream Time**: 120 Sekunden
- **Timeout**: 60s Client + 120s Server
- **Abbruch**: Nach 120s wird Stream beendet (Connection Close)

### Concurrency Limits

- **Max Concurrent Streams**: 3 pro Client-IP
- **Queue**: Bei 3+ Streams wird Request abgelehnt (429)

---

## 6. Cloudflare Environment Variables

### Secrets (Production)

In Cloudflare Dashboard > Pages > Settings > Environment Variables:

| Variable | Wert | Beschreibung |
|----------|------|--------------|
| `OPENROUTER_API_KEY` | `sk-or-v1-xxx` | OpenRouter API Key |
| `PROXY_SHARED_SECRET` | `32-char-random-string` | HMAC-Secret für Client-Auth |

### Preview/Staging

Separate Variablen für Preview-Umgebung mit eigenen Limits.

---

## 7. Client-Integration

### Auth-Token Generierung

```typescript
import { createHmac } from 'crypto';

const PROXY_SHARED_SECRET = 'aus-env-laden'; // In Production nicht hardcoded!

export async function chatStreamViaProxy(
  messages: ChatMessage[],
  onDelta: (text: string, data?: any) => void,
  opts?: { model?: string; params?: any; signal?: AbortSignal; }
) {
  const timestamp = Math.floor(Date.now() / 1000);
  const body = JSON.stringify({
    messages,
    model: opts?.model || DEFAULT_MODEL,
    stream: true,
    ...opts?.params,
  });

  const signature = createHmac('sha256', PROXY_SHARED_SECRET)
    .update(`${body}:${timestamp}`)
    .digest('hex');

  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Proxy-Secret': signature,
      'X-Proxy-Timestamp': timestamp.toString(),
      'X-Proxy-Client': 'disa-ai-app',
    },
    body,
    signal: opts?.signal,
  });

  // ... rest der Implementation
}
```

### Fallback zu Direct API

Wenn Proxy fehlschlägt (401/429), Client kann Option bieten:
- Retry nach Timeout
- Fallback zu Direct API (mit user-seitigem Key)

---

## 8. Error Handling

### HTTP Status Codes

| Code | Nachricht | Lösung |
|------|-----------|--------|
| 400 | Bad Request | Ungültige Parameter |
| 401 | Unauthorized | Ungültige Signatur (Secret stimmt nicht) |
| 403 | Forbidden | Origin/Referer nicht erlaubt |
| 429 | Too Many Requests | Rate Limit erreicht |
| 500 | Internal Server Error | Server-Fehler (Retry nach Backoff) |
| 503 | Service Unavailable | OpenRouter nicht erreichbar |

### Retry-Strategie

```typescript
async function chatWithRetry(messages: ChatMessage[]) {
  let retryCount = 0;
  const maxRetries = 3;

  while (retryCount < maxRetries) {
    try {
      return await chatStreamViaProxy(messages, onDelta);
    } catch (error) {
      const isRetryable = error instanceof RateLimitError;
      if (!isRetryable || retryCount === maxRetries) {
        throw error;
      }

      const backoff = Math.pow(2, retryCount) * 1000;
      await sleep(backoff);
      retryCount++;
    }
  }
}
```

---

## 9. Monitoring & Alerts

### Zu überwachende Metriken

- **Request Rate** pro Minute/Stunde
- **Failed Auth** Versuche (Anzahl pro IP)
- **Rate Limit Hits** pro Client
- **OpenRouter API Errors** (4xx/5xx)
- **Average Stream Duration**

### Alerts

- Rate Limit > 50% des Limits für 5 Minuten
- >100 Failed Auth Versuche pro Stunde
- OpenRouter API Error Rate > 10%

---

## 10. Deployment

### Setup-Schritte

1. **Cloudflare Secrets setzen:**
   ```bash
   wrangler secret put OPENROUTER_API_KEY
   wrangler secret put PROXY_SHARED_SECRET
   ```

2. **Client-Environment aktualisieren:**
   ```bash
   # In .env.local
   VITE_PROXY_SHARED_SECRET=dein-secret-hier
   ```

3. **Deploy:**
   ```bash
   npm run build
   wrangler pages deploy dist
   ```

### Verification

```bash
# Test Request ohne Auth (sollte 401 zurückgeben)
curl -X POST https://disaai.de/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"test"}],"model":"test"}'

# Test Request mit falschem Auth (sollte 401 zurückgeben)
curl -X POST https://disaai.de/api/chat \
  -H "Content-Type: application/json" \
  -H "X-Proxy-Secret: invalid" \
  -H "X-Proxy-Timestamp: 1234567890" \
  -d '{"messages":[{"role":"user","content":"test"}],"model":"test"}'

# Test Request mit korrektem Auth (sollte durchgelassen werden)
curl -X POST https://disaai.de/api/chat \
  -H "Content-Type: application/json" \
  -H "X-Proxy-Secret: <correct-signature>" \
  -H "X-Proxy-Timestamp: <current-timestamp>" \
  -d '{"messages":[{"role":"user","content":"test"}],"model":"meta-llama/llama-3.3-70b-instruct:free"}'
```

---

## 11. Known Limitations

1. **In-Memory Rate Limiting**: Bei Server-Reset werden Limits zurückgesetzt
2. **Keine Persistente Logging**: Anfragen werden nicht dauerhaft gespeichert
3. **Client-Side Secret**: HMAC-Secret muss im Frontend verfügbar sein
4. **Keine User-Isolation**: Alle Clients teilen sich Rate Limit pro IP

---

## 12. Migration Guide

### Von ungesichertem Proxy

**Alt:** Direkter Aufruf ohne Auth
```typescript
await chatStreamViaProxy(messages, onDelta);
```

**Neu:** Mit HMAC-Auth
```typescript
await chatStreamViaProxy(messages, onDelta, {
  model: 'meta-llama/llama-3.3-70b-instruct:free',
});
```

**Keine Breaking Changes:** Signature ist optional für Backwards-Kompatibilität (mit Warnung)

---

## 13. Troubleshooting

### "Unauthorized" (401)

- Prüfe `PROXY_SHARED_SECRET` in Cloudflare Dashboard
- Prüfe Timestamp ist nicht älter als 5 Minuten
- Verifiziere HMAC-Signatur-Berechnung

### "Rate Limit Exceeded" (429)

- Warte 60 Sekunden vor erneutem Versuch
- Prüfe Rate Limit Konfiguration
- Überwache Metrics für Anomalien

### "Forbidden" (403)

- Prüfe Origin/Referer Header
- Verifiziere CORS-Konfiguration
- Prüfe ob Client auf erlaubter Domain läuft

---

**Letzte Aktualisierung:** 2025-02-08
**Autor:** Security Team
