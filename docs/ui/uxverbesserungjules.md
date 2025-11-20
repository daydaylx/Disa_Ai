# UX/UI Audit Report: Disa AI Mobile Experience

## 1. Executive Summary
Die aktuelle Implementierung weicht signifikant von der in `docs/UX_MOBILE_FIRST_SPECIFICATION.md` definierten Mobile-First-Strategie ab. Statt der spezifizierten Bottom-Navigation wird ein für Mobile ungeeignetes Hamburger-Menü (Drawer) verwendet, was die Erreichbarkeit (Thumb Zone) massiv einschränkt. Zudem verletzen zentrale interaktive Elemente (Buttons, Chat-Actions) systematisch die Mindestgröße von 44px (bzw. 48px laut Spec), was die App auf Touch-Geräten frustrierend bedienbar macht. Der größte Hebel ist die Umsetzung der spezifizierten Bottom-Navigation und die globale Korrektur der Touch-Targets.

## 2. Top-Prioritäten (Must-Fix)
1.  **P0: Navigation Architektur korrigieren** – Das Hamburger-Menü (`AppMenuDrawer`) durch die spezifizierte Bottom-Navigation (`MobileBottomNav`) ersetzen, um Kernfunktionen (Chat, Models) direkt erreichbar zu machen.
2.  **P0: Touch-Targets vergrößern** – Globale Anhebung der Button-Standardhöhe von 40px (`h-10`) auf min. 44px/48px. Kritische Fixes in `ChatMessage` (aktuell 32px).
3.  **P1: Header-Höhe optimieren** – Reduktion der Header-Gesamthöhe von ~69px auf max. 60px, um wertvollen Screen-Real-Estate für den Chat-Content freizugeben.
4.  **P1: Mobile Padding reduzieren** – Der Content-Container (`main` in `AppShell`) nutzt `px-6` (24px), was auf kleinen Screens (360px) zu viel Platz verschwendet. Reduktion auf `px-4` (16px).

## 3. Detaillierte Problemanalyse

| ID | Bereich/Komponente | Problem & Impact | Lösungsvorschlag (Deskriptiv) | Prio |
|----|-------------------|------------------|-------------------------------|------|
| UX-01 | Navigation (`AppShell`) | Hamburger-Menü versteckt Kernfunktionen; Bruch mit Spec | Implementierung der 5-Tab Bottom Navigation gemäß Spec (Höhe 56px + Safe Area). | **P0** |
| UX-02 | `Button.tsx` | Standardgröße `h-10` (40px) und `sm` (36px) verletzen Touch-Guidelines | Standard auf `h-12` (48px) erhöhen oder mobile-specific `touch` Variante einführen. | **P0** |
| UX-03 | `ChatMessage.tsx` | Copy/Retry Buttons sind 32px (`h-8`) – extrem schwer zu treffen | Mindestgröße auf 44px erhöhen (via Padding oder größere Hit-Area), Icons optisch klein lassen. | **P0** |
| UX-04 | `AppHeader.tsx` | Zu hoch (~69px durch Padding + Min-Height), wirkt wuchtig | Padding auf `py-2` reduzieren, Elemente kompakter anordnen (Ziel: 56-60px). | P1 |
| UX-05 | `AppShell` (Layout) | `px-6` (24px) Seitenrand verschwendet Platz auf Mobile (360px) | Responsive Padding: `px-4` (16px) für Mobile, `px-6` erst ab Tablet. | P1 |
| UX-06 | `ChatComposer.tsx` | Inline Style `height: "48px"` überschreibt Klassen ("billiger" Fix) | Entfernen des Inline-Styles, Nutzung der Tailwind-Klasse `h-12` oder `min-h-[48px]`. | P2 |
| UX-07 | `GlassCard.tsx` | Inkonsistentes Padding: Komponente erzwingt `p-6`, Nutzung überschreibt oft mit `p-3`/`p-4` | Standard-Padding für Mobile auf `p-4` senken; Varianten für `compact` (p-3) einführen. | P2 |
| UX-08 | Typography | Hardcoded `text-[13px]` und `text-[15px]` in `ChatMessage` | Nutzung der Design-Token `text-xs` (12px) oder `text-sm` (14px) zur Konsistenzwahrung. | P2 |

## 4. Design-System & Konsistenz
- **Inkonsistente Größen:** Das Design-System (Tokens) definiert `touch-target-comfortable: 48px`, aber die Komponenten (`Button`, `Avatar`) nutzen hardcoded 40px (`h-10`). Dies ist ein direkter Widerspruch zur "Single Source of Truth".
- **Typography Wildwuchs:** Nutzung von Arbitrary Values (`text-[13px]`, `text-[15px]`) untergräbt die Typografie-Skala. Dies führt zu unharmonischem Schriftbild.
- **GlassCard Varianten:** Die `GlassCard` Komponente wird oft ad-hoc überschrieben (`className` overrides). Es fehlen klare Varianten (z.B. `variant="compact"`) im Design-System, um diese Hacks unnötig zu machen.

## 5. Mobile Specifics
- **Touch-Targets:** Die App ist aktuell "Desktop-First" implementiert (40px Standard). Für eine "Mobile-First" App müssen alle interaktiven Elemente >= 44px sein. `ChatMessage` Actions (32px) sind ein Showstopper.
- **Navigation:** Die fehlende Bottom Navigation zwingt Nutzer bei jedem Kontextwechsel (z.B. Chat -> Models) in das Drawer-Menü (2 Klicks statt 1). Dies bricht den Flow.
- **Thumb Zone:** Durch das Hamburger-Menü oben links/rechts liegen primäre Navigationsziele in der "Hard to reach" Zone. Die Spec sieht diese korrekt in der Bottom Nav (Easy to reach).

## 6. Roadmap: Quick Wins vs. Deep Dives

### Quick Wins (< 1 Std)
- [ ] **Padding Fix:** `AppShell` Padding auf `px-4` für Mobile ändern.
- [ ] **Header Slimming:** `AppHeader` Padding reduzieren.
- [ ] **Composer Cleanup:** Inline-Styles entfernen und durch Klassen ersetzen.

### Structural Changes (Deep Dives)
- [ ] **Navigation Rewrite:** Komplettes Refactoring von `AppShell` zur Nutzung einer Bottom Navigation (gemäß Spec). Entfernen des Drawers als Hauptnavigation.
- [ ] **Design System Sync:** Update der `Button` und `Avatar` Base-Komponenten auf Mobile-Standards (44px+). Dies erfordert visuelle Regression-Tests.
- [ ] **Touch Target Audit:** Refactoring aller `icon-only` Buttons (z.B. in `ChatMessage`), um unsichtbare Hit-Areas von 44px zu garantieren, auch wenn das Icon kleiner ist.
