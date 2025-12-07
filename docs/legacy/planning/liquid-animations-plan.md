# Plan: Liquid/Fluid/Glass-Animationen für disaai.de

## 1. Ist-Analyse (kurz & konkret)
- **Hintergrund**: Der aktuelle helle/glasige Hintergrund ist statisch; dezente Glow-Effekte vorhanden, aber ohne organische Bewegung.
- **Hero & Feature-Cards**: Cards sind glasig mit leichten Shadows, aber bewegen sich nicht; Hover/Tap-Feedback kaum wahrnehmbar auf Mobile.
- **Buttons/Chips**: Primäre Buttons haben Farb-/Glow-Stil, aber keine Microinteractions außer evtl. Hover-Color; auf Touch fehlt taktiles Feedback.
- **Transitions**: Seiten-/Section-Wechsel sind sofort; kein sanftes Fade/Slide, wodurch der „flüssige“ Eindruck fehlt.

## 2. Zielbild „Liquid Look & Feel“
- **Hintergrund**: Sanft driftende, verschwommene Farb-Blobs (2–3 Layer) mit leichter Parallax-Bewegung; Helligkeit bleibt subtil, Lesbarkeit im Vordergrund bleibt hoch.
- **Cards/Panels**: Glass-Overlays mit leichtem Float (y-Translation 4–6px) und minimaler Scale-Reaktion auf Interaktion; Glow/Schatten pulsen sehr langsam.
- **Buttons/Chips**: Kurzes, federndes Scale + softer Glow beim Tap; aktive/fokussierte States heben sich mit leichtem Lichtreflex ab.
- **Page-Transitions**: Schnelles Fade/Slide-in (150–220ms) mit kurzem Blur-Reduce-Effekt für den Hintergrund.
- **Design-Prinzipien (max 5)**:
  1) Ruhige Grundbewegung, aber klare Verstärkung bei User-Input.
  2) Mobile-first: Animationen kurz halten (<300ms) und GPU-freundlich (transform/opacity).
  3) Lesbarkeit > Effekt: Kontrast und Textschärfe nie beeinträchtigen.
  4) Konsistenz: Gleiche Curve/Duration-Familien für alle Elementtypen.
  5) Optionalität: Respect `prefers-reduced-motion` + App-Setting (Standard/Minimal/Aus).

## 3. Animations-Konzept
### Hintergrund
- **Idee**: 2–3 Blobs (CSS Gradients) bewegen sich langsam über Blur-Layer; Parallax durch unterschiedliche Geschwindigkeiten.
- **Technik**: CSS `@keyframes` mit `translate/scale` + `filter: blur`; optional `mix-blend-mode: screen` für leichten Glow. SVG/Canvas nur falls CSS nicht reicht (zunächst vermeiden).
- **Interaktion**: Bei Page-Wechsel leichtes Beschleunigen (z. B. `animation-play-state` kurz erhöhen) optional.

### Cards/Sections
- **Float**: Dauer 6–8s, Amplitude 4–6px; `translateY` + minimaler `scale(1.01)` Loop mit alternierendem Timing.
- **Glow/Schatten**: Langsames Pulsieren (10–12s) der `shadow/opacity` für Soft-Depth.
- **Hover/Tap**: Mobile Tap/Focus: `scale(0.99 → 1.01)` über 160–200ms, Shadow +2px Spread, danach Ease-out.
- **Parallax-Light**: Optional kleiner `background-position` Shift bei Scroll (nur auf leistungsstarken Geräten).

### Buttons/Controls
- **Tap**: `scale(0.97 → 1.02)` über 140–180ms, Glow-Intensity +5–8%; anschließend `spring-out` (cubic-bezier(0.2, 0.8, 0.3, 1)).
- **Focus (Keyboard)**: Dezenter Glow-Ring (outline via box-shadow) mit kurzer Fade-in (120ms); kein Jumping.
- **Loading/Async**: Subtile shimmer/flow innerhalb des Buttons (linear gradient move) nur bei tatsächlichem Loading-State.

### Page-Transitions
- **Entry**: `opacity 0→1` + `translateY(8px→0)` + `blur(6px→0)` über 180–220ms.
- **Exit**: Umgekehrt mit kürzerer Dauer (140–160ms) für snappy Gefühl.
- **Scope**: Auf Page-Level Wrapper anwenden, nicht auf jedes Child, um Performance zu sichern.

## 4. Technische Umsetzung (Strukturierter Plan)
- **Globale Klassen**: Ergänzungen in `src/styles/design-tokens.css` (Durations/Easings) und `src/styles/globals.css` (Keyframes + Utility-Klassen). Tailwind `tailwind.config.ts` um Custom Animations erweitern.
- **Neue Tokens** (Beispiele):
  - `--anim-duration-slow: 7s;`
  - `--anim-duration-medium: 220ms;`
  - `--anim-ease-liquid: cubic-bezier(0.33, 0.85, 0.36, 0.99);`
- **@keyframes / Utilities** (Beispiele, keine Vollcodes):
  - `liquid-blob`: langsame `translate/scale` mit 3 Key Positions.
  - `card-float`: `translateY` +/- 4–6px + leichte Scale.
  - `card-glow-pulse`: Shadow/opacity Pulse.
  - `button-tap`: Scale/Glow kurz.
  - `page-fade-slide`: kombiniert `opacity/translateY/blur`.
- **Tailwind-Erweiterungen** (`tailwind.config.ts`):
  - `animation: { 'liquid-bg': 'liquid-blob var(--anim-duration-slow) ease-in-out infinite alternate', ... }`
  - `keyframes` Einträge passend.
- **Utility-Structure** (Klassen):
  - `.animation-liquid-bg` (auf Background-Layer-Divs)
  - `.animation-card-float`, `.animation-card-glow`
  - `.animation-button-tap` (per `data-pressed` oder `:active`)
  - `.animation-page-transition`
- **React-Einbindung (Pseudo)**:
  - Background Wrapper: `<div className="absolute inset-0 overflow-hidden pointer-events-none"><div className="animation-liquid-bg bg-gradient-to-br from-cyan-400/30 via-fuchsia-500/20 ..." /></div>`
  - Card: `<div className="glass-base animation-card-float hover:animation-card-float-boost active:animation-card-press">...</div>`
  - Button: `<button className="btn-primary data-[pressed=true]:animation-button-tap" ... />` (Press-State via onPointerDown/Up oder aria-pressed).
  - Page Transition: Framer Motion optional, sonst Wrapper mit Tailwind `animate-page-enter` + `animate-page-exit` Klassen gesteuert über Router-State.

## 5. Performance & Accessibility
- **GPU-freundlich**: Nur `transform`, `opacity`, `filter: blur` in moderaten Werten nutzen; keine Layout-affinen Properties (top/left/width/height) animieren.
- **Reduce Motion**: `@media (prefers-reduced-motion: reduce)` → Animationen auf `none` oder deutlich kürzer; Glow-Pulse stoppen.
- **Budget**: Max 2–3 parallele Background-Blobs; Frame-Dauer >16ms vermeiden; Test auf Low-End Android via Throttling.
- **Animations-Level Setting**:
  - `Standard` (alle Effekte), `Minimal` (keine Background-Blobs, nur Tap/Focus), `Aus` (alle Animations-Klassen auf `animation-none`).
  - Umsetzung: globaler Zustand (z. B. `animationLevel` im UI-Store/context); Body-Klasse `anim-standard|minimal|off` schaltet Tailwind Variants (`.anim-off .animation-* { animation: none; }`).

## 6. Roadmap / To-Do-Liste
### Phase 1: Basis-Hintergrund + Card-Float
- **Ziel**: Flüssiger Hintergrund mit 2–3 Blobs; Cards erhalten Float + Glow-Pulse.
- **Betroffene Dateien**: `src/styles/design-tokens.css`, `src/styles/globals.css`, `tailwind.config.ts`, evtl. `src/components/layout` für Background-Layer, `src/components/ui/card*`.
- **Risiko**: Performance auf Mobile; Test mit `prefers-reduced-motion` und Low-End Geräten.

### Phase 2: Buttons & Chips Microinteractions
- **Ziel**: Tap/Focus-Feedback per Scale/Glow; Loading-Shimmer optional.
- **Betroffene Dateien**: Button/Chip-Komponenten in `src/components/ui`, Tailwind Animation-Utilities.
- **Risiko**: Tap-Feedback darf Scroll nicht blockieren; Pointer/PWA Testing auf iOS/Android.

### Phase 3: Page-Transitions & Finetuning
- **Ziel**: Einfache Page-Fade/Slide mit Blur-Reduction; optional Parallax-Light für Sections.
- **Betroffene Dateien**: Routing/Page-Wrapper (`src/app`), globale Animationsklassen.
- **Risiko**: Übergänge dürfen Navigation nicht verzögern; Accessibility (Focus-Reflow) prüfen.
