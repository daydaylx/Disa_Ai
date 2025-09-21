import { GlassCard } from "../components/glass/GlassCard";
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
      <GlassCard variant="floating" tint="warm" className="p-8 text-center" enhanced>
        <div className="mb-6 flex items-center justify-center gap-3">
          <div className="bg-warm-500/20 rounded-xl p-4">
            <HeroOrb state="idle" size="lg" />
          </div>
          <div className="text-left">
            <h1 className="text-3xl from-warm-400 to-purple-400 bg-gradient-to-r bg-clip-text font-bold text-transparent">
              Quickstart
            </h1>
            <p className="text-neutral-300 text-lg">20 Startfragen, die häufig helfen</p>
          </div>
        </div>
      </GlassCard>

      <section className="grid gap-4 sm:grid-cols-2">
        {QUESTIONS.slice(0, 4).map((q, i) => (
          <GlassCard
            key={i}
            variant="medium"
            className="min-h-[140px] cursor-pointer p-6 transition-all duration-200 hover:scale-[1.02]"
            onClick={() => onPick(q)}
            interactive
            enhanced
            data-testid="quickstart-item"
          >
            <div className="flex items-start gap-4">
              <div className="bg-accent-500/20 rounded-xl flex-shrink-0 p-3">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-accent-400"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-white mb-2 text-base font-semibold leading-tight">
                  {q.split(":")[0]}:
                </h3>
                <div className="glass-badge glass-badge--accent">Startfrage</div>
              </div>
            </div>
          </GlassCard>
        ))}
      </section>

      {/* Additional questions as smaller tiles */}
      <section className="lg:grid-cols-3 grid gap-3 sm:grid-cols-2">
        {QUESTIONS.slice(4).map((q, i) => (
          <GlassCard
            key={i + 4}
            variant="soft"
            className="min-h-[100px] cursor-pointer p-4 transition-all duration-200 hover:scale-[1.02]"
            onClick={() => onPick(q)}
            interactive
          >
            <div className="flex items-start gap-3">
              <div className="bg-purple-500/20 flex-shrink-0 rounded-lg p-2">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-purple-400"
                >
                  <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.1 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-white text-sm font-medium leading-tight">{q.split(":")[0]}</h4>
                <div className="glass-badge mt-2 text-xs">Frage</div>
              </div>
            </div>
          </GlassCard>
        ))}
      </section>
    </div>
  );
}

export { QuickStartView };
