# UX/A11y Feststellungen (Phase A – keine Änderungen)

- Navigation: Hash‑Routing, klare Labels („Chat“, „Einstellungen“, „Loslegen“). Fokusverhalten unkritisch.
- Composer: Tastaturbedienung (Enter/Shift+Enter) korrekt.
- Kopieren: `components/CodeBlock` hat Fallback, Inline‑CodeBlock in `ChatView` nicht → vereinheitlichen.
- FAB: Safe‑Area berücksichtigt, 44px‑Targets (h-11/w-11) ok.
- Kontraste: dunkles Theme, ausreichende Kontraste in Kernflächen.
- A11y: Hauptbereiche mit `role=main`, Buttons mit `aria-label`. Skip‑Link aktiviert.
- PWA: SW cached App‑Shell, keine API‑Antworten (gut – Datenschutz/Frische).
