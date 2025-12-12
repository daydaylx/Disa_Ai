## Visual Upgrade Report – Aurora Spine

### 1) Vorher/Nachher – Hauptprobleme

- Flache, generische Karten ohne Wiedererkennungsmerkmal → Jetzt Aurora-Spine (Gradient-Streifen + Gleam) auf Cards/Buttons.
- Uneinheitliche Schatten (Glow + Raise gemischt) → 3 klare Tiefen: lift, float, press (alle Aliases darauf gemappt).
- Inkonsistente Radii (8/12/16) und Farbakzente → Neue Skala 10/14/18, Duo-Accent Violet/Cyan durchgängig.
- Hintergrund ohne Markenwirkung → Dunkle Navy-Basis mit zwei radialen Aurora-Flares.
- Buttons ohne Mikro-Feedback → Aurora-Gleam Hover/Fokus mit sanfter Scale.
- Navigation/Drawer ohne Signature → Drawer-Karte mit Spine und stärkerer Layer-Tiefe.

### 2) Gewählte Style-Route

- Route: **Aurora Spine Instrument Panel**
- Leitidee: Nacht-Cockpit mit leuchtender Backbone-Linie, die alle Module verbindet.
- Farbwelt: Hintergrund Navy (#040714), Duo-Akzent Violet (#8f7bff) + Cyan (#5ee4ff), Grün für Success.
- Schattenlogik: lift (8/20px), float (14/36px), press (inset); Glow ist farbiger Alias von float.
- Typo-Vibe: Plus Jakarta Sans, gewichtete Headlines, kontraststark für Mobile.
- Icon-Stil: bestehendes Line/Stroke beibehalten, aber auf farbigen Flächen mit Spine/Glow eingebettet.

### 3) Token-Übersicht (neu konsolidiert)

- Shadows: `--shadow-soft-raise` (lift), `--shadow-strong-raise` (float), `--shadow-inset` (press); `brandGlow` = farbiger Alias.
- Radii: `--r-sm: 10px`, `--r-md: 14px`, `--r-lg: 18px`.
- Accents: `--accent-primary #8f7bff`, `--accent-bright #5ee4ff`, Gradient `--brand-gradient` (violet→cyan→teal).
- Signature: `--signature-spine`, `--signature-gleam`, `--signature-noise`.
- Backgrounds: `--bg-base #040714`, Surfaces `--surface-1 #0c1222`, `--surface-2 #121b2f`, `--surface-inset #0a0f1d`.

### 4) Signature-Features im UI

- **Aurora-Spine**: linke Gradient-Linie + Glow auf Cards (MaterialCard raised/hero), Drawer und Info-Bar.
- **Aurora-Gleam Buttons**: radiale Light-Gleams auf Hover/Fokus für alle Buttons (Base-Klasse `btn-aurora`).
- **Geleimte Hintergründe**: doppelte Radial-Flares auf Body statt Flat Color.
- **Gleam Overlay**: sanfter Screen-Blend auf Cards (`with-gleam`) für Tiefe ohne Blur.

### 5) Rollout-Abdeckung

- Tokens & Tailwind remain source of truth (`design-tokens-consolidated.css`, `tailwind.config.ts`).
- Komponenten: Button, MaterialCard, Drawer, Chat Info-Bar automatisch im neuen Look.
- Globale Hintergründe in `base.css` aktiv; wirkt auf alle Seiten (Chat, Models, Roles, Settings, Studio).

### 6) Offene Punkte / Follow-up (nicht blocker)

- Optional: Chat-Bubbles könnten zusätzliche Spine-Linie bekommen, wenn gewünscht.
- Icon-Set könnte komplett auf ein Gewicht (2px Stroke) normiert werden; derzeit unverändert.
