# MailChannels Setup für Feedback-Funktion

Dieses Dokument beschreibt die notwendigen DNS-Konfigurationen, damit die Feedback-Funktion über MailChannels zuverlässig E-Mails versenden kann.

## Übersicht

Die Feedback-API nutzt **MailChannels** über Cloudflare Pages Functions, um Feedback-Nachrichten per E-Mail zu versenden. Ohne korrekte DNS-Konfiguration werden die E-Mails wahrscheinlich als Spam markiert oder vom Empfänger-Server abgelehnt.

## Benötigte DNS-Records

### 1. SPF Record (Sender Policy Framework)

Der SPF-Record legitimiert MailChannels als autorisierten Absender für deine Domain.

**Typ:** `TXT`
**Name:** `disaai.de` (oder deine Root-Domain)
**Wert:**
```
v=spf1 include:_spf.mx.cloudflare.net ~all
```

**Alternative (wenn bereits ein SPF-Record existiert):**
```
v=spf1 include:_spf.mx.cloudflare.net include:_spf.google.com ~all
```

⚠️ **Wichtig:** Es darf nur **einen** SPF-Record pro Domain geben. Falls bereits ein SPF-Record existiert, füge `include:_spf.mx.cloudflare.net` zu den bestehenden Includes hinzu.

---

### 2. DKIM Record (Optional, aber empfohlen)

DKIM signiert ausgehende E-Mails kryptografisch, um Manipulationen zu verhindern.

**Typ:** `TXT`
**Name:** `mailchannels._domainkey.disaai.de`
**Wert:**
```
v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDPtW5iwpXVPiH5FzJ7Nrl8USzuY9zqqzjE0D1r04xDN6qwziDnmgcFNNfMewVKN2D1O+2J9N73khMBBGGPTR7VN/xBHi2D+vgCmTcO8kE7AqIPNLZ5M/MvWD5Bp7sTQtMJ9rRk5Xg3vTzQPwCLY3xmKkVlXRYnpVTKZ6W5/wIDAQAB
```

⚠️ **Hinweis:** Der obige Public Key ist ein **Beispiel** von MailChannels. Verwende den offiziellen DKIM-Key aus der [MailChannels Dokumentation](https://support.mailchannels.com/hc/en-us/articles/7122849237389-Adding-a-DKIM-Signature).

---

### 3. Domain Lockdown (Optional, aber empfohlen)

Schützt deine Domain vor Missbrauch durch unautorisierten MailChannels-Versand.

**Typ:** `TXT`
**Name:** `_mailchannels.disaai.de`
**Wert:**
```
v=mc1 cfid=disaai.pages.dev
```

**Ersetze** `disaai.pages.dev` mit deiner tatsächlichen Cloudflare Pages Domain.

---

## Cloudflare Pages Environment Variables

Die Feedback-API benötigt folgende Umgebungsvariablen in Cloudflare Pages:

### In Cloudflare Dashboard konfigurieren:

1. Gehe zu **Cloudflare Pages** → Dein Projekt → **Settings** → **Environment Variables**
2. Füge folgende Variablen hinzu:

| Variable | Wert | Beschreibung |
|----------|------|--------------|
| `DISA_FEEDBACK_TO` | `disaai@justmail.de` | Empfänger-Adresse für Feedback |
| `DISA_FEEDBACK_FROM` | `feedback@disaai.de` | Absender-Adresse (muss mit DNS übereinstimmen) |

⚠️ **Wichtig:** `DISA_FEEDBACK_FROM` muss eine verifizierte Domain sein (mit SPF/DKIM).

---

## DNS-Konfiguration bei gängigen Providern

### Cloudflare DNS

1. Gehe zu **Cloudflare Dashboard** → Deine Domain → **DNS**
2. Klicke auf **Add record**
3. Füge die oben genannten TXT-Records hinzu
4. **Proxy Status:** ❌ DNS only (graue Wolke, nicht orange)

### Beispiel-Konfiguration:

| Type | Name | Content | Proxy |
|------|------|---------|-------|
| TXT | disaai.de | `v=spf1 include:_spf.mx.cloudflare.net ~all` | DNS only |
| TXT | mailchannels._domainkey | `v=DKIM1; k=rsa; p=...` | DNS only |
| TXT | _mailchannels | `v=mc1 cfid=disaai.pages.dev` | DNS only |

---

## DNS-Propagierung überprüfen

Nach dem Hinzufügen der DNS-Records kann die Propagierung bis zu **48 Stunden** dauern (meist nur wenige Minuten).

### Überprüfung mit dig (Linux/Mac):

```bash
# SPF Record prüfen
dig TXT disaai.de +short

# DKIM Record prüfen
dig TXT mailchannels._domainkey.disaai.de +short

# Domain Lockdown prüfen
dig TXT _mailchannels.disaai.de +short
```

### Online-Tools:

- **MXToolbox SPF Check:** https://mxtoolbox.com/spf.aspx
- **MXToolbox DKIM Check:** https://mxtoolbox.com/dkim.aspx
- **Google DNS Check:** https://dns.google/

---

## Testen der Feedback-Funktion

### 1. Lokales Testen (mit Cloudflare Wrangler)

```bash
# Functions lokal starten (erfordert Wrangler)
npx wrangler pages dev dist

# In einem anderen Terminal:
curl -X POST http://localhost:8788/api/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Test Feedback",
    "type": "idea",
    "email": "test@example.com"
  }'
```

### 2. Production-Test

1. Öffne die App: https://disaai.de/feedback
2. Fülle das Formular aus (mit oder ohne E-Mail für anonymes Feedback)
3. Sende das Feedback ab
4. Überprüfe die Empfänger-Adresse (`disaai@justmail.de`)

---

## Fehlersuche

### Problem: "Failed to dispatch email" (500 Error)

**Ursachen:**
- SPF-Record fehlt oder ist falsch konfiguriert
- MailChannels API lehnt die Anfrage ab (fehlende Domain-Verifizierung)
- Cloudflare Pages Environment Variables sind nicht gesetzt

**Lösung:**
1. DNS-Records überprüfen (siehe oben)
2. Environment Variables in Cloudflare Pages überprüfen
3. Cloudflare Pages Logs prüfen: `wrangler pages deployment tail`

---

### Problem: E-Mails landen im Spam

**Ursachen:**
- DKIM-Record fehlt
- SPF-Record unvollständig
- Reply-To-Adresse ist nicht verifiziert

**Lösung:**
1. DKIM-Record hinzufügen
2. SPF-Record mit `-all` statt `~all` setzen (strenger)
3. Empfänger bitten, Absender zur Whitelist hinzuzufügen

---

### Problem: Rate Limiting greift zu früh

Das clientseitige Rate Limiting erlaubt nur **1 Feedback pro 3 Minuten**.

**Lösung für Entwicklung:**
```javascript
// In Browser Console:
localStorage.removeItem('feedback_last_sent');
```

---

## Weitere Ressourcen

- **MailChannels Cloudflare Pages Docs:** https://support.mailchannels.com/hc/en-us/articles/4565898358413
- **MailChannels Domain Lockdown:** https://support.mailchannels.com/hc/en-us/articles/16918954360845
- **Cloudflare Pages Functions:** https://developers.cloudflare.com/pages/functions/

---

## Zusammenfassung Checklist

- [ ] SPF-Record für `disaai.de` hinzufügen
- [ ] DKIM-Record für `mailchannels._domainkey.disaai.de` hinzufügen (optional)
- [ ] Domain Lockdown Record für `_mailchannels.disaai.de` hinzufügen (optional)
- [ ] Cloudflare Pages Environment Variables setzen (`DISA_FEEDBACK_TO`, `DISA_FEEDBACK_FROM`)
- [ ] DNS-Propagierung überprüfen (dig/MXToolbox)
- [ ] Feedback-Funktion in Production testen
- [ ] E-Mail-Empfang überprüfen (inkl. Spam-Ordner)

Bei Fragen siehe: `docs/guides/ENVIRONMENT_VARIABLES.md` für weitere Backend-Konfiguration.
