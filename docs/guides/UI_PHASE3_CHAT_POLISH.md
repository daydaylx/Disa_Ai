# UI Phase 3 - Chat Polish

## Status

Accepted (Phase 3 umgesetzt)

## Ziel

- Chat als Signature-Screen mit ruhiger, klarer Hierarchie statt Effekt-Overload.
- Wichtige Zustände (Modell, Rolle, Memory) sofort sichtbar.
- Composer und Message-Bubbles mobile-first lesbar und gut bedienbar.

## Deliverables

### Chat Header + Kontext-Chips

- `src/components/layout/ChatLayout.tsx`
  - Header visuell beruhigt (weniger Gradient/Glow, klare Surface-Basis)
- `src/pages/Chat.tsx`
  - Neue Status-Chips oberhalb des Message-Streams:
    - `Modell`
    - `Rolle`
    - `Memory`
  - Chips führen direkt zu den relevanten Einstellungsseiten

### Empty State vereinfacht

- `src/pages/Chat.tsx`
  - Hero reduziert auf klare Surface-Card mit Brandmark + kurzer Guidance
  - Starter-Prompts als ruhige Action-Rows mit Accent-Bar statt Glow-Karten

### Message-Bubbles & Lesbarkeit

- `src/components/chat/ChatMessage.tsx`
  - Bubbles ohne starke Gradients/Blur, mit klaren Surface-Kontrasten
  - Maximale Zeilenbreite über `max-w` begrenzt für bessere Lesbarkeit
  - Follow-up Aktionen visuell zurückgenommen, Fokus auf Inhalt

### Composer-Polish

- `src/components/chat/UnifiedInputBar.tsx`
  - Primär-CTA (Send) auf 44px Touch-Target angehoben
  - Disabled/Sending/Ready states klarer und konsistenter
  - Composer-Container auf ruhigere Surface-Variante umgestellt

## Testanpassung

- `src/components/chat/__tests__/ChatMessage.test.tsx`
  - Style-Assertions auf neue Bubble-Klassen aktualisiert
