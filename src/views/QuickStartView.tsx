import React from "react";

const QUESTIONS: string[] = [
  "Erkläre mir diesen Code und mögliche Randfälle:",
  "Fasse den folgenden Text in 5–7 Punkten zusammen:",
  "Schreibe eine professionelle E‑Mail zu folgendem Anliegen:",
  "Gib mir 10 Ideen für Social‑Posts zu diesem Thema:",
  "Erstelle eine Schritt‑für‑Schritt‑Anleitung für:",
  "Übersetze den Text idiomatisch ins Deutsche und erhalte Formatierung:",
  "Verbessere diesen Text auf Klarheit und Kürze:",
  "Schlage mir eine Datenstruktur/API vor für:",
  "Finde Performance‑Engpässe in diesem Code:",
  "Schreibe Tests (Unit) für diese Funktionen:",
  "Entwirf eine kurze Feature‑Spezifikation (Given/When/Then) für:",
  "Gib mir 3 Alternativen und ihre Vor-/Nachteile zu:",
  "Erstelle ein Brainstorming mit 12 Vorschlägen zu:",
  "Erkläre ein Konzept für Anfänger – mit Beispielen:",
  "Formuliere eine höfliche Antwort auf:",
  "Analysiere Risiken und edge cases bei:",
  "Erzeuge eine Tabelle (Markdown) mit den wichtigsten Punkten zu:",
  "Formuliere eine Job‑Beschreibung (kurz) für:",
  "Gib mir eine Checkliste für den Start mit:",
  "Schreibe eine klare Fehlermeldung und Lösungsvorschläge zu:" ,
];

export default function QuickStartView() {
  const onPick = (q: string) => {
    try {
      localStorage.setItem("disa:prefill", q + "\n\n");
    } catch (_e) {
      /* ignore */
    }
    location.hash = "#/chat";
  };

  return (
    <main className="mx-auto w-full max-w-4xl space-y-6 px-4 py-6 pb-28">
      <header className="space-y-1">
        <h1 className="text-xl font-semibold title-underline">Quickstart</h1>
        <p className="text-sm opacity-80">20 Startfragen, die häufig helfen.</p>
      </header>

      <section className="grid gap-3">
        {QUESTIONS.map((q, i) => (
          <button
            key={i}
            className="nav-pill text-left"
            onClick={() => onPick(q)}
            aria-label={`Quickstart Frage ${i + 1}`}
          >
            {q}
          </button>
        ))}
      </section>
    </main>
  );
}

export { QuickStartView };
