/** file: docs/ui-audit.md */
# Disa AI UI Rebuild – Plan & Audit (Stand: 2025-02-14)

## 1. Ablaufplan („Prompt Plan“)
1. **Bestandsaufnahme & Löschliste**  
   - Analyse bestehender Komponenten/Styles, Routing, State, Tokens.  
   - Doppelte oder veraltete Module markieren (`components/chat/**`, Legacy Layouts, neomorph CSS).
2. **Designsystem konsolidieren**  
   - CSS-Variablen für Tokens (`--bg0`, `--accent` …) + `data-theme` Light/Dark.  
   - Tailwind-Mapping (Farben, Radius, Schatten, Typo, 4pt-Spacing, motion tokens) und Purge-Bereinigung.  
   - Globale Styles vereinheitlichen, Fokus-Ringe & prefers-reduced-motion sicherstellen.
3. **AppShell & Navigation erneuern**  
   - `features/shell` mit `<AppShell/>`, `<BottomNav/>`, `<SideDrawer/>`.  
   - Mobile-first Layout (Bottom-Nav ≤5 Tabs, FAB „Neue Session“, Drawer mit Swipe/Haptics).  
   - Desktop-Breakpoint zeigt Sidebar statt Bottom-Nav; Skip-Link & Landmarks erhalten.
4. **Domänenfeatures implementieren**  
   - Chat: Header, MessageList (virtualisiert), Bubbles (user/assistant/system), Composer (Send/Stop/Presets/Rollen), QuickChips, Streaming-State (aria-live).  
   - Sessions: Verlaufsliste, Suche/Filter, Merge-Dubletten, Batch-Operationen, Drawer/Details.  
   - Presets: Grid + CRUD + Import/Export JSON + Favoriten.  
   - Models: Session-Scoped Drawer/Modal mit Filtern („Free/Code/Kreativ“), Provider-Metadaten.  
   - Settings & Extras: Sektionierte Views (Theme, API, Sprache, Accessibility) + Spielekarten (20 Fragen/Quiz/TTL).
5. **State, Persistenz, i18n, A11y, Performance**  
   - Context-Slices (`session/ui/models/presets`), Dexie-Lokalspeicher für Verlauf/Presets/Settings.  
   - i18n (mind. `de`, `en`) mit Fallback.  
   - Gesten (Swipe, Long-Press, Pull-to-refresh) + Vibration API fallback.  
   - Code-Splitting (ModelSwitcher/Extras), Lighthouse-Budgets (<250 KB gz Start), Service Worker (App-Shell cache) prüfen.
6. **Tests, QA & Dokumentation**  
   - Unit-Tests (RTL) für Kernkomponenten, Hooks.  
   - Playwright-E2E: Nachricht senden, Stream abbrechen, Modell wechseln, Session CRUD, Preset Import/Export.  
   - Lighthouse/ PWA Check ≥90, Dokumentation (Migrationsliste, commit story), Altlasten entfernen.

## 2. Auftrag & Methodik
- Ziel: Bestandsaufnahme der aktuellen PWA-Oberfläche (React + Vite + TS + Tailwind) als Grundlage für den vollständigen Neuaufbau nach Master-Prompt.
- Vorgehen: Struktur-Analyse (`src`-Baum, Pages, Features, Hooks, Styles), Stichproben wichtiger Komponenten (Chat, Shell, Modelle, Settings), Sichtung bestehender Tokens & Tailwind-Konfiguration, Prüfung auf Dead Code/Dubletten, Status von Tests/PWA/i18n bewertet.
- Ergebnis: Nachfolgende Abschnitte listen Ist-Zustand, Defizite und Konsequenzen pro Domäne; dient als Referenz für Migrations-Backlog.

## 3. Struktur-Snapshot & Altlasten
- Router (`src/app/router.tsx`) nutzt `RouteWrapper -> AppShell`, aber Pages liegen verstreut (`src/pages`, `src/features`, `src/components/studio`, etc.), nicht nach geforderter Domain-Ordnung (`features/chat`, `shared/ui` ...).
- Mehrere parallel existierende Shell-/Layout-Konzepte (`AppShell`, `MobilePageShell`, `DesktopSidebar`, `GlobalNav`, `DrawerSheet`), keine einheitliche Mobile-First-Implementierung mit Bottom-Nav + Sidebar.
- Chat-spezifische Komponenten liegen unter `src/components/chat`, während Sessions/Presets/Models über mehrere Verzeichnisse verstreut sind; erschwert Aufräum- und Tree-Shaking.
- Dubletten/Backups: `ChatMessage.tsx.backup`, `ChatMessage.tsx.backup2`, `docs/archive/**`, `report/**` enthalten Legacy-Implementierungen; müssen bereinigt werden.

## 4. Designsystem & Styles
- CSS-Tokens: `src/styles/tokens.css` + `design-tokens.generated.ts` erzeugen umfangreiche Variablen (Neomorphismus, gradients). Kein `data-theme="light|dark"` Mapping gemäß Master-Prompt; Hell/Dunkel-Werte vermischt.
- Tailwind (`tailwind.config.ts`) definiert eigenes Farbsystem (`primary`, `accent`, `secondary`, ...), das nicht mit CSS-Variablen gekoppelt ist ⇒ Komponenten hardcoden Hexwerte statt `var(--token)`.
- Aktuelle Typografie-/Spacing-Skalen weichen von gewünschtem 4pt-Raster ab; Radii/Shadow tokens nicht standardisiert (z. B. `var(--radius-xl)` vs. geforderte `sm=6px`, `md=12px`, ...).
- Neomorphische Utilities (`neomorphic-utilities.css`, `button`-Varianten, `brand-panel` Hintergründe) widersprechen Prinzip „Klarheit vor Dekor“ und erschweren kontrastreiche Themes.
- Fokus-Stile/Tokens vorhanden, aber heterogen; `index.css` erzwingt `color-scheme: dark`, blockiert helles Theme.

## 5. AppShell & Navigation
- `AppShell` (src/app/layouts/AppShell.tsx) kombiniert Sticky-Header + Drawer + Footer; kein Bottom-Nav; Desktop-Sidebar wird immer angezeigt (fixed width 64). Kein FAB/New Session Shortcut.
- Drawer (`components/ui/drawer-sheet`) fungiert als Overflow-Menü statt vollwertigem SideDrawer mit Fokus-Trap/Swipe-Gesten; Edge-Swipe Hook existiert (`useEdgeSwipe`), aber Drawer-Open-State lokal, keine UI-Synchronisierung.
- `GlobalNav` zeigt Page-Titel + Burger-Button, aber Navigation erfolgt über Drawer-Liste ⇒ zwei Interaktionsebenen für Tab-Wechsel, nicht finger-first.
- Kein Mechanismus für SideDrawer (Modelle/Presets) oder Secondary panel; Vorgaben zu breadcrumbs, gestures, accessible focus nur rudimentär erfüllt.

## 6. Chat Experience
- Page `src/pages/Chat.tsx` orchestriert ChatFlow via `useChat`, `useConversationManager`, `useDiscussion`; UI setzt auf `ChatList`, `ChatComposer`, `ChatMessage`.
- QuickChips/Actions: improvisiert über Quickstarts + RoleCards, aber keine dedizierte `QuickChips`-Komponente mit horizontalem Scroll + Filterzustand.
- `ChatMessage` (neomorphische Cards) bietet Copy/Retry, aber keine Edit/Delete/Pins, keine `aria-live` für Streaming, Codeblöcke im eigenen Container ohne thematisierte Buttons.
- `VirtualizedMessageList` existiert, dennoch Scroll-Anchoring nicht robust (separate `useStickToBottom` Instanz), „Neue Nachrichten“-Marker nur Buttons; kein pinned composer.
- Composer (`ChatComposer`) unterstützt Send/Stop/Retry, aber keine Attachments/Role-Picker/Token-Infos (nur optional), keine Quick-Chip Andockung. Icon-Buttons 48px, jedoch Buttons-Legacy-Variants.
- Streaming State: `useChat` dispatcht Deltas, aber UI zeigt generisches Loading-Card statt typendem Bubble mit `aria-live="polite"`.

## 7. Sessions/Verlauf
- Conversation Storage (`src/lib/conversation-manager.ts`) basiert auf `localStorage`, nicht Dexie; keine IndexedDB/Versionierung, keine Konfliktbehandlung.
- `ChatHistorySidebar` + `MobileChatHistorySidebar` implementieren History UI außerhalb einer dedizierten View; `SessionsView` noch nicht vorhanden; Merge/Dubletten-Detection fehlt (nur Filter/Sort per UI-Controls).
- `useConversationManager` verwaltet Dialog über `confirm()` und Toasts; Batch-Actions, Suche, Filter existieren, aber 1.) nur im Drawer, 2.) keine deduplizierende Logik, 3.) Export/Import ausgelagert.

## 8. Presets & Rollen
- Rollen/Preset-Funktionalität verteilt: `src/pages/MobileStudio.tsx`, `src/components/studio/RoleCard.tsx`, `config/roleStore.ts`, `contexts/CustomRolesContext`.
- Keine Presets-Grid-View nach Vorgabe (Gruppen, Suche, Favoriten). CRUD über Kontext, aber UI stark modul-spezifisch, nicht generisch.
- Import/Export JSON nicht durchgänging (es gibt `config/quickstarts` + `role dataset`), aber kein zentraler „PresetsView“ mit Modal/Drawer.

## 9. Model Management
- `MobileModels` + `EnhancedModelsInterface` bieten umfangreiche Filter/Sort, aber UI-Pattern (Material Alternative B) weicht vom gewünschten Drawer/Modal `ModelSwitcher` ab.
- Modelwechsel nicht Session-Scoped: `useChat` erhält `setRequestOptions`, aber es existiert kein globaler models-Context; Modelauswahl ist entkoppelt von Chat-Sessions.
- Keine Provider-Filter wie „Free/Code/Kreativ“ laut Vorgabe; capabilities existieren, aber UI zeigt generische Filter.
- Drawer/BottomSheet zur schnellen Model-Umschaltung fehlt; stattdessen separate Seite.

## 10. Settings & Extras
- Settings-Seiten (`src/pages/Settings*.tsx`) sind einzelne Routen, mit `SettingsOverview` (features/settings) + `SettingsView`. Theme-/Language-Schalter existieren isoliert; kein gebündelter „Sektionen“-Screen.
- API-Key-Handling nur per Page, kein einheitlicher Drawer/Modal.
- Language/i18n: `src/lib/i18n/locales` leer; Strings hardcoded (deutsch), keine Fallback-Mechanik.
- Extras/Spiele: nicht vorhanden; keine dedizierte Route/Feature.

## 11. Shared UI & Utilities
- UI-Primitives in `src/components/ui` (Button, Card, Dialog...) stark auf Neomorphismus getrimmt, z. T. redundant (Card vs. StaticSurface). Viele Variants -> schwer wartbar.
- Drawer/Toast/Tooltip existieren, aber Toasts Provider monolithisch; ConfirmDialog/ProgressBar nicht implementiert.
- Gestures/Haptics libs vorhanden (`lib/touch`, `useEdgeSwipe`), aber nicht konsistent genutzt.
- `useStickToBottom`, `useVisualViewport` existieren; Scroll-Locking muss neu bewertet werden.

## 12. Zustand, Daten & Persistenz
- Chat-State: `useChat` + `chatReducer` decken Streaming/Abort ab, aber RequestOptions/Prompt-Handling lokal; keine Kontext-Slices (`session/ui/models/presets`).
- Settings: `useSettings` Hook, aber implementiert `localStorage`-basierte Settings (siehe `config/settings.ts`), keine Dexie/Context.
- Dexie fehlt komplett (`rg "Dexie"` → kein Treffer). Lokale DB-Layer muss eingeführt werden (Sessions, Presets, Settings).
- `contexts` Ordner nur für `CustomRoles`/`Favorites`, nicht Domain-basiert.

## 13. Internationalisierung
- Kein i18n-Framework; Strings deutsch/englisch gemischt in Komponenten.
- `src/lib/i18n/locales` leer → good starting point but unused.
- Fallback-Mechanismus/Provider fehlt; `react-intl` oder simple dictionary muss eingeführt werden.

## 14. A11y, Gesten & Feedback
- Skip-Link vorhanden; Buttons nutzen `aria-label` teilweise.
- Fokus-Ringe teilweise via `focus-visible:shadow...` gelöst, aber unklar, ob alle Interaktionen abgedeckt (z. B. Chat history Chips, Quickstarts).
- `aria-live` nur in `VirtualizedMessageList`? (role="log"), aber `ChatMessage` Bubbles nicht `aria-live`.
- Gesten: `useEdgeSwipe` hooking, aber Drawer nicht focus-trapped; no haptic fallback.
- Prefers-reduced-motion nicht berücksichtigt (Animations in CSS).

## 15. Performance & PWA
- PWA: Manifest vorhanden, Service Worker `sw.js` (generated) + register helper; caching-Strategie ? (SW-Datei nicht geprüft). Kein Code-Splitting nach Features (nur route-level).
- Bundle-Budgets (>250 KB gz) unvalidiert; `EnhancedModelsInterface` + heavy CSS (neomorphic) likely pushes size.
- CSS Purge: Tailwind default; zusätzliche global CSS-Dateien könnten ungenutzte Klassen enthalten.
- Virtualized list existiert, aber Quickstart/Hero-Bereich hat viele DOM-Knoten + gradients → jank risk.

## 16. Tests & QA
- Unit Tests zahlreich unter `__tests__` (analytics, models, network), aber UI-Komponenten kaum abgedeckt (nur `button.test.tsx`).
- Chat Flow Tests? In `tests`? `tests` Ordner existiert (Playwright config), aber E2E Szenarien aus Master-Prompt (send message, abort, model switch, session CRUD, preset import/export) nicht implementiert.
- Lighthouse config (`lighthouserc.cjs`) existiert, aber Scores unbekannt; Input CSS (dark default) evtl. bremst.

## 17. Entfernen / Migrieren (erste Liste)
1. Layout/Navigation:
   - `src/components/layout/DesktopSidebar.tsx`, `GlobalNav.tsx`, `MobilePageShell.tsx`, `PageLoader.tsx` → ersetzen durch neues `features/shell`.
2. Chat Legacy:
   - `src/components/chat/ChatMessage.tsx.backup*`, `WelcomeScreen`, `ChatHistorySidebar`, `MobileChatHistorySidebar`, `ChatList` (Neomorph Look) → neu implementieren bzw. ersetzen durch `features/chat`.
3. Styles:
   - `src/styles/neomorphic-utilities.css`, `brand-panel`/`neo-*` utilities, `index.css` gradient/hard-coded backgrounds → entfernen nach Migration.
4. Storage:
   - `src/lib/conversation-manager.ts` + zugehörige `Conversation` utils → ersetzen durch Dexie-basierten Layer.
5. Pages:
   - `src/pages/*.tsx` (Chat, MobileModels, MobileStudio, Settings*) → durch Domain Routen `features/*/routes` ablösen.
6. Config/Docs:
   - `docs/archive/**`, `report/**`, `.backup` etc. -> optional archivieren/entfernen zur Reduktion.

## 18. Empfohlene nächste Schritte
1. Definiere neues Designsysten (Tokens, Tailwind extend, data-theme) gem. Abschnitt 4 Master-Prompt.
2. Richte neue Ordnerstruktur ein (`features/{chat,sessions,presets,models,extras,settings}`, `shared/{ui,lib,types}`) und verschiebe/ersetz alte Komponenten iterativ.
3. Implementiere `AppShell`, `BottomNav`, `SideDrawer`, Drawer Infrastructure + gestures/haptics.
4. Portiere Chat Domain (Header, MessageList/Bubble, Composer, QuickChips, streaming states).
5. Erstelle Dexie Layer (sessions, presets, settings) + Context-Slices + i18n Setup.
6. Plane Tests/E2E & Lighthouse-Budgets vor Umsetzung; definierte Checkliste aus Master-Prompt als Definition of Done.

---
Notes: Zusammengeführt aus Prompt-Ablaufplan und Audit; keine Codefunktionen verändert.
