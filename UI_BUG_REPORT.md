# UI Bug Report

Stand: 2026-02-27T23:48:59+01:00  
Branch: `fix/spa-audit-wave-1`  
Commit: `6d202252`

## 1) Route-Landkarte

- `/` -> redirect `/chat`
- `/chat`
- `/studio` -> redirect `/chat`
- `/roles`
- `/chat/history`
- `/themen`
- `/models`
- `/feedback`
- `/settings`
- `/settings/memory`
- `/settings/behavior`
- `/settings/youth`
- `/settings/api-data`
- `/settings/filters` -> redirect `/settings/youth`
- `/settings/extras`
- `/settings/appearance`
- `/settings/api`
- `/settings/data` -> redirect `/settings/api-data`
- `/impressum`
- `/datenschutz`

## 2) Globale UI-Schichten

- Header/Nav (mobile + desktop)
- Desktop-Sidebar
- AppMenuDrawer (Portal)
- HistorySidePanel (Portal)
- Dialog Layer (Radix)
- BottomSheet Layer (Portal)
- ContextMenu Layer (Portal)
- Select/Dropdown Layer (Portal)
- Toast Layer (`toast-root`)
- Tooltip Layer
- Overlay Root (`#app-overlay-root`)
- Phone Frame (`phone-frame-wrapper` / `phone-frame-content`)
- PWA Install Modal
- Neko/Mascot Layer (Portal)

## 3) UI Test Matrix

### 3.1 Geräte/Browser/Themes

| Umfeld           | Light | Dark |          Auto/System |
| ---------------- | ----: | ---: | -------------------: |
| Chrome Desktop   |    ✅ |   ✅ | ✅ (Appearance-Flow) |
| Firefox Desktop  |    ✅ |   ✅ | ✅ (Appearance-Flow) |
| Chrome iPhone SE |    ✅ |   ✅ | ✅ (Appearance-Flow) |
| Chrome iPhone 13 |    ✅ |   ✅ | ✅ (Appearance-Flow) |
| Chrome Pixel 7   |    ✅ |   ✅ | ✅ (Appearance-Flow) |

Quelle: `.tmp/theme_matrix_results.json` (150 Checks, 0 Failed) + `.tmp/ui_qa_audit_reliable_results.json`.

### 3.2 States

| State                                    | Chrome Desktop | Firefox Desktop | iPhone SE | iPhone 13 | Pixel 7 |
| ---------------------------------------- | -------------: | --------------: | --------: | --------: | ------: |
| Default route rendering                  |             ✅ |              ✅ |        ✅ |        ✅ |      ✅ |
| Drawer open/close (ESC/Backdrop)         |             ✅ |              ✅ |        ✅ |        ✅ |      ✅ |
| Drawer scroll-lock style                 |             ✅ |              ✅ |        ✅ |        ✅ |      ✅ |
| Browser Back mit offenem Drawer          |             ✅ |              ✅ |        ✅ |        ✅ |      ✅ |
| Keyboard auf/zu (sim. viewport shrink)   |            n/a |             n/a |        ✅ |        ✅ |      ✅ |
| Rotation portrait/landscape              |            n/a |             n/a |        ✅ |        ✅ |      ✅ |
| Address bar in/out (sim. viewport +/-80) |            n/a |             n/a |        ✅ |        ✅ |      ✅ |
| Reduced Motion an                        |             ✅ |              ✅ |        ✅ |        ✅ |      ✅ |

Quellen: `.tmp/ui_qa_audit_reliable_results.json`, `.tmp/addressbar_sim_results.json`, `.tmp/reduced_motion_results.json`, `.tmp/drawer_outside_esc_result.json`, `.tmp/drawer_back_with_history_result.json`.

## 4) Priorisierte Bugliste

## [UB-001] "Details"-Buttons sind nicht klickbar (Event-Interception)

- Route/Screen: `/models`, `/roles`, `/settings`
- Gerät/Browser: Chrome Desktop + mobile (reproduzierbar in allen geprüften Chrome-Profilen)
- Repro Steps:
  1. `npm run dev -- --port=5177`
  2. Route `/models` öffnen.
  3. Auf ersten Button `Details` klicken.
- Erwartet: Detail-Dialog/BottomSheet öffnet sich.
- Tatsächlich: Klick wird abgefangen; Playwright meldet `intercepts pointer events` durch `div.absolute.inset-0.z-sticky-header`.
- Schweregrad: high
- Ursache (wenn klar): Press-Overlay in `ListRow` liegt über Trailing-Buttons.
- Fix-Vorschlag (konkret, minimal): In [`src/ui/ListRow.tsx`](/home/d/Schreibtisch/Disa_Ai/src/ui/ListRow.tsx) Overlay-Z-Order hinter Trailing legen oder Row-Press auf Container verlagern.
- Verifikation: `node .tmp/details_click_check.mjs` muss `clickable: true` liefern.
- Screenshot/Video Hinweis (falls vorhanden): `test-results/ui-qa-shots/models-details-intercept.png`

## [UB-002] `/chat/history` hat kein `main`-Landmark

- Route/Screen: `/chat/history`
- Gerät/Browser: Chrome Desktop, Firefox Desktop, iPhone SE/13, Pixel 7
- Repro Steps:
  1. Route `/chat/history` öffnen.
  2. Axe-Check laufen lassen (`node .tmp/ui_qa_audit_reliable.mjs`).
- Erwartet: Genau ein `main`-Landmark.
- Tatsächlich: `mainCount = 0` + Axe `landmark-one-main`.
- Schweregrad: high
- Ursache (wenn klar): Chat-Mode-Erkennung behandelt `/chat/history` wie `/chat`.
- Fix-Vorschlag (konkret, minimal): [`src/app/layouts/AppShell.tsx`](/home/d/Schreibtisch/Disa_Ai/src/app/layouts/AppShell.tsx): `isChatMode` nur für `/chat` setzen.
- Verifikation: Axe-Verstoß `landmark-one-main` auf `/chat/history` verschwindet.
- Screenshot/Video Hinweis (falls vorhanden): `test-results/ui-qa-shots/chat-history.png`

## [UB-003] Skip-Link-Ziel fehlt auf `/chat/history`

- Route/Screen: `/chat/history`
- Gerät/Browser: Chrome Desktop, Firefox Desktop, iPhone SE/13, Pixel 7
- Repro Steps:
  1. `/chat/history` öffnen.
  2. Skip-Link "Zum Hauptinhalt springen" fokussieren/aktivieren.
- Erwartet: Fokus springt zu `#main`.
- Tatsächlich: `#main` existiert nicht (`skipTargetExists=false`).
- Schweregrad: medium
- Ursache (wenn klar): Wie UB-002 (Chat-Mode blendet `id="main"` aus).
- Fix-Vorschlag (konkret, minimal): Wie UB-002; `main` auf `/chat/history` wiederherstellen.
- Verifikation: `skipTargetExists=true` in Audit-JSON.
- Screenshot/Video Hinweis (falls vorhanden): `test-results/ui-qa-shots/chat-history.png`

## [UB-004] Menü-Button trifft 44x44 Touch-Target nicht

- Route/Screen: Fast alle Shell-Seiten
- Gerät/Browser: Chrome + Firefox Desktop, iPhone SE/13, Pixel 7
- Repro Steps:
  1. `/models` (oder andere Shell-Route) öffnen.
  2. Menü-Icon messen.
- Erwartet: Mindestens 44x44 px.
- Tatsächlich: 40x40 px (`aria-label="Menü öffnen"`).
- Schweregrad: medium
- Ursache (wenn klar): `w-10 h-10` im MenuIcon.
- Fix-Vorschlag (konkret, minimal): [`src/components/layout/AppMenuDrawer.tsx`](/home/d/Schreibtisch/Disa_Ai/src/components/layout/AppMenuDrawer.tsx) `w-11 h-11` + `min-h/min-w` 44 setzen.
- Verifikation: `node .tmp/small_targets_dump.mjs` zeigt Menü-Button >=44.
- Screenshot/Video Hinweis (falls vorhanden): `test-results/ui-qa-shots/settings-appearance-controls.png`

## [UB-005] Chat "Mehr Optionen"-Button schrumpft auf ~17px Breite + kein `aria-label`

- Route/Screen: `/chat`
- Gerät/Browser: Chrome Desktop, iPhone SE/13, Pixel 7
- Repro Steps:
  1. `/chat` öffnen.
  2. Button mit Titel "Mehr Optionen" inspizieren.
- Erwartet: 44x44 + zugängliche Benennung (`aria-label`).
- Tatsächlich: Breite ~17.45 px, Höhe 44 px, `aria-label=null`.
- Schweregrad: high
- Ursache (wenn klar): Flex-Shrink auf Button + nur `title`, kein `aria-label`.
- Fix-Vorschlag (konkret, minimal): [`src/components/chat/UnifiedInputBar.tsx`](/home/d/Schreibtisch/Disa_Ai/src/components/chat/UnifiedInputBar.tsx) `shrink-0 min-w-[44px]` + `aria-label` ergänzen.
- Verifikation: Small-target-Audit für `/chat` ohne 17x44-Fund.
- Screenshot/Video Hinweis (falls vorhanden): `test-results/ui-qa-shots/chat-history.png`

## [UB-006] Theme-Buttons in Darstellung sind zu niedrig

- Route/Screen: `/settings/appearance`
- Gerät/Browser: Chrome + Firefox Desktop, iPhone SE/13, Pixel 7
- Repro Steps:
  1. `/settings/appearance` öffnen.
  2. Buttons `Hell/Dunkel/Auto` messen.
- Erwartet: Touch-Targets >=44 px Höhe.
- Tatsächlich: 28 px Höhe.
- Schweregrad: medium
- Ursache (wenn klar): `py-1.5 text-xs` ohne Mindesthöhe.
- Fix-Vorschlag (konkret, minimal): [`src/features/settings/components/AppearanceSettingsPanel.tsx`](/home/d/Schreibtisch/Disa_Ai/src/features/settings/components/AppearanceSettingsPanel.tsx) auf `min-h-[44px]` erhöhen.
- Verifikation: `small_targets_dump` ohne diese drei Treffer.
- Screenshot/Video Hinweis (falls vorhanden): `test-results/ui-qa-shots/settings-appearance-controls.png`

## [UB-007] Slider in Darstellung: keine Label-Verknüpfung + nur 8px Höhe

- Route/Screen: `/settings/appearance`
- Gerät/Browser: Chrome + Firefox Desktop, iPhone SE/13, Pixel 7
- Repro Steps:
  1. `/settings/appearance` öffnen.
  2. Axe + Touch-Target-Check ausführen.
- Erwartet: Form-Control mit Label/`aria-label` + bedienbarer Touch-Fläche.
- Tatsächlich: Axe `label`-Violation; Slider-Höhe 8 px.
- Schweregrad: high
- Ursache (wenn klar): `Label` nicht per `htmlFor`/`id` gebunden; kleiner Range-Track.
- Fix-Vorschlag (konkret, minimal): In [`AppearanceSettingsPanel.tsx`](/home/d/Schreibtisch/Disa_Ai/src/features/settings/components/AppearanceSettingsPanel.tsx) `id` + `htmlFor` + größere Touch-Fläche (Wrapper) ergänzen.
- Verifikation: Axe `label` entfällt; Small-target für Range entfällt.
- Screenshot/Video Hinweis (falls vorhanden): `test-results/ui-qa-shots/settings-appearance-controls.png`

## [UB-008] Switches in Darstellung haben keinen zugänglichen Namen

- Route/Screen: `/settings/appearance`
- Gerät/Browser: Chrome + Firefox Desktop
- Repro Steps:
  1. Axe-Check auf `/settings/appearance`.
- Erwartet: Jeder Switch mit `aria-label` oder `aria-labelledby`.
- Tatsächlich: Axe `button-name` für mehrere `button.peer.inline-flex.h-6.w-11`.
- Schweregrad: high
- Ursache (wenn klar): `Switch` wird ohne zugängliche Namenszuweisung verwendet.
- Fix-Vorschlag (konkret, minimal): Switch-Instanzen in [`AppearanceSettingsPanel.tsx`](/home/d/Schreibtisch/Disa_Ai/src/features/settings/components/AppearanceSettingsPanel.tsx) mit `aria-label`/`aria-labelledby` versehen.
- Verifikation: Axe `button-name` auf `/settings/appearance` verschwindet.
- Screenshot/Video Hinweis (falls vorhanden): `test-results/ui-qa-shots/settings-appearance-controls.png`

## [UB-009] Switches in Gedächtnis haben keinen zugänglichen Namen

- Route/Screen: `/settings/memory`
- Gerät/Browser: Chrome + Firefox Desktop
- Repro Steps:
  1. Axe-Check auf `/settings/memory`.
- Erwartet: Schalter sind durch Screenreader benannt.
- Tatsächlich: Axe `button-name` auf Toggle-Switches.
- Schweregrad: high
- Ursache (wenn klar): `SettingsToggleRow` übergibt keinen zugänglichen Namen an `Switch`.
- Fix-Vorschlag (konkret, minimal): [`src/ui/SettingsRow.tsx`](/home/d/Schreibtisch/Disa_Ai/src/ui/SettingsRow.tsx) um `aria-labelledby`-Verknüpfung zwischen Label und Switch erweitern.
- Verifikation: Axe `button-name` auf `/settings/memory` verschwindet.
- Screenshot/Video Hinweis (falls vorhanden): n/a

## [UB-010] Switch in Extras hat keinen zugänglichen Namen

- Route/Screen: `/settings/extras`
- Gerät/Browser: Chrome + Firefox Desktop
- Repro Steps:
  1. Axe-Check auf `/settings/extras`.
- Erwartet: Switch mit sprechendem Namen.
- Tatsächlich: Axe `button-name` auf `.peer`.
- Schweregrad: high
- Ursache (wenn klar): `Switch` als `trailing` in `ListRow` ohne Name.
- Fix-Vorschlag (konkret, minimal): [`src/features/settings/SettingsExtrasView.tsx`](/home/d/Schreibtisch/Disa_Ai/src/features/settings/SettingsExtrasView.tsx) `aria-label="Neko-Katze anzeigen"` ergänzen.
- Verifikation: Axe `button-name` auf `/settings/extras` verschwindet.
- Screenshot/Video Hinweis (falls vorhanden): n/a

## [UB-011] Gedächtnis-Textinputs sind nur 36px hoch

- Route/Screen: `/settings/memory`
- Gerät/Browser: Chrome + Firefox Desktop, iPhone SE/13, Pixel 7
- Repro Steps:
  1. `/settings/memory` öffnen.
  2. Inputs `Name/Interessen/Hintergrund` messen.
- Erwartet: Touch-Targets >=44 px Höhe.
- Tatsächlich: 36 px Höhe (`h-9`).
- Schweregrad: medium
- Ursache (wenn klar): Input-Klassen setzen `h-9`.
- Fix-Vorschlag (konkret, minimal): [`src/features/settings/SettingsMemoryView.tsx`](/home/d/Schreibtisch/Disa_Ai/src/features/settings/SettingsMemoryView.tsx) auf `h-11` anheben.
- Verifikation: Small-target-Liste ohne 36px-Inputs.
- Screenshot/Video Hinweis (falls vorhanden): n/a

## [UB-012] API-Key-Visibility-Button ist 32x32

- Route/Screen: `/settings/api-data`
- Gerät/Browser: Chrome + Firefox Desktop, iPhone SE/13, Pixel 7
- Repro Steps:
  1. `/settings/api-data` öffnen.
  2. `Key anzeigen`-Button messen.
- Erwartet: >=44x44.
- Tatsächlich: 32x32.
- Schweregrad: medium
- Ursache (wenn klar): Zu kleine absolute Button-Dimension.
- Fix-Vorschlag (konkret, minimal): [`src/features/settings/SettingsApiDataView.tsx`](/home/d/Schreibtisch/Disa_Ai/src/features/settings/SettingsApiDataView.tsx) auf 44x44 + ggf. Icon zentrieren.
- Verifikation: Small-target-Liste ohne `Key anzeigen`-Treffer.
- Screenshot/Video Hinweis (falls vorhanden): n/a

## [UB-013] Rollen-Kategoriechips sind zu klein und als `div role="button"` umgesetzt

- Route/Screen: `/roles`
- Gerät/Browser: Chrome + Firefox Desktop, iPhone SE/13, Pixel 7
- Repro Steps:
  1. `/roles` öffnen.
  2. Chips `Assistance`, `Creative` usw. messen.
- Erwartet: Native Buttons mit >=44px Höhe.
- Tatsächlich: 30px (und `Favoriten` nur 18px), semantisch `div role="button"`.
- Schweregrad: medium
- Ursache (wenn klar): Nicht-native Controls + kompakte Chip-Höhen.
- Fix-Vorschlag (konkret, minimal): [`src/components/roles/EnhancedRolesInterface.tsx`](/home/d/Schreibtisch/Disa_Ai/src/components/roles/EnhancedRolesInterface.tsx) Chips auf `<button>` + `min-h-[44px]`.
- Verifikation: Small-target-Funde für Kategoriechips entfallen.
- Screenshot/Video Hinweis (falls vorhanden): `test-results/ui-qa-shots/roles-filter-tiny.png`

## [UB-014] Tippfehler-Klasse auf Favoriten-Chip führt zu 0px Padding

- Route/Screen: `/roles`
- Gerät/Browser: Chrome Desktop + mobile
- Repro Steps:
  1. `/roles` öffnen.
  2. Chip `Favoriten` inspizieren.
- Erwartet: Innenabstand wie andere Chips.
- Tatsächlich: Klasse `px-2xspy-1.5`; berechnetes Padding links/rechts/oben/unten = `0px`; Chip nur 18px hoch.
- Schweregrad: medium
- Ursache (wenn klar): Tippfehler in Utility-Class.
- Fix-Vorschlag (konkret, minimal): In [`EnhancedRolesInterface.tsx`](/home/d/Schreibtisch/Disa_Ai/src/components/roles/EnhancedRolesInterface.tsx) auf `px-2 py-1.5` korrigieren (oder einheitlich `px-3 py-1.5`).
- Verifikation: Chip-Padding >0 + Höhe >=44 nach Zielanpassung.
- Screenshot/Video Hinweis (falls vorhanden): `test-results/ui-qa-shots/roles-filter-tiny.png`

## [UB-015] Inhaltsverzeichnis-Links auf Impressum sind nicht touch-freundlich

- Route/Screen: `/impressum`
- Gerät/Browser: Chrome + Firefox Desktop, iPhone SE/13, Pixel 7
- Repro Steps:
  1. `/impressum` öffnen.
  2. TOC-Linkgrößen messen (`Angaben gemäß §5 TMG`, `Kontakt`, ...).
- Erwartet: Touch-freundliche Links (mind. 44px Höhe/Zeilenbox).
- Tatsächlich: Link-Höhen ~17px.
- Schweregrad: medium
- Ursache (wenn klar): Inline-Link-Styling ohne Touch-Target-Erweiterung.
- Fix-Vorschlag (konkret, minimal): [`src/pages/ImpressumPage.tsx`](/home/d/Schreibtisch/Disa_Ai/src/pages/ImpressumPage.tsx) TOC-Links als `block` + `py-2`/`min-h-[44px]`.
- Verifikation: Small-target-Audit ohne TOC-Link-Funde.
- Screenshot/Video Hinweis (falls vorhanden): `test-results/ui-qa-shots/datenschutz-links.png`

## [UB-016] Inhaltsverzeichnis-Links auf Datenschutz sind nicht touch-freundlich

- Route/Screen: `/datenschutz`
- Gerät/Browser: Chrome + Firefox Desktop, iPhone SE/13, Pixel 7
- Repro Steps:
  1. `/datenschutz` öffnen.
  2. TOC-Linkgrößen messen.
- Erwartet: Touch-Targets >=44px.
- Tatsächlich: viele Links 17px Höhe.
- Schweregrad: medium
- Ursache (wenn klar): Gleiches Muster wie UB-015.
- Fix-Vorschlag (konkret, minimal): [`src/pages/DatenschutzPage.tsx`](/home/d/Schreibtisch/Disa_Ai/src/pages/DatenschutzPage.tsx) TOC-Link-Layout auf block/touch-target.
- Verifikation: Small-target-Audit ohne Datenschutz-TOC-Funde.
- Screenshot/Video Hinweis (falls vorhanden): `test-results/ui-qa-shots/datenschutz-links.png`

## [UB-017] Heading-Hierarchie in Gedächtnis springt von H1 auf H3

- Route/Screen: `/settings/memory`
- Gerät/Browser: Chrome + Firefox Desktop
- Repro Steps:
  1. Axe auf `/settings/memory` ausführen.
- Erwartet: Sequenzielle Heading-Ebenen.
- Tatsächlich: Axe `heading-order`.
- Schweregrad: low
- Ursache (wenn klar): `SettingsSection` nutzt `h3` direkt unter Seiten-`h1`.
- Fix-Vorschlag (konkret, minimal): [`src/ui/SettingsRow.tsx`](/home/d/Schreibtisch/Disa_Ai/src/ui/SettingsRow.tsx) `h3` -> `h2` (oder konsistente Struktur).
- Verifikation: Axe `heading-order` verschwindet auf `/settings/memory`.
- Screenshot/Video Hinweis (falls vorhanden): n/a

## [UB-018] Heading-Hierarchie in Verhalten springt

- Route/Screen: `/settings/behavior`
- Gerät/Browser: Chrome + Firefox Desktop
- Repro Steps:
  1. Axe auf `/settings/behavior` ausführen.
- Erwartet: Korrekte Heading-Reihenfolge.
- Tatsächlich: Axe `heading-order`.
- Schweregrad: low
- Ursache (wenn klar): Unterkomponenten nutzen Headings nicht hierarchisch.
- Fix-Vorschlag (konkret, minimal): [`src/features/settings/SettingsBehaviorView.tsx`](/home/d/Schreibtisch/Disa_Ai/src/features/settings/SettingsBehaviorView.tsx) + Kindkomponenten Heading-Level angleichen.
- Verifikation: Axe `heading-order` verschwindet.
- Screenshot/Video Hinweis (falls vorhanden): n/a

## [UB-019] Heading-Hierarchie in API & Daten springt

- Route/Screen: `/settings/api-data`
- Gerät/Browser: Chrome + Firefox Desktop
- Repro Steps:
  1. Axe auf `/settings/api-data` ausführen.
- Erwartet: Konsistente Heading-Struktur.
- Tatsächlich: Axe `heading-order`.
- Schweregrad: low
- Ursache (wenn klar): Section-Headings nicht sequenziell.
- Fix-Vorschlag (konkret, minimal): [`src/features/settings/SettingsApiDataView.tsx`](/home/d/Schreibtisch/Disa_Ai/src/features/settings/SettingsApiDataView.tsx) Heading-Level anpassen.
- Verifikation: Axe `heading-order` verschwindet.
- Screenshot/Video Hinweis (falls vorhanden): n/a

## [UB-020] Quickstart-Buttons im Chat verwenden ungültige ARIA-Rolle (`listitem` auf `button`)

- Route/Screen: `/chat`
- Gerät/Browser: Chrome + Firefox Desktop
- Repro Steps:
  1. Axe auf `/chat` ausführen.
  2. QuickstartStrip prüfen.
- Erwartet: Semantisch korrektes List-Markup.
- Tatsächlich: Axe `aria-allowed-role`.
- Schweregrad: medium
- Ursache (wenn klar): `role="listitem"` direkt auf `<button>`.
- Fix-Vorschlag (konkret, minimal): [`src/components/chat/QuickstartStrip.tsx`](/home/d/Schreibtisch/Disa_Ai/src/components/chat/QuickstartStrip.tsx) auf `<ul><li><button>` umstellen.
- Verifikation: Axe `aria-allowed-role` auf `/chat` verschwindet.
- Screenshot/Video Hinweis (falls vorhanden): n/a

## [UB-021] Kontrastproblem in Chat (Model-Pill/Chip-Text)

- Route/Screen: `/chat`
- Gerät/Browser: Chrome + Firefox Desktop
- Repro Steps:
  1. Axe auf `/chat` ausführen.
- Erwartet: Kontrast >= WCAG AA.
- Tatsächlich: Axe `color-contrast` (3.89:1) auf `.max-w-[80px].truncate`.
- Schweregrad: medium
- Ursache (wenn klar): Akzenttext auf dunklem Brand-Hintergrund zu schwach.
- Fix-Vorschlag (konkret, minimal): Text-/Hintergrundtoken leicht anheben in Chat-Pill-Komponenten.
- Verifikation: Axe `color-contrast` auf `/chat` entfällt.
- Screenshot/Video Hinweis (falls vorhanden): n/a

## [UB-022] Kontrastproblem in Extras (kleines Badge/Text)

- Route/Screen: `/settings/extras`
- Gerät/Browser: Chrome + Firefox Desktop
- Repro Steps:
  1. Axe auf `/settings/extras` ausführen.
- Erwartet: Kontrast >= WCAG AA.
- Tatsächlich: Axe `color-contrast` (3.75:1) auf `.rounded-md`-Element.
- Schweregrad: medium
- Ursache (wenn klar): Niedriger Kontrast im Badge-/Chip-Styling.
- Fix-Vorschlag (konkret, minimal): Badge-Farbtoken in Extras-Kontext erhöhen.
- Verifikation: Axe `color-contrast` entfällt.
- Screenshot/Video Hinweis (falls vorhanden): n/a

## [UB-023] Kontrastproblem in Chat-History (Button-Text)

- Route/Screen: `/chat/history`
- Gerät/Browser: Chrome + Firefox Desktop
- Repro Steps:
  1. Axe auf `/chat/history` ausführen.
- Erwartet: Kontrast >= WCAG AA.
- Tatsächlich: Axe `color-contrast` (4.23:1) auf Button-Text.
- Schweregrad: medium
- Ursache (wenn klar): Weiß auf violettem Button bei kleiner Schrift knapp unter AA.
- Fix-Vorschlag (konkret, minimal): Schriftgröße/Weight erhöhen oder Button-Hintergrund abdunkeln.
- Verifikation: Axe `color-contrast` auf `/chat/history` entfällt.
- Screenshot/Video Hinweis (falls vorhanden): `test-results/ui-qa-shots/chat-history.png`

## [UB-024] Globales `overflow-x: hidden` auf `html` + `body` maskiert potenzielle Overflow-Ursachen

- Route/Screen: global (App Root)
- Gerät/Browser: alle
- Repro Steps:
  1. App laden.
  2. DevTools: `document.documentElement.style.overflowX`, `document.body.style.overflowX` prüfen.
- Erwartet: Kein globales Hard-Hide, außer nachgewiesener Notfall-Fix.
- Tatsächlich: Beide werden in `App.tsx` auf `hidden` gesetzt.
- Schweregrad: medium
- Ursache (wenn klar): Globaler "Prevent horizontal scrolling"-Workaround.
- Fix-Vorschlag (konkret, minimal): [`src/App.tsx`](/home/d/Schreibtisch/Disa_Ai/src/App.tsx) globales hide entfernen und echte Overflow-Quellen komponentenspezifisch beheben.
- Verifikation: Kein globales hard-hide; gezielte Layout-Regressionstests weiter grün.
- Screenshot/Video Hinweis (falls vorhanden): n/a

## 5) Top-5 Fix-Pläne

Hinweis: Diese Top-5 wurden am 2026-02-28 in kleinen Fix-Wellen umgesetzt und verifiziert.

### Top-1: Interaktions-Blocker "Details" lösen

- Betroffene Dateien: [`src/ui/ListRow.tsx`](/home/d/Schreibtisch/Disa_Ai/src/ui/ListRow.tsx)
- Änderung: Press-Layer-Z-Order korrigieren, sodass `trailing`/`topRight` klickbar bleiben.
- Minimaler Ansatz: Overlay entfernen und `onPress`/Keyboard direkt auf dem äußeren Container behandeln; bestehende `stopPropagation` in Buttons beibehalten.
- Verifikation: `.tmp/details_click_check.mjs` -> alle `clickable: true`.

### Top-2: `/chat/history` wieder in semantische Shell bringen

- Betroffene Dateien: [`src/app/layouts/AppShell.tsx`](/home/d/Schreibtisch/Disa_Ai/src/app/layouts/AppShell.tsx)
- Änderung: `isChatMode` nur für `/chat` aktivieren (nicht `/chat/history`).
- Effekt: `main`/Skip-Link/H1/Region-Landmarks wieder korrekt.
- Verifikation: Axe-Verstöße `landmark-one-main`, `page-has-heading-one`, `region` verschwinden auf `/chat/history`.

### Top-3: Touch-Target-Baseline auf 44x44 ziehen

- Betroffene Dateien:
  - [`src/components/layout/AppMenuDrawer.tsx`](/home/d/Schreibtisch/Disa_Ai/src/components/layout/AppMenuDrawer.tsx)
  - [`src/components/chat/UnifiedInputBar.tsx`](/home/d/Schreibtisch/Disa_Ai/src/components/chat/UnifiedInputBar.tsx)
  - [`src/features/settings/SettingsApiDataView.tsx`](/home/d/Schreibtisch/Disa_Ai/src/features/settings/SettingsApiDataView.tsx)
- Änderung: Menü-Button 40->44, More-Options-Button gegen Shrink fixen + `aria-label`, Key-Button 32->44.
- Verifikation: Small-target-Audit ohne diese Kern-Treffer.

### Top-4: Settings-A11y paketieren (Labels + Switch-Namen)

- Betroffene Dateien:
  - [`src/features/settings/components/AppearanceSettingsPanel.tsx`](/home/d/Schreibtisch/Disa_Ai/src/features/settings/components/AppearanceSettingsPanel.tsx)
  - [`src/ui/SettingsRow.tsx`](/home/d/Schreibtisch/Disa_Ai/src/ui/SettingsRow.tsx)
  - [`src/features/settings/SettingsExtrasView.tsx`](/home/d/Schreibtisch/Disa_Ai/src/features/settings/SettingsExtrasView.tsx)
- Änderung: `id/htmlFor` für Range/Input; `aria-label`/`aria-labelledby` für alle Switches; Theme-Segment min-height anheben.
- Verifikation: Axe `button-name` + `label` auf Settings-Routen beseitigt.

### Top-5: Rollenfilter + Legal TOC touch-freundlich

- Betroffene Dateien:
  - [`src/components/roles/EnhancedRolesInterface.tsx`](/home/d/Schreibtisch/Disa_Ai/src/components/roles/EnhancedRolesInterface.tsx)
  - [`src/pages/ImpressumPage.tsx`](/home/d/Schreibtisch/Disa_Ai/src/pages/ImpressumPage.tsx)
  - [`src/pages/DatenschutzPage.tsx`](/home/d/Schreibtisch/Disa_Ai/src/pages/DatenschutzPage.tsx)
- Änderung: `div role="button"` -> echte `<button>` + min-height 44; Tippfehler `px-2xspy-1.5` korrigieren; TOC-Links als block/tap-target.
- Verifikation: Rollen- und Legal-Touch-Target-Funde entfallen.

## 6) Artefakte

- Audit JSON: `.tmp/ui_qa_audit_reliable_results.json`
- Theme Matrix: `.tmp/theme_matrix_results.json`
- Reduced Motion: `.tmp/reduced_motion_results.json`
- Details-Click-Blocker: `.tmp/details_click_results.json`
- Addressbar-Simulation: `.tmp/addressbar_sim_results.json`
- Drawer Verhalten: `.tmp/drawer_outside_esc_result.json`, `.tmp/drawer_back_with_history_result.json`
- Screenshots: `test-results/ui-qa-shots/`

## 7) Fix-Status (2026-03-01)

### 7.1 Auf `fixed` gesetzt

- UB-001, UB-002, UB-003
- UB-004, UB-005
- UB-006, UB-007, UB-008
- UB-009, UB-010, UB-011, UB-012
- UB-013, UB-014
- UB-015, UB-016
- UB-020, UB-021, UB-022, UB-023

### 7.2 Weiterhin `open`

- (keine aus den priorisierten UB-001 bis UB-024)

### 7.3 Re-Checks nach Umsetzung

- `npm run lint` ✅
- `npm run typecheck` ✅
- `npm run build` ✅
- `node .tmp/details_click_check.mjs` ✅ (`/models`, `/roles`, `/settings` clickable)
- Axe Recheck (Chrome/Firefox): `/chat`, `/settings/extras`, `/chat/history` ohne `aria-allowed-role` und ohne `color-contrast` ✅
- `node .tmp/small_targets_dump.mjs`:
  - Rollenfilter-Chips ohne Sub-44 Treffer ✅
  - Impressum/Datenschutz TOC-Links ohne Sub-44 Treffer ✅
  - Memory-Inputs ohne 36px-Treffer (`h-11`) ✅
- Heading/Overflow Recheck (Chrome + Firefox):
  - `/settings/memory`, `/settings/behavior`, `/settings/api-data`: kein `heading-order` ✅
  - Kernrouten (`/chat`, `/models`, `/roles`, `/impressum`, `/datenschutz`): `htmlOverflowX/bodyOverflowX = null`, `docOverflow/bodyOverflow = 0` ✅
