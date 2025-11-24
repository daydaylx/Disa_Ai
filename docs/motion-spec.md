# Motion Specification (Deutsch)

Dieses Dokument beschreibt die Motion-Guidelines für Disa AI. Alle Animationen nutzen eine kleine, konsistente Menge an Dauer- und Easing-Tokens; `prefers-reduced-motion` wird respektiert.

## Prinzipien
- **Purposeful Motion:** Animationen leiten Aufmerksamkeit, geben Feedback oder verbessern die wahrgenommene Performance.
- **Subtil & schnell:** Kurz halten, keine ablenkenden Effekte.
- **Konsistenz:** Immer die definierten Tokens verwenden.
- **Accessibility:** Bei reduzierter Bewegung Animationen abschwächen oder deaktivieren.

## Motion-Tokens

Alle Werte sind als CSS-Variablen definiert und in `tailwind.config.ts` gemappt.

### Dauern
| Token                 | Wert   | Einsatz                              |
| :-------------------- | :----- | :----------------------------------- |
| `--motion-duration-1` | 120ms  | Schnelle Interaktionen (Chips, Hover) |
| `--motion-duration-2` | 180ms  | Basis-Interaktionen (Modals, Tooltips) |
| `--motion-duration-3` | 240ms  | Page-Transitions, komplexe Elemente   |

Tailwind: `duration-1`, `duration-2`, `duration-3`.

### Easing
| Token             | Wert                        | Einsatz                |
| :---------------- | :-------------------------- | :--------------------- |
| `--motion-ease-1` | cubic-bezier(.23,1,.32,1)   | Standard für alle Anim. |

Tailwind: `ease-1`.

## Anwendungsbeispiele
- Chips: `transition-all duration-1 ease-1`
- Modals: `transition-all duration-2 ease-1`
- Page-Transitions: `transition-all duration-3 ease-1`
- Hover/Press: `transition-all duration-1 ease-1`

## Implementierung
- `@media (prefers-reduced-motion: reduce)` beachten und Animationen dort reduzieren/abschalten.
- Keine rohen `ms`/`cubic-bezier` Werte in Komponenten; immer Tokens nutzen.
- Bei komplexen Animationslibs Tokens weiterverwenden, um Konsistenz zu behalten.
