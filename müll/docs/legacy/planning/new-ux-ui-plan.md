# Neuer UX/UI-Plan für Disa AI

## 1. Ist-Analyse
- **Screens laut Router**: Chat, Chat-Historie, Rollen, Modelle, Themen, Feedback, Einstellungen (Übersicht, Memory, Behavior, Jugendschutz, API/Data, Extras, Appearance), Impressum, Datenschutz.
- **Aktuelles Layout**: Chat-Ansicht mit Page-Swipe/Book-Navigation, Kontext- und Schnellstart-Leisten, History-Sidepanel und Themen-Bottomsheet; diverse Einstellungs-Subpages mit heterogener Kartengestaltung; neumorpher Stil mit starken Schatten.
- **Design/Styling**: Tailwind + CSS-Variablen über generierte Design-Tokens; dramatischer Neumorphism („erhabene" Karten, starke Schatten), viele Layer-Effekte; Radix-Primitives + CVA-Varianten; Mobile-Gate + Safe-Area-/viewport-Workarounds.
- **Hauptprobleme**:
  - Inkonsistente visuelle Linie (wechselnde Karten-/Shadow-Stile, wechselnde Flächenfarben, uneinheitliche Typo-Abstände).
  - Neumorphismus erschwert Lesbarkeit/Kontrast; zu viele Schatten und Glas-Effekte.
  - Informationshierarchie unscharf (gleichgewichtete Panels, keine klare Priorität für Chat vs. Nebenfunktionen).
  - Mobile-Usability leidet unter überfrachteten Toolbars (Kontextbar, Buttons, Sheet, Swipe-Navigation gleichzeitig).
  - Einstellungen fragmentiert, unterschiedliche Layout-Muster und Buttons.
  - Icon/Label-Mix uneinheitlich; CTA- und Sekundäraktionen kaum differenziert.
  - Alte Design-Tokens und CVA-Varianten sind stark verästelt und blockieren einheitliche mobile Patterns.

## 2. Reset / Was wird verworfen
- **Wird NICHT übernommen**: Neumorphes Karten-/Shadow-Design, „Buchseiten“-Navigation/Swipe-Metapher, heterogene Panel-Rahmen, überladene Kontext-/Statusleisten, flächige Gradients und Glows, inkonsistente Abstands- und Typo-Skalen, parallele Bottomsheet + Sidepanel-Steuerung.
- **Wird aktiv entfernt**:
  - Alte Design-Tokens (Farben, Radius, Shadows) und zugehörige Tailwind-Mapping-Dateien.
  - Verstreute CVA-Varianten für Buttons/Inputs/Cards, die die alte Typo-/Spacing-Skala kodieren.
  - Book-/Page-Animator-Komponenten, doppelte Layout-Shells, neumorphe CSS-Hilfsdateien.
  - Historien-Sidepanel-Logik als Pflichtbestandteil des Chats (ersetzt durch dedizierte View/Sheet).
- **Funktional bleibt, aber neues UI**: Chat-Funktion inkl. Streaming/Stop, Rollen-/Persona-Management, Modellwahl, Themen/Quickstarts, Chat-Historie, Einstellungen (alle Unterseiten), Feedback, Impressum/Datenschutz, Onboarding/Toasts/Fehlerstates.

## 3. Neues UX/UI-Konzept (High-Level)
- **Design-Identität**: Ruhig, professionell, editorial-tech. Fokus auf klare Flächen, dezente Tiefenstaffelung, hoher Kontrast, präzise Typo, minimaler Farbeinsatz. Keine Glassmorphism-/Neumorph-Ästhetik.
- **Mobile-First-Gefühl**: Einspaltig, große Touch-Ziele, sticky Kernaktionen (Eingabe unten), reduzierte Navigationsleiste als Bottom-Bar. Gesten nur ergänzend (z.B. Pull-to-refresh, optionaler Swipe für Historie). Safe-Area-Insets berücksichtigen, Scrollbars ausblenden, damit der Content maximalen Platz erhält.
- **Visuelle Prinzipien**: Content-first, klare Hierarchie, 8pt-Rhythmus, max. zwei Akzentfarben, Schatten nur für Overlays/Modals, flache Karten mit Border statt Glow, konsequente Typo-Skala. Mobile: Priorität auf vertikale Lesbarkeit, kurze Zeilenlängen und konsistente 16px Basisschrift.
- **Performance/Ergonomie (mobil)**: Animationen ≤150ms, keine schweren Blur-Effekte, zurückhaltende Gradients. Tappable Flächen min. 44x44px, ausreichend vertikale Abstände zwischen Aktionen. Skeleton-Loader statt Spinner, um wahrgenommene Geschwindigkeit zu verbessern.
- **Design-System-Governance**: Nur ein Token-Set und ein Komponenten-Layer; keine projektspezifischen CSS-Ausreißer. Variantenzahl pro Komponente minimal (Primary, Ghost, Destructive, Text).

## 4. Designsystem (Tokens)
### Farben (Neutral + Akzent, kein Glow)
- `--color-bg`: #0B0C10 (Hintergrund dunkel)
- `--color-surface-1`: #11131A (Grundfläche Karten)
- `--color-surface-2`: #171A21 (Elevated Surface)
- `--color-surface-3`: #1D2028 (Modal/Sheet)
- `--color-primary`: #7CD4FF
- `--color-primary-strong`: #42B2F5
- `--color-accent`: #9F7AEA
- `--color-text-primary`: #F5F7FA
- `--color-text-secondary`: #C4CBD5
- `--color-text-tertiary`: #8C94A3
- `--color-border`: #1F2430
- `--color-muted`: #1A1E27
- Status: `--color-success` #4AD295, `--color-warning` #F2C14E, `--color-error` #F06272, `--color-info` #5AB0FF

### Typografie
- Schrift: "Inter" (Fallback: system-ui). Monospace: "JetBrains Mono" für Code.
- Hierarchie:
  - `--font-h1`: 24/32 semi-bold
  - `--font-h2`: 20/28 semi-bold
  - `--font-h3`: 18/26 semi-bold
  - `--font-body`: 16/24 regular
  - `--font-body-sm`: 14/20 regular
  - `--font-mono`: 14/20 medium

### Spacing (8pt-Basis)
- `--space-2`: 4px
- `--space-3`: 6px
- `--space-4`: 8px
- `--space-6`: 12px
- `--space-8`: 16px
- `--space-10`: 20px
- `--space-12`: 24px
- `--space-16`: 32px

### Radius & Shadow
- Radius: `--radius-sm` 8px, `--radius-md` 12px, `--radius-lg` 16px, `--radius-pill` 999px.
- Schatten minimal: `--shadow-sm` 0 6px 20px rgba(0,0,0,0.18); `--shadow-md` 0 12px 28px rgba(0,0,0,0.22). Nur für Modals/Dropdowns.

### States & Tokens-Mapping
- Hover (Desktop): leichte Hintergrundaufhellung (`surface-2`), Border zu `--color-primary` bei Fokus.
- Focus: 2px Outline `--color-primary` + 4px Outline Offset transparent.
- Active/Tap: 98% Scale, Hintergrund zu `--color-muted`.
- Disabled: 50% Opacity, keine Schatten.
- Inputs: Border `--color-border`, Fokus Border `--color-primary-strong`, Fehler Border `--color-error`.
- **Tailwind-Mapping**: Nur ein Token-Set in `src/styles/design-tokens.css`; alte Variablen-Dateien löschen und `tailwind.config` auf neues Set verweisen.

## 5. Screen-Plan & Layout-Wireframes
### Gemeinsame Bausteine
- **Topbar** (optional Desktop): Title + sekundäre Aktion (Feedback/Info).
- **Bottom-Bar Navigation (mobile)**: Chat, Rollen, Modelle, Verlauf, Einstellungen. Fixiert mit Safe-Area-Padding, aktive Sektion klar hervorgehoben, Labels immer sichtbar. Kein zusätzliches Drawer/Split-Layout auf Mobil.
- **Section Cards**: flache Karten mit Border, Title links, Actions rechts. Tap-Fläche komplett klickbar, Chevron rechts für Navigation, 12–16px vertikales Padding.
- **Mobile-Optimierung**: Scrollbereiche klar voneinander getrennt, Sticky-Bereiche (Input, Filter-Chips) erhalten Schatten/Border, um Überlagerungen zu vermeiden. Empty-States kompakt mit CTA und kurzer Erklärung.

### Chat (Home)
- **Ziel**: Hauptinteraktion Chat, schnelle Rollen-/Modellwahl, klarer Eingabefluss.
- **Inhalt**: Statusbanner (API/Offline), Chatverlauf, Quick Actions (Rolle/Modell/Anhänge), Input mit Send/Stop, optional Kontextchips.
- **Wireframe**:
  - HEADER: [Logo/Title] [Statusbadge/Sync]
  - MAIN: [Chat-History Scroll | Nachrichtenkarten] + [System/Info Banner oben]
  - FOOTER: [Context chips horizontal] [Input + Send + Stop] (sticky)
- **Mobile**: Einspaltig, sticky Input mit Safe-Area-Padding, Quick Actions als Icon-Buttons rechts der Inputzeile, Kontextchips horizontal scrollend über dem Input. Letzte Nachricht immer oberhalb der Tastatur sichtbar (Auto-Scroll). Voice/Attachment Buttons optional in Overflow-Menü, um Platz zu sparen.
- **Tablet/Desktop**: Zwei-Spalten: Chat links (70%), rechts schmale Pane für Rolle/Modell/Verlauf toggelbar.

### Chat-Historie
- **Ziel**: Gespräche finden/fortsetzen.
- **Inhalt**: Suche/Filter, Listeneinträge mit Titel, Datum, Tokens/Model, Actions (Fortsetzen, Löschen).
- **Wireframe**: HEADER [Zurück] [Titel]; LIST [Card: Title | Meta | Actions]; FAB „Neuer Chat“.
- **Mobile**: Liste einspaltig, Swipe-Aktion Delete/Pin optional, FAB rechts unten mit Safe-Area-Padding. Schnellsuche als Sticky oberhalb der Liste, um sofortigen Zugriff zu bieten. Keine Sidepanel-Variante; Verlauf ist eigener Screen oder Sheet.
- **Desktop**: Zwei-Spalten (Liste links, Preview rechts optional).

### Rollen/Persona-Manager
- **Ziel**: Rollen durchstöbern, aktivieren, editieren.
- **Inhalt**: Kategorien-Filter, Karten mit Avatar/Name/Tags, Favoriten-Toggle, Detail-Sheet, Neu/Bearbeiten-Dialog.
- **Wireframe**: HEADER [Filter/Sort]; GRID/List Cards; CTA „Neue Rolle“ unten.
- **Mobile**: 2-Spalten-Grid oder Liste mit kompakten Cards; Details als Bottom Sheet mit Swipe-to-close. Filter-Chips sticky unter dem Header; Favoriten-Toggle gut erreichbar am Card-Rand. Keine eingebetteten Drawer/Sidepanels.
- **Desktop**: 3-Spalten-Grid, Detailpanel rechts.

### Modelle
- **Ziel**: Modell auswählen/filtern.
- **Inhalt**: Suchfeld, Chips (Provider, Preis, Geschwindigkeit), Cards mit Kurzinfos, Favorit/Standard setzen.
- **Wireframe**: HEADER [Suchfeld]; FILTER Chips; LIST Cards mit Badges (Preis/Speed/Context); Primary CTA „Als Standard setzen“.
- **Mobile**: Einspaltige Liste, Filter-Chips horizontal scrollend, CTA als Sticky Bottom-Bar („Als Standard setzen“ für ausgewähltes Modell), damit kein Scrollen nötig ist.

### Themen/Quickstarts
- **Ziel**: Einstiegsthemen anbieten.
- **Inhalt**: Kategorie-Chips, Cards mit Titel/kurzer Beschreibung, Start-Button.
- **Wireframe**: Chips horizontal; Cards in Liste; Start führt direkt in Chat und setzt Prompt.
- **Mobile**: Cards mit prägnanten Titeln und kurzem Text, Start-Button vollflächig pro Card; Kategorie-Chips sticky, um zwischen Themen zu wechseln.

### Einstellungen (Übersicht)
- **Ziel**: Alle Settings klar gruppiert.
- **Inhalt**: Abschnitte (Allgemein, Verhalten, Jugendschutz, API & Daten, Extras, Erscheinungsbild), jede als Card mit Kurzbeschreibung + Chevron.
- **Wireframe**: HEADER [Titel]; SECTION Cards; Fußnote Version/Build.
- **Mobile**: Einspaltige Liste mit großzügigen Tap-Flächen; primäre Aktionen oben (z.B. Account/Backup), weniger wichtige Links unten. Sticky Topbar mit klarem Titel.

### Einstellungen Detailseiten
- **Memory/Verhalten/Jugendschutz/API/Extras/Aussehen**: Formfelder mit klaren Labels, Hilfetexten, Toggles/Slider/Select; Primäre CTA „Speichern“, Sekundär „Reset“.

### Feedback
- **Ziel**: Feedback senden.
- **Inhalt**: Form (Typ, Nachricht, optional Kontakt), CTA Senden, Erfolgs-/Fehlerhinweis.
- **Mobile**: Kürzere Form mit Progress-Feedback (CTA wird zu Spinner). Tastatur-Verhalten: Auto-Fokus auf Textfeld, CTA bleibt sichtbar über der Tastatur.

### Impressum/Datenschutz
- **Ziel**: Rechtstexte lesbar.
- **Inhalt**: Typo-Hierarchie, Table of Contents Sprunglinks.
- **Mobile**: TOC als horizontal scrollbare Chips; Abschnittsanker mit sticky Abschnittstiteln für Orientierung.

## 6. Navigation & Informationsarchitektur
- **Hauptnavigation (mobile)**: Bottom-Bar mit 5 Icons+Labels: Chat, Rollen, Modelle, Verlauf, Einstellungen. Fixiert, mit Safe-Area-Abstand und klarer Aktivmarkierung; kein verstecktes Drawer-Menü nötig.
- **Sekundärzugriff**: Innerhalb Chat Quick-Links auf Rolle/Modell via kleine Pills über der Eingabe.
- **Desktop**: Linke Rail (permanent) mit denselben Einträgen; Chat als Start.
- **Schnelle Aktionen**: Floating „Neuer Chat“ Button auf Chat/Verlauf; Rollenwechsel über Bottom Sheet/Drawer ohne Kontextwechsel. Auf Mobil nur ein Overlay zur Zeit (Sheet oder Modal) für Klarheit.
- **Reduktion der Komplexität**: Nur eine Overlayschicht gleichzeitig (entweder Sheet oder Drawer), kein gleichzeitiges Sidepanel + Sheet; Navigationspfade auf max. 2 Ebenen begrenzen, Back-Aktion immer sichtbar.

## 7. Interaktionen & Microinteractions
- Buttons: sanfte 150ms Ease-out, Tap-Scale 0.98, Fokus-Outline klar sichtbar.
- Inputs: 200ms Border/Fill-Transition; Inline-Validation mit ruhigen Farben.
- Cards/Listen: Hover-Lift (border-color + leichter Schatten), Tap Ripple dezent auf Mobile.
- Loader: lineare Progressbar im Header für laufende Requests; Senden-Button zeigt Spinner + „Senden…“.
- Fehler/Status: Toast unten zentriert; Banner oben für API/Offline; Erfolgs-Checkmarks bei Save.
- Gesten: Optionaler Swipe nach rechts für Verlauf öffnen (auf Mobil); Pull-to-refresh für Verlaufsliste.
- Motion: Respektiert `prefers-reduced-motion`; standard 150–200ms Ease, keine Parallax/3D. Mobile-First: Animationen blockieren keine Eingabe, kein starkes Opacity-Fading über dem Keyboard.
- Mobile-Feedback: Haptisches Feedback (Vibration light) bei langen Aktionen (Senden/Stop), visuelle Ladeindikatoren nahe am Daumen (Input-Bereich).

## 8. Technischer Migrationsplan
1. **Design-Tokens neu definieren**: `src/styles/design-tokens.css` mit neuer Palette, Typo, Spacing, Radius überschreiben; alte Token-Dateien und Tailwind-Mappings löschen.
2. **Globale Styles**: `src/index.css` und Basis-Utilities auf neues Farbschema/Rhythmus umstellen; neumorphe Shadows/Gradients und Spezial-Viewport-Hacks entfernen.
3. **Layout-Shell**: Neues App-Layout mit Bottom-Bar (mobile) und optionaler Side-Rail (desktop) erstellen; `RouteWrapper` vereinfachen und alte Book/Page-Shells streichen.
4. **Primitives aktualisieren**: Buttons, Inputs, Cards, Chips in `components/ui` an neues Tokensystem binden; CVA-Varianten auf Kernstates reduzieren.
5. **Chat-Ansicht**: Struktur neu aufbauen (Header+Banner, History, Input-Bar); BookPageAnimator und überflüssige Panels entfernen; Kontextchips/Quick Actions schlank.
6. **Navigation/Historie**: History-Sidepanel durch dedizierte Seite/Sheet ersetzen; ein Overlay-Typ enforced.
7. **Rollen/Modelle/Themen**: Einheitliches Card/List-Layout; Filter-Chips standardisieren und alte Drawer/Sidepanels entfernen.
8. **Einstellungen**: Übersicht + Detailseiten in konsistentes Formular-Layout mit Section Cards; CTA-Pattern vereinheitlichen.
9. **Feedback/Legal**: Lesbare Typo-Hierarchie, Table of Contents einführen.
10. **Onboarding/Toasts**: Visuell an neues Schema anpassen; Motion reduzieren.
11. **Aufräumen**: Alte CSS-Dateien/Komponenten (Neumorphismus, Book-Navigation), doppelte Themes und ungenutzte Assets löschen; Storybook/Docs auf neue Tokens aktualisieren.
12. **Tests/Docs**: Snapshot/Visual-Tests anpassen, README/Design-Dokumente auf neues System aktualisieren.
