# Spiele-Feature Plan

## 1. Architekturübersicht

### 1.1 Prompt-basierter Ansatz

Beide Spiele (Quiz und 20 Questions) kommunizieren direkt über vereinfachte Prompts mit dem KI-Modell:

- Weniger Zustandsmanagement
- Einfachere API-Integration
- Schnellere Entwicklung

### 1.2 Gemeinsame Komponenten

- `GameLayout.tsx`: Einheitlicher Rahmen für alle Spiele
- `GameHub.tsx`: Zentrale Spiele-Übersicht
- `PromptService.ts`: Einheitliche API-Interaktion
- `games.config.ts`: Spiel-Konfiguration

## 2. Spiel-Implementierungen

### 2.1 Quiz-Spiel

- **Prompt-Struktur**:
  ```
  "Erstelle eine Quizfrage mit 4 Antwortmöglichkeiten (A-D) zu [Thema].
  Antwortformat:
  {
    "frage": "Frage hier",
    "optionen": {"A": "...", "B": "...", "C": "...", "D": "..."},
    "korrekt": "A|B|C|D",
    "erklaerung": "Kurze Erklärung"
  }
  ```
- **UI-Komponenten**:
  - Frage-Anzeige
  - Antwort-Buttons (A-D) mit Farbfeedback
  - Fortschrittsanzeige
  - Weiter-Button für nächste Frage
- **Spezialfälle**:
  - Fallback-Parsing bei ungültigem JSON

### 2.2 20 Questions

- **Prompt-Struktur**:
  ```
  "Rate ein Objekt/Tier/Person. Ich werde mit Ja/Nein/Weiß nicht antworten.
  Aktueller Stand: [Spielerantworten: Ja, Nein, ...]
  Nächste Frage?"
  ```
- **UI-Komponenten**:
  - Frage-Anzeige
  - Antwort-Buttons (Ja/Nein/Weiß nicht)
  - Verbleibende Fragen-Anzeige (max. 20)
- **Spezialfälle**:
  - Beenden nach 20 Fragen mit "Forced Guess"
  - Beenden wenn korrekt geraten

## 3. UI/UX Konzept

### 3.1 GameHub

- Grid-Layout mit Spiel-Kacheln
- Glassmorphism-Design wie Chat-Ansicht
- Mobile-first Ansatz

### 3.2 GameLayout

- Einheitlicher Header mit Spieltitel und Zurück-Button
- Hauptbereich für Spiel-Inhalt
- Footer mit Aktionen (z.B. „Weiter“, „Beenden“)

### 3.3 Design-Richtlinien (Glassmorphism)

- Hintergrund: `bg-white/6`
- Border: `border-white/10`
- Schatten: `shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]`
- Blur: `backdrop-blur-md`
- Text: `text-white/90`
- Buttons: Aktiv `bg-white/10 hover:bg-white/20`, Richtig `bg-green-500/30`, Falsch `bg-red-500/30`

## 4. Technische Umsetzung

### 4.1 PromptService

- Einheitliche API-Interaktion mit OpenRouter
- Fehlerbehandlung und Retry-Logik
- Rate-Limiting und Token-Management

### 4.2 Spielzustand

- Einfache React-State-Verwaltung (kein externer Store)
- Prompt-History für 20 Questions
- Punktezählung für Quiz

### 4.3 Spielende

- Quiz: Nach 10 Fragen
- 20 Questions: Nach 20 Fragen oder erfolgreichem Raten

## 5. Token- und Kostenkontrolle

### 5.1 Limit-Management

- Quiz: Maximal 10 Fragen pro Durchgang
- 20 Questions: Maximal 20 Interaktionen pro Spiel
- System-Prompt einmalig, danach kurze JSON-Interaktionen

### 5.2 Modell-Auswahl

- Kosten-effiziente Modelle:
  - `mistralai/mistral-small`
  - `qwen/qwen2.5-coder`
  - `deepseek/deepseek-chat`

## 6. Tests

### 6.1 Unit-Tests

- Prompt-Service-Funktionalität
- JSON-Parser (Fallback-Logik)
- Spielzustands-Logik

### 6.2 UI-Tests

- Klick-Flows in beiden Spielen
- Mobile Ansicht
- Fehlerfälle (ungültige Antworten)

## 7. Implementierungsphasen

### Phase 1: Basis

- GameLayout-Komponente
- GameHub mit Navigation
- PromptService
- Quiz-Spiel (ohne 20 Questions)

### Phase 2: Erweiterung

- 20 Questions Spiel
- Design-Feinabstimmung
- Komplette Mobile-Optimierung

### Phase 3: Optimierung

- Tests implementieren
- Performance-Optimierungen
- Token-Kosten-Monitoring
