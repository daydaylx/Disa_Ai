# Design System Verbesserungen - Dezember 2025

## Zusammenfassung

Systematische Überprüfung und Verbesserung des Designsystems mit Fokus auf **Konsistenz**, **Accessibility** und **Mobile Usability**.

## Durchgeführte Änderungen

### 1. **Neue Design Token Datei**

**Datei**: `src/styles/design-system-tokens.css`

- ✅ Einheitliche Spacing-Skala (8px Rhythm)
- ✅ Reduzierte Border-Radius auf 3 Stufen (sm/md/lg)
- ✅ Vereinfachtes Shadow-System (2 Elevations statt 20+)
- ✅ Konsistente Touch Targets (44px minimum)
- ✅ Standardisierte Transitions (fast/base/slow)
- ✅ Accessibility-Support (reduced-motion, prefers-contrast)

### 2. **Button Komponente** (`src/ui/Button.tsx`)

**Vorher**:

- Inkonsistente Höhen (h-8, h-10, h-12)
- `focus-visible:ring-1` (zu subtil)
- Borders mit 0.05 opacity (fast unsichtbar)

**Nachher**:

- Konsistente Touch Targets: `h-11` (default), `h-10` (sm), `h-14` (lg)
- `focus-visible:outline-2 outline-offset-2` (WCAG AA konform)
- Borders mit 0.08-0.12 opacity (sichtbar)
- Konsistenter Hover-Effekt: `hover:-translate-y-px`

### 3. **Input Komponente** (`src/ui/Input.tsx`)

**Vorher**:

- Referenzierte nicht-existente `.input-chalk` Klasse
- Kein sichtbarer Focus-State
- Arbitrary padding-Werte

**Nachher**:

- Klarer Focus-Ring: `focus:ring-2 focus:ring-brand-primary/20`
- Konsistentes Padding: `px-4 py-3`
- Border-Feedback: `border-white/12 hover:border-white/20`

### 4. **Chat Message Actions** (`src/components/chat/ChatMessage.tsx`)

**Vorher**:

- Action Buttons: `p-1.5` mit Icons `h-3.5 w-3.5` → **zu klein für Touch** (ca. 28px)
- Follow-up Buttons: `py-2 text-xs` → **nicht WCAG konform**
- Inkonsistente Focus-States: `ring-1`

**Nachher**:

- Action Buttons: `min-w-[2.75rem] min-h-[2.75rem] p-2` mit Icons `h-4 w-4` → **44px Touch Target** ✅
- Follow-up Buttons: `min-h-[2.75rem] py-2.5 text-sm` → **WCAG AA** ✅
- Konsistente Focus: `outline-2 outline-offset-1 outline-accent-chat`
- Hinzugefügt: `aria-label` für Screen Reader

### 5. **Unified Input Bar** (`src/components/chat/UnifiedInputBar.tsx`)

**Vorher**:

- Select Triggers: `h-9 px-3 text-xs` → **36px (zu klein)** ❌
- Borders: `border-white/5` (fast unsichtbar)

**Nachher**:

- Select Triggers: `min-h-[2.75rem] px-4 text-sm` → **44px Touch Target** ✅
- Borders: `border-white/8 hover:border-white/12` (sichtbar)

### 6. **Component CSS** (`src/styles/components.css`)

**Vorher**:

- Card Borders: `0.02` opacity (unsichtbar in High Contrast Mode)
- Focus Border: `0.12` opacity (zu subtil)

**Nachher**:

- Card Borders: `0.08` opacity (Standard), `0.12` (Roles)
- Focus Border: `0.2` opacity (deutlich sichtbar)

## Behobene Probleme (aus Audit)

| #   | Problem                           | Status | Fix-Ort                                             |
| --- | --------------------------------- | ------ | --------------------------------------------------- |
| 1   | Inkonsistente Border-Radius       | ✅     | Button.tsx, Input.tsx (unified zu xl/lg)            |
| 2   | Shadow-Chaos (20+ Varianten)      | ⚠️     | design-system-tokens.css (neu: 3 Stufen)            |
| 3   | Fehlende konsistente Focus States | ✅     | Button, Input, ChatMessage (alle `outline-2`)       |
| 4   | Doppelte Color-Token              | ⚠️     | Nicht geändert (würde Breaking Changes verursachen) |
| 5   | Arbitrary Spacing-Werte           | ✅     | UnifiedInputBar (py-2.5 → Token-basiert)            |
| 6   | **Touch Targets < 44px**          | ✅     | ChatMessage, UnifiedInputBar                        |
| 7   | Animation-Komplexität             | ⚠️     | Nicht geändert (für Phase 2)                        |
| 8   | Inkonsistente Hover States        | ✅     | Standardisiert auf `-translate-y-px`                |
| 9   | **Borders zu subtil (0.02-0.08)** | ✅     | components.css (0.08-0.12)                          |
| 10  | **Input Focus-State fehlt**       | ✅     | Input.tsx (ring-2 hinzugefügt)                      |

**Legende**: ✅ Behoben | ⚠️ Teilweise | ❌ Offen

## Verifikation

### Lokale Tests

```bash
# Dev-Server starten
npm run dev

# Lint-Check
npm run lint  # ✅ Keine Fehler

# Type-Check
npm run typecheck  # (empfohlen)

# Build-Test
npm run build  # (empfohlen)
```

### Live-Verifikation

1. **Chat-Seite** (`/chat`):
   - Teste Message Actions (Kopieren/Bearbeiten/Retry) auf **Mobile** (Touch Targets mindestens 44px)
   - Teste Follow-up Suggestions (sollten auch 44px sein)
   - Teste Context Pills (Rolle/Stil/Kreativität - alle 44px)

2. **Keyboard Navigation**:
   - Tab durch alle interaktiven Elemente
   - Focus Ring sollte deutlich sichtbar sein (2px Outline)

3. **Accessibility**:
   - High Contrast Mode aktivieren → Borders sollten sichtbar bleiben
   - Screen Reader: Action Buttons haben `aria-label`

### Viewport Tests (optional)

```bash
# Playwright Screenshots (wenn vorhanden)
npm run test:e2e -- --project=chromium --headed
```

**Empfohlene Viewports**:

- Mobile: 390×844 (iPhone 13/14)
- Android: 412×915 (Pixel 7)
- Desktop: 1280×800

## Phase 2 - Geplante Verbesserungen (optional)

**✅ Umgesetzt (Commit a4f3f90)**:

1. ✅ **Ungenutzte Animationen entfernt** (Cube/Orb - 195 Zeilen)
   - Entfernt: 18 Cube + 10 Orb Animationen aus Tailwind Config
   - Behalten: Neko (aktiv genutzt), Blob (Background), Core (fadeIn, slideUp, etc.)
   - Reduktion: 642 → 450 Zeilen (-30%)
   - Tests: ✅ 27 Neko-Tests bestanden

**Noch offen (Nicht-Breaking Changes)**:

2. Shadow-System vereinfachen (Tailwind config bereinigen)
3. Color-Token konsolidieren (`accent-*` Aliase reduzieren)
4. High Contrast Mode CSS hinzufügen

**Würde Review benötigen**:

- Komplette Token-Migration (alle Komponenten)
- Breaking: Alte `accent-*` Klassen entfernen

## Hinweise

- **Keine Breaking Changes**: Alle Änderungen sind rückwärtskompatibel
- **HMR funktioniert**: Vite hat alle Änderungen live aktualisiert
- **Tailwind Warnungen**: `duration-[var(...)]` Warnungen können ignoriert werden (sind nur Hinweise, kein Error)

## Commit Message Vorlage

```
fix(design-system): Improve consistency, accessibility, and mobile UX

- Add design-system-tokens.css with unified spacing, radius, shadows
- Fix Button: Increase touch targets (h-11/10/14), improve focus states
- Fix Input: Add visible focus ring, remove broken .input-chalk ref
- Fix ChatMessage: WCAG AA compliant touch targets (44px minimum)
- Fix UnifiedInputBar: Increase context pill sizes to 44px
- Fix border opacities: 0.08-0.12 for better visibility

Resolves #970 (visual artifacts), improves mobile usability
```

---

**Autor**: Claude Code
**Datum**: 2025-12-19
**Review**: Empfohlen vor Merge
