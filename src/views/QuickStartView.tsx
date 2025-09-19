import { GlassCard } from "../components/ui/GlassCard";
import { GlassTile } from "../components/ui/GlassTile";
import { HeroOrb } from "../components/ui/HeroOrb";

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
  "Schreibe eine klare Fehlermeldung und Lösungsvorschläge zu:",
];

export default function QuickStartView() {
  const onPick = (q: string) => {
    try {
      localStorage.setItem("disa:prefill", q + "\n\n");
    } catch {
      /* ignore */
    }
    location.hash = "#/chat";
  };

  return (
    <main
      className="mx-auto w-full max-w-4xl space-y-6 px-4 py-6"
      style={{ paddingBottom: "calc(var(--bottomnav-h, 56px) + 24px)" }}
    >
      {/* Hero Orb on Glass Card */}
      <GlassCard className="flex flex-col items-center py-8" hover>
        <HeroOrb state="idle" size="lg" />
        <h1 className="mt-4 text-2xl font-semibold">Quickstart</h1>
        <p className="mt-2 text-sm text-text-secondary">20 Startfragen, die häufig helfen.</p>
      </GlassCard>

      <section className="grid grid-cols-2 gap-3">
        {QUESTIONS.slice(0, 6).map((q, i) => (
          <GlassTile
            key={i}
            icon="✦"
            title={q.split(":")[0] + ":"}
            subtitle="Startfrage"
            onPress={() => onPick(q)}
            data-testid="quickstart-item"
            className="min-h-[100px]"
          />
        ))}
      </section>

      {/* Additional questions as smaller tiles */}
      <section className="grid grid-cols-2 gap-2">
        {QUESTIONS.slice(6).map((q, i) => (
          <GlassTile
            key={i + 6}
            title={q.split(":")[0]}
            subtitle="Frage"
            onPress={() => onPick(q)}
            className="min-h-[80px] text-xs"
          />
        ))}
      </section>
    </main>
  );
}

export { QuickStartView };
