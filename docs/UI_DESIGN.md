UI Design – Dark Glasmorphism (freundlich, klar)

Palette (Tokens)

- Hintergrund: linear-gradient(180deg, #1E222C → #2B303B)
- Primär (Cyan): #4FC3F7 • Sekundär (Violett): #B388FF
- Mint: #6EE7B7 • Soft‑Orange: #FFB74D • Danger: #EF5350
- Text: Hell #F5F7FA • Sekundär #C5CAD3 • Disabled #9AA0AE

Bausteine (Glas‑Flächen)

- Surfaces (Cards/Inputs/Nav): bg‑white/10–14, border‑white/10–15, backdrop‑blur‑md, r=12–16px
- Buttons: primary = Cyan→Violett‑Gradient + moderater Glow; secondary/ghost = flach auf Glass; destructive = weiches Rot
- Nav‑Pills: Glass + Outline; aktiv = Cyan‑Glow, inaktiv = Outline only
- Chat‑Bubbles: User = Cyan‑Glass; KI = Violett‑Glass; dezente Glows
- Inputs: halbtransparent, Fokus‑Glow in Primär; gute Kontraste (AA)

Typografie

- Inter/DM Sans (system‑fallback), Headlines 20–24px, Body 14–16px

Effekte

- Weiche Shadows (Blur 24–32px) kombiniert mit Neon‑Glows in Akzentfarben

Konventionen

- Tokens in src/styles/tokens.css, Tailwind nutzt sie via theme.extend.colors
- Abstände/Tap‑Targets: ≥ 44px, Radii 12–16px, Fokus sichtbar, ARIA vollständig
