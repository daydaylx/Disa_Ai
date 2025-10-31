# Roadmap Tracking – Phase 3.2 (Fehlerhandling & Ladezustände)

_Aktualisiert: 31. Oktober 2025_

## Scope laut Roadmap

- **Roadmap 3.2:** „Fehlerbehandlung und Ladezustände vervollständigen: Ergänze in der zentralen Chat-Logik (`useChat`-Hook) spezifische `catch`-Blöcke, um API-Fehler an die UI zu melden (z.B. über einen Toast-Service). Stelle sicher, dass alle datenladenden Komponenten klare Lade-Indikatoren (Spinner, Skeleton) anzeigen.“ – Quelle: [Roadmap.md](../Roadmap.md)

## Fortschritt

- **Chat-Status & Retry (Desktop/Mobile):** `ChatStatusBanner` (`src/components/chat/ChatStatusBanner.tsx`) sorgt nun für dauerhaft sichtbare Fehlerhinweise inklusive Retry-CTA. Eingebunden in `ChatView` (`src/components/chat/ChatView.tsx`) und `MobileChatInterface` (`src/components/chat/MobileChatInterface.tsx`).
- **Fehlertypen vereinheitlicht:** `humanError()` liefert Severity-Information (`src/lib/errors/humanError.ts`) und wird in `Chat.tsx`/`MobileChatInterface.tsx` genutzt, um Toasts und Banner konsistent zu beschicken.
- **Abort-Feedback aktiviert:** `useChat` speichert `AbortError` im State (`src/hooks/useChat.ts`), sodass UI-Komponenten das Stoppen einer Antwort visuell kommunizieren können.
- **Quickstart-Ladevorgang abgesichert (neu):**
  - `loadQuickstarts()` wirft jetzt valide Fehler statt stiller Fallbacks (`src/config/quickstarts.ts`); `getQuickstartsWithFallback` meldet Fallback-Gründe via Callback.
  - `ChatList` zeigt bei Quickstart-Problemen ein Inline-Banner mit Retry (`src/components/chat/ChatList.tsx`), fällt auf Rollen-Vorschläge zurück und bietet direkten Chat-Start an.
  - `QuickstartGrid` nutzt `useQuickstartManager`, integriert denselben Banner und bietet eine Reload-Aktion (Fallback auf Rollen bei Fehlern, `src/components/chat/QuickstartGrid.tsx`).
  - `useQuickstartManager` verwaltet `Error | null` statt bloßer Strings (`src/hooks/useQuickstartManager.ts`), womit künftige Oberflächen dieselbe Fehlerlogik nutzen können.
- **Tests erweitert:** `src/config/quickstarts.test.ts` prüft neue Fehlerpfade (Throw + Fallback-Callback). Bestehende Tests (`src/__tests__/humanError.test.ts`, `src/__tests__/designTokens.test.ts`) bleiben grün.

## Offene Punkte / Risiken

- **UI-Tests für Banner & Retry:** Komponenten-/E2E-Tests, die den neuen Banner-Flow (Desktop + Mobile) abdecken, sind noch offen. Empfehlung: Playwright-Szenario hinzufügen.
- **Dokumentation für Agenten:** Sobald `docs/AI_DEVELOPMENT_GUIDE.md` existiert, sollte der Fehler-/Retry-Flow dort beschrieben werden (Trigger, Komponenten, Tests).
- **Quickstart-Fallback UX:** Der Rollen-Fallback ist bewusst knapp gehalten. Optional könnte ein Hinweis ergänzt werden, wenn externe Konfiguration dauerhaft fehlt (Monitoring?).

> Status dokumentiert, damit Phase 3.2 nachverfolgbar bleibt. Weitere Iterationen bitte in diesem Dokument ergänzen.
