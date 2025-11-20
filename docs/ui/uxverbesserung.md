## 1. Executive Summary (Max 10 Zeilen)
Die mobile Experience wirkt überladen durch großflächige Glas-Header/Gradients und inkonsistente Abstände, wodurch Inhalte nach unten gedrängt werden. Die Design-Tokens werden oft umgangen (Standard-Tailwind-Spacings statt Token-Variablen), was das Erscheinungsbild uneinheitlich macht. Touch-Ziele und Safe-Area-Paddings sind nicht konsequent umgesetzt, sodass primäre Aktionen auf iOS/kleinen Screens potenziell schwer erreichbar sind. Größter Hebel: Header/Composer verschlanken, Token-getreue Spacing/Radii erzwingen und Touch-Ziele vereinheitlichen.

## 2. Top-Prioritäten (Must-Fix)
- Header-Höhe & Randverluste reduzieren, damit der Chat-Inhalt ab Fold sichtbar bleibt.
- Touch-Targets überall ≥44px sicherstellen, insbesondere im Drawer/Secondary Actions.
- Konsistente Nutzung der Design-Tokens (Spacing, Radius, Shadows) statt Default-Tailwind-Werte.
- Safe-Area-Handling für untere Composer-Zone und obenliegenden Header klar und redundant gestalten.

## 3. Detaillierte Problemanalyse
| ID | Bereich/Komponente | Problem & Impact | Lösungsvorschlag (Deskriptiv) | Prio (P0-P2) |
|----|-------------------|------------------|-------------------------------|--------------|
| UX-01 | Header | Sticky-Header mit Gradient, max-w-4xl und großzügigem Padding frisst vertikalen Platz; auf 360–430px rutscht der sichtbare Chatinhalt unter den Fold. | Höhe auf ~60px deckeln, Padding auf Token `spacing-2`/`spacing-3` reduzieren, max-width auf 100% setzen und Titel/Menü in einer Zeile belassen. | P0 |
| UX-02 | Chat-Komposition | Composer ist sticky + Gradient, aber Safe-Area wird nur via Klasse angedeutet; keine explizite Padding-Kompensation im Container → Tastatur/Notch kann CTA teilweise verdecken. | Safe-Area-Variablen direkt im Container padding-bottom berücksichtigen (z.B. `pb-[calc(var(--spacing-4)+env(safe-area-inset-bottom))]`) und den Sticky-Gradienten reduzieren. | P0 |
| UX-03 | Quick Actions/Buttons | Close-Button im Drawer nur `p-2` (~32px) und Icon-Container `w-8 h-8` (~32px) → unter WCAG Touch-Minimum, erschwert mobiles Tippen. | Alle Steuer-Buttons im Drawer auf min 44x44px erhöhen (`min-h/min-w-[var(--touch-target-compact)]`) und Padding anpassen. | P0 |
| UX-04 | Design-System Drift | In Chat-Content wird `p-4`/`p-3` als Default-Tailwind genutzt (1rem/0.75rem) statt Token-Spacing; Radii/Shadows mischen Token-Varianten mit hartcodierten Werten → uneinheitliche Rhythmik. | Token-only Policy: Spacings nur über `px-[var(--spacing-*]` oder Token-basiertes Tailwind-Extend nutzen; Radii/Shadow auf definierte Token beschränken. | P1 |
| UX-05 | Visuelle Hierarchie | Karten/Lists nutzen vollen Border/Glow (border-[color:var(--glass-border-soft)] + shadow-lg), aber Textgröße/Zeilenabstand bleibt Standard → optische Schwere, Lesbarkeit leidet auf kleinen Screens. | Schatten in List-View reduzieren (`shadow-none`/`shadow-glow-subtle`), Zeilenhöhen/Spacing erhöhen (z.B. `leading-relaxed`, `gap-3`), Flächenkontrast zurücknehmen. | P1 |

## 4. Design-System & Konsistenz
- Tailwind-Config mappt ein vollständiges Token-Set (Spacing 4–64px, Radii 6–24px, Shadows Glow)【F:tailwind.config.ts†L4-L190】, aber Komponenten greifen häufig auf Default-Klassen (`p-4`, `p-3`) zurück, die nicht an Tokens gekoppelt sind (z.B. Chat-Container, Composer). Das erzeugt ungleichmäßige Abstände und bricht den 8px-Rhythmus.
- Radii: Tokens definieren 6/10/14/18/24px, im Drawer werden 12px+ Default-LG (nicht Token-basiert) gemischt【F:src/components/layout/AppMenuDrawer.tsx†L45-L146】. Vereinheitlichung nötig, um optischen Drift zu vermeiden.
- Shadows/Glas: Mehrfach-Glows (Header, Cards, Drawer) wirken additiv und erhöhen visuelle Latenz; begrenze auf ein Primary-Glow pro Screen und ersetze andere durch dezente Border.

## 5. Mobile Specifics
- Touch-Targets: Drawer-Close (`p-2`) und Icon-Container (`w-8 h-8`) unterschreiten das 44px-Mindestmaß【F:src/components/layout/AppMenuDrawer.tsx†L50-L101】. Menü-Button erfüllt das Maß (min-h/min-w 44px)【F:src/components/layout/AppMenuDrawer.tsx†L180-L207】, aber Nebenaktionen nicht.
- Safe-Areas: Header nutzt `safe-area-top`, Composer-Wrapper nur Klassenreferenz ohne direkte `env()`-Padding【F:src/pages/Chat.tsx†L118-L176】. Auf Geräten mit Home Indicator kann der Send-Button teilweise abgeschnitten werden.
- Scroll/Layout-Shifts: Sticky Header + Sticky Composer + Gradient-Layer erzeugen wenig nutzbare Vertikale; reduziert die sichtbare Message-Höhe, erhöht Scrollbedarf (Heuristik: Effizienz verletzt).

## 6. Roadmap: Quick Wins vs. Deep Dives
- **Quick Wins:** Header-Padding & max-width entfernen, Buttons im Drawer auf 44px anheben, Composer-Padding um Safe-Area erweitern, Schatten in Message-List reduzieren.
- **Structural Changes:** Token-Enforcement (eslint/tailwind plugin gegen Standard-Spacings), vereinheitlichte Radius/Shadow-Tokens pro Komponententyp, Audit aller Glas/Gradient-Layer auf Mobile und Reduktion auf ein primäres Highlight pro Screen.
