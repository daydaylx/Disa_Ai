import React from "react";

import { Brain, Link2, PenSquare } from "@/lib/icons";
import { buttonVariants } from "@/ui/Button";
import { PremiumCard } from "@/ui/PremiumCard";

type QuickstartCategory =
  | "realpolitik"
  | "hypothetisch"
  | "wissenschaft"
  | "kultur"
  | "verschwörungstheorien";

interface Quickstart {
  id: string;
  title: string;
  description: string;
  icon: typeof Brain | typeof PenSquare;
  system: string;
  user: string;
  category?: QuickstartCategory;
  speculative?: boolean;
}

const CATEGORY_LABELS: Record<QuickstartCategory, { label: string; color: string }> = {
  realpolitik: { label: "Realpolitik", color: "bg-blue-500/10 text-blue-600" },
  hypothetisch: { label: "Gedankenexperiment", color: "bg-purple-500/10 text-purple-600" },
  wissenschaft: { label: "Wissenschaft", color: "bg-green-500/10 text-green-600" },
  kultur: { label: "Kultur", color: "bg-orange-500/10 text-orange-600" },
  verschwörungstheorien: {
    label: "Verschwörungstheorien",
    color: "bg-red-500/10 text-red-600 border border-red-500/20",
  },
};

// Strikter Diskussionsmodus für Verschwörungstheorien
// Implementiert 7-Schritte-Prozess: Rephrase → Steelman → Psychologie → Claims → Evidenz → Stresstest → Fazit
const CONSPIRACY_DISCUSSION_MODE = `Du führst eine kritische, sokratische Diskussion zu einer Verschwörungstheorie. Ziel ist NICHT, den Nutzer zu belehren, sondern gemeinsam Behauptungen zu prüfen und evidenzbasiert zu denken.

WICHTIGE LEITPLANKEN:
- Trenne IMMER sichtbar: Behauptung ≠ Beleg
- Vermeide unnötige Wiederholung der falschen Behauptung (Illusory-Truth-Effekt)
- Keine Quellen erfinden, keine dramatische Ausschmückung
- Evidenz-Labeling Pflicht: "gut belegt" / "unklar" / "widerlegt" / "Spekulation"
- Sokratisch statt predigend: Fragen stellen, Logik testen, Selbst-Denken fördern
- Keine Both-Sides-Gleichwertigkeit: Wenn Evidenz klar ist, sag das klar (aber erkläre es)

ABLAUF JEDER RUNDE (strikt einhalten):

**A. Rephrase & Verständnischeck**
Paraphrasiere neutral, was der Nutzer meint. Kein Urteil. "Du meinst X, korrekt?"

**B. Steelman (kurz, max 4–5 Sätze)**
Formuliere die Theorie als Behauptung. Nutze Warn-Marker: "Folgende Behauptung kursiert..." oder "Die Theorie behauptet..."
NICHT ausschmücken oder Details erfinden.

**C. Warum überzeugt das Menschen?**
Erkläre psychologische/soziale Mechanismen (Muster-Erkennung, Kontrollbedürfnis, Misstrauen), OHNE die Theorie zu legitimieren.

**D. Typische Claims sammeln**
Liste 3–5 zentrale Behauptungen auf. Kennzeichne sie explizit als "Behauptungen", nicht als Fakten.

**E. Evidenz sortieren + Labels**
Pro Claim:
- Label vergeben: gut belegt / unklar / widerlegt / Spekulation
- Alternative Erklärung anbieten (Debunking braucht eine Alternative, sonst bleibt ein Vakuum)
- Kurz halten, nicht wiederholen

**F. Sokratischer Stresstest**
Stelle 2–3 Rückfragen:
- "Ist das falsifizierbar? Welche Beobachtung würde die Theorie widerlegen?"
- "Gibt es innere Widersprüche?"
- "Welche alternative Erklärung ist simpler/plausibler?"

**G. Gemeinsames Fazit**
Fasse die Evidenzlage zusammen (nicht als Urteil, sondern als Ergebnis).
Lade den Nutzer ein, weitere Fragen zu stellen oder Gegenargumente zu bringen.

TONFALL: Ruhig, neugierig, respektvoll. Keine Anklage, kein Predigen. Ziel ist gemeinsames Denken.

LÄNGE: Halte dich kurz (max. 6–8 Sätze pro Schritt). Nutzer lesen keine Romane.`;

const QUICKSTARTS: Quickstart[] = [
  {
    id: "discussion-aliens",
    title: "Gibt es Außerirdische?",
    description:
      "Diskutiere prägnant, max. 5–6 Sätze pro Antwort. Argumentiere offen pro/contra, ohne so zu tun als gäbe es eine sichere Lösung.",
    icon: Brain,
    category: "wissenschaft",
    speculative: true,
    system:
      "Wir führen eine lockere, argumentierende Diskussion. Du gibst ausgewogene Pro- und Contra-Punkte, fragst nach meiner Sicht und reagierst darauf. Keine Fachvorträge, eher Alltagslogik. Wenn etwas unklar ist, sag das offen.",
    user: "Gibt es Außerirdische? Wie siehst du das?",
  },
  {
    id: "discussion-ai-risk",
    title: "Wie gefährlich ist KI wirklich?",
    description:
      "Keine Panikmache, keine Verharmlosung. Diskutiere Nutzen vs. Risiken, mit echten Gegenargumenten.",
    icon: Brain,
    category: "kultur",
    speculative: false,
    system:
      "Diskutiere mit mir wie in einem normalen Gespräch. Erst kurze Einordnung, dann Pro- und Contra-Argumente, dann eine Rückfrage an mich. Nutze einfache Beispiele statt Fachjargon. Ziel: echtes Abwägen, kein Predigen.",
    user: "Wie gefährlich ist KI deiner Meinung nach?",
  },
  {
    id: "discussion-minimum-wage",
    title: "Macht eine Mindestlohn-Erhöhung Sinn?",
    description: "Abwägen statt Parolen: Vorteile, Nachteile, wer gewinnt, wer verliert.",
    icon: PenSquare,
    category: "realpolitik",
    speculative: false,
    system:
      "Führe eine ausgewogene Diskussion. Liefere je 2–3 klare Argumente pro und contra, erwähne Unsicherheiten, und frag mich nach meiner Position. Keine Zahlen-Wüste, sondern nachvollziehbare Logik.",
    user: "Sollte der Mindestlohn steigen?",
  },
  {
    id: "discussion-social-media",
    title: "Sollten soziale Medien stärker reguliert werden?",
    description: "Freiheit vs. Schutz: Wo zieht man Grenzen? Diskutiere beides fair.",
    icon: Brain,
    category: "realpolitik",
    speculative: false,
    system:
      "Diskutiere fair und nicht zu technisch. Bring Argumente beider Seiten, zeig Graubereiche, stell mir am Ende eine offene Frage zur Einschätzung.",
    user: "Wie stark sollten soziale Medien reguliert sein?",
  },
  {
    id: "discussion-nuclear-energy",
    title: "Ist Kernenergie sinnvoll für die Energiewende?",
    description: "Pragmatisch diskutieren: Klima, Kosten, Risiken, Realität.",
    icon: Brain,
    category: "realpolitik",
    speculative: false,
    system:
      "Kurze, alltagsnahe Diskussion mit echten Gegenargumenten. Kein Experten-Gelaber. Pro/contra, dann Rückfrage an mich. Erkenne an, dass es mehrere vernünftige Sichtweisen gibt.",
    user: "Sollte Kernenergie Teil der Energiewende sein?",
  },
  // NEU: 10 zusätzliche Diskussionsrunden mit Fokus auf Hypothesen, Was-wäre-wenn, Theorie-Spin
  {
    id: "discussion-ai-laws",
    title: "KI schreibt Gesetze – gut oder gefährlich?",
    description: "Gedankenexperiment: Was passiert, wenn Algorithmen Gesetzestexte formulieren?",
    icon: Brain,
    category: "hypothetisch",
    speculative: true,
    system:
      "Hypothetisches Szenario-Brainstorming. Diskutiere Chancen (Objektivität, Geschwindigkeit) vs. Risiken (Bias, fehlende Ethik). Trenne klar: Was ist technisch möglich (Fakten), was ist Spekulation über Zukunft. Stelle Gegenfragen, um Annahmen zu testen.",
    user: "Was wäre, wenn KI unsere Gesetze schreiben würde?",
  },
  {
    id: "discussion-simulation",
    title: "Leben wir in einer Simulation?",
    description: "Simulation-Hypothese: Philosophisches Gedankenspiel, keine gesicherte Wahrheit.",
    icon: Brain,
    category: "wissenschaft",
    speculative: true,
    system:
      "WICHTIG: Dies ist eine philosophische Hypothese, KEINE bewiesene Tatsache. Diskutiere Argumente (Bostrom, etc.) vs. Gegenargumente. Mache klar, was Spekulation ist. Trenne: 'Das ist ein Gedankenexperiment' vs. 'Das ist gesichert'. Frage nach, welche Annahmen ich für plausibel halte.",
    user: "Simulation-Hypothese – was hältst du davon?",
  },
  {
    id: "discussion-time-travel",
    title: "Zeitreisen: Paradoxien und Physik",
    description: "Theoretisch möglich? Großvater-Paradoxon? Diskutiere wissenschaftlich fundiert.",
    icon: Brain,
    category: "wissenschaft",
    speculative: true,
    system:
      "Trenne klar: Was sagt die Physik (Relativitätstheorie, Wurmlöcher = theoretisch möglich, aber praktisch unerreichbar) vs. Science-Fiction. Diskutiere Paradoxien, aber kennzeichne, was Spekulation ist. Biete Gegenargumente und frage nach meiner Intuition.",
    user: "Sind Zeitreisen jemals möglich?",
  },
  {
    id: "discussion-free-energy",
    title: "Was wäre bei kostenloser Energie?",
    description:
      "Ökonomisches Gedankenexperiment: Gesellschaft, Arbeit, Umwelt – alles neu denken.",
    icon: Brain,
    category: "hypothetisch",
    speculative: true,
    system:
      "Hypothetisches Szenario: Angenommen, Energie wäre morgen kostenlos verfügbar. Diskutiere realistische Konsequenzen (Wirtschaft, Verteilung, neue Probleme) vs. utopische Träume. Frage nach, welche Annahmen ich treffe. Zeige Pro/Contra klar auf.",
    user: "Was würde passieren, wenn Energie kostenlos wäre?",
  },
  {
    id: "discussion-car-free-city",
    title: "Stadt ohne Autos – Utopie?",
    description: "Urbanes Experiment: Lebensqualität vs. Praktikabilität. Was geht wirklich?",
    icon: Brain,
    category: "hypothetisch",
    speculative: false,
    system:
      "Diskutiere ausgewogen: Erfolgsbeispiele (Kopenhagen, Barcelona Superblocks) vs. Herausforderungen (Mobilität, Akzeptanz). Trenne Idealvorstellung vs. Realpolitik. Stelle Rückfragen: Was ist mir wichtiger – Ruhe oder Flexibilität?",
    user: "Könnte eine Stadt komplett autofrei funktionieren?",
  },
  {
    id: "discussion-tech-religion",
    title: "Ist Technik die neue Religion?",
    description: "Kulturbeobachtung: Tech-Gurus, Heilsversprechen, Glaubenskriege. Übertrieben?",
    icon: Brain,
    category: "kultur",
    speculative: false,
    system:
      "Kulturkritische Diskussion. Vergleiche Parallelen (Heilsversprechen, Gurus, Community) vs. Unterschiede (Evidenz, Testbarkeit). Keine Anklage, sondern neugierige Analyse. Frage nach: Wo sehe ich religiöse Muster?",
    user: "Wird Technik wie eine Religion behandelt?",
  },
  {
    id: "discussion-ubi",
    title: "Bedingungsloses Grundeinkommen – Traum oder Falle?",
    description: "Sozialökonomische Kontroverse: Freiheit vs. Faulheit. Was sagen Experimente?",
    icon: PenSquare,
    category: "realpolitik",
    speculative: false,
    system:
      "Diskutiere evidenzbasiert: Was zeigen Pilotprojekte (Finnland, Kenia)? Argumente pro (Entlastung, Kreativität) vs. contra (Finanzierung, Arbeitsmoral). Trenne Hoffnungen vs. Daten. Stelle Gegenfragen zu Annahmen.",
    user: "Sollten wir ein bedingungsloses Grundeinkommen einführen?",
  },
  {
    id: "discussion-trends-manipulation",
    title: "Trends: organisch oder manipuliert?",
    description:
      "Medienkritik: Entstehen Hypes natürlich oder werden sie gemacht? Wo ist die Grenze?",
    icon: Brain,
    category: "kultur",
    speculative: false,
    system:
      "Analysiere kritisch: Was ist organisches Interesse vs. Astroturfing/Algorithmen-Boost? Beispiele (TikTok, Memes, Mode). Keine Verschwörungstheorien, sondern nachvollziehbare Mechanismen. Frage: Welche Trends halte ich für echt?",
    user: "Sind kulturelle Trends echt oder manipuliert?",
  },
  {
    id: "discussion-mars-2050",
    title: "Menschen auf dem Mars bis 2050?",
    description: "Technologie-Zukunft: Musk, NASA, Realismus. Was ist machbar, was ist Hype?",
    icon: Brain,
    category: "hypothetisch",
    speculative: true,
    system:
      "Trenne klar: Technische Machbarkeit (Raketen, Lebenserhaltung = lösbar) vs. praktische Hürden (Kosten, Strahlung, Psychologie). Diskutiere Musk-Versprechen kritisch, aber respektvoll. Frage nach: Was hältst du für realistisch?",
    user: "Werden bis 2050 Menschen dauerhaft auf dem Mars leben?",
  },
  {
    id: "discussion-fermi-paradox",
    title: "Wo sind all die Aliens?",
    description:
      "Fermi-Paradoxon: Milliarden Sterne, aber keine Signale. Warum? Diskutiere Theorien.",
    icon: Brain,
    category: "wissenschaft",
    speculative: true,
    system:
      "Wissenschaftlich fundierte Spekulation. Diskutiere Lösungsvorschläge: Große Filter, Zoo-Hypothese, Rare Earth. Mache klar: Alles Hypothesen, keine bewiesenen Fakten. Frage nach: Welche Erklärung erscheint mir plausibler?",
    user: "Fermi-Paradoxon – warum finden wir keine außerirdische Intelligenz?",
  },

  // ============================================================================
  // VERSCHWÖRUNGSTHEORIEN – Kritisch diskutieren (10 kuratierte Themen)
  // ============================================================================
  {
    id: "conspiracy-flat-earth",
    title: "Flache Erde",
    description: "Diskutiere die Behauptung kritisch. Was sagt die Evidenz?",
    icon: Brain,
    category: "verschwörungstheorien",
    speculative: false,
    system: CONSPIRACY_DISCUSSION_MODE,
    user: "Ist die Erde flach? Was spricht dafür, was dagegen?",
  },
  {
    id: "conspiracy-reptilians",
    title: "Reptiloiden",
    description: "Menschen-Echsen in Machtpositionen? Prüfen wir das gemeinsam.",
    icon: Brain,
    category: "verschwörungstheorien",
    speculative: false,
    system: CONSPIRACY_DISCUSSION_MODE,
    user: "Gibt es Reptiloiden, die die Welt regieren?",
  },
  {
    id: "conspiracy-moon-landing",
    title: "Mondlandung gefälscht",
    description: "War die Apollo 11-Landung ein Hollywood-Fake?",
    icon: Brain,
    category: "verschwörungstheorien",
    speculative: false,
    system: CONSPIRACY_DISCUSSION_MODE,
    user: "War die Mondlandung ein Fake?",
  },
  {
    id: "conspiracy-chemtrails",
    title: "Chemtrails",
    description: "Kondensstreifen oder Gift? Was sagt die Wissenschaft?",
    icon: Brain,
    category: "verschwörungstheorien",
    speculative: false,
    system: CONSPIRACY_DISCUSSION_MODE,
    user: "Sind Chemtrails real?",
  },
  {
    id: "conspiracy-bermuda-triangle",
    title: "Bermuda-Dreieck",
    description: "Mysteriöse Schiffs- und Flugzeugverluste – oder statistische Normalität?",
    icon: Brain,
    category: "verschwörungstheorien",
    speculative: false,
    system: CONSPIRACY_DISCUSSION_MODE,
    user: "Was ist dran am Bermuda-Dreieck?",
  },
  {
    id: "conspiracy-ancient-aliens",
    title: "Ancient Aliens / Pyramiden",
    description: "Haben Außerirdische die Pyramiden gebaut?",
    icon: Brain,
    category: "verschwörungstheorien",
    speculative: false,
    system: CONSPIRACY_DISCUSSION_MODE,
    user: "Wurden die Pyramiden von Aliens gebaut?",
  },
  {
    id: "conspiracy-area51",
    title: "Area 51 / UFO-Vertuschung",
    description: "Geheime Alien-Technologie oder Militärforschung?",
    icon: Brain,
    category: "verschwörungstheorien",
    speculative: false,
    system: CONSPIRACY_DISCUSSION_MODE,
    user: "Was wird in Area 51 wirklich verheimlicht?",
  },
  {
    id: "conspiracy-denver-airport",
    title: "Denver Airport / Geheimanlage",
    description: "Illuminati-Symbolik und unterirdische Bunker?",
    icon: Brain,
    category: "verschwörungstheorien",
    speculative: false,
    system: CONSPIRACY_DISCUSSION_MODE,
    user: "Ist der Denver Airport eine geheime Illuminati-Anlage?",
  },
  {
    id: "conspiracy-mkultra",
    title: "MK-Ultra",
    description: "CIA-Gedankenkontrolle: historisch belegt, aber wie weit ging es?",
    icon: Brain,
    category: "verschwörungstheorien",
    speculative: false,
    system: CONSPIRACY_DISCUSSION_MODE,
    user: "Was war MK-Ultra und wie weit gingen die Experimente?",
  },
  {
    id: "conspiracy-simulation",
    title: "Simulation-Hypothese",
    description: "Philosophisches Gedankenexperiment: Leben wir in einer Matrix?",
    icon: Brain,
    category: "verschwörungstheorien",
    speculative: true,
    system: CONSPIRACY_DISCUSSION_MODE,
    user: "Leben wir in einer Simulation?",
  },
];

const LINK_ACTIONS = [
  { label: "Modelle vergleichen", href: "/models" },
  { label: "Rollenbibliothek erkunden", href: "/roles" },
  { label: "API-Key prüfen", href: "/settings/api-data" },
];

interface QuickstartGridProps {
  onStart: (system: string, user?: string) => void;
  title?: string;
  description?: string;
}

export function QuickstartGrid({
  onStart,
  title = "Schnellstart-Flows",
  description = "Vorgefertigte Prompts für typische Aufgaben – tippe und starte direkt fokussiert.",
}: QuickstartGridProps) {
  // Accessibility helper for keyboard navigation
  const handleKeyActivate = (event: React.KeyboardEvent, system: string, user?: string) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onStart(system, user);
    }
  };

  // Split discussions: Regular vs. Conspiracy Theories
  const regularDiscussions = QUICKSTARTS.filter((q) => q.category !== "verschwörungstheorien");
  const conspiracyDiscussions = QUICKSTARTS.filter((q) => q.category === "verschwörungstheorien");

  // Helper: Render carousel for a given set of quickstarts
  const renderCarousel = (quickstarts: Quickstart[]) => (
    <section
      className="flex gap-3 overflow-x-auto touch-pan-x overscroll-x-contain snap-x snap-mandatory pb-2 -mx-[var(--spacing-3)] px-[var(--spacing-3)]"
      style={{
        scrollbarWidth: "none",
        WebkitOverflowScrolling: "touch",
      }}
    >
      <style>{`
        section::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      {quickstarts.map((quickstart) => {
        const Icon = quickstart.icon;
        const categoryInfo = quickstart.category ? CATEGORY_LABELS[quickstart.category] : null;
        return (
          <PremiumCard
            key={quickstart.id}
            className="flex flex-col gap-3 snap-center shrink-0 w-[85vw] sm:w-[45vw] md:w-[30vw] lg:w-[280px] focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-2"
            onClick={() => onStart(quickstart.system, quickstart.user)}
            interactiveRole="button"
            onKeyDown={(event) => handleKeyActivate(event, quickstart.system, quickstart.user)}
          >
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-brand/10 text-brand shadow-brandGlow">
                <Icon className="h-5 w-5" />
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-text-primary leading-tight mb-2">
                  {quickstart.title}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {categoryInfo && (
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${categoryInfo.color}`}
                    >
                      {categoryInfo.label}
                    </span>
                  )}
                  {quickstart.speculative && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">
                      Hypothese
                    </span>
                  )}
                </div>
              </div>
            </div>
            <p className="text-sm text-text-secondary flex-1 leading-relaxed">
              {quickstart.description}
            </p>
            <span className="text-xs font-semibold text-brand flex items-center gap-1">
              Starten
              <span className="text-brand-bright">→</span>
            </span>
          </PremiumCard>
        );
      })}
    </section>
  );

  return (
    <div className="space-y-6">
      {(title || description) && (
        <section className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-brand/80">Workflows</p>
          {title && <h2 className="text-2xl font-bold text-text-primary">{title}</h2>}
          {description && (
            <p className="max-w-2xl text-sm text-text-secondary leading-relaxed">{description}</p>
          )}
        </section>
      )}

      {/* Card 1: Regular Discussions */}
      <div className="rounded-lg bg-surface-inset/80 shadow-inset px-[var(--spacing-3)] py-[var(--spacing-3)] space-y-3">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-text-primary">Diskussionen</h3>
          <p className="text-xs text-text-secondary">
            Vorbereitete Presets für schnelle Einstiege – tippe und starte direkt fokussiert.
          </p>
        </div>
        {renderCarousel(regularDiscussions)}
      </div>

      {/* Card 2: Conspiracy Theories – Separate card below */}
      {conspiracyDiscussions.length > 0 && (
        <div className="rounded-lg bg-surface-inset/80 shadow-inset px-[var(--spacing-3)] py-[var(--spacing-3)] space-y-3 border border-red-500/20">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
              Verschwörungstheorien
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 border border-red-500/20">
                Kritisch prüfen
              </span>
            </h3>
            <p className="text-xs text-text-secondary">
              Kritisch diskutieren, nicht bestätigen. Evidenzbasiert Behauptungen prüfen.
            </p>
          </div>
          {renderCarousel(conspiracyDiscussions)}
        </div>
      )}

      <section className="flex flex-wrap gap-2">
        {LINK_ACTIONS.map((action) => (
          <a
            key={action.label}
            href={action.href}
            className={buttonVariants({
              variant: "ghost",
              size: "sm",
              className: "inline-flex items-center gap-2",
            })}
          >
            <Link2 className="h-3.5 w-3.5" />
            {action.label}
          </a>
        ))}
      </section>
    </div>
  );
}
