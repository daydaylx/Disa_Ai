# Datenschutzerklärung – Disa AI

**Letzte Aktualisierung:** 2026-02-07
**Version:** 1.1

---

## 1 Verantwortliche Stelle und Kontakt

**David Grunert**
E-Mail: grunert94@hotmail.com

Die Anwendung wird privat betrieben. Es besteht daher keine gesetzliche Verpflichtung zur Benennung eines Datenschutzbeauftragten. Bei Fragen zum Datenschutz können Sie sich aber jederzeit an die obige Adresse wenden.

---

## 2 Welche Daten werden verarbeitet?

### 2.1 Nutzereingaben und Chat-Daten

Wenn Sie im Chat Texte eingeben, werden diese zusammen mit den von Ihnen gewählten Einstellungen (z.B. Modellname, Temperatur) über einen Serverless-Proxy (`/api/chat`) weitergeleitet.

**Technischer Ablauf:**

1. Ihre Chat-Nachrichten werden clientseitig an unseren Cloudflare-Proxy gesendet
2. Der Proxy leitet die Anfrage an die OpenRouter-API weiter, unter Verwendung unseres API-Schlüssels
3. OpenRouter leitet Ihre Eingaben an den jeweils ausgewählten Modellanbieter (z.B. OpenAI, Mistral, Anthropic) weiter

**Wichtiger Hinweis:**

- Der Proxy sendet keine Message-Inhalte in Server-Logs (nur Metadaten wie Modellname)
- Wir haben keinerlei Kontrolle darüber, ob Drittanbieter (OpenRouter, Modellanbieter) Ihre Inhalte speichern oder für Trainingszwecke nutzen
- Laut der OpenRouter Privacy Policy sammelt OpenRouter personenbezogene Daten und speichert Kopien Ihrer Anfragen
- Die einzelnen Modellanbieter haben eigene, teils abweichende Datenrichtlinien

**Empfehlung:** Geben Sie im Chat **keine personenbezogenen Daten** (Namen, Adressen, Gesundheits- oder Finanzdaten) ein. Verwenden Sie die App nur für allgemeine Anfragen.

---

### 2.2 Lokale Speicherung im Browser

Die Anwendung speichert verschiedene Datensätze **ausschließlich in Ihrem Browser**. Diese Daten verlassen Ihr Gerät nicht und werden nicht an uns übertragen.

**Im Browser gespeichert (localStorage/sessionStorage/IndexedDB):**

- **Konversationen und Chat-Verlauf** - Ihre Gespräche mit der KI
- **Nutzerpräferenzen** - Theme, Favoriten, Settings
- **API-Schlüssel** (falls Sie einen eigenen OpenRouter-Key verwenden) - Nur im `sessionStorage`, wird beim Tab-Schließen gelöscht

**Löschen der Daten:**
Sie können die gespeicherten Daten jederzeit löschen, indem Sie in Ihrem Browser die Website-Daten (Cookies und Site Data) für `disaai.de` löschen. Beachten Sie, dass der Chat-Verlauf dann verloren geht.

---

### 2.3 Technische Zugriffsdaten

Beim Aufruf der Anwendung verarbeiten unsere technischen Dienstleister automatisch Protokoll- und Verbindungsdaten, um die Seite auszuliefern und vor Angriffen zu schützen.

**Verarbeitete Daten:**

- IP-Adresse
- Browser-Typ und Version
- Betriebssystem
- Angeforderte Ressourcen
- Datum und Uhrzeit des Zugriffs

Diese Daten werden aus Sicherheitsgründen benötigt und begründen ein berechtigtes Interesse gemäß **Art. 6 Abs. 1 lit. f DSGVO**.

---

### 2.4 Feedback-Funktion

Wenn Sie das Feedback-Formular nutzen, werden folgende Daten verarbeitet:

- Ihre Nachricht
- Optional: Ihre E-Mail-Adresse
- Kategorie und Kontext-Informationen
- Browser User-Agent
- Zeitstempel

**Technischer Ablauf:**

1. Ihre Feedback-Daten werden an unseren Cloudflare-Proxy (`/api/feedback`) gesendet
2. Der Proxy validiert die Daten und prüft Rate Limits (5 Anfragen / 10 Minuten)
3. Bei erfolgreicher Validierung wird das Feedback per E-Mail über Resend.com versendet

**Wichtig:**

- Feedback-Inhalte werden NICHT in Server-Logs gespeichert
- Rate Limiting erfolgt über Cloudflare KV (speichert IP-Hash + User-Agent-Hash für 10 Minuten)
- Nutzen Sie das Feedback-Formular nur, wenn Sie mit dieser Verarbeitung einverstanden sind

---

## 3 Eingesetzte Dienstleister und Drittanbieter

### 3.1 Cloudflare (Hosting und CDN)

**Dienstleister:** Cloudflare, Inc., 101 Townsend St, San Francisco, CA 94107, USA

**Zweck:**

- Hosting der statischen Anwendung (Cloudflare Pages)
- Content Delivery Network (CDN)
- DDoS-Schutz
- Web Analytics (anonymisiert)

**Verarbeitete Daten:**

- IP-Adresse
- Browser-Informationen
- Zeitstempel
- Angeforderte Ressourcen

**Cloudflare Web Analytics:**

- Privacy-first Lösung ohne Cookies oder clientseitigen Speicher
- Keine Erstellung von Nutzerprofilen
- Anonyme Metriken (Seitenaufrufe, Ladezeiten)

**Rechtsgrundlage:** Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an sicherer und performanter Bereitstellung)

**Weitere Informationen:** [Cloudflare Privacy Policy](https://www.cloudflare.com/privacypolicy/)

---

### 3.2 OpenRouter und Modellanbieter

**Dienstleister:** OpenRouter Inc., USA

**Zweck:**

- Bereitstellung von KI-Modellen verschiedener Anbieter
- Weiterleitung von Chat-Anfragen

**Verarbeitete Daten:**

- Ihre Chat-Nachrichten
- Technische Metadaten (IP-Adresse, Browser-Informationen)
- Cookies (falls von OpenRouter gesetzt)

**Wichtige Hinweise:**

- OpenRouter sammelt und speichert personenbezogene Daten laut eigener Privacy Policy
- Die einzelnen Modellanbieter (OpenAI, Anthropic, Google, etc.) haben eigene Datenrichtlinien
- Wir haben **keinen Einfluss** auf die Datenverarbeitungs- und Retentionspraxis der Drittanbieter

**Rechtsgrundlage:** Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung) bzw. lit. a DSGVO (Einwilligung durch Nutzung)

**Weitere Informationen:**

- [OpenRouter Privacy Policy](https://openrouter.ai/privacy)
- Modellanbieter-Policies: Siehe jeweilige Anbieter-Websites

---

### 3.3 INWX (Domain-Provider)

**Dienstleister:** INWX GmbH & Co. KG, Deutschland

**Zweck:**

- Domainverwaltung für `disaai.de`
- DNS-Dienste

**Verarbeitete Daten:**

- Technische DNS-Anfragedaten
- IP-Adressen bei DNS-Lookup

**Rechtsgrundlage:** Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an Domainbetrieb)

---

### 3.4 Resend (E-Mail-Versand)

**Dienstleister:** Resend, Inc., USA

**Zweck:**

- Versand von Feedback-E-Mails

**Verarbeitete Daten:**

- Feedback-Nachricht
- Optional: Nutzer-E-Mail-Adresse
- Metadaten (User-Agent, Zeitstempel)

**Rechtsgrundlage:** Art. 6 Abs. 1 lit. a DSGVO (Einwilligung durch Nutzung des Feedback-Formulars)

**Weitere Informationen:** [Resend Privacy Policy](https://resend.com/legal/privacy-policy)

---

## 4 Rechtsgrundlagen der Verarbeitung

| Zweck                                | Rechtsgrundlage                                                            |
| ------------------------------------ | -------------------------------------------------------------------------- |
| Chat-Funktion (OpenRouter API)       | Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)                             |
| Technische Zugriffsdaten, Sicherheit | Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse)                        |
| Cloudflare Web Analytics             | Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an Performance-Analyse) |
| Feedback-Funktion                    | Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)                                  |
| Optionaler eigener API-Key           | Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)                                  |

**Widerruf der Einwilligung:**

- API-Key: In den Einstellungen entfernen
- Feedback: Nicht mehr nutzen (bereits versendete E-Mails können nicht zurückgezogen werden)

---

## 5 Datenübermittlungen in Drittstaaten

**USA (Drittland):**

- Cloudflare Inc. (USA)
- OpenRouter Inc. (USA)
- Resend Inc. (USA)

**Wichtiger Hinweis:**
Laut Europäischem Gerichtshof bieten die USA kein gleichwertiges Datenschutzniveau wie die EU. Cloudflare nutzt Standardvertragsklauseln und zusätzliche Schutzmaßnahmen. Für OpenRouter und Resend gelten deren eigene Datenschutzverpflichtungen.

**Durch die Nutzung der Anwendung willigen Sie in diese Übermittlungen ein.**

---

## 6 Speicherdauer und Löschung

| Datentyp                 | Speicherort       | Speicherdauer                                | Löschung                            |
| ------------------------ | ----------------- | -------------------------------------------- | ----------------------------------- |
| Chat-Verlauf, Settings   | Browser (lokal)   | Unbegrenzt, bis manuell gelöscht             | Browser-Daten für disaai.de löschen |
| API-Key (sessionStorage) | Browser (Session) | Bis Tab/Browser geschlossen                  | Automatisch beim Schließen          |
| OpenRouter Logs          | OpenRouter (USA)  | Siehe OpenRouter Privacy Policy              | Nicht durch uns steuerbar           |
| Cloudflare Logs          | Cloudflare (USA)  | Gemäß Cloudflare-Policy (kurz, für Security) | Automatisch nach Ablauf             |
| Feedback E-Mails         | Resend, Postfach  | Resend: kurz; Postfach: bis manuell gelöscht | E-Mail aus Postfach löschen         |

**Lokale Daten löschen:**

1. Browser-Einstellungen öffnen
2. "Cookies und Website-Daten löschen" für `disaai.de`
3. Alternativ: Browser-DevTools → Application → Storage → Clear Site Data

---

## 7 Ihre Rechte

Sie haben gegenüber uns und den eingesetzten Dienstleistern folgende Rechte:

### 7.1 Auskunft (Art. 15 DSGVO)

Sie können Auskunft darüber verlangen, welche personenbezogenen Daten wir verarbeiten.

### 7.2 Berichtigung (Art. 16 DSGVO)

Sollten Daten fehlerhaft sein, haben Sie ein Recht auf Berichtigung.

### 7.3 Löschung (Art. 17 DSGVO)

Sie können die Löschung Ihrer personenbezogenen Daten verlangen, soweit keine gesetzlichen Aufbewahrungspflichten entgegenstehen.

**Wichtig:** Wir speichern keine Chat-Daten auf unseren Servern. Für Löschungen bei OpenRouter oder den Modellanbietern müssen Sie sich direkt an diese Anbieter wenden.

### 7.4 Einschränkung der Verarbeitung (Art. 18 DSGVO)

Sie können die Einschränkung der Verarbeitung verlangen.

### 7.5 Datenübertragbarkeit (Art. 20 DSGVO)

Sie haben das Recht, Daten in einem strukturierten, gängigen Format zu erhalten.

### 7.6 Widerspruch (Art. 21 DSGVO)

Sie können aus Gründen, die sich aus Ihrer besonderen Situation ergeben, jederzeit der Verarbeitung personenbezogener Daten widersprechen.

### 7.7 Beschwerde bei einer Aufsichtsbehörde

Wenn Sie der Ansicht sind, dass die Verarbeitung Ihrer Daten gegen Datenschutzrecht verstößt, können Sie sich bei einer Datenschutzaufsichtsbehörde beschweren.

**Zuständige Behörde für uns:**
Berliner Beauftragte für Datenschutz und Informationsfreiheit
[https://www.datenschutz-berlin.de](https://www.datenschutz-berlin.de)

---

## 8 Sicherheit und Verschlüsselung

**Transportverschlüsselung:**

- Die Anwendung wird ausschließlich über **HTTPS** ausgeliefert
- Sicherheits-Header implementiert: CSP, HSTS, Permission-Policy

**CORS-Schutz:**

- Strikte Origin-Validierung für `/api/chat` und `/api/feedback`
- Nur erlaubte Domains können API-Anfragen stellen
- `Vary: Origin` Header für korrekte Caching-Behandlung

**Rate Limiting:**

- Feedback-Endpoint: 5 Anfragen / 10 Minuten (KV-basiert)
- Schutz vor Spam und Abuse

**Logging:**

- **Keine Logs von Chat-Inhalten** in Serverless Functions
- Nur technische Metadaten (Modellname, Status Codes)
- Keine Speicherung von API-Keys in Logs

**Wichtiger Hinweis:**
Die Vertraulichkeit Ihrer Eingaben kann **nicht garantiert** werden, da die Nachrichten an externe KI-Dienste übertragen werden. Nutzen Sie die Anwendung daher **nur für allgemeine Anfragen** und nicht für vertrauliche Geschäfts- oder Privatangelegenheiten.

---

## 9 Datenschutz-Disclaimer

Disa AI ist ein experimenteller Chat-Client, der externe KI-Anbieter nutzt.

**Wichtige Klarstellungen:**

- ❌ Wir garantieren **keine absolute Privatsphäre** für Chat-Inhalte
- ❌ Wir haben **keine Kontrolle** über Drittanbieter (OpenRouter, Modellanbieter)
- ✅ Lokale Speicherung und Cloudflare-Analytics sind datensparsam umgesetzt
- ✅ CORS-Schutz und Rate Limiting implementiert (Stand: 2026-02-07)
- ✅ Keine Logs von sensiblen Inhalten

**Prüfen Sie vor der Nutzung, ob Sie mit diesen Bedingungen einverstanden sind.**

---

## 10 Änderungen dieser Datenschutzerklärung

Wir behalten uns vor, diese Datenschutzerklärung anzupassen, um sie an geänderte Rechtslage oder Änderungen unserer Dienste anzupassen. Für erneute Besuche gilt jeweils die aktuelle Version.

**Letzte Änderung:** 2026-02-07 (Security-Updates: CORS, Rate Limiting, Streaming Performance)

---

## 11 Kontakt

Bei Fragen oder Anliegen zum Datenschutz wenden Sie sich bitte an:

**David Grunert**
E-Mail: grunert94@hotmail.com
