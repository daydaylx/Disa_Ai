# Design-System: Disa AI

> **Version:** 3.0.0
> **Status:** Aktiv & konsolidiert
> **Letztes Update:** November 2025

## 1. Übersicht

Das Design-System von Disa AI ist ein modernes, performantes und barrierefreies System, das für eine Mobile-First-Erfahrung optimiert ist. Es ist stark von **Microsoft's Fluent 2 Design-System** inspiriert und setzt auf klare Hierarchien, subtile "Glassmorphism"-Effekte und eine solide Grundlage aus Design-Tokens.

Dieses Dokument beschreibt den aktuellen Stand und ersetzt alle früheren Dokumentationen, die sich auf "Neumorphismus" oder andere veraltete Konzepte bezogen.

---

## 2. Design-Philosophie

### Kernprinzipien

1.  **Klarheit & Fokus**: Die Benutzeroberfläche soll intuitiv sein und den Nutzer nicht ablenken. Inhalte und Interaktionen stehen im Vordergrund.
2.  **Performance first**: Alle Design-Entscheidungen müssen die Performance auf mobilen Geräten berücksichtigen. Animationen und Effekte werden sparsam und gezielt eingesetzt.
3.  **Barrierefreiheit (Accessibility)**: Das System muss den WCAG 2.1 AA-Standards entsprechen. Kontraste, Fokus-Zustände und Tastatur-Navigation sind integraler Bestandteil jeder Komponente.
4.  **Konsistenz & Wartbarkeit**: Ein zentrales Token-System stellt sicher, dass das Design über die gesamte Anwendung hinweg konsistent und einfach zu warten ist.

### Visuelle Hierarchie

Die visuelle Tiefe wird durch ein einfaches, zweistufiges Schatten-System erzeugt, das auf dem "Glassmorphism"-Prinzip basiert:

-   **Standard-Oberfläche (`--shadow-elevation-1`)**: Für Basiselemente wie Karten oder statische Container.
-   **Erhöhte Oberfläche (`--shadow-elevation-2`)**: Für schwebende Elemente wie Modals, Popovers oder wichtige hervorzuhebende Bereiche.

Zusätzlich werden "Glow"-Schatten verwendet, um interaktiven oder statusbehafteten Elementen einen dezenten, farbigen Schein zu verleihen (z. B. bei Fokus oder Validierungsfehlern).

---

## 3. Token-System

Das gesamte Design-System basiert auf einem Satz von Design-Tokens, die zentral verwaltet und in der gesamten Anwendung wiederverwendet werden.

### 3.1. Struktur und Generierung

1.  **Quelle der Wahrheit (Source of Truth)**: Die Tokens sind in typsicheren TypeScript-Dateien unter `src/styles/tokens/` definiert (z. B. `color.ts`, `shadow.ts`, `spacing.ts`).
2.  **Generierung von CSS-Variablen**: Ein Build-Skript (`scripts/generate-tokens.mjs`) liest diese TypeScript-Dateien und generiert daraus automatisch CSS-Custom-Properties.
3.  **Verwendung in Tailwind CSS**: Die `tailwind.config.ts` referenziert diese CSS-Variablen, um die Utility-Klassen zu erstellen.

Dieses System stellt sicher, dass Design-Änderungen nur an einer Stelle vorgenommen werden müssen und sich konsistent auf die gesamte Anwendung auswirken.

### 3.2. Wichtige Token-Kategorien

#### Farben (`color.ts`)

Das Farbsystem ist semantisch aufgebaut und unterscheidet zwischen verschiedenen Anwendungsfällen:

-   `surfaces`: Hintergrundfarben für verschiedene Ebenen (z. B. `canvas`, `base`, `card`).
-   `text`: Textfarben für unterschiedliche Hierarchien (z. B. `primary`, `secondary`, `muted`).
-   `border`: Farben für Ränder und Trennlinien.
-   `brand`: Die primäre Markenfarbe (`--color-brand-primary`).
-   `status`: Farben für Erfolgs-, Warn-, Fehler- und Info-Zustände.
-   `action`: Farben für interaktive Elemente wie Buttons in verschiedenen Zuständen (`hover`, `active`, `focus`).

#### Schatten (`shadow.ts`)

Wie in der Philosophie beschrieben, gibt es ein minimalistisches, performantes Schatten-System:

-   `--shadow-elevation-1`: Subtiler Schatten für Standard-Elemente.
-   `--shadow-elevation-2`: Stärkerer Schatten für schwebende Elemente.
-   `--shadow-inset`: Ein innerer Schatten für "gedrückte" Zustände.
-   `--shadow-glow-*`: Farbige Schein-Effekte für verschiedene Status (z. B. `--shadow-glow-brand` für Fokus).

#### Typografie, Abstände & Radien

-   **Typografie (`typography.ts`)**: Definiert Schriftgrößen (`--text-sm`, `--text-base`, etc.) und Schriftstärken.
-   **Abstände (`spacing.ts`)**: Eine rhythmische Skala für `margin`, `padding` und `gap` (z. B. `--spacing-4` für `1rem`).
-   **Radien (`radius.ts`)**: Definiert Eckradien für Elemente wie Buttons und Karten.

---

## 4. Komponenten-System

Die UI-Komponenten (`src/components/ui/`) sind nach den folgenden Prinzipien aufgebaut:

### 4.1. Grundlage: Radix UI

Für die Logik und Barrierefreiheit komplexer Komponenten (Dialoge, Selects, Tooltips etc.) wird **Radix UI** verwendet. Radix liefert "headless" Komponenten, die keine eigenen Stile mitbringen, aber die gesamte Funktionalität, State-Verwaltung und ARIA-Attribute bereitstellen.

### 4.2. Styling: CVA & Tailwind

-   **Tailwind CSS**: Das Styling der Komponenten erfolgt ausschließlich über Tailwind-Utility-Klassen.
-   **`class-variance-authority` (cva)**: `cva` wird verwendet, um typsichere Varianten für jede Komponente zu erstellen. Dies ermöglicht es, verschiedene Stile (`variant`), Größen (`size`) oder Zustände (`state`) einfach und konsistent anzuwenden.

**Beispiel für eine Button-Komponente:**

```tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-semibold",
  {
    variants: {
      variant: {
        primary: "bg-brand-primary text-on-brand",
        secondary: "bg-surface-raised text-primary",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-8 px-3",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);
```

### 4.3. Barrierefreiheit (Accessibility)

Jede Komponente wird unter Berücksichtigung der Barrierefreiheit entwickelt:

-   **Fokus-Indikatoren**: Alle interaktiven Elemente haben einen klar sichtbaren Fokus-Zustand, der über einen `--shadow-glow-brand`-Effekt realisiert wird.
-   **Tastatur-Navigation**: Die Navigation und Interaktion mit allen Komponenten ist vollständig per Tastatur möglich.
-   **Screen-Reader-Unterstützung**: Durch die Verwendung von Radix UI und semantischem HTML sind die Komponenten für Screen-Reader optimiert.
-   **Reduzierte Bewegung**: Animationen und Übergänge respektieren die `prefers-reduced-motion`-Einstellung des Betriebssystems.

---

## 5. Mobile-Optimierung

### Performance

-   **Minimale Schatten**: Das Schatten-System ist bewusst einfach gehalten, um die Render-Performance auf mobilen Geräten nicht zu beeinträchtigen.
-   **Lazy Loading**: Komponenten und Bibliotheken, die nicht sofort benötigt werden (z. B. für Syntax-Highlighting), werden verzögert geladen.

### Layout

-   **Safe Area Insets**: Das Layout berücksichtigt die "Safe Areas" von modernen Smartphones, sodass keine UI-Elemente von der "Notch" oder anderen System-UI-Elementen verdeckt werden.
-   **Dynamische Viewport-Höhe (`--vh`)**: Die Anwendung passt sich an die tatsächliche sichtbare Höhe des Browserfensters an, um Layout-Sprünge beim Ein- und Ausblenden der mobilen Adressleiste zu vermeiden.
