Glas raus, Produkt rein. Hier ist der präzise Umbauplan auf Minimal-Design mit kleinem, konsistentem Brand-Signature.

Phase 0 – Zielbild fixieren (30 min)

Signature wählen: Brand-Rail links + Wortmarke „Disa▮AI“ + Caret/Selection in Brand.

Palette einfrieren: Neutral (3 Oberflächenstufen), 1 Brandfarbe, 1 Akzent höchstens.

Scope: Keine Blurs, keine Neon-Shadows, keine Bubbles.

Phase 1 – Tokens & Theme (1–2 h)

CSS-Variablen definieren: surface-0/1/2, text-0/1, border, brand, brand-weak, success/warn/danger.

Tailwind-Mapping: Farben auf Tokens mappen; ein globaler Radius (12–16), ein Shadow-Level maximal.

Done: Alle Komponenten nutzen Tokens, keine hex/rgb-Wildwuchs.

Phase 2 – Glassmorphism entfernen (1–2 h)

Kill-Liste: backdrop-blur/, backdrop-saturate/, bg-white/xx-Overlays, shadow-(md+), Glow-Text, Verlauf-Borders.

Ersetzen durch: flache surface-1, 1-px border, ruhige Hover-Tonwerte.

Done: 0 Vorkommen der Kill-Utilities, Build kompiliert ohne Style-Warnungen.

Phase 3 – App-Shell & Layout (1–2 h)

Topbar: 56 px, 1-px bottom-border, Brand-Rail (2–3 px) als linke Kante.

Content-Spalte: zentriert, max-Breite 680–720 px.

Composer: sticky unten, 1-px top-border, dvh + Safe-Area, keine Sprünge beim Tastatur-Einblenden.

Done: Keine horizontale Scrollbar, Layout stabil bei iOS/Android Browser-Chrome.

Phase 4 – Kernkomponenten (3–4 h)

Messages: flache Blöcke; Assistant mit linker Brand-Rail; konsistenter Radius/Padding; Links, Code, Listen geprüft.

Buttons: Standard = Outline; Primär nur wo nötig gefüllt; einheitliche Höhe ≥ 40–44 px.

Inputs: klare Labels, Fokus-Ring in Brand, Fehler-State sichtbar.

Code-Blöcke: surface-2, 1-px border, Copy-Icon, dezente Syntaxfarben.

Quickstart-Tiles: flache Cards, 2 Zeilen max, identische Icon-Größen.

Done: Optik konsistent, keine Doppelabstände, keine konkurrierenden Radien.

Phase 5 – Signature konsistent einziehen (45 min)

Wortmarke: „Disa▮AI“ in Header, gleiche Mikro-Spacing überall.

Caret/Selection: caret-color Brand; ::selection mit brand-weak.

Brand-Rail: Header + Assistant-Messages, sonst nirgends.

Done: Signature an 3 Stellen sichtbar, sonst unsichtbar.

Phase 6 – A11y & Performance (1–2 h)

Kontrast: AA für Text, 3:1 für große UI-Texte.

Touch-Ziele: ≥ 48 px, 8–12 px Abstand.

Motion: 150–200 ms, ein Easing; prefers-reduced-motion respektiert.

Fokus: sichtbarer 2-px Ring, nie entfernt.

Done: Lighthouse A11y ≥ 95, keine „low-contrast“-Findings.

Phase 7 – PWA/Details (1 h)

Manifest: name/short_name, theme_color, start_url, display=standalone, Icons 192/512, Shortcuts: Neuer Chat, Letzte Session.

Meta/UI: System-Font-Stack, overflow-wrap:anywhere für lange Tokens/URLs.

Done: Installierbar, Splash/Theme stimmig, keine Icons fehlen.

Phase 8 – QA & Regressionen (2–3 h)

E2E Smoke: Start, neuer Chat, Long-Message, Code-Block, Mobile-Keyboard, Dark/Light.

Visuell: 6 Golden-Screenshots (Home, Chat leer, Chat gefüllt, Code-Block, Settings, 404).

Metriken Zielwerte: LCP ≤ 2.5 s mid-device, CLS ≤ 0.02, TTI ≤ 3 s, FPS stabil beim Scrollen.

Done: Screens identisch bis auf erlaubte Textflow-Deltas.

Phase 9 – Aufräumen & Doku (45 min)

Leichen entfernen: ungenutzte Glass-Styles/Assets, alte Gradients.

README Abschnitt „Design-System“: Tokens, Komponentenprinzipien, Do/Don’t, Signature-Regeln.

Changelog: Breaking Styles, Migrationshinweise.

Definition of Done (hart, nicht verhandelbar)

Keine Blur/Glow-Utilities im Code.

Ein Border-Stil, ein Radius-Set, ein Shadow-Level.

Signature nur an Header, Assistant, Selection/Caret.

AA-Kontrast überall, Touch-Ziele eingehalten.

Max-Spaltenbreite aktiv, keine Bubbles, keine „Kirmes“.

Reihenfolge für schnellen Impact (wenn die Zeit knapp ist)

Phase 2 Kill-Liste,

Phase 3 App-Shell,

Phase 4 Messages/Composer,

Phase 5 Signature,

Phase 6 A11y.

Kurz, schmerzlos, professionell. Wenn du dich daran hältst, sieht Disa AI nicht mehr nach „Theme-Experimente, Woche 7“ aus, sondern wie ein ernsthaftes Tool.
