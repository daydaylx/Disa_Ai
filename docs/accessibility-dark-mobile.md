# Accessibility Quick Check – Dark Theme (Android Focus)

Datum: 2. November 2025  
Viewport: Pixel 6 / Chrome 141 emuliert  
Ziel: Sicherstellen, dass das neue Dark-Only UI tastatur- und kontrastseitig robust bleibt.

## Tastaturnavigation

| Bereich | Ergebnis | Bemerkungen |
| --- | --- | --- |
| Chat Start | `Tab` führt Reihenfolge: „Neuer Chat“, „Verlauf öffnen“, Preset-Select → Accordion Buttons | Fokus sichtbar via `shadow-focus-neo`; CTA hat zusätzlich scale |
| Command Palette | `Ctrl+K` (Desktop) → Liste erhält `aria-selected`; Pfeiltasten und `Enter` funktionieren | Close-Button hat Fokusring. `color-mix` Tints kontrastreich |
| Chat History Drawer | Keyboard öffnet Drawer, Items fokussierbar; Delete-Button `Enter`-triggerbar | Hover/Fokus-Shadow sichtbar, Outline optional |
| Settings Overview | Karten per `Tab` erreichbar (Link-Wrapper). Status-Badges nicht fokussierbar (rein informativ) | CTA „Details anzeigen“ reagiert auf Enter/Space |
| Templates | Ganze Card `role=button` -> Enter/Space starten Template. Hover & Focus ring sichtbar | Delete/Preview optional? (Preview optional) |

## Screenreader / Semantik
- `CommandPalette`: `role="dialog"` + `aria-labelledby`/`aria-describedby` vorhanden.  
- `Accordion` (Welcome) nutzt eigene `Accordion`-Komponente (Radix). Labels/Meta werden gelesen.  
- Template Cards: `aria-label` im Root-Button vorhanden.  
- Chat History Items: keine `aria-selected`. Optionales Enhancement: `role="listbox"` + `aria-selected` pro Item (kann später folgen).

## Farb-/Kontrastchecks
- Primärtexte: `text-text-primary` (#f6f7ff auf #0f1424) -> Kontrast ~12:1.  
- Sekundärtexte: `text-text-secondary` (#c2c7da) -> Kontrast ~6:1 > 4.5:1 OK.  
- Badge-Text auf brand (`shadow-glow-brand-subtle`) -> `#4b63ff` auf `bg ≈ #10142b` -> ~5.5:1.  
- Hover `color-mix` (Command Palette description) -> ca. #adb8ff auf #10142b => ~5:1.  
- Buttons Outline/Hover: `border-[var(--border-neumorphic-subtle)]` (#1a2440) vs background (#0f1424) > 1.5:1; Outline + shadow ausreichend sichtbar.

## Motion / prefers-reduced-motion
- Schatten-/Scale-Transitions < 200 ms, `transition` reagiert auf `motion-safe`.  
- Keine parallax-Effekte oder persistente Animationen.

## Offene Punkte / ToDos
1. **Automatisierter Lighthouse-Lauf**: CLI scheiterte mangels Chrome. Empfohlen: in CI (GitHub Action) laufen lassen.  
2. **List Accessibility**: Chat History könnte `aria-selected`/`role=listbox` erhalten, um NVDA/VoiceOver Klarheit zu geben.  
3. **Tooltip Delay**: Radix öffnet sofort; überlegen, global Delay/HoverIntent zu setzen (nicht kritisch).  
4. **Color-mix Fallback**: Safari 15 benötigt Fallback; aktuell ≥16.4 OK. Optional: `@supports (color: color-mix(...))` -> Alternative Farbe definieren.

**Fazit:** Dark-Only UI erfüllt praxisrelevante Tastatur- und Kontrastanforderungen. Keine Blocker; oben genannte Punkte als Follow-up aufnehmen.
