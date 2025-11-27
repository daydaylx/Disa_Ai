# 🚀 Disa AI - Cloudflare Deployment Konfiguration

## 🚨 QUICK FIX: Chat funktioniert nicht?

**Symptom:** "Missing server configuration" oder "Hohe Auslastung" Fehler beim Chatten

**Lösung in 3 Schritten:**

1. **OpenRouter API Key holen**
   - Gehe zu [OpenRouter.ai](https://openrouter.ai/)
   - Erstelle einen Account / Logge dich ein
   - Kopiere deinen API Key aus dem Dashboard

2. **Secret in Cloudflare setzen**
   - Gehe zu [Cloudflare Dashboard](https://dash.cloudflare.com/) → Workers & Pages → disaai
   - Settings → Environment variables → Add variable
   - Name: `OPENROUTER_API_KEY`
   - Value: [Dein API Key]
   - Type: **Encrypted**
   - Environment: **Production** (und **Preview**)
   - Save

3. **Deployment neu triggern**
   ```bash
   git commit --allow-empty -m "Trigger rebuild after secret setup"
   git push origin main
   ```

**Detaillierte Anleitung:** Siehe [docs/CLOUDFLARE_SETUP.md](docs/CLOUDFLARE_SETUP.md)

---

## Übersicht

This document explains how to properly configure the Disa AI application for deployment on Cloudflare Pages/Workers.

## Required Steps Before Deployment

### 1. KV Namespace Setup

You need to create KV namespaces for the rate limiting functionality:

1. Create a KV namespace for production:

   ```bash
   wrangler kv:namespace create "RATE_LIMIT_KV" --env production
   ```

2. Create a KV namespace for preview:

   ```bash
   wrangler kv:namespace create "RATE_LIMIT_KV" --env preview
   ```

3. Update the `wrangler.toml` file (konsolidierte Version) with the actual namespace IDs:
   - Replace `YOUR_PRODUCTION_RATE_LIMIT_KV_NAMESPACE_ID` with the production namespace ID
   - Replace `YOUR_PREVIEW_RATE_LIMIT_KV_NAMESPACE_ID` with the preview namespace ID

**AKTUELLER STATUS:** ✅ KV Namespaces sind korrekt konfiguriert:
- Production: `0d65c85d47bf490f961707338ad47993`
- Preview: `eca29f3a0056484785f3b0f6637c8f58`

**Verifizierung:**
```bash
wrangler kv:namespace list
```

### 2. Secrets Setup (CRITICAL!)

**Cloudflare Secrets** sind verschlüsselte Environment Variables, die niemals in Code oder Logs erscheinen.

**So setzt du Secrets:**

**Option A: Cloudflare Dashboard**
1. Dashboard → Workers & Pages → disaai
2. Settings → Environment variables
3. Add variable → Name: `OPENROUTER_API_KEY`, Type: **Encrypted**

**Option B: Wrangler CLI**
```bash
echo "your-api-key" | wrangler pages secret put OPENROUTER_API_KEY --project-name=disaai
```

### 3. Environment Variables

Regular environment variables (non-secret) sind in `wrangler.toml` konfiguriert:

**KRITISCH:**

**Production Secrets** (müssen als **Encrypted Secrets** im Dashboard gesetzt werden):

- `OPENROUTER_API_KEY` - **REQUIRED** - API key for OpenRouter (functions/api/chat.ts)
  - ⚠️ **Muss als Cloudflare Secret gesetzt werden, NICHT in wrangler.toml!**
  - Siehe Quick Fix oben

**Environment Variables** (in wrangler.toml konfiguriert):

- `VITE_OPENROUTER_BASE_URL` - ✅ Configured - `https://openrouter.ai/api/v1`
- `VITE_ENABLE_DEBUG` - ✅ Configured - `false` (production)

**Deprecated/Legacy:**

- `VITE_OPENROUTER_API_KEY` - ❌ NICHT MEHR GENUTZT - Legacy, wurde entfernt aus Sicherheitsgründen

### 4. Verification Steps

**Nach Secret-Setup:**

1. **Secret verifizieren** (zeigt nur ob vorhanden, nicht den Wert):
   ```bash
   wrangler pages secret list --project-name=disaai
   ```

2. **Validation Script ausführen:**
   ```bash
   npm run validate:deploy
   ```

   Prüft:
   - KV namespace configuration
   - Environment variables
   - Security headers
   - Route configuration

3. **Live-Test:**
   - Öffne [https://disaai.de](https://disaai.de)
   - Öffne Browser Console (F12)
   - Starte einen Chat
   - Keine Fehler = ✅ Setup erfolgreich

## Deployment Process

### Initial Setup (einmalig):

1. ✅ KV Namespaces erstellen (bereits erledigt)
2. ✅ wrangler.toml mit KV IDs konfigurieren (bereits erledigt)
3. **Secrets setzen** (siehe Quick Fix oben)

### Jedes Deployment:

1. Code-Änderungen committen
2. **Optional:** Validation ausführen: `npm run validate:deploy`
3. Push zu GitHub:
   ```bash
   git push origin main  # Production
   git push origin <branch>  # Preview
   ```
4. Cloudflare deployed automatisch

### Secrets aktualisieren:

```bash
# Production
echo "new-api-key" | wrangler pages secret put OPENROUTER_API_KEY --project-name=disaai

# Preview
echo "new-api-key" | wrangler pages secret put OPENROUTER_API_KEY --project-name=disaai --env=preview

# Deployment neu triggern
git commit --allow-empty -m "Trigger rebuild"
git push
```

## Troubleshooting

### Common Issues

1. **"Missing server configuration" Error**
   - **Ursache:** `OPENROUTER_API_KEY` Secret fehlt oder ist falsch
   - **Fix:** Siehe Quick Fix oben
   - **Verifizieren:** `wrangler pages secret list --project-name=disaai`

2. **"Hohe Auslastung" Error**
   - **Ursache 1:** Legitimes Rate Limiting (2s burst, 60/day)
   - **Ursache 2:** API Key fehlt oder ist ungültig
   - **Fix:** Prüfe Secret-Setup und OpenRouter Dashboard

3. **Rate Limiting Not Working**
   - **Ursache:** KV namespace IDs falsch
   - **Fix:** `wrangler kv:namespace list` und IDs in wrangler.toml vergleichen
   - **Status:** ✅ Aktuell korrekt konfiguriert

4. **Build Errors**
   - **Ursache:** Environment variables fehlen
   - **Fix:** `npm run validate:deploy` für Diagnose

5. **Secrets werden nicht erkannt**
   - **Ursache 1:** Secret-Name ist case-sensitive (`OPENROUTER_API_KEY`)
   - **Ursache 2:** Secret ist für falsche Environment gesetzt
   - **Ursache 3:** Nach Secret-Setup wurde nicht neu deployed
   - **Fix:** Dashboard prüfen, neu deployen

6. **Browser zeigt alte Version**
   - **Fix 1:** Hard Reload: `Ctrl+Shift+R` (Windows/Linux) oder `Cmd+Shift+R` (Mac)
   - **Fix 2:** Cloudflare Cache purgen: Dashboard → Settings → Functions → Purge cache

### Verification Commands

```bash
# Secrets auflisten (zeigt nur Namen, nicht Werte)
wrangler pages secret list --project-name=disaai

# KV Namespaces auflisten
wrangler kv:namespace list

# Deployment-Konfiguration validieren
npm run validate:deploy

# Build testen
npm run build

# Distribution verifizieren
npm run verify:dist

# Live Logs ansehen
wrangler pages deployment tail --project-name=disaai

# Deployment-Liste anzeigen
wrangler pages deployment list --project-name=disaai
```

## Weitere Ressourcen

- **Detaillierte Setup-Anleitung:** [docs/CLOUDFLARE_SETUP.md](docs/CLOUDFLARE_SETUP.md)
- **Environment Variables Referenz:** [docs/ENVIRONMENT_VARIABLES.md](docs/ENVIRONMENT_VARIABLES.md)
- **Cloudflare Pages Docs:** [developers.cloudflare.com/pages](https://developers.cloudflare.com/pages)
- **OpenRouter Docs:** [openrouter.ai/docs](https://openrouter.ai/docs)
