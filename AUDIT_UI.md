# UI-Audit Disa AI

## Typografie

- Konsistente Schriftgröße: H1(24px), H2(20px), Body(16px), Label(13px)
- Verwendet Token-basierte Schriftgrößen (design-tokens.ts)
- Ausreichende Zeilenhöhe für Lesbarkeit

## Abstände

- 8dp Grid-System (design-tokens.ts) für konsistente Abstände
- Standardabstände: 4px bis 96px (spacing token)
- Touch-Ziele: 48px empfohlen, 44px minimum (WCAG)

## Kontrast

- Viele Farbkombinationen erfüllen nicht WCAG AA (4.5:1)
- Weiße Texte auf transparenten Kacheln oft unzureichend kontrastreich
- Besonders bei farbigen Verläufen auf Kacheln

## Fokus-Indikator

- Fokus-Ringe mit 2px Breite und Akzentfarben
- Definiert in design-tokens.css: `outline: 2px solid var(--color-accent-500)`

## Dateipfade

- src/styles/design-tokens.ts
- src/styles/design-tokens.css
- tailwind.config.ts
- src/components/ui/card.tsx
- src/components/studio/RoleCard.tsx
- src/components/ui/StaticGlassCard.tsx
