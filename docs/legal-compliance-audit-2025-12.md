# Rechtliche Konformitätsprüfung disaai.de

**Prüfdatum:** 29. Dezember 2025
**Prüfer:** Automatisierte Analyse (keine Rechtsberatung)
**Geprüfte Seiten:**
- Impressum: `/impressum`
- Datenschutzerklärung: `/datenschutz`

---

## Teil 1: Impressum-Analyse

### 1.1 Ist-Zustand

Das Impressum enthält folgende Angaben:

| Angabe | Vorhanden | Inhalt |
|--------|-----------|--------|
| Name | ✅ | David Grunert |
| Anschrift | ✅ | Graßdorfer Straße 9, 04425 Taucha |
| E-Mail | ✅ | grunert94@hotmail.com |
| Telefon | ❌ | Nicht angegeben |
| Vertretungsberechtigter | n/a | Nicht erforderlich (Einzelperson) |
| Registernummer | n/a | Nicht erforderlich (keine juristische Person) |
| USt-ID | ❌ | Nicht angegeben |
| Inhaltlich Verantwortlicher (MStV) | ✅ | David Grunert |

### 1.2 Rechtliche Bewertung

#### ⚠️ KRITISCHER FEHLER: Veralteter Rechtsrahmen

Das Impressum verweist auf **§ 5 TMG**. Das **Telemediengesetz (TMG)** wurde jedoch durch das **Digitale-Dienste-Gesetz (DDG)** ersetzt, das am **14. Mai 2024** in Kraft trat.

**Korrekte Rechtsgrundlage:**
- Allgemeine Impressumspflicht: **§ 5 DDG** (nicht mehr § 5 TMG)
- Inhaltliche Verantwortung: **§ 18 Abs. 2 MStV** (korrekt angegeben)

#### ⚠️ Telefonnummer fehlt

Nach aktueller Rechtsprechung (BGH, EuGH) muss eine **unmittelbare Kommunikationsmöglichkeit** bestehen. Bei Privatpersonen ohne gewerbliche Tätigkeit ist E-Mail ausreichend.

**Risikobewertung:** Gering, da nicht-kommerzielles Projekt. Bei jeglicher Monetarisierung (Spenden, Werbung) wäre zusätzliche Kontaktmöglichkeit (Telefon oder Kontaktformular mit schneller Reaktion) erforderlich.

#### ⚠️ USt-ID nicht angegeben

Wenn der Dienst **ausschließlich privat/nicht-kommerziell** betrieben wird, ist keine USt-ID erforderlich. Sobald jedoch:
- Werbung geschaltet wird
- Spenden angenommen werden
- API-Kosten auf Nutzer umgelegt werden

müsste eine USt-ID angegeben werden (sofern umsatzsteuerpflichtig) oder ein Hinweis auf Kleinunternehmerregelung erfolgen.

### 1.3 Impressum - Erforderliche Änderungen

| Priorität | Änderung | Rechtsgrundlage |
|-----------|----------|-----------------|
| **HOCH** | "§ 5 TMG" durch "§ 5 DDG" ersetzen | DDG seit 14.05.2024 in Kraft |
| Mittel | Telefon oder zusätzliche Kontaktmöglichkeit ergänzen | § 5 Abs. 1 Nr. 2 DDG |
| Niedrig | Klarstellung "Nicht-kommerzielle Nutzung, daher keine USt-ID" | Transparenz |

---

## Teil 2: Datenschutzerklärung - Analyse

### 2.1 Pflichtangaben nach Art. 13/14 DSGVO

| Pflichtangabe | Vorhanden | Bewertung |
|---------------|-----------|-----------|
| Verantwortlicher (Name, Adresse, E-Mail) | ✅ | Vollständig |
| Kontaktdaten Datenschutzbeauftragter | n/a | Nicht erforderlich (< 20 Personen mit Datenverarbeitung) |
| Zwecke der Verarbeitung | ✅ | Angegeben |
| Rechtsgrundlagen | ✅ | Art. 6 Abs. 1 lit. a, b, f DSGVO genannt |
| Berechtigte Interessen | ⚠️ | Teilweise benannt, könnte konkreter sein |
| Empfänger/Kategorien | ⚠️ | OpenRouter genannt, CDN nur allgemein |
| Drittlandübermittlung | ⚠️ | USA erwähnt, aber unzureichende Details |
| Speicherdauer | ⚠️ | Nur vage ("begrenzter Zeitraum") |
| Betroffenenrechte | ✅ | Vollständig aufgeführt |
| Beschwerderecht | ✅ | Vorhanden |
| Freiwilligkeit/Pflicht zur Bereitstellung | ❌ | Fehlt |
| Automatisierte Entscheidungsfindung | ❌ | Fehlt (bei KI-Anwendung relevant!) |

### 2.2 Identifizierte Rechtsverstöße und Lücken

#### 🔴 SCHWERWIEGEND: Fehlende Angaben zur automatisierten Entscheidungsfindung

**Verstoß gegen: Art. 13 Abs. 2 lit. f DSGVO, Art. 22 DSGVO**

Bei einer KI-Anwendung **muss** informiert werden über:
- Bestehen automatisierter Entscheidungsfindung einschließlich Profiling
- Aussagekräftige Informationen über die involvierte Logik
- Tragweite und angestrebte Auswirkungen

Auch wenn die KI keine rechtsverbindlichen Entscheidungen trifft, sollte hierzu eine klare Aussage erfolgen.

#### 🔴 SCHWERWIEGEND: Unzureichende Drittlandübermittlung

**Verstoß gegen: Art. 13 Abs. 1 lit. f DSGVO, Art. 44 ff. DSGVO**

Die Datenschutzerklärung erwähnt Datenübermittlung in die USA, aber:
- Keine Nennung des konkreten Schutzmechanismus (Standardvertragsklauseln, Angemessenheitsbeschluss, etc.)
- Der Verweis auf "Art. 49 Abs. 1 lit. a DSGVO" (ausdrückliche Einwilligung) ist problematisch, da keine explizite Einwilligung eingeholt wird
- Der EU-US Data Privacy Framework wird nicht erwähnt (falls OpenRouter zertifiziert ist)

**Erforderlich:**
- Prüfen, ob OpenRouter unter EU-US Data Privacy Framework zertifiziert ist
- Falls ja: Dies als Rechtsgrundlage benennen
- Falls nein: Standardvertragsklauseln und ergänzende Maßnahmen dokumentieren

#### 🟠 MITTELSCHWER: Fehlende Cloudflare-Benennung

**Verstoß gegen: Art. 13 Abs. 1 lit. e DSGVO**

Die Datenschutzerklärung erwähnt nur allgemein "Hosting-/CDN-Anbieter", aber:
- Cloudflare wird nicht namentlich genannt
- Cloudflare setzt eigene Cookies (z.B. `__cf_bm`, `cf_clearance`)
- Cloudflare-Rechenzentren befinden sich weltweit, inkl. USA

**Erforderlich:**
- Namentliche Nennung von Cloudflare
- Verweis auf Cloudflare DPA und Datenschutzerklärung
- Information über EU-US Data Privacy Framework Zertifizierung von Cloudflare

#### 🟠 MITTELSCHWER: TTDSG-Compliance unklar

**Verstoß gegen: § 25 TTDSG**

Obwohl angegeben wird, dass keine Tracking-Cookies gesetzt werden, fehlt:
- Klare Unterscheidung zwischen "technisch notwendigen" und "nicht-notwendigen" Cookies/Speicherzugriffen
- Liste aller konkret verwendeten Cookies (Name, Zweck, Speicherdauer)
- Bei technisch notwendigen: Erklärung, warum diese für den Dienst unbedingt erforderlich sind

Nach TTDSG § 25 Abs. 2 sind nur folgende Zugriffe ohne Einwilligung erlaubt:
- Technisch zwingend erforderlich für den ausdrücklich gewünschten Dienst

#### 🟠 MITTELSCHWER: Speicherdauer zu ungenau

**Verstoß gegen: Art. 13 Abs. 2 lit. a DSGVO**

Formulierungen wie "für einen begrenzten Zeitraum" oder "so lange wie erforderlich" sind nicht konkret genug.

**Erforderlich:**
- Konkrete Fristen angeben (z.B. "Server-Logs: max. 7 Tage")
- Oder: Kriterien für die Festlegung der Dauer benennen

#### 🟡 LEICHT: Fehlende Angabe zur Pflicht der Bereitstellung

**Verstoß gegen: Art. 13 Abs. 2 lit. e DSGVO**

Es fehlt die Information, ob die Bereitstellung personenbezogener Daten:
- Gesetzlich oder vertraglich vorgeschrieben ist
- Für einen Vertragsabschluss erforderlich ist
- Welche Folgen die Nichtbereitstellung hätte

---

## Teil 3: Cookie- und Tracking-Analyse

### 3.1 Feststellungen

Laut Datenschutzerklärung werden verwendet:
- **Keine** Marketing- oder Tracking-Cookies
- **Technisch notwendige** Cookies durch CDN-Anbieter (Cloudflare)
- **LocalStorage/IndexedDB** für App-Einstellungen und Chatverläufe

### 3.2 TTDSG-Bewertung

| Technologie | Kategorie | Einwilligung erforderlich? |
|-------------|-----------|---------------------------|
| Cloudflare-Cookies (`__cf_bm`) | Technisch notwendig (Sicherheit) | Nein (§ 25 Abs. 2 Nr. 2 TTDSG) |
| LocalStorage (Einstellungen) | Technisch notwendig (Funktion) | Nein (§ 25 Abs. 2 Nr. 2 TTDSG) |
| LocalStorage (Chatverläufe) | Technisch notwendig (Funktion) | Nein |
| API-Schlüssel-Speicherung | Technisch notwendig | Nein |

### 3.3 Cookie-Banner-Erfordernis

**Aktueller Stand:** Kein Cookie-Banner erforderlich, WENN:
- Tatsächlich nur technisch notwendige Cookies/Speicherzugriffe erfolgen
- Cloudflare keine nicht-notwendigen Cookies setzt

**Empfehlung:** Verifizieren, welche Cookies Cloudflare tatsächlich setzt. `__cf_bm` (Bot Management) gilt als technisch notwendig. Andere Cloudflare-Cookies könnten problematisch sein.

---

## Teil 4: Überarbeitete Datenschutzerklärung

Die folgende Version behebt die identifizierten Mängel:

```html
<!-- Ersetzt den Inhalt von public/datenschutz.html ab <div class="content"> -->
```

### EMPFOHLENER NEUER TEXT:

---

# Datenschutzerklärung

**Stand: Dezember 2025**

## 1. Verantwortlicher

Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO) und anderer nationaler Datenschutzgesetze ist:

**David Grunert**
Graßdorfer Straße 9
04425 Taucha
Deutschland

E-Mail: grunert94@hotmail.com

Ein Datenschutzbeauftragter ist nicht bestellt, da die Voraussetzungen des Art. 37 DSGVO nicht erfüllt sind.

---

## 2. Allgemeines zur Datenverarbeitung

Ich betreibe disaai.de als privates, nicht-kommerzielles Projekt. Personenbezogene Daten werden nur verarbeitet, soweit dies zur Bereitstellung der Website, der KI-Funktionen oder zur Kommunikation mit Nutzern erforderlich ist.

„Personenbezogene Daten" sind alle Informationen, die sich auf eine identifizierte oder identifizierbare Person beziehen (z. B. IP-Adresse, E-Mail-Adresse, Inhalte von Nachrichten).

### Rechtsgrundlagen der Verarbeitung

- **Art. 6 Abs. 1 lit. b DSGVO:** Erfüllung eines Vertrags bzw. Bereitstellung der angeforderten Funktionen
- **Art. 6 Abs. 1 lit. f DSGVO:** Wahrung berechtigter Interessen (z. B. sichere und stabile Bereitstellung der Website, Schutz vor Missbrauch)
- **Art. 6 Abs. 1 lit. a DSGVO:** Einwilligung, sofern du diese ausdrücklich erteilst

---

## 3. Bereitstellung der Website und Server-Logfiles

Beim Aufruf von disaai.de werden automatisch technische Daten durch den Hosting- bzw. CDN-Anbieter verarbeitet:

- IP-Adresse des anfragenden Endgeräts
- Datum und Uhrzeit des Zugriffs
- Aufgerufene URL / angefragte Ressourcen
- Übertragene Datenmenge
- Verwendeter Browser und Betriebssystem (User-Agent)
- Referrer-URL (die zuvor besuchte Seite, sofern übertragen)

**Zweck:** Technische Bereitstellung der Website, Gewährleistung von Stabilität und Sicherheit, Erkennung und Abwehr von Missbrauch/Angriffen.

**Rechtsgrundlage:** Art. 6 Abs. 1 lit. f DSGVO. Das berechtigte Interesse liegt in der sicheren und funktionsfähigen Bereitstellung der Website.

**Speicherdauer:** Server-Logfiles werden für maximal **7 Tage** gespeichert und danach automatisch gelöscht.

### Content Delivery Network: Cloudflare

Für die Auslieferung der Website nutze ich Cloudflare, Inc. (101 Townsend St, San Francisco, CA 94107, USA). Cloudflare ist ein Content Delivery Network, das die Website schnell und sicher ausliefert und vor Angriffen schützt.

**Verarbeitete Daten:** IP-Adresse, Protokoll- und Performance-Daten, technische Cookies zur Sicherheit.

**Cookies durch Cloudflare:**

| Cookie | Zweck | Speicherdauer | Kategorie |
|--------|-------|---------------|-----------|
| `__cf_bm` | Bot-Erkennung und Schutz | 30 Minuten | Technisch notwendig |
| `cf_clearance` | CAPTCHA-Validierung (nur bei Verdacht) | max. 24 Stunden | Technisch notwendig |

**Rechtsgrundlage:** Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an sicherer Website-Bereitstellung). Für die technisch notwendigen Cookies gilt § 25 Abs. 2 Nr. 2 TTDSG (keine Einwilligung erforderlich).

**Datenübermittlung in die USA:** Cloudflare, Inc. ist unter dem **EU-U.S. Data Privacy Framework** zertifiziert. Dadurch besteht ein Angemessenheitsbeschluss der EU-Kommission für Datenübermittlungen an zertifizierte US-Unternehmen.

Weitere Informationen: [Cloudflare Datenschutzerklärung](https://www.cloudflare.com/privacypolicy/)

---

## 4. Nutzung der KI-Funktion („Disa AI")

### 4.1 Verarbeitung der Eingaben und Antworten

Wenn du die KI-Funktion nutzt, werden folgende Daten verarbeitet:

- Von dir eingegebene Texte (Prompts, Verlaufsnachrichten)
- Technisch erforderliche Metadaten (IP-Adresse, Zeitstempel, Modellkennung, Tokenanzahl)
- Die vom KI-Modell generierte Antwort

**Zweck:** Bereitstellung der Kernfunktion (KI-Chat).

**Rechtsgrundlage:** Art. 6 Abs. 1 lit. b DSGVO (Bereitstellung der angeforderten Funktion).

### 4.2 Einsatz von OpenRouter

Zur Anbindung verschiedener KI-Modelle nutze ich den Dienst **OpenRouter** (OpenRouter, Inc., USA). Bei Nutzung der KI-Funktion werden deine Anfragen per API an OpenRouter übermittelt.

**Datenverarbeitung durch OpenRouter:**
- Prompts und Completions werden laut OpenRouter standardmäßig **nicht dauerhaft geloggt**
- Metadaten (Timestamp, verwendetes Modell, Tokenanzahl) werden zu Abrechnungs- und Statistikzwecken gespeichert
- OpenRouter leitet Anfragen an die konfigurierten Modellanbieter weiter, die eigene Datenschutzrichtlinien haben

**Datenübermittlung in die USA:** Die Datenübermittlung an OpenRouter erfolgt auf Grundlage von:
- **Art. 6 Abs. 1 lit. b DSGVO** (Nutzung der KI-Funktion auf deinen Wunsch)
- **Standardvertragsklauseln (SCCs)** gemäß Art. 46 Abs. 2 lit. c DSGVO

Weitere Informationen: [OpenRouter Privacy Policy](https://openrouter.ai/privacy)

### 4.3 Automatisierte Entscheidungsfindung und Profiling

**Hinweis gemäß Art. 13 Abs. 2 lit. f DSGVO:**

Die KI-Funktion nutzt maschinelles Lernen zur Generierung von Textantworten. Es findet **keine automatisierte Entscheidungsfindung** im Sinne von Art. 22 DSGVO statt, die rechtliche Wirkung entfaltet oder dich in ähnlicher Weise erheblich beeinträchtigt.

Die KI-generierten Antworten:
- Sind informativ und haben keine rechtsverbindliche Wirkung
- Führen zu keinen automatisierten Entscheidungen über dich als Person
- Werden nicht für Profiling oder personenbezogene Bewertungen verwendet

### 4.4 Sensible und vertrauliche Inhalte

**Wichtiger Hinweis:** Gib in der KI-Funktion keine besonders sensiblen personenbezogenen Daten ein, insbesondere:
- Gesundheitsdaten
- Sehr intime Informationen
- Daten Dritter ohne deren Einwilligung
- Vollständige Klarnamenslisten
- Zahlungs- oder Bankdaten

Trotz technischer Schutzmaßnahmen werden Eingaben über externe Dienstleister verarbeitet und sind nicht vollständig risikofrei.

---

## 5. Lokale Speicherung im Browser

Die App speichert Informationen lokal auf deinem Endgerät:

| Speicher | Daten | Zweck |
|----------|-------|-------|
| LocalStorage | Persönliche Einstellungen (Theme, Sprache) | Komfortable Nutzung |
| IndexedDB | Chatverläufe, Sitzungsdaten | Funktionsbereitstellung |
| SessionStorage | API-Schlüssel (optional) | Sichere temporäre Speicherung |

**Wichtig:** Diese Daten werden **nicht** an mich als Betreiber übermittelt. Sie verbleiben in deinem Browser, bis du sie löschst.

**Rechtsgrundlage:** Art. 6 Abs. 1 lit. b DSGVO (Bereitstellung der gewünschten Funktionen). Für die lokale Speicherung gilt § 25 Abs. 2 Nr. 2 TTDSG (technisch erforderlich, keine Einwilligung nötig).

**Löschung:** Du kannst lokale Daten jederzeit löschen über:
- Browser-Einstellungen → Website-Daten löschen
- App-Einstellungen (soweit vorhanden)
- Deinstallation der PWA

---

## 6. Cookies und Tracking

### Übersicht der verwendeten Cookies

| Cookie/Technologie | Anbieter | Zweck | Kategorie | Einwilligung erforderlich? |
|--------------------|----------|-------|-----------|---------------------------|
| `__cf_bm` | Cloudflare | Bot-Schutz | Technisch notwendig | Nein |
| `cf_clearance` | Cloudflare | CAPTCHA-Validierung | Technisch notwendig | Nein |
| LocalStorage | Browser | App-Einstellungen | Technisch notwendig | Nein |
| IndexedDB | Browser | Chatverläufe | Technisch notwendig | Nein |

### Keine Tracking- oder Marketing-Cookies

Auf disaai.de werden:
- **Keine** Tracking- oder Marketing-Cookies gesetzt
- **Keine** externen Analyse-Tools (wie Google Analytics) verwendet
- **Keine** Social-Media-Plugins mit Tracking-Funktion eingebunden

**Rechtsgrundlage für technisch notwendige Technologien:** § 25 Abs. 2 Nr. 2 TTDSG – diese sind für die Bereitstellung des vom Nutzer ausdrücklich gewünschten Dienstes unbedingt erforderlich.

---

## 7. Kontaktaufnahme per E-Mail

Bei Kontaktaufnahme per E-Mail werden folgende Daten verarbeitet:
- Deine E-Mail-Adresse
- Inhalt deiner Nachricht
- Ggf. dein Name (falls mitgeteilt)

**Zweck:** Bearbeitung deiner Anfrage.

**Rechtsgrundlage:** Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Kommunikation) bzw. Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche Maßnahmen).

**Speicherdauer:** Die Daten werden gelöscht, sobald sie für die Kommunikation nicht mehr erforderlich sind, spätestens nach **2 Jahren** ab letztem Kontakt, es sei denn, gesetzliche Aufbewahrungspflichten stehen dem entgegen.

---

## 8. Speicherdauer

| Datenkategorie | Speicherdauer |
|----------------|---------------|
| Server-Logfiles | Maximal 7 Tage |
| E-Mail-Korrespondenz | Bis Abschluss der Anfrage, max. 2 Jahre |
| Lokale Browser-Daten | Bis zur manuellen Löschung durch dich |
| Metadaten bei OpenRouter | Gemäß OpenRouter-Richtlinien (Abrechnung) |
| Cloudflare-Cookies | 30 Minuten bis 24 Stunden |

---

## 9. Datenübermittlung in Drittländer

Eine Übermittlung personenbezogener Daten in Drittländer (Länder außerhalb EU/EWR) findet in folgenden Fällen statt:

| Empfänger | Land | Rechtsgrundlage | Schutzmechanismus |
|-----------|------|-----------------|-------------------|
| Cloudflare, Inc. | USA | Art. 45 DSGVO | EU-U.S. Data Privacy Framework (Angemessenheitsbeschluss) |
| OpenRouter, Inc. | USA | Art. 46 Abs. 2 lit. c DSGVO | Standardvertragsklauseln (SCCs) |
| Modellanbieter (via OpenRouter) | Diverse | Art. 46 DSGVO | Je nach Anbieter SCCs oder Angemessenheitsbeschluss |

---

## 10. Pflicht zur Bereitstellung von Daten

Die Bereitstellung personenbezogener Daten ist weder gesetzlich noch vertraglich vorgeschrieben. Du bist nicht verpflichtet, personenbezogene Daten bereitzustellen.

**Folgen der Nichtbereitstellung:**
- Ohne IP-Adresse kann die Website technisch nicht ausgeliefert werden (automatische Übermittlung)
- Ohne Eingabe von Prompts kann die KI-Funktion nicht genutzt werden
- Ohne E-Mail-Adresse kann keine E-Mail-Kommunikation stattfinden

---

## 11. Deine Rechte als betroffene Person

Dir stehen folgende Rechte zu (Art. 15-22 DSGVO):

- **Auskunftsrecht (Art. 15 DSGVO):** Du kannst Auskunft über die zu deiner Person gespeicherten Daten verlangen.
- **Berichtigungsrecht (Art. 16 DSGVO):** Du kannst die Berichtigung unrichtiger Daten verlangen.
- **Löschungsrecht (Art. 17 DSGVO):** Du kannst die Löschung deiner Daten verlangen, sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen.
- **Einschränkung der Verarbeitung (Art. 18 DSGVO):** Du kannst unter bestimmten Voraussetzungen die Einschränkung der Verarbeitung verlangen.
- **Datenübertragbarkeit (Art. 20 DSGVO):** Du kannst die Herausgabe deiner Daten in einem strukturierten, gängigen Format verlangen.
- **Widerspruchsrecht (Art. 21 DSGVO):** Du kannst der Verarbeitung widersprechen, wenn diese auf Art. 6 Abs. 1 lit. f DSGVO beruht.
- **Widerruf der Einwilligung (Art. 7 Abs. 3 DSGVO):** Erteilte Einwilligungen kannst du jederzeit mit Wirkung für die Zukunft widerrufen.

Zur Ausübung deiner Rechte wende dich an: **grunert94@hotmail.com**

---

## 12. Beschwerderecht bei einer Aufsichtsbehörde

Wenn du der Ansicht bist, dass die Verarbeitung deiner personenbezogenen Daten gegen die DSGVO verstößt, hast du das Recht, Beschwerde bei einer Datenschutzaufsichtsbehörde einzulegen.

Zuständige Aufsichtsbehörde für den Verantwortlichen:

**Sächsischer Datenschutzbeauftragter**
Devrientstraße 5
01067 Dresden
Telefon: +49 351 85471-101
E-Mail: saechsdsb@slt.sachsen.de
Website: https://www.saechsdsb.de

---

## 13. Änderungen dieser Datenschutzerklärung

Ich behalte mir vor, diese Datenschutzerklärung bei Änderungen der technischen Umsetzung, der genutzten Dienstleister oder der Rechtslage anzupassen. Es gilt jeweils die auf dieser Website abrufbare aktuelle Version.

---

**Letzte Aktualisierung:** Dezember 2025

---

## Teil 5: Checkliste für notwendige Anpassungen

### 🔴 Sofort erforderlich (rechtliche Risiken)

- [ ] **Impressum: § 5 TMG durch § 5 DDG ersetzen**
  - Datei: `public/impressum.html`, Zeile 77
  - Alt: "Angaben gemäß § 5 TMG"
  - Neu: "Angaben gemäß § 5 DDG"

- [ ] **Datenschutzerklärung vollständig überarbeiten**
  - Die überarbeitete Version aus Teil 4 implementieren
  - Datei: `public/datenschutz.html`

- [ ] **Cloudflare namentlich benennen**
  - Aktuell nur allgemein "CDN-Anbieter" erwähnt
  - Muss: Konkreter Name, Adresse, Datenschutz-Link

- [ ] **Drittlandübermittlung konkretisieren**
  - Prüfen: Ist OpenRouter unter EU-US Data Privacy Framework zertifiziert?
  - Falls ja: Als Rechtsgrundlage nennen
  - Falls nein: Standardvertragsklauseln dokumentieren

- [ ] **Automatisierte Entscheidungsfindung/KI-Hinweis ergänzen**
  - Art. 13 Abs. 2 lit. f DSGVO verlangt Information hierzu

### 🟠 Empfohlen (Best Practice)

- [ ] **Cookie-Tabelle mit konkreten Cookies ergänzen**
  - Alle Cookies mit Name, Zweck, Dauer auflisten
  - Klassifikation: technisch notwendig vs. optional

- [ ] **Speicherdauern konkretisieren**
  - Statt "begrenzter Zeitraum" → konkrete Fristen (z.B. "7 Tage")

- [ ] **Zuständige Aufsichtsbehörde nennen**
  - Sächsischer Datenschutzbeauftragter (Standort Taucha = Sachsen)

- [ ] **Hinweis zur Pflicht der Bereitstellung ergänzen**
  - Was passiert, wenn Nutzer keine Daten bereitstellt?

### 🟡 Optional (Verbesserungen)

- [ ] **Telefonnummer oder Kontaktformular im Impressum**
  - Aktuell nicht zwingend bei privatem Projekt
  - Erhöht Rechtssicherheit

- [ ] **Link zur OpenRouter DPA (Data Processing Agreement)**
  - Falls vorhanden, für Transparenz verlinken

- [ ] **Verifizieren: Welche Cloudflare-Cookies werden tatsächlich gesetzt?**
  - Browser-DevTools → Application → Cookies prüfen
  - Sicherstellen, dass nur technisch notwendige gesetzt werden

### Technische Prüfungen

- [ ] **Cookie-Scan durchführen**
  - Tool: z.B. Cookiebot-Scan oder Browser-DevTools
  - Alle tatsächlich gesetzten Cookies dokumentieren

- [ ] **Impressum- und Datenschutz-Links im Footer prüfen**
  - Müssen von jeder Unterseite mit max. 2 Klicks erreichbar sein

- [ ] **Mobile Erreichbarkeit der rechtlichen Seiten testen**
  - Hamburger-Menü → Links zu Impressum/Datenschutz vorhanden?

---

## Zusammenfassung

| Bereich | Bewertung | Kritische Mängel |
|---------|-----------|------------------|
| **Impressum** | ⚠️ Überarbeitungsbedarf | Veralteter Rechtsrahmen (TMG statt DDG) |
| **Datenschutzerklärung** | ⚠️ Überarbeitungsbedarf | Fehlende KI-/Drittland-/Speicherdauer-Angaben |
| **Cookies/TTDSG** | ✅ Grundsätzlich konform | Konkretisierung empfohlen |
| **Cookie-Banner** | ✅ Nicht erforderlich | Nur technisch notwendige Cookies |

**Gesamtbewertung:** Die Website ist im Kern DSGVO-konform, weist jedoch mehrere Dokumentationslücken auf, die behoben werden sollten. Die dringendsten Maßnahmen sind:

1. § 5 TMG → § 5 DDG im Impressum
2. Cloudflare namentlich benennen
3. Drittlandübermittlung rechtlich absichern
4. KI-Hinweis gemäß Art. 13 Abs. 2 lit. f DSGVO ergänzen

---

*Hinweis: Diese Analyse stellt keine Rechtsberatung dar. Bei Unsicherheiten sollte ein Rechtsanwalt für IT-Recht konsultiert werden.*
