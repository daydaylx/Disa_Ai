# Cloudflare Functions Setup Guide

Dieser Guide erklärt, wie du die Cloudflare Functions für Disa AI konfigurierst.

## 🏗️ Architektur

```
┌──────────────────────────────────────────────────────────┐
│                    Browser (SPA)                         │
│                                                           │
│  src/api/proxyClient.ts                                 │
│  ↓ fetch("/api/chat")                                   │
└──────────────────────────────────────────────────────────┘
                          ↓
┌──────────────────────────────────────────────────────────┐
│              Cloudflare Pages Function                   │
│                                                           │
│  functions/api/chat.ts                                  │
│  ↓ uses env.OPENROUTER_API_KEY                         │
│  ↓ fetch(openrouter.ai)                                │
└──────────────────────────────────────────────────────────┘
                          ↓
┌──────────────────────────────────────────────────────────┐
│                  OpenRouter API                          │
└──────────────────────────────────────────────────────────┘
```

## 🚀 Deployment (Production)

### 1. Secret bei Cloudflare konfigurieren

**Option A: Über Cloudflare Dashboard (empfohlen)**

1. Gehe zu [dash.cloudflare.com](https://dash.cloudflare.com)
2. Wähle dein Pages-Projekt: **disa-ai**
3. Navigiere zu: **Settings → Environment Variables**
4. Klicke auf **Add variable** (Production Environment)
5. Füge hinzu:
   - **Name:** `OPENROUTER_API_KEY`
   - **Value:** `sk-or-v1-...` (dein OpenRouter API Key)
6. Klicke auf **Save**

**Option B: Via Wrangler CLI**

```bash
npx wrangler pages secret put OPENROUTER_API_KEY
# Eingabe: sk-or-v1-...
```

### 2. Deployment triggern

```bash
git add functions/
git commit -m "fix(cloudflare): restore Functions for /api/chat endpoint"
git push origin main
```

Cloudflare deployt automatisch bei jedem Push auf `main`.

### 3. Deployment verifizieren

**Warte 1-2 Minuten**, dann teste:

```bash
curl -X POST https://disa-ai.pages.dev/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Hi"}],
    "model": "meta-llama/llama-3.3-70b-instruct:free",
    "stream": false
  }'
```

**Erwartete Antwort:**
```json
{
  "id": "gen-...",
  "choices": [{
    "message": {
      "role": "assistant",
      "content": "Hello! How can I help you today?"
    }
  }]
}
```

**Falls 500 Error:**
- Prüfe, ob `OPENROUTER_API_KEY` korrekt gesetzt ist
- Schaue in die Logs: **Cloudflare Dashboard → Workers & Pages → disa-ai → Logs**

---

## 🧪 Lokale Entwicklung (Optional)

Falls du Cloudflare Functions lokal testen möchtest:

### 1. Wrangler installieren

```bash
npm install -g wrangler
```

### 2. Secrets konfigurieren

```bash
# Kopiere Beispiel-Datei
cp .dev.vars.example .dev.vars

# Füge deinen API-Key ein
echo "OPENROUTER_API_KEY=sk-or-v1-..." > .dev.vars
```

### 3. Lokalen Dev-Server starten

```bash
# Terminal 1: Vite Dev Server (Frontend)
npm run dev

# Terminal 2: Wrangler Dev Server (Functions)
npx wrangler pages dev dist --port 8788 --live-reload
```

Die App läuft dann auf:
- **Frontend:** http://localhost:5173
- **Functions:** http://localhost:8788/api/chat

**Hinweis:** Du musst in `src/api/proxyClient.ts` temporär die URL ändern, wenn du lokal mit Wrangler testen möchtest:

```typescript
// Für lokales Testen mit Wrangler:
const response = await fetch("http://localhost:8788/api/chat", {
  // ...
});

// Für Production (Standard):
const response = await fetch("/api/chat", {
  // ...
});
```

---

## 🐛 Debugging

### Logs anschauen

**Live-Logs (Production):**
```bash
npx wrangler pages deployment tail
```

**Oder via Dashboard:**
1. [dash.cloudflare.com](https://dash.cloudflare.com)
2. **Workers & Pages → disa-ai → Logs**

### Häufige Probleme

#### Problem: "Server configuration error: API key not configured"

**Ursache:** `OPENROUTER_API_KEY` Secret nicht gesetzt.

**Lösung:**
1. Gehe zu **Cloudflare Dashboard → disa-ai → Settings → Environment Variables**
2. Prüfe, ob `OPENROUTER_API_KEY` im **Production** Environment existiert
3. Falls nicht: Füge es hinzu (siehe oben)
4. Trigger Redeploy: `git commit --allow-empty -m "trigger redeploy" && git push`

#### Problem: "OpenRouter API error: 401"

**Ursache:** Ungültiger API Key.

**Lösung:**
1. Prüfe deinen API Key auf [openrouter.ai/keys](https://openrouter.ai/keys)
2. Aktualisiere Secret bei Cloudflare (siehe oben)

#### Problem: CORS-Fehler im Browser

**Ursache:** Falsche Origin in `ALLOWED_ORIGINS`.

**Lösung:**
1. Öffne `functions/api/chat.ts`
2. Füge deine Domain zu `ALLOWED_ORIGINS` hinzu:
   ```typescript
   const ALLOWED_ORIGINS = [
     "https://disaai.de",
     "https://disa-ai.pages.dev",
     "https://deine-custom-domain.com",  // Füge hier hinzu
     "http://localhost:5173",
   ];
   ```

---

## 📝 Wichtige Hinweise

1. **Niemals** API-Keys in den Code committen!
2. `.dev.vars` ist in `.gitignore` und wird **nicht** committed
3. Production Secrets werden nur über Cloudflare Dashboard/CLI gesetzt
4. Functions werden automatisch deployed bei jedem `git push`

---

## 🔗 Weiterführende Links

- [Cloudflare Pages Functions Docs](https://developers.cloudflare.com/pages/functions/)
- [OpenRouter API Docs](https://openrouter.ai/docs)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)
