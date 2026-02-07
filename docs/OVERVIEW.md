# Disa AI – Übersicht

Diese Dokumentation erklärt die App-Nutzung aus Anwender-Perspektive.

---

## Was ist Disa AI?

Disa AI ist ein KI-Chat-Client, der verschiedene Sprachmodelle (GPT-4, Claude, Mistral, etc.) über die OpenRouter-Plattform anspricht. Die App läuft vollständig im Browser, speichert Gespräche lokal und kann als PWA installiert werden.

**Typischer Anwendungsfall:**
- Recherche-Fragen an KI stellen
- Texte verfassen lassen (E-Mails, Artikel, Code)
- Verschiedene Modelle für verschiedene Aufgaben nutzen
- Persona/Rolle wählen, um den Gesprächskontext anzupassen

---

## App-Struktur

### Hauptseiten

```
┌─────────────────────────────────────────┐
│  /chat            Hauptseite            │
│  ├─ Chat-Verlauf                        │
│  ├─ Eingabefeld                         │
│  └─ Quickstart (bei leerem Chat)        │
├─────────────────────────────────────────┤
│  /models          Modell-Explorer       │
│  ├─ Alle verfügbaren Modelle            │
│  ├─ Filter (Kosten, Provider, etc.)     │
│  └─ Modell-Details                      │
├─────────────────────────────────────────┤
│  /roles           Rollen & Personas     │
│  ├─ Vordefinierte Rollen                │
│  ├─ Favoriten                           │
│  └─ Rollen-Details                      │
├─────────────────────────────────────────┤
│  /themen          Quickstart-Themen     │
│  └─ Gesprächsstarter nach Kategorie     │
├─────────────────────────────────────────┤
│  /settings        Einstellungen         │
│  ├─ API & Daten                         │
│  ├─ Gedächtnis                          │
│  ├─ Verhalten                           │
│  ├─ Jugendschutz                        │
│  ├─ Darstellung                         │
│  └─ Extras                              │
└─────────────────────────────────────────┘
```

### Navigation

Die Navigation erfolgt über ein **Sidepanel** (rechts), das durch:
- **Hamburger-Menü** (oben rechts) geöffnet wird
- **Swipe-Geste** (von rechts nach links auf Mobile) geöffnet wird
- **Escape-Taste** oder Klick außerhalb geschlossen wird

---

## Chat-Funktionen

### Neues Gespräch starten

1. Öffne `/chat`
2. Bei leerem Chat erscheinen **Quickstart-Karten** mit Themenvorschlägen
3. Klicke auf ein Thema oder tippe direkt eine Frage

### Nachricht senden

- **Enter**: Nachricht senden
- **Shift+Enter**: Zeilenumbruch
- **Stop-Button**: Laufende Antwort abbrechen

### Chat-Verlauf

- Alle Gespräche werden automatisch lokal gespeichert (IndexedDB)
- Zugriff über `/chat/history`
- Gespräche können gelöscht oder exportiert werden

### Markdown in Antworten

KI-Antworten unterstützen:
- **Fett**, *kursiv*, ~~durchgestrichen~~
- Code-Blöcke mit Syntax-Highlighting
- Listen, Tabellen, Überschriften

---

## Modelle

### Modell wechseln

Das aktive Modell kann gewechselt werden über:
1. **Modelle-Seite** (`/models`)
2. **Einstellungen → Verhalten**

Der Modellwechsel gilt für neue Nachrichten im aktuellen Gespräch.

### Verfügbare Modelle

Die App zeigt nur **kostenlose Modelle** an (OpenRouter `:free`-Suffix oder Preis = 0). Dazu gehören typischerweise:
- GPT-4o Mini (OpenAI)
- Claude 3 Haiku (Anthropic)
- Gemini Flash (Google)
- Mistral-Modelle
- Llama-Modelle

### Modell-Filter

Auf der Modelle-Seite können Filter gesetzt werden:
- Provider (OpenAI, Anthropic, Google, etc.)
- Kontext-Länge
- Fähigkeiten (Vision, Function Calling, etc.)

---

## Rollen & Personas

### Was sind Rollen?

Rollen sind vordefinierte **System-Prompts**, die das Verhalten der KI steuern. Beispiele:
- **Recherche-Assistent**: Sachlich, mit Quellenangaben
- **Berufsberater**: Empathisch, karrierefokussiert
- **Code-Reviewer**: Technisch, kritisch
- **Kreativ-Coach**: Ideenreich, inspirierend

### Rolle wählen

1. Öffne `/roles`
2. Durchsuche die Rollen-Karten
3. Klicke auf eine Rolle, um sie zu aktivieren
4. Die Rolle gilt für das nächste neue Gespräch

### Favoriten

Häufig genutzte Rollen können als Favoriten markiert werden (Stern-Icon).

### Jugendschutz & Rollen

Bei aktiviertem Jugendschutz werden bestimmte Rollen (z.B. unzensierte Personas) ausgeblendet.

---

## Einstellungen

### API-Key & Verbindung (`/settings/api-data`)

- **API-Key eingeben**: OpenRouter-Key hier einfügen
- **Verbindungsstatus**: Zeigt, ob die Verbindung funktioniert
- **Key löschen**: Entfernt den Key aus dem Browser

**Wichtig:** Der API-Key wird nur im `sessionStorage` gespeichert und geht beim Schließen des Browsers verloren. Bei jedem Neustart muss der Key erneut eingegeben werden.

### Gedächtnis (`/settings/memory`)

- **Kontext-Länge**: Wie viele vorherige Nachrichten an die KI gesendet werden
- **Gedächtnis leeren**: Löscht den Kontext für das aktuelle Gespräch

### Verhalten (`/settings/behavior`)

- **Bevorzugtes Modell**: Standard-Modell für neue Gespräche
- **Schreibstil**: Kreativ ↔ Präzise
- **Antwortlänge**: Kurz ↔ Ausführlich

### Jugendschutz (`/settings/youth`)

- **Altersfreigabe**: Filtert Modelle und Rollen nach Eignung
- **Sichere Modelle**: Zeigt nur Modelle mit Content-Filtern
- **Sichere Rollen**: Blendet unzensierte Personas aus

### Darstellung (`/settings/appearance`)

- **Theme**: Dark/Light (derzeit nur Dark vollständig implementiert)
- **Schriftgröße**: Anpassbar für bessere Lesbarkeit

### Extras (`/settings/extras`)

Experimentelle Features, die standardmäßig deaktiviert sind.

---

## PWA-Nutzung

### App installieren

1. Öffne `disaai.de` im Browser (Chrome, Edge, Safari)
2. Klicke auf "Zum Startbildschirm hinzufügen" (oder Teilen → Zum Home-Bildschirm)
3. Die App erscheint wie eine native App

### Offline-Fähigkeit

- **Shell & UI**: Funktioniert offline (aus dem Cache)
- **Chat**: Benötigt Internetverbindung für KI-Antworten
- **Verlauf**: Offline lesbar (lokal gespeichert)

### Updates

Bei App-Updates erscheint ein Banner. Klicke auf "Aktualisieren", um die neue Version zu laden.

---

## Datenschutz-Hinweise

### Was lokal bleibt

- Chat-Verlauf (IndexedDB)
- Einstellungen (localStorage)
- API-Key (sessionStorage)

### Was an Server geht

- **OpenRouter**: Deine Nachrichten werden an OpenRouter gesendet, das sie an den KI-Provider weiterleitet
- **Cloudflare**: Hosting, technische Logs (keine Tracking-Pixel)
- **Feedback**: Wenn du Feedback sendest, wird es per E-Mail verschickt

**Vollständige Datenschutzerklärung:** [`/datenschutz`](https://disaai.de/datenschutz) oder [`PRIVACY.md`](../PRIVACY.md)

---

## Problembehebung

### Chat lädt nicht

1. Prüfe Internetverbindung
2. Prüfe, ob API-Key eingegeben ist
3. Versuche Seite neu zu laden (Ctrl+R / Cmd+R)

### Antwort stoppt mitten drin

- OpenRouter hat Rate-Limits; warte kurz und versuche erneut
- Bei sehr langen Antworten kann das Modell-Limit erreicht sein

### App zeigt alte Version

1. Browser-Cache leeren
2. Service Worker deregistrieren (DevTools → Application → Service Workers → Unregister)
3. Seite neu laden

### App auf Desktop nutzen

Die App ist primär für mobile Geräte optimiert, funktioniert aber auch auf Desktop-Browsern. Für die beste Erfahrung auf Desktop wird empfohlen, die Browser-DevTools zu nutzen (F12 → Device Toolbar) und ein mobiles Gerät zu emulieren.

---

## Weiterführende Dokumentation

- [Technische Architektur](ARCHITECTURE.md)
- [Konfiguration](CONFIG.md)
- [Bekannte Probleme](guides/known-issues.md)
