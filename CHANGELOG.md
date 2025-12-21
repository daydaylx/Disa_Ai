# disa-ai

## 1.1.0

### Minor Changes

- **Screenshot-Anhänge im Feedback-System** - Nutzer können jetzt bis zu 5 Screenshots an Feedback anhängen

  **Features:**
  - Clientseitige Bildkompression (max. 1280px, WebP/JPEG, 85% Qualität)
  - Automatisches EXIF-Stripping (entfernt GPS und Metadaten)
  - Magic Bytes Validierung (PNG, JPEG, WebP)
  - Preview-Thumbnails mit Dateiname und Größe
  - Mobile-First: Native File-Picker (Kamera/Galerie)
  - Multipart/form-data Backend mit Resend-Attachments

  **Limits:**
  - Max. 5 Bilder pro Feedback
  - Max. 5 MB pro Bild
  - Max. 15 MB gesamt

  **Neue Dateien:**
  - `src/lib/feedback/imageUtils.ts` - Validierung und Kompression
  - `src/__tests__/lib/imageUtils.test.ts` - Unit-Tests (15/15 passed)
  - `docs/guides/FEEDBACK_SCREENSHOTS.md` - Umfassende Dokumentation

  **Geänderte Dateien:**
  - `src/pages/FeedbackPage.tsx` - File-Upload UI
  - `functions/api/feedback.ts` - Multipart-Handling
  - `docs/guides/FEEDBACK_SETUP.md` - Screenshot-Abschnitt hinzugefügt

  **Technische Details:**
  - Canvas API für Resize und Re-Encoding
  - FormData statt JSON für Client → Server
  - Base64-Encoding für Resend API
  - Rückwärtskompatibel (Feedback ohne Anhänge funktioniert weiterhin)

  **Security:**
  - Doppelte Validierung: Client + Server
  - File-Type-Spoofing Prevention (Magic Bytes)
  - EXIF-Metadaten werden entfernt
  - Rate-Limiting bleibt bestehen (3 Min. Cooldown)

## 1.0.2

### Patch Changes

- fix(e2e): resolve flaky tests for history panel, brand logo visibility, and send button animation

- [#983](https://github.com/daydaylx/Disa_Ai/pull/983) [`5d65200`](https://github.com/daydaylx/Disa_Ai/commit/5d65200b3dbfb01c0703adcf80b90e09738c4b93) Thanks [@daydaylx](https://github.com/daydaylx)! - Redesign mobile menu drawer glassmorphism for clarity

## 1.0.1

### Patch Changes

- [`78698ac`](https://github.com/daydaylx/Disa_Ai/commit/78698ace927fb3d8b00ca89b0717ccb956787ed4) Thanks [@daydaylx](https://github.com/daydaylx)! - refactor: improve chat branding with subtle card borders, gradient tints, and clean notch
