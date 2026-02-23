# UI Forensics – Mobile Layout / Layering / Scroll (Analyse-only)

Datum: 2026-02-22  
Quelle Baseline: `docs/reports/ui-baseline-2026-02-22/FINDINGS.md` + Screenshots + Code-Forensik

## Scope

- Fokus: Ursachenanalyse für sichtbare Mobile-UI-Probleme (kein Fix, keine Implementierung)
- Referenz-Findings:
  - **S1**: `Composer + MobileBottomNav Overlap`
  - **S2**: `ScrollToBottom` Layering gegen BottomNav/Composer
  - **S2**: `Feedback textarea` Clipping in BottomNav-Zone
- Untersuchte Schwerpunkte:
  - Scroll-Owner
  - Fixed Layers / Overlays
  - Portals (body vs Phone-Frame)
  - Z-Index-Policy
  - Safe-Area-Kette
  - Mobile-only Desktop Frame Nebenwirkungen

---

## Root Causes (max 5, testbar)

### 1) Bottom-Clearance ist geometrisch zu knapp / inkonsistent

**Aussage (testbar):** Der für den Chat-Composer reservierte Bottom-Abstand basiert auf `--app-bottom-nav-height` + `env(safe-area-inset-bottom)`, während die reale visuelle BottomNav-Fläche größer wirkt (u. a. durch innere Container/Padding). Dadurch endet der Composer-Bereich regelmäßig im Nav-Bereich.

**Belege (Code):**
- `src/pages/Chat.tsx`  
  `pb-[calc(env(safe-area-inset-bottom,0px)+var(--app-bottom-nav-height,0px))]`
- `src/components/navigation/MobileBottomNav.tsx`  
  `fixed ... bottom-0 z-bottom-nav` + inneres `pb-[env(safe-area-inset-bottom,0px)]` + `min-h-[var(--app-bottom-nav-height)]`
- `src/app/layouts/AppShell.tsx`  
  für Nicht-Chat ebenfalls `pb-[calc(var(--app-bottom-nav-height)+env(safe-area-inset-bottom,0px))]`

**Belege (Screenshots):**
- praktisch alle Chat-States/Viewports aus Findings (`chat__default__*`, `chat__drawer-open__*`, `chat__history-open__*`, `chat__keyboard-focus__*`, `chat__long-history-scrollfab__*`)

---

### 2) Fixed-Layer + Body-Portal kollidieren mit Phone-Frame-Modell

**Aussage (testbar):** Overlays und einige fixed Elemente werden an `document.body`/Viewport ausgerichtet, während die App visuell in `.phone-frame-content` (max 430px) gekapselt ist. Das erzeugt Layer- und Positionierungsdifferenzen zwischen logischem Root und visuellem Frame.

**Belege (Code):**
- Phone-Frame: `src/App.tsx` (`phone-frame-wrapper`, `phone-frame-content`) + `src/styles/base.css` (`.phone-frame-content { max-width: 430px; overflow: hidden; }`)
- Body-Portale:
  - `src/components/layout/AppMenuDrawer.tsx` → `createPortal(..., document.body)`
  - `src/ui/BottomSheet.tsx` → `createPortal(..., document.body)`
  - `src/ui/toast/index.tsx` → eigener `toast-root` in `document.body`
  - Radix Portals (`Dialog`, `Select`) standardmäßig ebenfalls body-basiert

**Beobachtbarer Effekt:** Drawer/Sheet/Select/Dialog/FAB können unabhängig vom eigentlichen Frame-Container „global“ gerendert werden.

---

### 3) Z-Index-Policy ist gemischt (Token + freie Werte)

**Aussage (testbar):** Obwohl ein Z-Index-System existiert (`z-index-system.css`), nutzt die UI parallel freie Tailwind- und Arbitrary-Werte (`z-50`, `z-20`, `z-[700]`). Das macht die Layer-Reihenfolge unvorhersehbarer.

**Belege (Code):**
- Token-System: `src/styles/z-index-system.css` (`--z-bottom-nav`, `--z-fab`, `--z-drawer`, `--z-modal`, `--z-toast`, ...)
- Freie Werte in produktivem UI-Code:
  - `src/ui/ScrollToBottom.tsx` → `z-50`
  - `src/pages/Chat.tsx` Input-Bereich → `z-20`
  - `src/ui/Select.tsx` → `z-[700]`

**Beobachtbarer Effekt:** Bei konkurrierenden fixed/portal Layers (FAB, Drawer, Composer, Nav) entstehen Inkonsistenzen trotz vorhandener Semantik-Tokens.

---

### 4) Safe-Area wird mehrfach in der Kette addiert (global + lokal)

**Aussage (testbar):** Safe-Area-Insets kommen gleichzeitig über JS-Variablen auf Root/Body und über lokale `env(safe-area-*)`-Paddings in Komponenten. Das erhöht Risiko für doppelte/uneinheitliche Bottom-Reserve.

**Belege (Code):**
- JS-Inset-Quelle: `src/lib/device-safe-area.ts` setzt `--safe-area-*` und `--mobile-safe-*`
- Global: `src/styles/base.css` nutzt `--mobile-safe-*` direkt auf `body` (inkl. Bottom)
- Lokal zusätzlich:
  - `src/pages/Chat.tsx` Input-Padding via `env(safe-area-inset-bottom)`
  - `src/components/navigation/MobileBottomNav.tsx` mit `pb-[env(safe-area-inset-bottom,0px)]`
  - `src/ui/BottomSheet.tsx` mit `pb-[calc(env(safe-area-inset-bottom,0px)+12px)]`

**Beobachtbarer Effekt:** Unterschiedliche Seiten/States können unterschiedliche kumulierte Bottom-Insets erhalten.

---

### 5) Scroll-Owner-Modell ist nicht strikt singular

**Aussage (testbar):** Es gibt mehrere potentielle vertikale Scroll-Container (routeabhängig), während Overlay-Scroll-Locking primär den Body adressiert. Das erhöht die Wahrscheinlichkeit von Scroll-/Layer-Unruhe.

**Belege (Code):**
- `Chat.tsx`: eigener Scroll-Owner (`chatScrollRef`, `overflow-y-auto`)
- `AppShell.tsx`: Nicht-Chat-Content kann ebenfalls `overflow-y-auto` sein
- `HistorySidePanel.tsx`: eigener `overflow-y-auto`
- `AppMenuDrawer.tsx` und `BottomSheet.tsx`: setzen Body-Scroll-Lock
- Phone-Frame: `.phone-frame-content { overflow: hidden; }` (äußere Hülle nicht scrollend)

**Beobachtbarer Effekt:** Scroll-Verhalten hängt stark vom aktuellen Route-/Overlay-Kontext ab; Body-Lock ist nicht immer identisch mit dem aktiven Scroll-Owner.

---

## Mapping: Problem -> Screenshot -> Komponenten -> konkrete Code-Stellen

| Problem | Screenshot(s) | Betroffene Komponenten | Konkrete Code-Stellen |
|---|---|---|---|
| Composer überlappt BottomNav (S1) | `chat__default__360x800.png`, `chat__default__390x844.png`, `chat__default__412x915.png`, `chat__default__430x932.png`, `chat__default__768x1024.png` (plus gleiche Tendenz in drawer/history/keyboard/long-history) | Chat Composer, MobileBottomNav, AppShell spacing | `src/pages/Chat.tsx` (Input-Wrapper `pb-[calc(env(...)+var(--app-bottom-nav-height))]`), `src/components/navigation/MobileBottomNav.tsx` (`fixed bottom-0`, `min-h-[var(--app-bottom-nav-height)]`, `pb env(...)`), `src/app/layouts/AppShell.tsx` (`pb-[calc(var(--app-bottom-nav-height)+env(...))]`) |
| FAB überlappt BottomNav (S2) | `chat__long-history-scrollfab__360x800.png`, `chat__long-history-scrollfab__412x915.png`, `chat__long-history-scrollfab__430x932.png` | ScrollToBottom, MobileBottomNav | `src/ui/ScrollToBottom.tsx` (`fixed bottom-24 right-4 z-50`), `src/components/navigation/MobileBottomNav.tsx` (`fixed ... z-bottom-nav`) |
| FAB kollidiert mit Composer (S2) | `chat__long-history-scrollfab__360x800.png`, `chat__long-history-scrollfab__412x915.png`, `chat__long-history-scrollfab__430x932.png` | ScrollToBottom, Composer/Input-Block | `src/ui/ScrollToBottom.tsx` (`bottom-24`, `z-50`), `src/pages/Chat.tsx` Input-Container (`z-20`, Bottom-Padding-Strategie) |
| Feedback-Textarea ragt in BottomNav (S2) | `feedback__default__360x800.png`, `feedback__drawer-open__360x800.png` | FeedbackPage Content-Container, AppShell, MobileBottomNav | `src/pages/FeedbackPage.tsx` (Seitencontainer ohne nav-klaren Bottom-Clearance), `src/app/layouts/AppShell.tsx` (globales Bottom-Padding), `src/components/navigation/MobileBottomNav.tsx` (fixed Bottom Layer) |

---

## Forensik-Details nach Themen

### Scroll-Owner

- Chat: primär `div[role="log"]` in `Chat.tsx` mit `overflow-y-auto`.
- Nicht-Chat-Routen (via AppShell): eigener scrollbarer Content-Bereich möglich.
- Drawer/HistoryPanel: jeweils eigener interner Scroll.
- Body wird bei bestimmten Overlays gelockt (Drawer/BottomSheet), ist aber nicht immer der aktive Scroll-Owner.

### Fixed Layers

- `MobileBottomNav`: `fixed bottom-0 z-bottom-nav`
- `ScrollToBottom`: `fixed bottom-24 right-4 z-50`
- Composer-Bereich im Chat: nicht fixed, aber eigener Z-Layer (`z-20`) + Bottom-Clearance
- `AppMenuDrawer`, `HistorySidePanel`: `fixed inset-0 z-drawer`

### Portals

- Sicher body-portalisiert: AppMenuDrawer, BottomSheet, Toasts
- Radix-Komponenten (Dialog, Select) nutzen Portal-Mechanik ebenfalls global
- In Phone-Frame-Architektur entsteht dadurch „Root-Split“ zwischen visuellem Frame und technischem Overlay-Root

### Z-Index

- Positiv: zentrales Token-System vorhanden (`z-index-system.css`), in `main.tsx` geladen.
- Negativ: nicht exklusiv verwendet (freie z-Werte existieren weiterhin).

### Safe-Area

- Insets werden per JS ermittelt und als CSS-Variablen gesetzt.
- Gleichzeitig direkte `env(safe-area-*)` Nutzung in Komponenten.
- Body trägt zusätzliche Safe-Area-Paddings.

### Mobile-only Desktop Frame (screens=99999px + phone-frame)

- Alle responsive Breakpoints sind deaktiviert (`tailwind.config.ts`, `screens: 99999px`).
- Visuelle App in `.phone-frame-content` gekapselt (`max-width: 430px; overflow: hidden`).
- Nebenwirkung: fixed/body-portal Layer orientieren sich am Viewport statt strikt am Frame.

---

## Entscheidungspunkte

### A) Overlay-Root: `body` vs `.phone-frame-content`

**Option body (Ist-Zustand):**
- + technisch Standard für viele Portal-Libs
- − kollidiert mit visuellem Phone-Frame-Modell (global vs framed)

**Option phone-frame-content:**
- + Overlay-Geometrie folgt dem visuellen Mobil-Container
- − benötigt konsistenten Portal-Container-Mechanismus für alle Overlay-Typen

**Entscheidungsfrage (testbar):** Müssen Overlays bei Desktop-Viewport strikt auf 430px-Frame begrenzt sein oder bewusst global viewport-basiert bleiben?

---

### B) Single Scroll-Owner Policy

**Entscheidungsfrage (testbar):** Soll pro Route genau **ein** vertikaler primärer Scroll-Owner definiert werden (und alle Overlays daran ausgerichtet), inklusive standardisiertem Scroll-Lock-Verhalten?

Messkriterium:
- Kein gleichzeitiger Root-Scroll + Inner-Scroll in kritischen Flows
- Keine Scroll-Sprünge beim Öffnen/Schließen von Drawer/Panel/Sheet

---

### C) Z-Index-Policy (strict)

**Entscheidungsfrage (testbar):** Gilt künftig strikt „nur CSS-Variablen (`z-index-system.css`)“, keine freien `z-50`, `z-[700]`, Inline-zIndex in produktiven UI-Layern?

Messkriterium:
- Alle persistenten UI-Layer/FAB/Overlays referenzieren semantische Z-Tokens
- Layer-Reihenfolge ist dokumentierbar und deterministisch

---

## Kurzfazit

Die Findings sind konsistent mit einer systemischen Ursache-Kombination aus (1) knapper Bottom-Clearance, (2) globalen Fixed/Portal-Layern trotz Phone-Frame, (3) inkonsistentem Z-Index-Regelwerk und (4) mehrfacher Safe-Area-Anrechnung.  
Das erklärt die wiederholten S1/S2-Befunde ohne zusätzliche Design-Hypothesen.
