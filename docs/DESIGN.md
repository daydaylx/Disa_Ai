# Glassmorphism Card Recipe

Der Rollen-Screen nutzt ein konsistentes Card-Rezept, das vollständig in der Komponente `src/components/studio/RoleCard.tsx` implementiert ist. Dieses Rezept kann als Referenz für zukünftige glassmorphische Layouts dienen.

## Basis-Layer

- Klassen: `rounded-2xl p-5 relative overflow-hidden bg-white/[0.06] border border-white/[0.10] backdrop-blur-md card-glass`
- Box-Shadow: `shadow-[0_8px_28px_-8px_rgba(0,0,0,0.55),_inset_0_1px_0_0_rgba(255,255,255,0.22)]`
- Inhalt immer in `<div class="relative z-10">` kapseln, damit Overlays darunterliegen.
- Fallback: `.card-glass` deaktiviert `backdrop-filter` auf Geräten ohne Blur-Support (`@supports not (backdrop-filter: blur(8px))`).

## Farb-Tints

- Overlay: `<div class="pointer-events-none absolute inset-0 rounded-[inherit] opacity-80">`
- Hintergrund: `style={{ background: "linear-gradient(135deg, VAR1 0%, VAR2 100%)" }}`
- HSL-Werte mit Alpha 0.18–0.26 halten (`0.22` ist Standard für die fünf kuratierten Rollen).
- Optionaler Kontrast-Guard: `contrastOverlay`-Prop aktiviert dunkles Overlay `bg-black/[0.20]` falls Messung < 4.5:1 ergibt.

## Typografie

- Titel: `text-base font-semibold tracking-tight text-white`
- Copy: `mt-1.5 text-sm leading-6 text-white/70`
- Keine gemischten Font-Weights innerhalb des Titels verwenden.

## Badge

- Maximal eine Badge pro Karte.
- Platzierung: Rechts oben in derselben Flex-Zeile wie der Titel.
- Klassen: `text-[11px] leading-4 px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/[0.14] backdrop-blur-sm text-white/85`

## Interaktionszustände

- Aktive Rolle: `aria-pressed="true"`, zusätzliche Klasse `ring-2 ring-white/25`.
- Active-State (Touch): `active:scale-[0.995]`
- Focus-Visible: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40`
- Hover ausschließlich via Media-Query:

  ```css
  @media (hover: hover) and (pointer: fine) {
    .card-hover:hover {
      border-color: rgba(255, 255, 255, 0.16);
      box-shadow: 0 14px 36px -10px rgba(0, 0, 0, 0.65);
    }
  }
  ```

## Layout & Spacing

- Grid: `grid grid-cols-1 gap-3`
- Card Padding: `p-5`
- Abstand Titel → Copy: `mt-1.5`
- Grid Abschlüsse: `pb-8`
- CTA-Zone unterhalb: Buttons mit `h-12`, `bg-white/[0.03]`, `border-white/[0.10]`, `backdrop-blur-sm`, Abstand `mt-4`.

## Accessibility

- Karten renderer als `<button>` mit `aria-pressed`.
- Tap Targets ≥ 48x48 dp (`min-h`/`min-w` via Tailwind bzw. Layout).
- Axe-Tests (`tests/e2e/roles.spec.ts`) verifizieren Fokus- und Kontrastanforderungen.
