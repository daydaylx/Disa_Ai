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
    <div
      className="mx-auto w-full max-w-4xl space-y-6 px-4 py-6"
      style={{ paddingBottom: "calc(var(--bottomnav-h, 56px) + 24px)" }}
    >
      {/* Hero Orb on Glass Card Podest */}
      <GlassCard className="flex flex-col items-center gap-3 py-8 text-center" hover>
        <HeroOrb state="idle" size="lg" />
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Quickstart</h1>
        <p className="max-w-[34ch] text-base text-text-secondary">
          20 Startfragen, die häufig helfen.
        </p>
      </GlassCard>

      <section className="grid gap-3 sm:grid-cols-2">
        {QUESTIONS.slice(0, 4).map((q, i) => (
          <GlassTile
            key={i}
            icon={
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-accent"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            }
            title={q.split(":")[0] + ":"}
            subtitle="Startfrage"
            onPress={() => onPick(q)}
            data-testid="quickstart-item"
            className="min-h-[120px] sm:min-h-[140px]"
          />
        ))}
      </section>

      {/* Additional questions as smaller tiles */}
      <section className="grid gap-2 sm:grid-cols-2">
        {QUESTIONS.slice(4).map((q, i) => (
          <GlassTile
            key={i + 4}
            icon={
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-accent"
              >
                <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.1 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" />
              </svg>
            }
            title={q.split(":")[0]}
            subtitle="Frage"
            onPress={() => onPick(q)}
            className="min-h-[84px] text-xs"
          />
        ))}
      </section>
    </div>
  );
}

export { QuickStartView };
