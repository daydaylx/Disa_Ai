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

## Screenshot-Anhänge

**Neu in Version 1.1.0:** Nutzer können jetzt Screenshots an Feedback anhängen!

### Was wird unterstützt?

✅ **Bis zu 5 Bilder** pro Feedback
✅ **Formate:** PNG, JPEG, WebP
✅ **Max. Größe:** 5 MB pro Bild, 15 MB gesamt
✅ **Automatische Kompression** (60-80% Größenreduktion)
✅ **EXIF-Stripping** (Metadaten wie GPS werden entfernt)

### Wie funktioniert es?

1. **Clientseitig:**
   - Nutzer wählt Bilder aus (Kamera/Galerie auf Mobile)
   - Bilder werden auf max. 1280px verkleinert
   - Canvas-API komprimiert zu WebP/JPEG
   - Preview-Thumbnails werden angezeigt

2. **Serverseitig:**
   - `multipart/form-data` statt JSON
   - MIME-Type + Magic Bytes Validierung (Sicherheit)
   - Konvertierung zu Base64
   - An Resend API als `attachments[]` gesendet

3. **E-Mail:**
   - Screenshots werden als Anhänge mitgesendet
   - Im Resend Free-Tier: Max. 40 MB pro E-Mail (aktuell max. 15 MB)

### Test mit Screenshots

```bash
# Mit Wrangler (multipart/form-data):
curl -X POST http://localhost:8788/api/feedback \
  -F "message=Bug gefunden!" \
  -F "type=bug" \
  -F "attachments=@screenshot.png"
```

### Fehlerbehebung

**"Anhänge zu groß" (HTTP 413)**
→ Nutzer hat zu viele oder zu große Bilder hochgeladen
→ Lösung: Weniger Bilder oder kleinere Auflösung

**"Invalid image file: fake.png" (HTTP 400)**
→ Magic Bytes stimmen nicht (File-Type-Spoofing)
→ Lösung: Datei ist korrupt oder kein echtes Bild

**Resend-Limit überschritten**
→ Attachments > 40 MB (Free-Tier)
→ Lösung: Upgrade auf Resend Pro (150 MB Limit)

### Detaillierte Dokumentation

Siehe: [`FEEDBACK_SCREENSHOTS.md`](./FEEDBACK_SCREENSHOTS.md) für:
- Technische Spezifikation
- Sicherheits-Details
- Testing-Guide
- Performance-Optimierungen
- FAQ

---

## Referenzen

- [Resend Dokumentation](https://resend.com/docs)
- [Resend Attachments API](https://resend.com/docs/api-reference/emails/send-email#body-parameters)
- [Cloudflare Workers + Resend Tutorial](https://developers.cloudflare.com/workers/tutorials/send-emails-with-resend/)
- [Cloudflare Pages Functions](https://developers.cloudflare.com/pages/functions/)
- **NEU:** [Screenshot-Anhänge Dokumentation](./FEEDBACK_SCREENSHOTS.md)
