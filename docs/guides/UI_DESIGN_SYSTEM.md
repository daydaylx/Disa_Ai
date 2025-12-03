# UI & Design System

Das Design der Anwendung ist auf ein modernes, konsistentes und performantes Nutzererlebnis ausgerichtet. Es basiert auf einem durchdachten System aus Design-Tokens, atomaren Komponenten und Utility-First-CSS.

## Design-Token-System

Das Fundament des Designs bildet ein zweistufiges Token-System:

1.  **CSS Custom Properties (`src/styles/design-tokens.css`)**: Hier werden alle grundlegenden Design-Entscheidungen als CSS-Variablen definiert. Dies umfasst Farben (`--color-primary`), Abstände (`--spacing-4`), Radien (`--radius-md`), Schatten und Schriftgrößen. Dieses Vorgehen zentralisiert die Design-Sprache und ermöglicht globale Änderungen an einer einzigen Stelle.

2.  **Tailwind-Konfiguration (`tailwind.config.ts`)**: Die Tailwind-Konfiguration konsumiert diese CSS-Variablen, um die Utility-Klassen zu erzeugen. Anstatt Werte hart zu kodieren, werden die Variablen referenziert:
    ```javascript
    // tailwind.config.ts
    theme: {
      extend: {
        colors: {
          primary: 'hsl(var(--primary))',
        },
        spacing: {
          4: 'var(--spacing-4)', // -> 16px
        }
      }
    }
    ```
    Dieses Vorgehen kombiniert die Flexibilität von Tailwind mit der Wartbarkeit eines zentralen Token-Systems.

## Komponenten-Bibliothek (`src/components/ui`)

Die Anwendung verfügt über eine eigene, wiederverwendbare Komponenten-Bibliothek, die auf folgenden Prinzipien basiert:

- **Headless-Komponenten von Radix UI**: Für komplexe UI-Elemente wie Dialoge, Dropdowns oder Checkboxen wird Radix UI als ungestylte, barrierefreie Basis verwendet. Dies trennt die Logik und das State-Management der Komponente von ihrem Aussehen.
- **Styling mit `class-variance-authority`**: Jede Komponente (z.B. `button.tsx`) verwendet `cva` um verschiedene Varianten (z.B. `variant: 'default' | 'destructive'`) und Größen (`size: 'sm' | 'lg'`) zu definieren. Dies erzeugt eine typsichere API zur Erstellung konsistenter UI-Elemente.
- **Klassen-Management mit `cn` (`src/lib/cn.ts`)**: Eine kleine Hilfsfunktion, die `clsx` und `tailwind-merge` kombiniert. Sie ermöglicht das bedingte Zusammenfügen von Klassen und löst Konflikte bei Tailwind-Klassen automatisch auf (z.B. `p-2` und `p-4` wird korrekt zu `p-4`).

## Styling & Layout

- **UI-Grundsätze**: Ein klares, reduziertes Design-System mit maximaler Funktionalität und dramatischen neumorphen Effekten. Das Dramatic Neumorphism Design-System verwendet tiefe, mehrschichtige Schatten und erhabene Oberflächen für eine taktile, dreidimensionale Benutzererfahrung mit konsistenten Abständen und Farben.
- **Mobile-First & Safe Area**: Das Layout ist primär für mobile Geräte konzipiert. `env(safe-area-inset-*)` wird in der Tailwind-Konfiguration genutzt, um sicherzustellen, dass UI-Elemente nicht von der "Notch" oder den Home-Indikatoren auf iOS- und Android-Geräten verdeckt werden.
- **Dynamische Viewport-Höhe**: `App.tsx` enthält eine Logik, die die tatsächliche sichtbare Höhe des Viewports (`window.visualViewport.height`) misst und als CSS-Variable (`--vh`) setzt. Dies löst das klassische Problem auf mobilen Browsern, bei dem die Adressleiste die `100vh`-Einheit verfälscht.
