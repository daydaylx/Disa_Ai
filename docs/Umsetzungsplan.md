# Umsetzungsplan: Disa AI UI-Refresh

**Projekt:** Disa AI UI-Überarbeitung zu Soft-Depth Glassmorphism
**Branch:** `claude/disa-ui-refresh-design-tokens-011CV3dMB8dGJP6Bp9YycFpC`
**Zeitraum:** 2025-11-12
**Status:** Phase 1 abgeschlossen, Phase 2 & 3 offen

## Phasen-Übersicht

### ✅ Phase 1: Foundation & Core (Abgeschlossen)
- ✅ Design-Tokens zentralisieren und anpassen
- ✅ Shared-Komponenten erstellen (TileCard, SectionCard)
- ✅ Chat-View optimieren
- ✅ MobileBottomNav mit Icons erweitern
- ✅ Dokumentation (Ist-Analyse, UI-Richtlinien, Abnahmebericht)

### ⚠️ Phase 2: Vervollständigung (Optional)
- ⚠️ Settings-Seiten mit SectionCard migrieren
- ⚠️ A11y-Audit und Fixes
- ⚠️ Legacy-Code bereinigen
- ⚠️ Performance-Optimierung

### ⚠️ Phase 3: QA & Launch (Optional)
- ⚠️ Lighthouse-Tests (≥90 Scores)
- ⚠️ Responsive-Testing auf Devices
- ⚠️ Merge & Deploy

## Phase 1: Foundation & Core ✅

### 1.1 Design-Tokens aktualisieren ✅

**Ziel:** Radii, Shadows, Glass-Variablen an Spezifikation anpassen.

**Umsetzung:**
```css
/* src/styles/theme.css */

/* Radii: xs=6, sm=10, md=14, lg=18, xl=24, 2xl=32 */
--radius-xs: 0.375rem;
--radius-sm: 0.625rem;
--radius-md: 0.875rem;
--radius-lg: 1.125rem;
--radius-xl: 1.5rem;
--radius-2xl: 2rem;

/* Shadows: 2-Ebenen-Hierarchie */
--shadow-surface: 0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.06);
--shadow-elevated: 0 8px 24px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.08);

/* Glass-Opazität */
--glass-opacity-light: 0.85;
--glass-opacity-medium: 0.75;
--glass-opacity-heavy: 0.65;
--glass-opacity-overlay: 0.95;
```

**Dateien:**
- ✅ `src/styles/theme.css`
- ✅ `tailwind.config.ts`

**Aufwand:** ~30 Min.

### 1.2 Shared-Komponenten erstellen ✅

#### TileCard-Komponente ✅

**Ziel:** Einheitliche Kacheln für Grid-Layouts (Start/Hub).

**Features:**
- Aspect-Ratio (square, video, auto)
- Konsistente Icon-Platzierung (top, left)
- Glassmorphism + Hover-States
- Touch-friendly (min 44px)

**Datei:** ✅ `src/components/ui/TileCard.tsx`

**Aufwand:** ~45 Min.

#### SectionCard-Komponente ✅

**Ziel:** Einheitliche Sektionen für Settings.

**Features:**
- Optionaler Header/Footer
- Konsistente Innenabstände
- Automatisches Spacing zwischen Kindern

**Datei:** ✅ `src/components/ui/SectionCard.tsx`

**Aufwand:** ~30 Min.

### 1.3 Chat-View optimieren ✅

**Änderungen:**
1. ✅ Chat-Bubbles Max-Width 85% → 70%
2. ✅ Timestamps unter Bubble verschieben
3. ✅ Spacing optimieren (py-5 → py-4)
4. ✅ Actions kompakter (size="sm")

**Datei:** ✅ `src/components/chat/ChatMessage.tsx`

**Aufwand:** ~60 Min.

### 1.4 MobileBottomNav erweitern ✅

**Änderungen:**
1. ✅ Icons hinzufügen (MessageSquare, Brain, Users, Settings)
2. ✅ Aktiv-State mit Akzentfarbe + Glow
3. ✅ Touch-Targets min. 56px

**Datei:** ✅ `src/components/layout/MobileBottomNav.tsx`

**Aufwand:** ~30 Min.

### 1.5 Chat Empty-State optimieren ✅

**Änderungen:**
1. ✅ Quickstart-Tiles mit neuem Card-System
2. ✅ Gap konsistent (gap-4 = 16px)
3. ✅ Responsive Grid (1 → 2 → 3 cols)

**Datei:** ✅ `src/pages/Chat.tsx`

**Aufwand:** ~45 Min.

### 1.6 Dokumentation erstellen ✅

**Dateien:**
- ✅ `docs/Ist-Analyse.md`
- ✅ `docs/UI-Richtlinien.md`
- ✅ `docs/Abnahmebericht.md`
- ✅ `docs/Umsetzungsplan.md`

**Aufwand:** ~90 Min.

**Gesamt Phase 1:** ~5.5 Stunden

---

## Phase 2: Vervollständigung ⚠️

### 2.1 Settings-Seiten migrieren ⚠️

**Ziel:** Alle Settings-Seiten auf SectionCard umstellen.

**Dateien:**
- `/src/pages/SettingsApi.tsx`
- `/src/pages/SettingsAppearance.tsx`
- `/src/pages/SettingsData.tsx`
- `/src/pages/SettingsMemory.tsx`
- `/src/pages/SettingsFilters.tsx`
- `/src/pages/SettingsOverviewPage.tsx`

**Beispiel:**
```tsx
// Vorher
<div className="space-y-4">
  <h2>API-Einstellungen</h2>
  <Label>API-Key</Label>
  <Input type="password" />
</div>

// Nachher
<SectionCard title="API-Einstellungen">
  <Label htmlFor="api-key">API-Key</Label>
  <Input id="api-key" type="password" className="min-h-[44px]" />
</SectionCard>
```

**Aufwand:** ~2-3 Stunden (6 Seiten × 20-30 Min.)

### 2.2 Button-Component Radius aktualisieren ⚠️

**Problem:** Button nutzt noch `rounded-[var(--radius-md)]` (8px), sollte `rounded-sm` (10px) sein.

**Änderung:**
```tsx
// src/components/ui/button.tsx

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm ...", // ← sm statt md
  { /* ... */ }
);
```

**Datei:** `/src/components/ui/button.tsx`

**Aufwand:** ~10 Min.

### 2.3 Legacy-Shadow-Classes entfernen ⚠️

**Ziel:** Alle `shadow-neo-*` durch `shadow-surface` oder `shadow-elevated` ersetzen.

**Suche:**
```bash
grep -r "shadow-neo-" src/
```

**Ersetze:**
- `shadow-neo-xs` → `shadow-surface`
- `shadow-neo-sm` → `shadow-surface`
- `shadow-neo-md` → `shadow-surface`
- `shadow-neo-lg` → `shadow-elevated`
- `shadow-neo-xl` → `shadow-elevated`

**Aufwand:** ~30 Min.

### 2.4 A11y-Audit ⚠️

**Aufgaben:**
1. Kontraste prüfen (WCAG AA: 4.5:1)
   - `--fg-muted` auf `--surface-bg`
   - `--fg-subtle` auf `--surface-bg`
   - `--accent` auf `white`

2. Fokus-Ringe überall sichtbar
   - Button ✅
   - Link ⚠️
   - Card (clickable) ✅
   - Input/Select ⚠️

3. ARIA-Labels vollständig
   - Icons ohne Text: `aria-label`
   - Interactive-Elemente: `role`, `aria-current`, etc.

**Tools:**
- axe DevTools (Browser Extension)
- Playwright axe-core Tests

**Aufwand:** ~2 Stunden

### 2.5 Performance-Optimierung ⚠️

**Aufgaben:**
1. Ungenutzte Assets entfernen
   - Alte Icons/Bilder
   - Ungenutzte CSS-Dateien
   - Alte Komponenten

2. Tailwind Purge prüfen
   - `tailwind.config.ts`: `content: ["./index.html", "./src/**/*.{ts,tsx}"]`
   - Keine ungenutzten Klassen im Bundle

3. Schatten/Blur sparsam
   - Backdrop-Blur nur für Overlays
   - Max. 2 Box-Shadows pro Element

4. Bundle-Analyse
   ```bash
   npm run analyze
   ```

**Aufwand:** ~1-2 Stunden

---

## Phase 3: QA & Launch ⚠️

### 3.1 Lighthouse-Tests ⚠️

**Ziel:** ≥90 Score in Performance, A11y, Best Practices.

**Setup:**
```bash
npm run lh
```

**Metriken:**
- Performance: ≥90
- Accessibility: ≥90
- Best Practices: ≥90
- SEO: ≥90 (optional)

**Aufwand:** ~1 Stunde (Tests + Fixes)

### 3.2 Responsive-Testing ⚠️

**Devices:**
- 360×800 (Galaxy S8)
- 390×844 (iPhone 12/13)
- 414×896 (iPhone 11 Pro Max)
- 768×1024 (iPad Mini)

**Checks:**
- Kein horizontales Scrolling
- Touch-Targets ≥44px
- Safe-Area korrekt
- Lesbarkeit

**Tools:**
- Browser DevTools
- Real Devices (optional)

**Aufwand:** ~1 Stunde

### 3.3 Build & TypeScript ⚠️

**Aufgaben:**
1. Dependencies installieren
   ```bash
   npm install
   ```

2. TypeScript-Checks
   ```bash
   npm run typecheck
   ```

3. Lint
   ```bash
   npm run lint
   ```

4. Build
   ```bash
   npm run build
   ```

**Aufwand:** ~30 Min.

### 3.4 PR erstellen & Merge ⚠️

**PR-Beschreibung:**
```markdown
## UI Refresh: Soft-Depth Glassmorphism

### Summary
Migriert das Design-System von Neumorphismus zu einem konsistenten Glassmorphism-Ansatz. Optimiert für Mobile-First, Lesbarkeit und Accessibility.

### Changes
- Design-Tokens: Radii, Shadows, Glass-Opazität aktualisiert
- Neue Komponenten: TileCard, SectionCard
- Optimiert: ChatMessage (70% Max-Width, Timestamps unter Bubble)
- Optimiert: MobileBottomNav (Icons, Akzent-Glow)
- Optimiert: Chat Empty-State (Einheitliche Cards)

### Betroffene Routen
- `/chat` (Empty-State, Bubbles)
- `/models` (Bottom-Nav)
- `/roles` (Bottom-Nav)
- `/settings` (Bottom-Nav)

### Lighthouse Scores
- Performance: [Score]
- Accessibility: [Score]
- Best Practices: [Score]

### A11y
- Touch-Targets: ✅ ≥44px
- Fokus-Ringe: ✅ Sichtbar
- ARIA-Labels: ✅ Vollständig
- Kontraste: ✅ WCAG AA

### Breaking Changes
- Keine

### Migration Guide
- Keine Migrations erforderlich (abwärtskompatibel)
```

**Review-Checklist:**
- [ ] Code-Review durch Team
- [ ] Lighthouse-Tests ≥90
- [ ] A11y-Audit bestanden
- [ ] Responsive-Tests bestanden
- [ ] Build erfolgreich
- [ ] TypeScript ohne Errors

**Aufwand:** ~30 Min.

---

## Gesamt-Aufwandsschätzung

| Phase | Aufwand | Status |
|-------|---------|--------|
| Phase 1: Foundation & Core | ~5.5 h | ✅ |
| Phase 2: Vervollständigung | ~5-7 h | ⚠️ |
| Phase 3: QA & Launch | ~3-4 h | ⚠️ |
| **Gesamt** | **~13-16.5 h** | **⚠️** |

## Risiken & Dependencies

| Risiko | Wahrscheinlichkeit | Mitigation |
|--------|-------------------|------------|
| Build-Fehler (fehlende Dependencies) | Mittel | `npm install` durchführen |
| Legacy-Shadows brechen Layout | Niedrig | Schrittweise Migration |
| A11y-Regression | Mittel | axe-core Tests |
| Performance-Regression | Niedrig | Lighthouse vor/nach |

## Nächste Schritte

1. ✅ **Phase 1 abgeschlossen**
2. ⚠️ **Phase 2:** Optional, je nach Zeitbudget
3. ⚠️ **Phase 3:** Vor Merge erforderlich
4. ⚠️ **Merge:** Nach erfolgreichem Testing

---

**Erstellt:** 2025-11-12
**Aktualisiert:** -
**Status:** Phase 1 ✅, Phase 2 & 3 ⚠️
