# UI Phase 4 - Legal Read Mode

## Status

Accepted (Phase 4 vollständig umgesetzt)

## Ziel

- Rechtstexte als ruhiger Lesemodus statt kompakter App-Card.
- Bessere Orientierung über klare Inhaltsverzeichnisse mit Sprungmarken.
- Konsistente `loading / error / empty / data`-States auf Content-Seiten.

## Umsetzung

### Impressum

- `src/pages/ImpressumPage.tsx`
  - Lesemodus-Layout mit größerer max-width und verbessertem Zeilenabstand
  - Klarere Dokument-Hierarchie (Header, Inhalt, Abschnitte)
  - Inhaltsverzeichnis als semantische Navigation (`nav`) mit Jump-Links

### Datenschutz

- `src/pages/DatenschutzPage.tsx`
  - Lesemodus-Layout mit angepasster Typo-Hierarchie und Zeilenhöhe
  - Inhaltsverzeichnis als semantische Navigation (`nav`) mit Jump-Links
  - Abschnitts-Headings auf konsistente H2-Skala angehoben

### Chat-Verlauf States

- `src/pages/ChatHistoryPage.tsx`
  - Expliziter Error-State als `EmptyState` mit Retry-CTA ergänzt
  - Rendering-Pfade für `loading / error / empty / data` klar getrennt

### Themen States

- `src/pages/ThemenPage.tsx`
  - Asynchrones Laden via `getQuickstartsWithFallback`
  - Rendering-Pfade für `loading / error / empty / data` ergänzt
  - Retry-CTA im Error-State und Warning-Banner bei Fallback auf Defaults
  - A11y-Feinschliff: semantische Button-Interaktion + `aria-expanded`/`aria-controls` für Details

### Settings-Overview States

- `src/features/settings/TabbedSettingsView.tsx`
  - Initiales Laden der Bereiche über `loadSettingsSections`
  - Rendering-Pfade für `loading / error / empty / data` ergänzt
  - Retry-CTA im Error-State ergänzt

### Feedback States

- `src/pages/FeedbackPage.tsx`
  - Sichtbare Statusdarstellung während `isSending` und `isCompressing`
  - Expliziter Error-State als `InfoBanner` ergänzt (zusätzlich zu Toasts)
  - Expliziter Empty-State für fehlende Anhänge ergänzt
  - A11y-Feinschliff: verknüpfte Labels (`htmlFor`), Live-Region, `aria-busy`

### Tests

- `src/__tests__/pages/ChatHistoryPage.test.tsx`
  - Absicherung von `empty / error / data`
- `src/__tests__/pages/ThemenPage.test.tsx`
  - Absicherung von `data / empty / error` und Fallback-Hinweis
- `src/__tests__/pages/FeedbackPage.test.tsx`
  - Absicherung von `empty / loading / error`
