# Rollenseite – UX/UI Analyse & Verbesserungsplan

## 1. Ist-Zustand (kurz)
- **Struktur:** Sticky Header (Suche + Filter + Kategorien) über einer scrollbaren Grid-Liste von "PremiumCards".
- **Interaktion:** Filtern client-seitig; Klick auf Karte expandiert Details inline (Accordion-Prinzip); Aktivierung über Button.
- **Mobile-UX:** 1-Spalten-Layout; Sticky Header nimmt ca. 30-40% der Höhe ein; Touch-Targets teilweise sehr klein (Chips, Expand-Icon).
- **Performance:** Client-side Filtering bei jedem Tastenanschlag; Listen-Animationen (`animate-card-enter`) könnten bei vielen Elementen ruckeln.
- **Design-Konsistenz:** Nutzung von `bg-surface-inset` (fehlt in Tailwind Config → transparent); Mischung aus Neumorphism (Code/Kommentare) und Aurora (Docs).

## 2. Probleme (priorisiert)
### P0
- **Touch Targets zu klein:** Filter-Chips (`h-9` = 36px) und Expand-Button (`min-h-[32px]`) unterschreiten das 44px Minimum massiv (Mobile-First Pflichtverletzung).
- **Fehlendes Styling:** Klasse `bg-surface-inset` ist in `tailwind.config.ts` nicht definiert. Elemente wie der Header-Hintergrund und Card-Container sind transparent statt abgedunkelt, was zu Lesbarkeitsproblemen führt (Text über Text beim Scrollen).

### P1
- **Platzverschwendung Header:** Der Sticky Header ist auf Mobile unverhältnismäßig hoch (Input + Filter-Row + Kategorie-Container). Der effektive Lesebereich für die Liste ist zu klein.
- **Overlay-Konflikt:** Das "Aktive Rolle"-Pill (unten rechts, `fixed`) überlagert potenziell die Bottom Navigation oder FABs und beachtet keine Safe-Areas.
- **Design-Inkonsistenz:** Code nutzt explizit Neumorphism-Begriffe ("shadow-inset", "raise"), während `AGENTS.md` und `DESIGN_SYSTEM.md` dies als "deprecated" bezeichnen und Aurora fordern.

### P2
- **Inline-Details auf Mobile:** Das Aufklappen von Details innerhalb einer Liste ("Accordion") ist auf kleinen Screens desorientierend, da sich der Content-Flow verschiebt.
- **Performance:** Suche triggert Filterung und Re-Render bei jedem Keystroke (kein Debounce).

## 3. Plan A – Quick Wins
**Zielbild:** Eine sauber bedienbare Seite mit korrekten Farben, ausreichenden Touch-Targets und verbesserter Raumaufteilung.

**Schritte:**
1. **Fix Styles:** `bg-surface-inset` in `tailwind.config.ts` unter `extend.colors.surface` hinzufügen (Mapping auf `var(--surface-inset)` oder Hex `#0a0f1d`), um Transparenz-Probleme zu lösen.
2. **Touch Targets:** Mindesthöhe für `FilterChip` und Buttons auf `h-11` (44px) erhöhen. Padding im Expand-Button vergrößern.
3. **Header Optimierung:** Abstände im Header reduzieren (`py-6` -> `py-3`).
4. **Overlay Position:** Das "Aktive Rolle"-Pill verschieben (z. B. nach oben `top-20` oder als statischer Banner *in* die Liste), um Konflikte mit der Bottom-Nav zu vermeiden.

**Aufwand/Risiko/Nutzen:**
- **Aufwand:** S (Konfiguration & CSS-Klassen Anpassung)
- **Risiko:** Niedrig
- **UX-Nutzen:** Signifikant (Nutzbarkeit wiederhergestellt, visuelle Fehler behoben).

## 4. Plan B – Re-Work (optional)
**Zielbild:** Echte Mobile-First Experience mit Standard-Patterns (Bottom Sheet) und strikter Design-System-Treue.

**Schritte:**
1. **Navigation:** Umstellung der Detail-Ansicht auf ein **Bottom Sheet** (Drawer). Klick auf Karte öffnet Sheet → Kontext der Liste bleibt erhalten.
2. **Header Redesign:** "Sliver"-Header implementieren (Suche/Filter verschwinden/schrumpfen beim Scrollen) für maximalen Platz.
3. **Design System:** Refactoring der Cards auf reine Aurora-Komponenten (Entfernung aller manuellen `shadow-inset`/`bg-surface-inset` Aufrufe zugunsten globaler Komponenten-Klassen).
4. **Performance:** Virtualisierung (`react-window`) einführen, falls Rollen-Anzahl > 50 steigt.

**Aufwand/Risiko/Nutzen:**
- **Aufwand:** M (Komponenten-Umbau, Navigation)
- **Risiko:** Mittel (Interaktionsänderung)
- **UX-Nutzen:** Hoch (Professionelles Mobile-Feeling, bessere Skalierbarkeit).

## 5. Offene Fragen / Annahmen
- **Annahme:** Die App nutzt eine globale Bottom Navigation (laut Memory), daher ist der untere Bildschirmrand "tabu" für fixe Overlays.
- **Annahme:** `bg-surface-inset` soll dunkel sein (wie in `design-tokens-consolidated.css` definiert), nicht transparent.
- **Frage:** Soll die Suche serverseitig werden? Falls ja, muss Debounce zwingend in Plan A.
