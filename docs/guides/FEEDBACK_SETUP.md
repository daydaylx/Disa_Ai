# Feedback-Funktion Setup (Resend.com)

Diese Anleitung beschreibt die Einrichtung der Feedback-Funktion für Disa AI mit **Resend.com** als E-Mail-Provider.

## Warum Resend?

- ✅ **Einfaches Setup** - Nur API Key erforderlich, kein DNS-Setup
- ✅ **Kostenloser Tier** - 100 E-Mails/Tag, 3.000/Monat
- ✅ **Cloudflare-kompatibel** - Offizielle Unterstützung in CF Workers
- ✅ **Zuverlässig** - Keine Spam-Probleme wie bei MailChannels

## Setup in 3 Schritten

### 1. Resend Account erstellen

1. Gehe zu [resend.com](https://resend.com)
2. Erstelle einen kostenlosen Account
3. Navigiere zu **API Keys** im Dashboard
4. Klicke **Create API Key**
5. Kopiere den Key (beginnt mit `re_...`)

### 2. Cloudflare Pages konfigurieren

1. Öffne [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Gehe zu **Pages** → Dein Projekt → **Settings**
3. Klicke auf **Environment variables**
4. Füge hinzu:

| Variable | Wert | Umgebung |
|----------|------|----------|
| `RESEND_API_KEY` | `re_xxxxxxxxxxxxx` | Production |
| `DISA_FEEDBACK_TO` | `deine@email.de` (optional) | Production |

5. Klicke **Save**
6. Triggere ein Re-Deploy (oder pushe einen Commit)

### 3. Testen

```bash
# Lokaler Test (mit Wrangler)
npx wrangler pages dev dist --binding RESEND_API_KEY=re_xxx

# In anderem Terminal:
curl -X POST http://localhost:8788/api/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Test Feedback!",
    "type": "idea"
  }'
```

Oder in der App unter `/feedback`.

## Optional: Eigene Domain als Absender

Standardmäßig werden E-Mails von `onboarding@resend.dev` gesendet.

Für eine eigene Absender-Domain (z.B. `feedback@disaai.de`):

1. In Resend → **Domains** → **Add Domain**
2. DNS-Records hinzufügen (SPF, DKIM, DMARC)
3. Warten auf Verifizierung
4. In `functions/api/feedback.ts` die `DEFAULT_FROM` Konstante ändern

## Fehlerbehebung

### "Email service not configured"
→ `RESEND_API_KEY` ist nicht gesetzt. Prüfe Cloudflare Pages Environment Variables.

### "Invalid API key" (401)
→ Der API Key ist falsch oder abgelaufen. Generiere einen neuen in Resend.

### "Rate limit exceeded" (429)
→ Tageslimit erreicht. Warte 24h oder upgrade auf Resend Pro.

### E-Mails kommen nicht an
1. Prüfe Spam-Ordner
2. Prüfe Cloudflare Pages Logs: `wrangler pages deployment tail`
3. Prüfe Resend Dashboard → Emails für Delivery Status

## Alternative: Eigener SMTP-Server

Falls du keinen externen Dienst nutzen möchtest, kannst du die Funktion auch anpassen, um einen eigenen SMTP-Server zu verwenden. Dafür wäre aber ein externes npm-Paket wie `nodemailer` erforderlich, das in Cloudflare Workers nicht direkt unterstützt wird.

## Referenzen

- [Resend Dokumentation](https://resend.com/docs)
- [Cloudflare Workers + Resend Tutorial](https://developers.cloudflare.com/workers/tutorials/send-emails-with-resend/)
- [Cloudflare Pages Functions](https://developers.cloudflare.com/pages/functions/)
