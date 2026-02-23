# UI Fix Plan – Mobile Stabilisierung ohne Bottom Navigation

Datum: 2026-02-22  
Basis: `docs/reports/ui-baseline-2026-02-22/FINDINGS.md`, `docs/reports/ui-forensics.md`, Baseline-Screenshots

## Executive Summary

- Wir entfernen die Bottom Navigation vollständig und eliminieren alle daraus entstandenen Clearance-/Offset-Workarounds.
- Wir definieren pro Route genau einen Scroll-Owner und koppeln Scroll-Lock strikt an diesen Container.
- Wir vereinheitlichen alle Overlays auf **einen** Root und beseitigen die Frame-vs-Body-Layer-Inkonsistenz.
- Wir migrieren Layering vollständig auf `src/styles/z-index-system.css` (keine freien `z-*` Werte mehr).
- Wir trennen Keyboard-Offset von Safe-Area, mit einer einzigen Source of Truth für Insets.
- Wir reduzieren gleichzeitigen UI-Chrome (kein "alles auf einmal") und priorisieren Content > Primäraktion > Sekundäraktionen.
- Brand-Elemente (Glass/Notch/Akzente) bleiben erhalten, aber ruhiger und konsistenter eingesetzt.
- Erfolg wird über viewport-basierte Screenshot-Gates und verhaltensbezogene MUSS-Kriterien nachgewiesen.

---

## Zielbild

- Mobile First bleibt verbindlich.
- **Keine Bottom Navigation** (kein `MobileBottomNav`, kein fixed Bottom-Nav-Container, keine nav-bedingten Bottom-Offsets).
- Overlaps/Layering werden deterministisch beseitigt.
- Scroll/Keyboard-Verhalten wird pro Screen stabil und reproduzierbar.
- UI-Chrome wird reduziert („Ordnung und Ruhe“), Brand/Notch/Glass bleiben dezent erhalten.

---

## Architecture Decisions

### A) Scroll Owner pro Route (verbindlich)

**Entscheidung:** Pro Route exakt ein vertikaler Haupt-Scrollcontainer.

- `/chat`: `ChatMessageLog` (der Log-/Message-Container) ist der einzige Scroll-Owner.
- `/models`, `/roles`, `/settings`, `/themen`, `/feedback`: `AppShellMainContent` ist der einzige Scroll-Owner.
- Drawer/History/Sheet haben nur internen Scroll für ihren Inhalt, aber sind kein zusätzlicher Page-Scroll.

**Begründung:** Beseitigt doppelte Scrollbars, verhindert Scroll-Sprünge und macht Keyboard-/Overlay-Verhalten testbar.

### B) Overlay Root (body vs frame)

**Entscheidung:** Einheitlicher Overlay-Root im Phone-Frame (`.phone-frame-content`), z. B. `#app-overlay-root`.

- Alle Overlays/Portale rendern in diesen Root: Drawer, HistoryPanel, Dialogs, Sheets, Select-Popovers, Toasts.
- Keine Mischform mit `document.body` für Teilmengen.

**Begründung:** Overlays folgen exakt der mobilen Frame-Geometrie; kein Root-Split mehr zwischen visueller Fläche und technischer Portal-Ebene.

### C) Z-Index Policy (konkret)

**Entscheidung:** Nur semantische Tokens aus `src/styles/z-index-system.css`; keine freien `z-20`, `z-50`, `z-[...]`, kein Inline-`zIndex` für produktive UI-Layer.

Verbindliche Layer-Reihenfolge:

1. `--z-base: 0` (Content)
2. `--z-sticky: 100` (Header)
3. `--z-composer: 200` (Composer/Input)
4. `--z-fab: 220` (ScrollToBottom/FAB)
5. `--z-drawer: 400` (Drawer/HistoryPanel)
6. `--z-sheet: 500` (BottomSheet/Popover-Layer)
7. `--z-modal: 600` (Dialog/Modal)
8. `--z-toast: 700` (Toast)
9. `--z-tooltip: 800` (Tooltip/Transient Top Layer)

**Begründung:** Deterministische Reihenfolge ersetzt ad-hoc Layering und verhindert Regressionsroulette.

### D) Keyboard + Safe-Area Strategie

**Entscheidung:** Eine Source of Truth über Root-CSS-Variablen; Komponenten konsumieren nur semantische Insets.

- Safe-Area wird zentral bereitgestellt (`--inset-safe-top/right/bottom/left`).
- Keyboard-Offset separat (`--inset-keyboard-bottom`) und nur dort addiert, wo nötig (Composer/FAB-Positionierung).
- Keine parallele Mehrfachrechnung aus `env()` + JS + body-padding + component-padding.

**Begründung:** Verhindert doppelte Bottom-Reserven und stabilisiert Composer/Fokus in Keyboard-Zuständen.

### E) Navigation ohne Bottom Navigation

**Entscheidung:** Primärnavigation über Drawer + Top-Bar + kontextuelle Actions.

- `MobileBottomNav` wird entfernt/deaktiviert.
- Top-Bar zeigt nur wenige, stabile Primäraktionen.
- Drawer enthält globale Navigation; HistoryPanel ist kontextuell und mutual exclusive zum Drawer.

**Begründung:** Weniger konkurrierende Navigationsflächen, klarere Interaktionshierarchie, keine Bottom-Layer-Konflikte.

---

## Phase 1: Stabilität (Stacking + Scroll Owner + Portals + Safe-Area/Keyboard)

1. Scroll-Owner-Vertrag pro Route implementieren und dokumentieren.
2. Overlay-Root im Frame einführen und alle Portal-Komponenten dorthin migrieren.
3. Z-Index-Migration auf Token-only starten (`ScrollToBottom`, Composer, Drawer, Dialog/Sheet/Toast).
4. Safe-Area/Keyboard-Source-of-Truth implementieren, doppelte Insets entfernen.
5. Snapshot-Gate für Chat-Kernzustände (`default`, `drawer-open`, `history-open`, `keyboard-focus`) in 360/390/412/430.

**Ergebnis Phase 1:** Keine zufälligen Overlaps durch gemischte Scroll-/Portal-/Layer-Mechanik; Composer bleibt geometrisch stabil.

---

## Phase 2: Navigation ohne Bottom Nav (Remove offsets, Drawer/Top Actions, Chrome vereinfachen)

1. `MobileBottomNav` entfernen/deaktivieren.
2. Alle BottomNav-Abhängigkeiten entfernen:
   - `--app-bottom-nav-height`
   - `pb-[calc(...bottom-nav...)]`
   - nav-spezifische Offset-/Clearance-Hacks.
3. Top-Bar + Drawer Navigationsmodell finalisieren (globale vs kontextuelle Aktionen).
4. Drawer und HistoryPanel mutual exclusive erzwingen.

**Ergebnis Phase 2:** Navigation funktioniert vollständig ohne BottomNav; keine Nav-bedingten Bottom-Kollisionen mehr.

---

## Phase 3: Layout-Ruhe (Spacing, Reduktion gleichzeitiger Elemente, klare Prioritäten)

1. Sichtbarkeits-Hierarchie verbindlich machen:
   - Immer sichtbar: Header, Kerninhalt, primäre Eingabe/CTA.
   - Bei Bedarf: HistoryPanel, Filter-Pills, sekundäre Badges, Banner.
2. Gleichzeitige Chrome-Elemente begrenzen (kein Drawer + History + FAB + Banner-Stapel parallel).
3. Spacing-System routeübergreifend harmonisieren (`/chat`, `/models`, `/roles`, `/settings`, `/themen`, `/feedback`).
4. Chips/Pills/Badges reduzieren und in Panels/Drawer verlagern, wenn nicht primär.

**Ergebnis Phase 3:** Ruhigere, besser lesbare UI mit klarer Priorisierung auf 360–430px.

---

## Phase 4: Polish (Token-Konsistenz, weniger Motion, Brand bleibt)

1. Restliche ad-hoc Layoutwerte auf Tokens migrieren (Spacing/Insets/Layer/Shadow/Blur).
2. Animationen auf funktionale Zustandswechsel reduzieren (Drawer, Panel, Composer, FAB).
3. Brand-/Glass-/Notch-Akzente vereinheitlichen: subtil, konsistent, ohne Lesbarkeitsverlust.
4. Abschließendes visuelles QA-Gate gegen Baseline-Findings und Akzeptanzkriterien.

**Ergebnis Phase 4:** Stabil, konsistent und markentreu – ohne visuelle Überladung.

---

## Akzeptanzkriterien (MUSS)

- [ ] **Keine Overlaps** in Viewports 360x800 / 390x844 / 412x915 / 430x932 (Nachweis über Screenshots auf `/chat`, `/models`, `/roles`, `/settings`, `/themen`, `/feedback`).
- [ ] Composer/Input wird **nie** verdeckt oder abgeschnitten (inkl. `keyboard-focus`).
- [ ] Composer/Input wird nicht von Panels/Sheets/Toasts überlagert; Fokus/ScrollIntoView bleibt stabil.
- [ ] Drawer und HistoryPanel liegen immer über Content und sperren den Hintergrund-Scroll korrekt.
- [ ] `ScrollToBottom` (falls aktiv) ist immer nutzbar, nie hinter Composer/Overlay, Position safe-area-konsistent.
- [ ] Keine doppelte Scrollbar: niemals Kombination aus Body-Scroll + Inner-Scroll als Seiten-Scroll.
- [ ] **Keine Bottom Navigation** im UI und im Layout-System (inkl. entfernter Variablen/Offsets/Container).
- [ ] Z-Index-Regeln sind vollständig zentralisiert (keine freien `z-*` Werte in produktiven Layern).
- [ ] Safe-Area + Keyboard verwenden genau eine zentrale Berechnung (keine doppelte Bottom-Anrechnung).
- [ ] Portal-Strategie ist einheitlich (alle Overlays im definierten Overlay-Root).
- [ ] Visuelle Ruhe ist nachweisbar verbessert (geringere Dichte, klare Abstände, konsistente Typografie, weniger Dauer-Chrome).

---

## Risiken

1. **Discoverability-Risiko** nach Entfernen der Bottom-Navigation.
2. **Regressionsrisiko** bei Keyboard-/Scroll-Lock auf iOS Safari und Android Chrome.
3. **Portal-Migrationsrisiko** bei Focus Trap, `aria-modal`, Escape/Outside-Click-Verhalten.
4. **Token-Migrationsrisiko** bei versteckten Resten freier z-index-/offset-Werte.

---

## Rollback Strategy

- Umsetzung strikt phasenweise mit isolierten Commits.
- Vor jeder Phase Snapshot-Baseline, nach jeder Phase Screenshot-/Verhaltens-Gate.
- Rollback nur der zuletzt eingeführten Phase (kein Full-Revert), dann Ursachenisolierung.
- Re-Apply nur mit klarer Hypothese und nachgewiesener Wirkung gegen MUSS-Kriterien.

---

## Do NOT Do

- Keine random z-index Fixes außerhalb der zentralen Policy.
- Keine hardcoded Pixel-Offsets als Dauerlösung.
- Keine neuen UI-Primitiven ohne klare Notwendigkeit.
- Kein kosmetisches Rumgeschiebe ohne Root-Cause-Fix.
- Kein "alles gleichzeitig" (Drawer + HistoryPanel + Pills + FAB + Banner-Stapel).
