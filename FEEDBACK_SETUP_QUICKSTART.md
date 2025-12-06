# Feedback-Funktion: Quick Start Setup-Anleitung

Die Code-Änderungen sind abgeschlossen! Jetzt musst du noch die Cloudflare-Konfiguration und DNS-Records einrichten.

## ✅ Bereits erledigt

- ✅ Frontend & Backend Code implementiert
- ✅ `_routes.json` korrigiert (API-Routen sind jetzt aktiviert)
- ✅ Dokumentation vorhanden

---

## 📋 Nächste Schritte (außerhalb des Codes)

### Schritt 1: Environment Variables in Cloudflare Dashboard setzen

**Wo:** [Cloudflare Dashboard](https://dash.cloudflare.com/) → Pages → **disaai** → Settings → Environment Variables

**Was hinzufügen:**

| Variable Name        | Wert                 | Environment |
| -------------------- | -------------------- | ----------- |
| `DISA_FEEDBACK_TO`   | `disaai@justmail.de` | Production  |
| `DISA_FEEDBACK_FROM` | `feedback@disaai.de` | Production  |

**Wichtig:** Setze diese für das **Production** Environment!

**Screenshot-Anleitung:**

1. Klicke auf "Add variable"
2. Trage Namen und Wert ein
3. Wähle "Production" Environment
4. Klicke "Save"
5. Wiederhole für die zweite Variable

---

### Schritt 2: DNS-Records konfigurieren

**Wo:** [Cloudflare Dashboard](https://dash.cloudflare.com/) → Deine Domain (**disaai.de**) → DNS

#### A) SPF-Record (ERFORDERLICH)

Ohne diesen Record werden E-Mails abgelehnt!

```
Typ:  TXT
Name: disaai.de  (oder @ für Root-Domain)
Wert: v=spf1 include:_spf.mx.cloudflare.net ~all
TTL:  Auto
Proxy Status: DNS only (graue Wolke ☁️, NICHT orange!)
```

#### B) DKIM-Record (EMPFOHLEN für bessere Zustellbarkeit)

```
Typ:  TXT
Name: mailchannels._domainkey.disaai.de
Wert: v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDPtW5iwpXVPiH5FzJ7Nrl8USzuY9zqqzjE0D1r04xDN6qwziDnmgcFNNfMewVKN2D1O+2J9N73khMBBGGPTR7VN/xBHi2D+vgCmTcO8kE7AqIPNLZ5M/MvWD5Bp7sTQtMJ9rRk5Xg3vTzQPwCLY3xmKkVlXRYnpVTKZ6W5/wIDAQAB
TTL:  Auto
Proxy Status: DNS only (graue Wolke)
```

⚠️ **Hinweis:** Dies ist der Standard-MailChannels DKIM-Key. Für einen eigenen Key siehe [MailChannels DKIM-Dokumentation](https://support.mailchannels.com/hc/en-us/articles/7122849237389).

#### C) Domain Lockdown (EMPFOHLEN für Sicherheit)

Verhindert, dass andere deine Domain für MailChannels missbrauchen:

```
Typ:  TXT
Name: _mailchannels.disaai.de
Wert: v=mc1 cfid=disaai.pages.dev
TTL:  Auto
Proxy Status: DNS only (graue Wolke)
```

⚠️ **Wichtig:** Ersetze `disaai.pages.dev` mit deiner tatsächlichen Cloudflare Pages URL!

---

### Schritt 3: DNS-Propagierung überprüfen

Nach dem Hinzufügen der DNS-Records (Wartezeit: 5 Min - 48 Std, meist < 1 Std):

```bash
# SPF-Record prüfen
dig TXT disaai.de +short

# DKIM-Record prüfen
dig TXT mailchannels._domainkey.disaai.de +short

# Domain Lockdown prüfen
dig TXT _mailchannels.disaai.de +short
```

**Alternative (Online):** [MXToolbox SPF Check](https://mxtoolbox.com/spf.aspx)

---

### Schritt 4: Deploy & Test

#### 4.1 Deploy auf Cloudflare Pages

```bash
# Commit die Änderungen
git add deploy/cloudflare/cloudflare-pages.json
git commit -m "fix: Enable API routes in Cloudflare Pages Functions"
git push
```

Cloudflare Pages deployed automatisch bei Push auf `main`.

#### 4.2 Production-Test

1. Öffne: https://disaai.de/feedback
2. Wähle Feedback-Typ (z.B. "Idee")
3. Schreibe eine Test-Nachricht
4. Gib **deine eigene E-Mail** ein (für Reply-To-Test)
5. Klicke "Feedback absenden"
6. **Prüfe** `disaai@justmail.de` auf eingehende E-Mail (inkl. Spam-Ordner!)

**Erwartetes Ergebnis:**

- ✅ Toast: "Feedback gesendet"
- ✅ E-Mail kommt in `disaai@justmail.de` an
- ✅ Reply-To-Adresse ist deine eingegebene E-Mail

---

### Schritt 5: Fehlersuche (falls nötig)

#### Problem: "Senden fehlgeschlagen" (500 Error)

**Mögliche Ursachen:**

1. Environment Variables nicht gesetzt → Gehe zu Schritt 1
2. SPF-Record fehlt → Gehe zu Schritt 2A
3. MailChannels API-Fehler → Prüfe Logs (siehe unten)

**Logs prüfen:**

```bash
npx wrangler pages deployment tail --project-name=disaai
```

#### Problem: E-Mail kommt nicht an

1. **Spam-Ordner prüfen** (häufigste Ursache!)
2. **DKIM-Record hinzufügen** (Schritt 2B) für bessere Reputation
3. **DNS-Propagierung abwarten** (bis zu 48h)

#### Problem: E-Mail landet im Spam

**Lösungen:**

- DKIM-Record hinzufügen (Schritt 2B)
- SPF-Record auf `-all` verschärfen: `v=spf1 include:_spf.mx.cloudflare.net -all`
- Domain Lockdown aktivieren (Schritt 2C)
- Empfänger bittet, `feedback@disaai.de` zur Whitelist hinzuzufügen

---

## 📚 Detaillierte Dokumentation

Für technische Details siehe:

- `/docs/guides/FEEDBACK_MAILCHANNELS_SETUP.md` - Vollständige MailChannels-Anleitung
- `/docs/guides/ENVIRONMENT_VARIABLES.md` - Alle Environment Variables

---

## ✅ Checkliste

- [ ] Environment Variables in Cloudflare Pages gesetzt
- [ ] SPF-Record hinzugefügt (erforderlich)
- [ ] DKIM-Record hinzugefügt (empfohlen)
- [ ] Domain Lockdown hinzugefügt (empfohlen)
- [ ] DNS-Propagierung überprüft (dig oder MXToolbox)
- [ ] Code deployed (git push)
- [ ] Production-Test durchgeführt
- [ ] E-Mail-Empfang bestätigt

---

Bei Problemen schau in die ausführliche Dokumentation oder prüfe die Cloudflare Pages Logs!
