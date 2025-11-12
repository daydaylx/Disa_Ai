# UI-Richtlinien: Disa AI Design System

**Version:** 2.0 (Glassmorphism Refresh)
**Stand:** 2025-11-12

## 1. Design-Prinzipien

### 1.1 Soft-Depth Glassmorphism
- **Dunkler Hintergrund** mit subtilen Verläufen
- **Halbtransparente Paneele** mit Backdrop-Blur
- **Weiche Schatten** statt harter Kanten
- **Dezente 1-px-Outlines** mit geringer Opazität (8-12% Weiß)

### 1.2 Farbklima
- **Neutral-dunkle Flächen**: Keine aggressive Schwärze
- **Akzentfarbe**: Freundlich, moderat gesättigt (kein Neon)
- **Konsistenz**: Akzent in Icon-Highlights, primären Buttons, aktiven States

### 1.3 Typografie
- **Ruhige Headline-Skala**: Klar lesbar, keine Schnörkel
- **Body-Text**: Gute Zeilenhöhe (1.6), angenehme Lesbarkeit
- **Keine dünnen Hairlines**: Mindestens 400 font-weight

## 2. Design-Tokens

### 2.1 Farben

```css
/* Background */
--surface-bg: var(--color-background-dark);      /* Page background */
--surface-base: var(--color-background-light);   /* Component background */
--surface-muted: #283447;                        /* Secondary content */

/* Glassmorphism Surfaces */
--surface-glass-card: rgba(48, 58, 84, 0.85);    /* Cards */
--surface-glass-panel: rgba(30, 41, 59, 0.75);   /* Panels */
--surface-glass-floating: rgba(40, 52, 71, 0.65); /* Floating */
--surface-glass-overlay: rgba(15, 23, 42, 0.95); /* Modals */

/* Text */
--fg: var(--color-text-primary);                 /* #f8fafc */
--fg-muted: #94a3b8;                             /* Secondary text */
--fg-subtle: #64748b;                            /* Tertiary text */

/* Accent */
--accent: var(--color-brand-primary);            /* #4f46e5 */
--accent-weak: var(--color-brand-secondary);     /* #818cf8 */
--accent-contrast: var(--color-text-on-accent);  /* #ffffff */

/* Borders */
--border-glass: rgba(255, 255, 255, 0.1);        /* 10% */
--border-glass-strong: rgba(255, 255, 255, 0.15); /* 15% */
--border-glass-accent: rgba(79, 70, 229, 0.3);   /* 30% */
```

### 2.2 Spacing

```css
--space-3xs: 4px;
--space-2xs: 6px;
--space-xs: 8px;
--space-sm: 12px;
--space-md: 16px;   /* Standard padding */
--space-lg: 20px;
--space-xl: 24px;
--space-2xl: 32px;
--space-3xl: 40px;
--space-4xl: 48px;
```

**Verwendung:**
- Grid-Gap: `12px` (sm) oder `16px` (md)
- Card-Padding: Mindestens `16px` (md)
- Section-Spacing: `24px` (xl) oder `32px` (2xl)

### 2.3 Border-Radius

```css
--radius-xs: 6px;   /* Badges, kleine Elemente */
--radius-sm: 10px;  /* Buttons */
--radius-md: 14px;  /* Cards, Inputs */
--radius-lg: 18px;  /* Große Karten */
--radius-xl: 24px;  /* Panels, Modals */
--radius-2xl: 32px; /* Hero-Elemente */
```

**Verwendung:**
- Buttons: `rounded-sm` (10px)
- Standard-Cards: `rounded-md` (14px)
- Tiles/Panels: `rounded-lg` (18px)
- Modals: `rounded-xl` (24px)

### 2.4 Schatten (2-Ebenen-System)

```css
/* Surface: Weich, geringer Offset, größerer Blur */
--shadow-surface: 0 2px 8px rgba(0, 0, 0, 0.08),
                  0 1px 3px rgba(0, 0, 0, 0.06);

/* Elevated: Stärker, diffus */
--shadow-elevated: 0 8px 24px rgba(0, 0, 0, 0.12),
                   0 4px 12px rgba(0, 0, 0, 0.08);
```

**Verwendung:**
- Standard-Karten: `shadow-surface`
- Schwebende Elemente (Modals, Drawer): `shadow-elevated`
- Hover-States: Von `surface` zu `elevated`

### 2.5 Backdrop-Blur

```css
--backdrop-blur-subtle: blur(8px);   /* Leichte Unschärfe */
--backdrop-blur-medium: blur(12px);  /* Standard */
--backdrop-blur-strong: blur(16px);  /* Ausgeprägt */
--backdrop-blur-intense: blur(24px); /* Modals */
```

### 2.6 Touch-Targets

```css
--size-touch-compact: 44px;      /* WCAG minimum */
--size-touch-comfortable: 48px;  /* Standard */
--size-touch-relaxed: 56px;      /* Groß */
--size-touch-spacious: 64px;     /* Extra-groß */
```

**Regel:** Mindestens 44×44 px für alle interaktiven Elemente.

## 3. Komponenten-Muster

### 3.1 Buttons

```tsx
// Primary (Accent)
<Button variant="accent" size="default">Senden</Button>

// Glass (Standard)
<Button variant="glass-primary" size="default">Abbrechen</Button>

// Ghost
<Button variant="ghost" size="icon">
  <Icon className="h-5 w-5" />
</Button>
```

**States:**
- **Default**: Baseline mit `shadow-surface`
- **Hover**: `shadow-elevated`, leichter Lift
- **Focus**: `ring-2 ring-accent ring-offset-2`
- **Disabled**: `opacity-50 pointer-events-none`

**Größen:**
- `size="sm"`: 36px Höhe (kompakte UI)
- `size="default"`: 40px Höhe (Standard)
- `size="lg"`: 48px Höhe (prominent CTAs)
- `size="icon"`: 40×40px

### 3.2 Cards

```tsx
// Standard Glass Card
<Card
  tone="glass-primary"
  elevation="surface"
  padding="md"
>
  <CardContent>...</CardContent>
</Card>

// Interactive Tile
<Card
  tone="glass-primary"
  elevation="surface"
  interactive="gentle"
  clickable
  onClick={handleClick}
>
  ...
</Card>
```

**Eigenschaften:**
- **tone**: `glass-primary`, `glass-subtle`, `glass-floating`, `glass-overlay`
- **elevation**: `surface`, `elevated`
- **padding**: `sm` (12px), `md` (16px), `lg` (20px)
- **interactive**: `none`, `basic`, `gentle`, `glow`, `glow-accent`

### 3.3 TileCard (für Start/Hub-Grid)

```tsx
<TileCard
  icon={<Icon className="h-8 w-8" />}
  title="Research"
  description="Tiefe Recherchen, Quellencheck"
  onClick={handleClick}
/>
```

**Spezifikationen:**
- **Aspect-Ratio**: 1:1 oder 4:3
- **Einheitliche Höhe**: Durch Grid-Template
- **Icon**: Oben oder links, konsistente Größe (32px)
- **Hover**: `shadow-surface` → `shadow-elevated`, Lift -2px

### 3.4 SectionCard (für Settings)

```tsx
<SectionCard title="API-Einstellungen">
  <Label>API-Key</Label>
  <Input type="password" />

  <Label>Model</Label>
  <Select>...</Select>
</SectionCard>
```

**Spezifikationen:**
- **Padding**: `md` (16px) oder `lg` (20px)
- **Border-Radius**: `rounded-md` (14px)
- **Border**: `border border-glass`
- **Background**: `bg-surface-glass-card`
- **Interne Spacing**: `space-y-md` (16px)

### 3.5 Chat-Bubbles

```tsx
// User
<Card
  tone="glass-primary"
  intent="accent"
  className="max-w-[70%] ml-auto"
>
  {message.content}
</Card>

// Assistant
<Card
  tone="glass-subtle"
  className="max-w-[70%]"
>
  <MarkdownRenderer content={message.content} />
</Card>
```

**Spezifikationen:**
- **Max-Width**: 70% (nicht 85%!)
- **Timestamps**: Klein, unter der Bubble, `text-xs text-muted`
- **Spacing**: `gap-6` zwischen Bubbles
- **Avatar**: 36×36px, links/rechts ausgerichtet

### 3.6 Composer (Chat-Input)

```tsx
<ChatComposer
  value={input}
  onChange={setInput}
  onSend={handleSend}
  placeholder="Nachricht schreiben..."
/>
```

**Spezifikationen:**
- **Fixed Bottom**: `z-composer` (300)
- **Safe-Area**: `pb-[calc(1rem+max(env(safe-area-inset-bottom),0px))]`
- **Max-Width**: `max-w-md` zentriert
- **Min-Height**: 44px (WCAG)
- **Border**: `border-glass-accent` für Fokus
- **Shadow**: `shadow-elevated`

### 3.7 Bottom-Nav

```tsx
<MobileBottomNav />
```

**Spezifikationen:**
- **Fixed Bottom**: `z-bottom-nav` (105)
- **Safe-Area**: `pb-[max(env(safe-area-inset-bottom),0.35rem)]`
- **Height**: Min. 56px + Safe-Area
- **Items**: 3-5 Tabs
- **Active State**:
  - Akzentfarbe für Icon/Text
  - Soft Glow: `shadow-glow-brand-subtle`
  - Kleiner Balken oben: 4px Höhe, 24px Breite, `bg-accent`

## 4. Layout-Muster

### 4.1 Start/Hub-Grid

```tsx
<div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
  <TileCard ... />
  <TileCard ... />
  <TileCard ... />
</div>
```

**Spezifikationen:**
- **Gap**: 16px (md)
- **Responsive**: 1 Col (mobile), 2 Cols (sm), 3 Cols (lg)
- **Aspect-Ratio**: Konsistent (z.B. 4:3)
- **Min-Height**: Keine variablen Höhen

### 4.2 Settings-Liste

```tsx
<div className="space-y-6">
  <SectionCard title="Account">...</SectionCard>
  <SectionCard title="Appearance">...</SectionCard>
  <SectionCard title="Privacy">...</SectionCard>
</div>
```

**Spezifikationen:**
- **Spacing**: `space-y-6` (24px) zwischen Sektionen
- **Max-Width**: `max-w-2xl mx-auto` für Lesbarkeit
- **Interne Spacing**: `space-y-4` (16px)

### 4.3 Empty States

```tsx
<div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
  <div className="text-6xl">📭</div>
  <h3 className="text-lg font-semibold text-text-primary">
    Keine Nachrichten
  </h3>
  <p className="text-sm text-text-secondary max-w-sm">
    Starte eine neue Konversation mit einem Klick auf den Button unten.
  </p>
  <Button variant="accent" size="lg">
    Neue Konversation
  </Button>
</div>
```

### 4.4 Skeleton-Loading

```tsx
<Card tone="glass-primary" className="animate-pulse">
  <div className="h-4 bg-surface-muted rounded w-3/4 mb-2" />
  <div className="h-3 bg-surface-muted rounded w-1/2" />
</Card>
```

**Spezifikationen:**
- **Gleiche Geometrie** wie finale Karten
- **Pulse-Animation**: `animate-pulse`
- **Background**: `bg-surface-muted`

## 5. Mobile-First & Safe-Area

### 5.1 Breakpoints

```css
xs: 480px   /* Kleine Phones */
sm: 640px   /* Große Phones */
md: 768px   /* Tablets */
lg: 1024px  /* Desktop */
xl: 1280px  /* Große Desktops */
```

### 5.2 Safe-Area-Insets

```tsx
// Bottom-Nav
<nav className="pb-[max(env(safe-area-inset-bottom),0.35rem)]">
  ...
</nav>

// Composer
<div
  className="pb-[calc(1rem+max(env(safe-area-inset-bottom),0px))]"
  style={{
    paddingLeft: "max(env(safe-area-inset-left), 0.5rem)",
    paddingRight: "max(env(safe-area-inset-right), 0.5rem)",
  }}
>
  ...
</div>
```

### 5.3 Viewport-Handling

```tsx
// Für iOS Keyboard
const viewport = useVisualViewport();

<div
  style={{
    transform: viewport.isKeyboardOpen
      ? `translateY(-${viewport.offsetTop}px)`
      : undefined
  }}
>
  ...
</div>
```

## 6. Accessibility (A11y)

### 6.1 Fokus-Ringe

```css
/* Global Focus Style */
*:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}
```

**Alle interaktiven Elemente müssen sichtbare Fokus-Ringe haben:**
- Buttons: `focus-visible:ring-2 ring-accent ring-offset-2`
- Links: Gleiche Regel
- Custom-Komponenten: Explizit setzen

### 6.2 Touch-Targets

**Mindestgröße:** 44×44 px (WCAG 2.5.5)

```tsx
// Korrekt
<button className="min-h-[44px] min-w-[44px]">...</button>

// Falsch
<button className="h-8 w-8">...</button> // Nur 32px!
```

### 6.3 Kontraste

**WCAG AA:** Mindestens 4.5:1 für normalen Text, 3:1 für großen Text.

**Prüfen:**
- `--fg` auf `--surface-bg`: Sollte >7:1 sein
- `--fg-muted` auf `--surface-bg`: Mindestens 4.5:1
- `--accent` auf `white`: Mindestens 3:1

### 6.4 ARIA-Labels

```tsx
<Button aria-label="Nachricht senden">
  <Send className="h-5 w-5" />
</Button>

<nav aria-label="Hauptnavigation">
  ...
</nav>

<div role="status" aria-live="polite">
  {isLoading && "Lädt..."}
</div>
```

## 7. Performance

### 7.1 Lazy-Loading

```tsx
// Komponenten
const HeavyComponent = lazy(() => import('./HeavyComponent'));

// CSS (Prism, KaTeX)
const loadPrismCSS = () => import('prismjs/themes/prism-tomorrow.css');
```

### 7.2 Memoization

```tsx
const MemoizedComponent = React.memo(Component);

const expensiveValue = useMemo(() => {
  return computeExpensiveValue(a, b);
}, [a, b]);
```

### 7.3 Schatten-Optimierung

**Regel:** Maximal 2 Box-Shadows pro Element.

```css
/* Gut */
box-shadow: 0 2px 8px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.06);

/* Vermeiden */
box-shadow: 0 1px 2px ..., 0 2px 4px ..., 0 4px 8px ..., 0 8px 16px ...;
```

### 7.4 Backdrop-Blur-Sparsam

**Regel:** Nur für schwebende/modale Elemente nutzen.

```tsx
// Gut: Modal
<div className="backdrop-blur-intense">...</div>

// Vermeiden: Jede Card
<Card className="backdrop-blur-medium">...</Card>
```

## 8. Beispiel-Implementierungen

### 8.1 Tile-Grid (Start/Hub)

```tsx
function StartHub() {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      <TileCard
        icon={<Brain className="h-8 w-8 text-accent" />}
        title="Research"
        description="Tiefe Recherchen, Quellencheck"
        onClick={() => navigate('/chat?preset=research')}
      />
      <TileCard
        icon={<Pen className="h-8 w-8 text-accent" />}
        title="Schreiben"
        description="Klare Mails, Support-Texte"
        onClick={() => navigate('/chat?preset=writing')}
      />
      {/* ... weitere Tiles */}
    </div>
  );
}
```

### 8.2 Settings-Sektion

```tsx
function SettingsApi() {
  return (
    <div className="space-y-6 max-w-2xl mx-auto p-4">
      <SectionCard title="OpenAI API">
        <Label htmlFor="api-key">API-Key</Label>
        <Input
          id="api-key"
          type="password"
          placeholder="sk-..."
          className="min-h-[44px]"
        />

        <Label htmlFor="model">Modell</Label>
        <Select id="model">
          <option>gpt-4</option>
          <option>gpt-3.5-turbo</option>
        </Select>
      </SectionCard>
    </div>
  );
}
```

### 8.3 Chat mit Bubbles

```tsx
function ChatView() {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={cn(
            "flex gap-3",
            msg.role === "user" && "flex-row-reverse"
          )}>
            <Avatar className="h-9 w-9">
              {msg.role === "user" ? <User /> : <Bot />}
            </Avatar>

            <div className={cn(
              "max-w-[70%]",
              msg.role === "user" && "ml-auto"
            )}>
              <Card
                tone={msg.role === "user" ? "glass-primary" : "glass-subtle"}
                intent={msg.role === "user" ? "accent" : "default"}
                padding="md"
              >
                {msg.content}
              </Card>
              <div className="text-xs text-text-muted mt-1">
                {formatTime(msg.timestamp)}
              </div>
            </div>
          </div>
        ))}
      </div>

      <ChatComposer ... />
    </div>
  );
}
```

## 9. Qualitätskriterien

### 9.1 Visuelle Abnahme
- ✅ Radii konsistent (xs=6, sm=10, md=14, lg=18, xl=24)
- ✅ Schatten auf 2 Ebenen (surface, elevated)
- ✅ Spacing konsistent (12px, 16px, 24px)
- ✅ Glassmorphism mit Backdrop-Blur
- ✅ Kein horizontales Scrolling (360-414px)

### 9.2 Lighthouse
- ✅ Performance ≥90
- ✅ Best Practices ≥90
- ✅ Accessibility ≥90
- ✅ SEO ≥90 (optional für PWA)

### 9.3 A11y
- ✅ Tastatur-Navigation vollständig
- ✅ Screenreader-Labels korrekt
- ✅ Kontraste WCAG AA
- ✅ Touch-Targets ≥44px

### 9.4 Performance
- ✅ Build ohne Warnungen
- ✅ Keine ungenutzten Assets
- ✅ Bundle-Größe optimiert
- ✅ Lazy-Loading für große Komponenten
