# UI/UX Overhaul Plan for Disa AI

## 1. Kurz-Ist-Analyse
- **Navigation ist verteilt und redundant:** Chat ist sowohl unter `/` als auch `/chat` erreichbar; Settings haben viele Unterrouten (Memory, Behavior, Youth, Extras, API/Data), wodurch Orientierung auf Mobil schwer fällt.【F:src/app/router.tsx†L7-L98】
- **Chat-Ansicht ist überladen:** Mehrere Ebenen (BookPageAnimator, Bookmark, HistorySidePanel, ThemenBottomSheet, Status-Banner, Kontextleiste) konkurrieren auf engem Raum und erschweren einen klaren Flow.【F:src/pages/Chat.tsx†L90-L233】【F:src/pages/Chat.tsx†L233-L320】【F:src/pages/Chat.tsx†L320-L360】
- **Settings haben doppelte Navigationsmuster:** Mobile Tabs + Desktop-Sidebar + Breadcrumbs erzeugen Inkonsistenzen; einige Sektionen (Extras, API-Data) wirken wie eigene Features ohne klaren Kontext.【F:src/features/settings/SettingsLayout.tsx†L25-L114】
- **Modelle-Seite ist datenlastig und komplex:** Viele Filter/Sortierungen, Dialoge und Tabellen erhöhen kognitive Last, besonders mobil.【F:src/components/models/EnhancedModelsInterface.tsx†L1-L120】
- **UI-Overlays & Gimmicks streuen Fokus:** NekoLayer, PWA-Prompts, NetworkBanner und Build/Debug-Infos werden global eingeblendet und können Kernflows verdecken.【F:src/app/layouts/AppShell.tsx†L6-L100】【F:src/app/layouts/AppShell.tsx†L125-L178】
- **Komponenten-Stil wirkt uneinheitlich:** Unterschiedliche Card-/Button-Varianten (MaterialCard, FilterChip, Buttons) und mehrere Illustration-Stile (Papier/Buch vs. Material) konkurrieren innerhalb einer Seite.【F:src/components/models/EnhancedModelsInterface.tsx†L10-L36】【F:src/pages/Chat.tsx†L233-L320】

## 2. Zielbild
- **Mobil-first, klares Single-Flow-Erlebnis:** Chat steht im Zentrum mit stabiler Eingabeleiste, reduzierter Navigation und klarer Sicht auf Verlauf und Kontext.
- **Konsistente Navigationsarchitektur:** Eine einheitliche Bottom-Navigation (mobil) bzw. kompakte Sidebar (Desktop) mit maximal 4 Tabs (Chat, Modelle, Rollen, Einstellungen); sekundäre Inhalte (Feedback, Themen) wandern in ein Overflow-Sheet.
- **Ruhige, professionelle Ästhetik:** Modernes KI-Chat-Feeling (klare Flächen, dezente Schatten, keine verspielten Animationslayer). Dark/Light Themes bleiben, aber mit harmonischer Farbpalette und konsistenten Abständen.
- **Geführte Flows:** Rollen/Modelle/Stile sind über kurze Sheets oder modale Panels wählbar; Settings werden in logische Gruppen konsolidiert und mit kurzen Beschreibungen versehen.
- **Transparente Systemzustände:** Netzwerk-, Rate-Limit- und Modell-Status erscheinen als schlanke Inline-Badges statt großer Banner; Toasts bleiben dezent.

## 3. Designsystem
- **Farbpalette:**
  - Hintergrund: `#0F1115` (Dark) / `#F7F7F9` (Light)
  - Flächen: `#181B21` / `#FFFFFF`
  - Akzent: `#6D8CFF` (primär), `#F2C94C` (Warnung), `#FF6B6B` (Fehler), `#10B981` (Success)
  - Linien/Border: `#1F2430` / `#E4E7EE`
- **Typografie:** Inter/Manrope, 16px Basis, 1.5 line-height; Headings (24/20/18), Body (16/14), Mono für Code-Blöcke.
- **Abstände & Radius:** 8px Grid, 12–16px Card-Padding, 10px Radius für Cards/Sheets, 999px für Chips/Bubbles.
- **Komponenten:**
  - Buttons: Primary (filled), Secondary (outline), Ghost (text), Icon-Only (circle, 44px min-Tap).
  - Inputs: Filled + outline Fokus, klares Label/Helper-Text.
  - Cards/Panels: Schatten `0 8px 24px -12px rgba(0,0,0,0.35)`; Borders 1px.
  - Chips/Badges: Statusfarben, kleine Icons optional.
  - Sheets/Modals: 12px top-radius (mobile), 24px desktop modal; Dimmer 45%.

## 4. Seiten & Flows
- **Chat:**
  - *Ist:* Buch-/Papier-Metapher mit Swipe-Stack, HistorySidePanel, ThemenBottomSheet, ContextBar; Eingabe + Kontext getrennt, mehrere Floating-Buttons.【F:src/pages/Chat.tsx†L186-L260】【F:src/pages/Chat.tsx†L233-L320】
  - *Neu:* Straightforward Chat-Layout: Header mit Titel/Status, Scrollbarer Verlauf, sticky Composer mit Actions (Attach, Mic, Send). Kontext (Rolle/Model/Style) in ein kompaktes Bottom-Sheet (max drei Chips + „Mehr“). History als eigene Seite/Tab mit simplen Karten.
- **Rollen:**
  - *Ist:* Eigenständige Seite (Route `/roles`), vermutlich Listen-UI; Kontext-Auswahl in Chat getrennt.【F:src/app/router.tsx†L25-L49】
  - *Neu:* Rollen-Drawer aus Chat heraus (Bottom Sheet). Rollen-Seite bleibt für Management (Favoriten, Edit), aber Auswahl erfolgt in Chat.
- **Modelle:**
  - *Ist:* Dichte Tabelle mit Filtern, Sortierung, Vergleichen, Dialogen.【F:src/components/models/EnhancedModelsInterface.tsx†L10-L88】
  - *Neu:* Zwei Layer: (1) Schnellauswahl (Top-3 Empfehlungen + Suche) als Bottom Sheet; (2) Detailseite mit Karten + Vergleichstabelle.
- **Settings:**
  - *Ist:* Mehrere Unterrouten mit eigenem Layout, mobile Tabs + Desktop-Sidebar, Breadcrumbs im AppShell.【F:src/features/settings/SettingsLayout.tsx†L25-L114】【F:src/app/layouts/AppShell.tsx†L52-L84】
  - *Neu:* Einheitliches Settings-Home mit Sektionen (Konto/API, Chat-Verhalten, Sicherheit, Darstellung, Extras). Unterseiten nutzen identisches Layout; Mobil: Accordion-Liste, Desktop: rechte Content-Spalte + linkes Nav.
- **Themen/Quickstarts & Feedback:**
  - *Ist:* Eigene Routen, aber wenig integriert in Chat-Flow.【F:src/app/router.tsx†L50-L88】
  - *Neu:* Quickstart-Sheet von Chat aus; Feedback-Link im Header/Overflow, eigenes Modal statt kompletter Seite auf Mobil.
- **Overlays/Gimmicks:**
  - *Ist:* NekoLayer, PWA-Prompt, NetworkBanner, Debug-Infos global aktiv.【F:src/app/layouts/AppShell.tsx†L6-L100】【F:src/app/layouts/AppShell.tsx†L125-L178】
  - *Neu:* Opt-in Extras im Settings-Tab „Experimente“; Standard-UI bleibt clean.

## 5. Technischer Plan
- **Layout & Navigation:**
  - Vereinheitlichung auf eine zentrale Shell: Bottom-Nav (mobil) / kompakte Sidebar (Desktop) mit 4 Hauptrouten; Chat-Route canonical `/chat` und Redirect von `/`.
  - Entfernen/Reduzieren von Buch-/Swipe-Logik in Chat; History in eigene Route mit simplen Cards.
- **Chat-Komponenten:**
  - Composer als eigener Sticky-Container mit Actions; ContextBar-Funktionalität in neue „Context Sheet“ Komponente umziehen.
  - MessageList vereinfachen: weniger Wrapper, klarere Scrollfläche, Inline-Status-Badges statt großer Banner.
- **Modelle & Rollen:**
  - Neue „Model Quickpick“-Komponente (Sheet) + vereinfachte Kartenliste; Favoriten-Persistenz behalten.
  - Rollen-Auswahl in Chat kontextualisieren; Rollen-Seite nur für CRUD/Import.
- **Settings:**
  - Neues Settings-Layout-Komponent mit einheitlichen Section-Cards; Tabs entkoppeln und Breadcrumbs nur auf Desktop.
  - Konsolidierung der Extras/Neko/PWA-Schalter unter „Experimente“.
- **Design Tokens & Theming:**
  - Aktualisierte Farb-/Typo-Tokens in `src/styles/design-tokens.css`; vereinheitlichte Button/Card Variants in `src/components/ui`.
- **Aufräumen:**
  - Entfernen alter Animation/Gimmick-Komponenten, Legacy-Settings (`features/settings/_legacy`) und doppelte Navigation (Studio-Redirect etc.).
  - Prüfen ungenutzter Komponenten in `components/navigation` und `components/chat` (Bookmark, BookPageAnimator) und entweder modernisieren oder auslagern.

## 6. Priorisierte Roadmap
1. **Prio A:** Navigation vereinheitlichen (Routes, Bottom-Nav/Sidebar), Chat-Layout auf simplen Verlauf + Sticky Composer umbauen, Statusanzeige vereinfachen.
2. **Prio A:** Context/Model/Rollen-Auswahl als einheitliches Sheet implementieren; History als eigene Seite/Tab.
3. **Prio B:** Modelle-Quickpick + Detailseite redesignen; Rollen-Management modernisieren.
4. **Prio B:** Settings konsolidieren (neues Layout, Sektionen, Experimente-Bereich) und Breadcrumbs/Sidebars vereinheitlichen.
5. **Prio C:** Visual Polish (Design Tokens, Komponentenvarianten, Icons), Animationsreduktion, Leere Zustände + Feedback-Flow in Modals.
6. **Prio C:** Optional: PWA/Neko/Extras in Experimente verschieben und standardmäßig deaktivieren.

## 7. Test-/Review-Checkliste (Mobil + Kernfunktionen)
- **Navigation:** Bottom-Nav/Sidebar funktioniert in allen Routes, Zurück-Flow auf Mobil ok.
- **Chat:** Eingabefeld stets sichtbar; Senden/Stoppen, Retry/Edit, Scroll-Verhalten; Kontextwechsel aktualisiert Prompt/Modelle.
- **History:** Laden/Wechseln zwischen Konversationen; Leere Zustände; Löschen/Umbenennen (falls vorhanden).
- **Rollen/Modelle Sheets:** Öffnen/Schließen mit Wischgesten/Buttons; Auswahl persistiert; Such-/Filter-Funktionen mobil bedienbar.
- **Settings:** Umschalten von Toggles/Slider, Persistenz in Storage; API-Keys sicher gehandhabt.
- **Feedback/Quickstarts:** Modale öffnen/schließen, Formularvalidierung; Quickstart startet neuen Chat mit gesetztetem Prompt.
- **Overlays:** Network/Rate-Limit-Badges erscheinen kontextuell; PWA/Extras nur auf Wunsch aktiv.
