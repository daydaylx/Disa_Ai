# Cloudflare Pages Setup für Disa AI

## Schnellstart: OpenRouter API Key Setup

### Problem
Die App zeigt Fehler wie "Missing server configuration" oder "Hohe Auslastung" beim Chatten, obwohl vorher alles funktioniert hat.

### Lösung
Der `OPENROUTER_API_KEY` muss als **Secret** im Cloudflare Pages Dashboard gesetzt werden.

## Schritt-für-Schritt-Anleitung

### 1. OpenRouter API Key besorgen

1. Gehe zu [OpenRouter.ai](https://openrouter.ai/)
2. Logge dich ein oder erstelle einen Account
3. Navigiere zu "API Keys" im Dashboard
4. Erstelle einen neuen API Key oder kopiere einen bestehenden
5. Sichere den Key (er wird nur einmal angezeigt!)

### 2. Secret im Cloudflare Pages Dashboard setzen

#### Option A: Über Cloudflare Dashboard (Empfohlen)

1. Gehe zu [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Wähle "Workers & Pages" aus der linken Navigation
3. Klicke auf dein Projekt: **disaai**
4. Gehe zu "Settings" → "Environment variables"
5. Klicke auf "Add variable"

**Für Production:**
- Variable name: `OPENROUTER_API_KEY`
- Value: [Dein OpenRouter API Key]
- Type: **Encrypted** (wichtig!)
- Environment: **Production**

**Für Preview (optional, aber empfohlen):**
- Wiederhole den Vorgang
- Variable name: `OPENROUTER_API_KEY`
- Value: [Dein OpenRouter API Key oder Test-Key]
- Type: **Encrypted**
- Environment: **Preview**

6. Klicke auf "Save"

#### Option B: Über Wrangler CLI

```bash
# Production Secret setzen
echo "your-openrouter-api-key-here" | wrangler pages secret put OPENROUTER_API_KEY --project-name=disaai

# Preview Secret setzen (optional)
echo "your-openrouter-api-key-here" | wrangler pages secret put OPENROUTER_API_KEY --project-name=disaai --env=preview
```

### 3. Deployment neu triggern

Nach dem Setzen des Secrets:

**Option A: Neues Deployment durch Git Push**
```bash
git commit --allow-empty -m "Trigger rebuild after secret setup"
git push origin main
```

**Option B: Retry Deployment im Dashboard**
1. Gehe zu "Deployments" Tab
2. Klicke auf das letzte Deployment
3. Klicke auf "Retry deployment"

**Option C: Cloudflare Cache löschen (Falls A & B nicht helfen)**
1. Gehe zu "Settings" → "Functions"
2. Klicke auf "Purge deployment cache"

### 4. Testen

1. Öffne [https://disaai.de](https://disaai.de)
2. Öffne die Browser Console (F12)
3. Versuche einen Chat zu starten
4. Bei Erfolg: Keine Fehlermeldungen mehr
5. Bei Fehler: Siehe Troubleshooting unten

## Architektur-Übersicht

### Wie funktioniert der API Key Flow?

```
┌─────────────────────────────────────────────────────────────┐
│ User interagiert mit Disa AI Frontend                       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │ Hat User eigenen      │
         │ API Key gesetzt?      │
         └───────┬───────────────┘
                 │
        ┌────────┴────────┐
        │                 │
       JA                NEIN
        │                 │
        ▼                 ▼
┌───────────────┐  ┌────────────────────┐
│ Direct Call   │  │ Proxy Mode         │
│ zu OpenRouter │  │ /api/chat          │
│               │  │                    │
│ Nutzt User    │  │ Nutzt Server       │
│ API Key       │  │ OPENROUTER_API_KEY │
└───────────────┘  └──────┬─────────────┘
                          │
                          ▼
                   ┌──────────────────┐
                   │ Cloudflare       │
                   │ Function         │
                   │ functions/api/   │
                   │ chat.ts          │
                   │                  │
                   │ Benötigt:        │
                   │ env.OPENROUTER_  │
                   │ API_KEY          │
                   └──────┬───────────┘
                          │
                          ▼
                   ┌──────────────────┐
                   │ OpenRouter API   │
                   └──────────────────┘
```

### Wichtig zu verstehen:

1. **Standard-Nutzer** haben KEINEN eigenen API Key → nutzen automatisch Proxy Mode
2. **Proxy Mode** benötigt `OPENROUTER_API_KEY` als Cloudflare Secret
3. **Power-Nutzer** können eigenen API Key in den App-Settings setzen → Direct Mode

## Troubleshooting

### "Missing server configuration" Fehler

**Symptom:** Fehlermeldung "Missing server configuration" beim Chat

**Diagnose:**
```typescript
// In functions/api/chat.ts:241
if (!env.OPENROUTER_API_KEY) {
  return new Response(JSON.stringify({ error: "Missing server configuration." }), {
    status: 500,
  });
}
```

**Lösung:**
- OPENROUTER_API_KEY Secret ist nicht gesetzt
- Folge Schritt 2 dieser Anleitung

### "Hohe Auslastung. Bitte kurz neu versuchen."

**Mögliche Ursachen:**
1. **Rate Limiting** (legitim) - Warte 2-3 Sekunden
2. **API Key fehlt** - Siehe oben
3. **Falscher API Key** - Prüfe den Key auf OpenRouter.ai

**Diagnose:**
```bash
# Check Cloudflare Logs
wrangler pages deployment tail --project-name=disaai
```

### Secrets werden nicht erkannt

**Checklist:**
- [ ] Secret heißt EXAKT `OPENROUTER_API_KEY` (case-sensitive!)
- [ ] Secret ist als "Encrypted" markiert
- [ ] Secret ist für die richtige Environment gesetzt (Production/Preview)
- [ ] Nach Secret-Setup wurde neu deployed
- [ ] Cloudflare Cache wurde geleert

**Debug-Test:**
```bash
# Prüfe ob Secret gesetzt ist (zeigt nur ob vorhanden, nicht den Wert)
wrangler pages secret list --project-name=disaai
```

### Browser zeigt alte Version

**Lösung:**
1. Hard Reload: `Ctrl+Shift+R` (Windows/Linux) oder `Cmd+Shift+R` (Mac)
2. Cache leeren: Browser DevTools → Network → "Disable cache" aktivieren
3. PWA Cache leeren: Application → Storage → "Clear site data"

## KV Namespace Setup (Falls noch nicht erledigt)

### 1. KV Namespaces erstellen

```bash
# Production KV Namespace
wrangler kv:namespace create "RATE_LIMIT_KV" --env production

# Preview KV Namespace
wrangler kv:namespace create "RATE_LIMIT_KV" --env preview
```

### 2. IDs in wrangler.toml aktualisieren

Die Namespaces sind bereits in `wrangler.toml` konfiguriert:

```toml
[[kv_namespaces]]
binding = "RATE_LIMIT_KV"
id = "0d65c85d47bf490f961707338ad47993"  # Production
preview_id = "eca29f3a0056484785f3b0f6637c8f58"  # Preview
```

**Prüfen ob die IDs stimmen:**
```bash
wrangler kv:namespace list
```

Die angezeigten IDs sollten mit denen in `wrangler.toml` übereinstimmen.

## Sicherheits-Hinweise

### ⚠️ Wichtig: API Keys niemals committen!

**Niemals:**
- API Keys in Git committen
- API Keys in `wrangler.toml` eintragen
- API Keys in `.env`-Dateien committen

**Stattdessen:**
- Nutze Cloudflare Secrets (encrypted)
- Nutze `.env.local` für lokale Entwicklung (im `.gitignore`)
- Nutze Wrangler Secret Management

### Rate Limiting

Das System implementiert automatisches Rate Limiting:
- **Burst Limit:** 2 Sekunden zwischen Requests
- **Daily Budget:** 60 Requests pro Tag pro IP
- **Hard Caps:** Max 1200 Tokens pro Request

Dies schützt deinen API Key vor Missbrauch.

## Häufige Fragen

### Warum zwei Secrets (OPENROUTER_API_KEY und VITE_OPENROUTER_API_KEY)?

**Aktuell wird nur `OPENROUTER_API_KEY` benötigt.**

- `OPENROUTER_API_KEY`: Für Cloudflare Functions (Backend/Proxy)
- `VITE_OPENROUTER_API_KEY`: Legacy, wird nicht mehr genutzt

Die `VITE_` Variante war für Frontend Direct Calls gedacht, aber das ist unsicher (API Key im Browser-Code). Daher nutzen wir jetzt:
- Proxy Mode mit Server Secret für Standard-User
- User können eigenen API Key in App-Settings setzen (wird in sessionStorage gespeichert)

### Wie kann ich eigenen API Key in der App nutzen?

1. Öffne [https://disaai.de](https://disaai.de)
2. Gehe zu Einstellungen (Zahnrad-Icon)
3. Navigiere zu "API-Einstellungen"
4. Gib deinen OpenRouter API Key ein
5. Speichern

Der Key wird **nur** in `sessionStorage` gespeichert (nicht auf Server, geht bei Tab-Close verloren).

### Kostet das was?

OpenRouter ist ein API-Aggregator mit verschiedenen Preismodellen:
- **Free Tier Models:** Viele Modelle sind kostenlos (z.B. die konfigurierten Free Models)
- **Paid Models:** Kosten pro Request, je nach Modell

**Unsere Konfiguration (`functions/api/models.ts`):**
Wir erlauben nur **free** Models (`:free` suffix), z.B.:
- `deepseek/deepseek-chat-v3-0324:free`
- `meta-llama/llama-3.3-70b-instruct:free`

**Rate Limiting schützt vor Cost Overrun.**

## Weiterführende Dokumentation

- [OpenRouter Documentation](https://openrouter.ai/docs)
- [Cloudflare Pages Secrets](https://developers.cloudflare.com/pages/platform/functions/bindings/#secrets)
- [Cloudflare Workers KV](https://developers.cloudflare.com/workers/runtime-apis/kv/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)

## Support

Bei Problemen:
1. Prüfe die Browser Console (F12) auf Fehler
2. Prüfe Cloudflare Logs: `wrangler pages deployment tail`
3. Erstelle ein Issue im GitHub Repository mit:
   - Browser Console Logs
   - Network Tab Screenshots
   - Schritte zum Reproduzieren
