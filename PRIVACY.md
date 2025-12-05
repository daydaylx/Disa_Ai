# Datenschutzerklärung für disaai.de (Stand: 05. Dezember 2025)

Diese Datenschutzerklärung beschreibt, welche Daten bei der Nutzung von Disa AI (im Folgenden „Anwendung“ oder „wir“) verarbeitet werden, zu welchen Zwecken dies geschieht und welche Rechte Sie als betroffene Person haben. Die Anwendung ist ein webbasiertes Chat-Interface, das auf OpenRouter-Modelle zugreift und als Progressive-Web-App im Browser betrieben wird.

**Vorweg:** Die Marketing-Aussage „Deine Daten bleiben auf deinem Gerät“ ist irreführend. Ihre Eingaben werden zwangsläufig an externe KI-Dienste weitergeleitet. Bitte lesen Sie die folgenden Abschnitte sorgfältig und verzichten Sie darauf, vertrauliche Informationen in die Chat-Felder einzutragen.

## 1 Verantwortliche Stelle und Kontakt

David Grunert  
E-Mail: grunert94@hotmail.com

Die Anwendung wird privat betrieben. Es besteht daher keine gesetzliche Verpflichtung zur Benennung eines Datenschutzbeauftragten. Bei Fragen zum Datenschutz können Sie sich aber jederzeit an die obige Adresse wenden.

## 2 Welche Daten werden verarbeitet?

### 2.1 Nutzereingaben und Chat-Daten

Wenn Sie im Chat Texte eingeben, werden diese zusammen mit den von Ihnen gewählten Einstellungen (z. B. Modellname, Temperatur) an einen Serverless-Proxy gesendet, der die Anfrage an die Plattform OpenRouter weiterleitet. Der Quellcode der Funktion in unserem Repository zeigt, dass der Proxy Ihre Chat-Nachrichten unverändert an die OpenRouter-API schickt und dabei unseren API-Schlüssel sowie einen HTTP-Referer mit der Herkunfts-URL übermittelt.  
Die OpenRouter-Plattform wiederum leitet Ihre Eingaben an den jeweils ausgewählten Modellanbieter (z. B. OpenAI, Mistral, Anthropic) weiter. Wir haben keinerlei Kontrolle darüber, ob diese Anbieter Ihre Inhalte speichern oder für Trainingszwecke nutzen. Laut der OpenRouter-Privacy-Policy (Stand April 2025) sammelt OpenRouter personenbezogene Daten, speichert Kopien Ihrer Anfragen und kann Tracking-Technologien einsetzen. Zusätzlich gibt OpenRouter an, dass die einzelnen Modellanbieter eigene, teils abweichende Datenrichtlinien haben und Sie sich dort informieren müssen.

**Wichtig:** Wenn Sie im Chat personenbezogene Daten (z. B. Namen, Adressen, Gesundheits- oder Finanzdaten) eingeben, gelangen diese an OpenRouter und möglicherweise an Drittanbieter. Wir raten dringend davon ab, vertrauliche Informationen einzugeben.

### 2.2 Lokale Speicherung im Browser

Die Anwendung speichert verschiedene Datensätze in Ihrem Browser (LocalStorage/SessionStorage). In der Datei `storageKeys.ts` sind die Schlüssel definiert. Dazu gehören u. a.:

- Konversationen und Metadaten (`disa:conversations`, `disa:conversations:metadata`, `disa:last-conversation-id`)
- Nutzerpräferenzen, Theme-Einstellungen und Favoriten (`disa-ai-settings`, `disa:theme-preference`, `disa:favorites-data`)
- API-Schlüssel (falls Sie einen eigenen OpenRouter-API-Key verwenden)
- Analyse-Events und Sitzungen (`disa:usage-analytics`, `disa:analytics-events`)

Diese Informationen verbleiben auf Ihrem Gerät und werden nicht an uns übertragen. Sie können die gespeicherten Daten jederzeit löschen, indem Sie in Ihrem Browser die Website-Daten (Cookies und Site Data) für disaai.de löschen. Beachten Sie, dass der Chat-Verlauf dann verloren geht.

### 2.3 Technische Zugriffsdaten

Beim Aufruf der Anwendung verarbeiten unsere technischen Dienstleister automatisch Protokoll- und Verbindungsdaten, um die Seite auszuliefern und vor Angriffen zu schützen. Dazu gehören insbesondere IP-Adresse, Browser-Typ, Betriebssystem, angeforderte Ressourcen sowie Datum und Uhrzeit des Zugriffs. Diese Daten werden aus Sicherheitsgründen benötigt und begründen ein berechtigtes Interesse gemäß Art. 6 Abs. 1 lit. f DSGVO.

## 3 Eingesetzte Dienstleister und Drittanbieter

### 3.1 Cloudflare (Hosting und Content Delivery Network)

Unsere Anwendung wird über Cloudflare Pages gehostet. Cloudflare sorgt für die Bereitstellung der statischen Inhalte, die Abwehr von DDoS-Angriffen und die Auslieferung über ein weltweites CDN. Die in der Datei `_headers` definierte Content-Security-Policy erlaubt Verbindungen zu `static.cloudflareinsights.com` und `cloudflareinsights.com`. Cloudflare verarbeitet technische Daten wie IP-Adresse, Browser-Typ, Zeitstempel und angeforderte Ressourcen.

Darüber hinaus ist in der Anwendung Cloudflare Web Analytics (früher „Browser Insights“) aktiv. Laut Cloudflare handelt es sich um eine „privacy-first“-Lösung: Das Unternehmen erhebt keine Cookies und verwendet keine clientseitigen Speichermechanismen; IP-Adresse und User-Agent werden nicht zur Erstellung von Nutzerprofilen genutzt. Cloudflare erhebt anonyme Metriken (z. B. Seitenaufrufe, Ladezeiten) zur Analyse der Performance. Wir nutzen diese Statistiken, um die Stabilität und Geschwindigkeit der Anwendung zu verbessern.

### 3.2 OpenRouter und Modellanbieter

Wie oben erläutert, werden Ihre Chat-Eingaben an OpenRouter weitergeleitet, das wiederum diverse KI-Modelle bereitstellt. OpenRouter erhebt und speichert persönliche Daten, einschließlich Ihrer Eingaben, sowie technische Metadaten wie IP-Adresse, Browser-Informationen und Cookies. Wir haben keinen Einfluss auf die Datenverarbeitungs- und Retentionspraxis der einzelnen Modellanbieter; OpenRouter informiert lediglich darüber, dass die Nutzungsbedingungen je nach Provider variieren.

### 3.3 INWX (Domain-Provider)

Die Domain disaai.de wird über INWX GmbH & Co. KG verwaltet. INWX verarbeitet technische Daten (z. B. IP-Adresse, DNS-Anfragen) zur Domainverwaltung. Diese Verarbeitung erfolgt im berechtigten Interesse gemäß Art. 6 Abs. 1 lit. f DSGVO.

### 3.4 Feedback-Seite

Im Feedback-Formular können Sie Ideen, Fehler oder UI-Vorschläge übermitteln. Der Quellcode zeigt, dass Ihre Nachricht clientseitig an eine fiktive „API“ gesendet wird und anonymisierte technische Details (Browser- und Geräteinformationen) angehängt werden. In der aktuellen Version erfolgt keine tatsächliche Übertragung an einen Server, sondern lediglich eine Simulation. Wenn künftig eine echte API verwendet wird, werden Ihre Angaben und die technischen Details entsprechend an diesen Dienstleister übermittelt. Nutzen Sie das Feedback-Formular nur, wenn Sie damit einverstanden sind.

## 4 Rechtsgrundlagen der Verarbeitung

- **Erbringung des Dienstes (Vertragsdurchführung):** Die Verarbeitung Ihrer Chat-Eingaben und der technische Betrieb der Anwendung erfolgen, um Ihnen die angefragte Funktion zu liefern. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO.
- **Berechtigtes Interesse:** Die Erhebung von technischen Zugriffsdaten und die Nutzung von Cloudflare Web Analytics dienen der Sicherheit und Leistungsanalyse unserer Website. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO.
- **Einwilligung für optionale Funktionen:** Wenn Sie einen eigenen OpenRouter-API-Key hinterlegen oder bestimmte Modelle nutzen, erfolgt die Verarbeitung Ihrer Daten auf Grundlage Ihrer Einwilligung gemäß Art. 6 Abs. 1 lit. a DSGVO. Sie können die Einwilligung jederzeit widerrufen, indem Sie den API-Key aus den Einstellungen entfernen.

## 5 Datenübermittlungen in Drittstaaten

Cloudflare Inc. und OpenRouter Inc. haben ihren Sitz in den USA. Bei der Nutzung der Anwendung werden Ihre Daten an Server außerhalb der Europäischen Union übermittelt. Für Cloudflare bestehen Standardvertragsklauseln und zusätzliche Maßnahmen; Cloudflare verspricht ein hohes Datenschutzniveau, weist jedoch darauf hin, dass die USA aus Sicht des Europäischen Gerichtshofs kein gleichwertiges Datenschutzniveau bieten. OpenRouter unterliegt US-Recht. Wir haben keinen Einfluss auf deren Verarbeitung. Durch die Nutzung der KI-Funktionen willigen Sie in diese Übermittlung ein.

## 6 Speicherdauer und Löschung

- **Lokaler Speicher:** Chat-Verläufe, Einstellungen und Favoriten verbleiben dauerhaft in Ihrem Browser, bis Sie diese manuell löschen. Wir speichern keine Kopie.
- **OpenRouter und Modellanbieter:** Wir erhalten keine Informationen darüber, wie lange OpenRouter oder die angeschlossenen Anbieter Ihre Daten aufbewahren. Laut deren eigenen Angaben wird ein Teil der Logs zu Analyse- und Sicherheitszwecken gespeichert.
- **Server-Logs und Cloudflare-Analytics:** Technische Zugriffsdaten werden für Sicherheitszwecke gespeichert und anschließend automatisch gelöscht. Cloudflare beschreibt, dass seine Web-Analytics keine Identifikation einzelner Nutzer ermöglicht und keine langfristigen Profile anlegt.

## 7 Ihre Rechte

Sie haben gegenüber uns und den eingesetzten Dienstleistern folgende Rechte:

- Auskunft (Art. 15 DSGVO) – Sie können Auskunft darüber verlangen, welche personenbezogenen Daten wir verarbeiten.
- Berichtigung (Art. 16 DSGVO) – Sollten Daten fehlerhaft sein, haben Sie ein Recht auf Berichtigung.
- Löschung (Art. 17 DSGVO) – Sie können die Löschung Ihrer personenbezogenen Daten verlangen, soweit keine gesetzlichen Aufbewahrungspflichten entgegenstehen. Beachten Sie, dass wir keine Chat-Daten speichern; für Löschungen bei OpenRouter oder den Modellanbietern müssen Sie sich an diese Anbieter wenden.
- Einschränkung der Verarbeitung (Art. 18 DSGVO) – Sie können die Einschränkung der Verarbeitung verlangen.
- Datenübertragbarkeit (Art. 20 DSGVO) – Sie haben das Recht, Daten in einem strukturierten, gängigen Format zu erhalten.
- Widerspruch (Art. 21 DSGVO) – Sie können aus Gründen, die sich aus Ihrer besonderen Situation ergeben, jederzeit der Verarbeitung personenbezogener Daten widersprechen.
- Beschwerde bei einer Aufsichtsbehörde – Wenn Sie der Ansicht sind, dass die Verarbeitung Ihrer Daten gegen Datenschutzrecht verstößt, können Sie sich bei einer Datenschutzaufsichtsbehörde beschweren. Zuständig für uns ist die Berliner Beauftragte für Datenschutz und Informationsfreiheit (https://www.datenschutz-berlin.de).

## 8 Sicherheit und Verschlüsselung

Die Anwendung wird ausschließlich über HTTPS ausgeliefert; dadurch wird der Transportweg verschlüsselt. Wir haben zusätzliche Sicherheits-Header implementiert (u. a. CSP, HSTS und Permission-Policy). Dennoch sollten Sie sich darüber im Klaren sein, dass die Vertraulichkeit Ihrer Eingaben nicht gewährleistet werden kann, da die Nachrichten an externe KI-Dienste übertragen werden und dort verarbeitet werden. Nutzen Sie die Anwendung daher nur für allgemeine Anfragen und nicht für vertrauliche Geschäfts- oder Privatangelegenheiten.

**Fazit:** Disa AI ist ein experimenteller Chat-Dienst, der externe KI-Anbieter nutzt. Lokale Speicherung und Cloudflare-Analytics sind datensparsam umgesetzt, allerdings verlassen Ihre Eingaben spätestens beim Aufruf der OpenRouter-API Ihr Gerät. Eine „garantiert private“ Nutzung, wie in der Werbeaussage suggeriert, existiert daher nicht. Prüfen Sie vor der Nutzung, ob Sie dieses Risiko eingehen möchten.
