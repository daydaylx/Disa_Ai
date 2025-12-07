# Disa AI – Konfiguration

Diese Dokumentation beschreibt alle Konfigurationsmöglichkeiten der Anwendung.

---

## Umgebungsvariablen

### Client-seitige Variablen (VITE_*)

Diese Variablen sind im Browser verfügbar (`import.meta.env`).

| Variable | Pflicht | Default | Beschreibung |
|----------|---------|---------|--------------|
| `VITE_OPENROUTER_BASE_URL` | Nein | `https://openrouter.ai/api/v1` | Basis-URL für OpenRouter-API |
| `VITE_ENABLE_DEBUG` | Nein | `false` | Aktiviert Debug-Logs |
| `VITE_ENABLE_ANALYTICS` | Nein | `false` | Aktiviert Analytics |
| `VITE_ENABLE_PWA` | Nein | `true` | PWA-Features an/aus |
| `VITE_SENTRY_DSN` | Nein | – | Sentry Error-Tracking |
| `VITE_ENV` | Nein | `production` | Environment-Label |

### Automatisch generierte Variablen

Diese werden während `npm run build` durch `scripts/build-info.js` gesetzt:

| Variable | Beschreibung |
|----------|--------------|
| `VITE_BUILD_ID` | Build-Kennung (z.B. `v1.0.0-f57289a`) |
| `VITE_BUILD_TIME` | ISO-Zeitstempel des Builds |
| `VITE_BUILD_TIMESTAMP` | Unix-Timestamp (Cache-Busting) |
| `VITE_GIT_SHA` | Git-Commit-Hash |
| `VITE_GIT_BRANCH` | Git-Branch |
| `VITE_VERSION` | Semantische Version aus package.json |

### Server-seitige Variablen (Cloudflare)

Für Cloudflare Pages Functions (z.B. Feedback-Funktion):

| Variable | Pflicht | Beschreibung |
|----------|---------|--------------|
| `RESEND_API_KEY` | Ja | API-Key von Resend.com |
| `DISA_FEEDBACK_TO` | Nein | Empfänger für Feedback-Mails |
| `OPENROUTER_API_KEY` | Ja (falls Proxy) | Server-seitiger OpenRouter-Key |

### Konfiguration in Dateien

**Lokale Entwicklung:**
```bash
# .env.local (nicht committen!)
VITE_ENABLE_DEBUG=true
```

**Produktion:**
- Variablen in Cloudflare Pages Dashboard setzen
- Oder in `.env.production` (nur nicht-sensitive Werte)

**Vollständige Referenz:** [`docs/guides/ENVIRONMENT_VARIABLES.md`](guides/ENVIRONMENT_VARIABLES.md)

---

## Statische Konfiguration

### `src/config/defaults.ts`

Zentrale Konstanten, um "Magic Strings" zu vermeiden:

```typescript
// Storage-Keys
export const STORAGE_KEYS = {
  API_KEY: 'disa_api_key',
  SETTINGS: 'disa_settings_v1',
  THEME: 'disa:theme-preference',
  FAVORITES: 'disa:favorites-data',
  // ...
};

// Request-Konfiguration
export const REQUEST_CONFIG = {
  TIMEOUT: 30000,
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
};

// App-Konfiguration
export const APP_CONFIG = {
  PREFIX: 'disa',
  VERSION: 1,
};
```

### `src/config/env.ts`

Validiert Umgebungsvariablen mit Zod:

```typescript
const envSchema = z.object({
  VITE_OPENROUTER_BASE_URL: z.string().url().default('https://openrouter.ai/api/v1'),
  VITE_ENABLE_DEBUG: z.string().transform(v => v === 'true').default('false'),
  // ...
});

export const env = envSchema.parse(import.meta.env);
```

---

## Feature-Flags

### `src/config/flags.ts`

Runtime-Flags, die ohne neuen Build geändert werden können:

```typescript
// Lesen
const virtualListEnabled = getVirtualListEnabled();

// Setzen (speichert in localStorage)
setVirtualListEnabled(true);
```

**Verfügbare Flags:**

| Flag | Beschreibung | Default |
|------|--------------|---------|
| `preferRolePolicy` | Rolle schränkt Modellauswahl ein | `false` |
| `virtualListEnabled` | Virtualisierung der Modell-Liste | `true` |

### Umgebungsvariablen-basierte Flags

Flags können auch per `VITE_FF_*` Variablen gesetzt werden:

```bash
VITE_FF_EXPERIMENTAL_FEATURE=true
```

---

## Modell-Konfiguration

### `src/config/models.ts`

Lädt den Modell-Katalog hybrid:

1. **OpenRouter API**: Live-Liste aller Modelle
2. **Metadaten-Datei**: `public/models_metadata.json` mit kuratierten Infos

```typescript
const catalog = await loadModelCatalog();
// catalog.models: Array<Model>
// catalog.providers: Set<string>
```

### `public/models_metadata.json`

Optionale Metadaten für bessere UX:

```json
{
  "openai/gpt-4o-mini": {
    "displayName": "GPT-4o Mini",
    "description": "Schnelles, günstiges Modell von OpenAI",
    "qualityScore": 85,
    "tags": ["fast", "cheap"]
  }
}
```

### Modell-Filterung

Nur kostenlose Modelle werden angezeigt:
- Modell-ID endet auf `:free`
- ODER `pricing.prompt === 0`

---

## Persona-Konfiguration

### `public/persona.json`

Definiert die verfügbaren Rollen/Personas:

```json
[
  {
    "id": "research-assistant",
    "name": "Recherche-Assistent",
    "system": "Du bist ein sachlicher Recherche-Assistent...",
    "tags": ["research", "factual"],
    "allow": ["openai/gpt-4o", "anthropic/claude-3-*"]
  },
  {
    "id": "creative-coach",
    "name": "Kreativ-Coach",
    "system": "Du bist ein inspirierender Kreativ-Coach..."
  }
]
```

**Felder:**

| Feld | Pflicht | Beschreibung |
|------|---------|--------------|
| `id` | Ja | Eindeutige ID |
| `name` | Ja | Anzeigename |
| `system` | Ja | System-Prompt für die KI |
| `tags` | Nein | Kategorisierung |
| `allow` | Nein | Erlaubte Modell-IDs (Glob-Pattern) |

### Laden in der App

```typescript
// src/config/roleStore.ts
const roles = await loadRoles();
```

Die Datei wird mit `cache: "no-store"` geladen, um Caching-Probleme zu vermeiden.

---

## Settings-Schema

### `src/config/settings.ts`

Definiert das Schema für User-Settings:

```typescript
export const settingsSchema = z.object({
  preferredModelId: z.string().optional(),
  temperature: z.number().min(0).max(2).default(0.7),
  maxTokens: z.number().optional(),
  theme: z.enum(['dark', 'light', 'system']).default('dark'),
  fontSize: z.enum(['small', 'medium', 'large']).default('medium'),
  youthFilterEnabled: z.boolean().default(false),
  memoryEnabled: z.boolean().default(true),
  contextLength: z.number().min(1).max(50).default(10),
});

export type Settings = z.infer<typeof settingsSchema>;
```

### Default-Werte

```typescript
export const DEFAULT_SETTINGS: Settings = {
  theme: 'dark',
  fontSize: 'medium',
  temperature: 0.7,
  youthFilterEnabled: false,
  memoryEnabled: true,
  contextLength: 10,
};
```

### Persistenz

Settings werden in `localStorage` unter `disa_settings_v1` gespeichert.

---

## PWA-Konfiguration

### `vite.config.ts` (PWA-Plugin)

```typescript
VitePWA({
  registerType: 'prompt',
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/openrouter\.ai\/api/,
        handler: 'NetworkOnly',
      },
    ],
  },
  manifest: {
    name: 'Disa AI',
    short_name: 'Disa',
    // ...
  },
})
```

### `public/manifest.webmanifest`

```json
{
  "name": "Disa AI",
  "short_name": "Disa",
  "start_url": "/chat",
  "display": "standalone",
  "theme_color": "#131314",
  "background_color": "#131314",
  "icons": [
    { "src": "/app-icons/icon-192.png", "sizes": "192x192" },
    { "src": "/app-icons/icon-512.png", "sizes": "512x512" }
  ]
}
```

---

## Deployment-Konfiguration

### Cloudflare Pages

`deploy/cloudflare/cloudflare-pages.json`:

```json
{
  "build_command": "npm run build",
  "build_output_directory": "dist",
  "root_directory": ""
}
```

### HTTP-Headers

`public/_headers`:

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Content-Security-Policy: default-src 'self'; ...
```

---

## Jugendschutz-Konfiguration

### In Settings

```typescript
settings.youthFilterEnabled: boolean
```

### Auswirkungen

Wenn aktiviert:
- **Modelle**: Nur Modelle mit Content-Filtern werden angezeigt
- **Rollen**: Unzensierte Personas werden ausgeblendet
- **Inhalte**: Einige Quickstart-Themen werden gefiltert

### In `persona.json`

Rollen können mit Tags markiert werden:

```json
{
  "id": "uncensored",
  "tags": ["adult", "uncensored"],
  "system": "..."
}
```

Bei aktiviertem Filter werden Rollen mit `adult` oder `uncensored` Tag ausgeblendet.

---

## Weiterführende Dokumentation

- [Umgebungsvariablen (vollständige Liste)](guides/ENVIRONMENT_VARIABLES.md)
- [Architektur](ARCHITECTURE.md)
- [Feedback-Setup](guides/FEEDBACK_SETUP.md)
