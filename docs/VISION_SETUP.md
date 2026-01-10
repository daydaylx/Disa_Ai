# Vision-Feature Setup Guide

Das Vision-Feature ermöglicht das Anhängen und Analysieren von Bildern im Chat mit Hilfe von Z.AI's Vision-Modell (glm-4.6v).

## Übersicht

- **Modell**: Z.AI GLM-4.6V (Vision-Enabled, fest konfiguriert)
- **Unterstützte Formate**: JPEG, PNG, WebP
- **Maximale Dateigröße**: 4 MB (vor Kompression)
- **Verarbeitung**: Automatische Resize auf max. 1280px Kantenlänge, JPEG Kompression (~0.8 Qualität)
- **Modell-Auswahl**: glm-4.6v ist als Standard-Modell für alle Bildanalysen fest konfiguriert

## Lokale Entwicklung

### 1. API Key hinzufügen

Erstelle oder bearbeite die Datei `.dev.vars` im Projektstammverzeichnis:

```bash
# .dev.vars
ZAI_API_KEY=your-zai-api-key-here
```

**WICHTIG**: Die Datei `.dev.vars` ist in `.gitignore` enthalten und wird niemals committet.

### 2. API Key erhalten

1. Gehe zu [Z.AI](https://z.ai/)
2. Registriere dich oder logge dich ein
3. Navigiere zu den API-Einstellungen
4. Erstelle einen neuen API Key
5. Kopiere den Key und füge ihn in `.dev.vars` ein

### 3. Lokale Entwicklung testen

Starte den Entwicklungsserver:

```bash
npm run dev
```

Die Cloudflare Pages Functions (inklusive `/api/vision`) werden automatisch gestartet und nutzen die Umgebungsvariablen aus `.dev.vars`.

## Production Deployment (Cloudflare Pages)

### 1. Secret in Cloudflare Dashboard setzen

1. Öffne das [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigiere zu **Workers & Pages** → **Disa AI**
3. Wähle die **Settings** Tab
4. Scrolle zu **Environment variables**
5. Klicke auf **Add variable**
6. Füge folgende Variable hinzu:
   - **Name**: `ZAI_API_KEY`
   - **Value**: Dein Z.AI API Key
   - **Environment**: Production (oder Production + Preview für beide)
7. Klicke **Encrypt** und speichere

### 2. Deployen

```bash
npm run deploy:production
```

oder nutze das automatische CI/CD Deploy über GitHub Actions.

### 3. Überprüfung

Nach dem Deploy kannst du testen, ob das Secret korrekt gesetzt ist:

1. Öffne die Anwendung: `https://disaai.de`
2. Klicke auf das Bild-Icon in der Chat-Input-Bar
3. Wähle ein Bild (JPEG, PNG, oder WebP, max. 4MB)
4. Gib einen Prompt ein und sende

Wenn alles korrekt konfiguriert ist, erhältst du eine Antwort vom Vision-Modell.

## Troubleshooting

### Error: "Server configuration error: API key not configured"

**Ursache**: `ZAI_API_KEY` ist nicht gesetzt oder leer.

**Lösung**:
- **Lokal**: Stelle sicher, dass `.dev.vars` existiert und einen gültigen Key enthält
- **Production**: Überprüfe die Environment Variables im Cloudflare Dashboard

### Error: "Dateityp 'xxx' wird nicht unterstützt"

**Ursache**: Das Bildformat wird nicht unterstützt.

**Lösung**: Nutze nur JPEG, PNG oder WebP Bilder.

### Error: "Datei zu groß (X MB). Maximum: 4 MB"

**Ursache**: Das Bild überschreitet die 4MB Grenze.

**Lösung**: Komprimiere das Bild vor dem Upload oder nutze ein kleineres Bild.

### Error: "Request to Z.AI API timed out"

**Ursache**: Die Anfrage an Z.AI hat länger als 30 Sekunden gedauert.

**Lösung**:
- Überprüfe deine Internetverbindung
- Versuche es erneut mit einem kleineren Bild
- Prüfe den Status von [Z.AI Status Page](https://status.z.ai)

### Error: "Vision API Error: 500 Internal Server Error"

**Ursache**: Serverseitiger Fehler bei Z.AI oder in unserer Cloudflare Function.

**Lösung**:
- Warte einige Minuten und versuche es erneut
- Prüfe die Cloudflare Logs für detaillierte Fehlermeldungen
- Wenn das Problem persists, kontaktiere das Development Team

## Sicherheit

### API Key Schutz

- **NIEMALS** API Keys im Client-Code speichern (React, TypeScript, etc.)
- **IMMER** Secrets nur serverseitig nutzen (Cloudflare Pages Functions)
- `.dev.vars` niemals commiten (ist bereits in `.gitignore`)
- Production Secrets nur über Cloudflare Dashboard verwalten

### Data URL Logging

Die Server-Logs enthalten **keine** vollständigen Image Data URLs, um Speicherplatz zu sparen und Sicherheitsrisiken zu minimieren. Es werden nur Metadaten wie MIME-Type und geschätzte Größe geloggt.

## Limits und Constraints

### Client-Seite
- **Max Dateigröße**: 4 MB (vor Kompression)
- **Max Dimension**: 1280px (nach Resize)
- **Unterstützte Formate**: JPEG, PNG, WebP
- **Timeout**: 45 Sekunden

### Server-Seite
- **Max Data URL Größe**: 10 MB (nach Kompression)
- **Timeout**: 30 Sekunden (Z.AI API)
- **Modell**: `glm-4.6v` (fest konfiguriert)

## Testing

### Unit Tests

```bash
npm run test:unit
```

Testet:
- Bildverarbeitung (Resize, Kompression)
- Validierung (MIME-Type, Größe)
- API Client Request Builder

### Integration Tests

```bash
npm run verify
```

Führt alle Tests, Linting und Type-Checking durch.

## API Contract

### Request

```typescript
POST /api/vision
Content-Type: application/json

{
  "prompt": "string",      // Der Text-Prompt
  "imageDataUrl": "string", // Base64 Data URL (data:image/...;base64,...)
  "mimeType": "string",     // "image/jpeg", "image/png", oder "image/webp"
  "filename": "string"      // Optional: Originaler Dateiname
}
```

### Success Response (200)

```typescript
{
  "text": "string",  // Die Antwort des Vision-Modells
  "usage": {
    "prompt_tokens": number,
    "completion_tokens": number,
    "total_tokens": number
  },
  "model": "string"  // "glm-4.6v"
}
```

### Error Response (4xx, 5xx)

```typescript
{
  "error": {
    "code": "string",
    "message": "string"
  }
}
```

### Error Codes

- `METHOD_NOT_ALLOWED` - Falsche HTTP-Methode (nur POST erlaubt)
- `INVALID_JSON` - Ungültiges JSON im Request Body
- `MISSING_PROMPT` - Prompt fehlt
- `MISSING_IMAGE` - Image Data URL fehlt
- `MISSING_MIME_TYPE` - MIME Type fehlt
- `UNSUPPORTED_MIME_TYPE` - MIME Type nicht unterstützt
- `INVALID_DATA_URL` - Data URL Format ungültig
- `PAYLOAD_TOO_LARGE` - Data URL zu groß (>10MB)
- `MISSING_API_KEY` - ZAI_API_KEY nicht konfiguriert
- `INTERNAL_ERROR` - Interner Serverfehler
- `GATEWAY_TIMEOUT` - Timeout bei Z.AI API

## Weiterführende Ressourcen

- [Z.AI Dokumentation](https://docs.z.ai)
- [Cloudflare Pages Functions Guide](https://developers.cloudflare.com/pages/functions/)
- [OpenAI Vision API Format](https://platform.openai.com/docs/guides/vision)