# Konfigurationsstruktur - Notizen

**Stand:** 2025-10-31
**Status:** Phase 1.4 abgeschlossen

## Zentrale Konfigurationsdateien

### ✅ Erfolgreich zentralisiert

1. **`public/persona.json`** (262 Zeilen)
   - **30 Personas** vollständig definiert
   - **Format:** JSON-konform (Kommentare entfernt)
   - **Loader:** `src/config/roleStore.ts` + `src/lib/configLoader.ts`
   - **Cache:** localStorage (`disa:roles:v2`)

2. **`public/models.json`**
   - KI-Modell-Definitionen mit Pricing
   - Wird korrekt von OpenRouter-Integration geladen

## ⚠️ Bekannte technische Schuld

### Duplikation in `src/data/roles.ts` (240+ Zeilen hartcodiert)

**Problem:**

- Zeilen 16-243: Hartcodiertes `defaultRoles` Array mit ~15 Rollen
- Diese Rollen sind **Duplikate** der ersten Einträge aus `persona.json`
- Die Funktion `getRoles()` gibt nur die hartcodierten Rollen zurück, ignoriert die JSON

**Auswirkung:**

- Die vollständigen 30 Personas aus `persona.json` werden nur über `loadRoles()` geladen
- `getRoles()` gibt nur 15 hartcodierte Rollen zurück
- **Code-Duplikation:** ~240 Zeilen, die in `persona.json` bereits existieren

**Empfohlene Lösung (für spätere Phase):**

```typescript
// Vorher:
export const defaultRoles: Role[] = [
  /* 240+ Zeilen */
];

// Nachher:
export const defaultRoles: Role[] = [
  // Minimal-Fallback für offline/error-Szenarien
  {
    id: "neutral",
    name: "Neutral Standard",
    systemPrompt: "Du bist ein sachlicher, hilfreicher Assistent.",
    allowedModels: ["mistralai/mistral-nemo:free"],
    tags: ["standard"],
    category: "Alltag",
    styleHints: { typographyScale: 1, borderRadius: 0.5, accentColor: "hsl(200, 100%, 50%)" },
  },
];

// getRoles() sollte auf loadRoles() umgestellt werden mit Caching
```

**Dateien betroffen:**

- `src/data/roles.ts` - Entfernung der hartcodierten Duplikate
- Alle Importer von `getRoles()` prüfen, ob sie `loadRoles()` verwenden sollten

## Loader-Architektur

### Haupt-Loader

1. **`src/config/roleStore.ts`** (184 Zeilen)
   - Lädt aus: `/styles.json`, `/persona.json`, `/roles.json` (in dieser Reihenfolge)
   - Zod-Validierung
   - localStorage-Cache
   - State-Management: `idle | loading | ok | missing | error`

2. **`src/lib/configLoader.ts`** (120 Zeilen)
   - Lädt YAML/JSON: `/persona.yaml`, `/persona.yml`, `/styles.yaml`, `/styles.yml`, `/persona.json`, etc.
   - Fallback auf hartcodierte Minimal-Styles

### Empfehlung

- Beide Loader sind funktional, aber **konsolidieren** in `roleStore.ts` (Zod-Validierung ist robuster)
- `configLoader.ts` kann als Fallback für YAML-Support behalten werden

## Modell-Konfiguration

**Status:** ✅ Zentral
**Datei:** `public/models.json`
**Loader:** OpenRouter-Integration (zu verifizieren in Phase 3.1)

## Nächste Schritte (spätere Phasen)

- [ ] Phase 3.3: Duplikate aus `data/roles.ts` entfernen
- [ ] Phase 3.3: `getRoles()` auf `loadRoles()` mit Caching umstellen
- [ ] Phase 3.1: Modell-Loader zentralisieren und dokumentieren
- [ ] Loader-Architektur vereinfachen (1 Loader statt 2)

## Validierung

```bash
# Persona.json validieren
jq '.styles | length' public/persona.json  # Output: 30

# Models.json validieren
jq 'length' public/models.json  # Output: Anzahl der Modelle
```
