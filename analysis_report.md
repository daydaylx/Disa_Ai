# Ist-Analyse & Maßnahmen-Checkliste (Disa AI "Buch-Konzept")

## 1. Übersicht & Ziel
Das Ziel ist die konsequente Umsetzung des "Tinte-auf-Papier"-Konzepts (Buch.md). Die aktuelle Anwendung befindet sich in einem Hybrid-Zustand zwischen dem alten "Neumorphism/Aurora"-Design und ersten Ansätzen des Buch-Konzepts (Swipe-Logik teilweise vorhanden).

## 2. Ist-Analyse (Vergleich Ist vs. Soll)

### Visuelles Design (Look & Feel)
| Bereich | Ist-Zustand (Code/Live) | Soll-Zustand (Buch.md) | Status |
| :--- | :--- | :--- | :--- |
| **Theme-Basis** | Mix aus `design-tokens-consolidated.css` (Neon/Glow) und `theme-ink.css`. | Rein `theme-ink.css` (Warmes Off-White, dunkle Tinte). | ⚠️ Konflikt |
| **Farben** | Viel Lila/Violett, Aurora-Gradients, Dark-Mode Default. | `hsl(45, 25%, 96%)` (Papier), `hsl(220, 15%, 18%)` (Tinte). | ❌ Falsch |
| **Schatten/Tiefe** | Neumorphismus (`shadow-raise`, `shadow-inset`), "Glow"-Effekte. | Subtile Papierschatten (`0 1px 3px`), keine Glows. | ❌ Falsch |
| **Typografie** | System-UI, aber oft zu klein oder kontrastarm auf Glass-Hintergründen. | Gute Lesbarkeit (17-18px Base), hoher Kontrast (Tinte auf Papier). | ⚠️ Verbesserbar |
| **Borders/Radius** | Oft keine Borders (nur Schatten), Radien teils inkonsistent. | 1px feine Borders, "Notizbuch"-Radius (8-12px). | ❌ Falsch |

### Layout & Interaktion
| Bereich | Ist-Zustand | Soll-Zustand | Status |
| :--- | :--- | :--- | :--- |
| **Haupt-Container** | Füllt Screen, oft Glass-Overlay-Optik. | Definierte "Buchseite" mit Rändern (vor allem auf Tablet/Desktop). | ⚠️ Teils |
| **Swipe-Logik** | `BookSwipeGesture` und `useBookNavigation` sind im Code vorhanden. | Swipe Links = Neu, Rechts = Zurück (History). | ✅ Vorhanden (zu prüfen) |
| **Lesezeichen** | `Bookmark`-Komponente existiert. | Rechts oben, "Zunge"-Optik, öffnet Sidepanel. | ✅ Vorhanden (Optik prüfen) |
| **Navigation** | Mix aus Bottom-Nav (in Specs erwähnt) und On-Screen Buttons. | Fokus auf Swipe + Lesezeichen. | ⚠️ Aufräumen |

### Code-Struktur
*   **`tailwind.config.ts`**: Stark auf das alte "Premium Material Studio" (Lila Brand, Glows) ausgerichtet. Muss bereinigt werden.
*   **`src/index.css`**: Importiert widersprüchliche Stylesheets (`aurora-optimized.css`).
*   **`Chat.tsx`**: Verwendet Klassen wie `backdrop-blur-sm`, `bg-surface-2/95`, `shadow-raise`, die dem Buch-Konzept widersprechen.

## 3. Maßnahmen-Checkliste

### A. Basis-Styling & Cleanup (Priorität 1)
- [ ] **`src/index.css`**: Importe von `aurora-optimized.css` und `design-tokens-consolidated.css` entfernen. `theme-ink.css` als Primary setzen.
- [ ] **`tailwind.config.ts`**: "Aurora" und "Brand Glow" Sektionen entfernen. Colors auf CSS-Variablen aus `theme-ink.css` mappen (`--bg-app`, `--bg-page`).
- [ ] **Reset**: Hintergrundfarbe global auf "Papier" (Off-White) erzwingen, Dark-Mode (vorerst) deaktivieren oder anpassen (Dunkles Papier).

### B. Chat-Page Refactoring (Priorität 2)
- [ ] **Container**: `bg-surface-2` und `shadow-raise` durch `bg-page`, `border-ink-border` (1px) ersetzen.
- [ ] **Composer**: Gradients entfernen. Solider "Papier"-Hintergrund mit Top-Border.
- [ ] **Info-Bar**: Glass-Effekt (`backdrop-blur`) entfernen. Einfacher, sauberer Header.
- [ ] **Nachrichten**: Bubbles anpassen (User: leicht getönt, Bot: Weiß mit Tinte-Border/Akzent-Linie).

### C. Komponenten-Anpassung (Priorität 3)
- [ ] **Buttons**: "Glow"-Effekte entfernen. Klare, flache Buttons oder Outline-Buttons nutzen.
- [ ] **Lesezeichen**: Sicherstellen, dass es wie ein physisches Lesezeichen aussieht (kein schwebender Button).
- [ ] **Sidepanel**: "Papier"-Look statt Overlay-Blur.

### D. Mobile-UX Check
- [ ] Font-Size auf mind. 16px (besser 17px) für Chat-Text.
- [ ] Touch-Targets prüfen (mind. 44px).
- [ ] Safe-Areas (Notch/Home-Bar) prüfen.
