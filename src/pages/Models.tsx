import { useState } from "react";
import { Link } from "react-router-dom";

import { useStudio } from "../app/state/StudioContext";
import { RoleCard } from "../components/studio/RoleCard";
import { Button } from "../components/ui/button";
import { useToasts } from "../components/ui/toast/ToastsProvider";
import { cn } from "../lib/utils";

function formatContext(ctx?: number) {
  if (!ctx) return "Unbekannte Kontextlänge";
  if (ctx >= 1000000) return `${(ctx / 1000000).toFixed(1)} Mio. Token`;
  if (ctx >= 1000) return `${(ctx / 1000).toFixed(0)}k Token`;
  return `${ctx.toLocaleString()} Token`;
}

const premiumModels = [
  {
    id: "perplexity/llama-3.1-sonar-large-128k-online",
    label: "Sonar Large Online",
    provider: "Perplexity",
    priceIn: 1.0,
    priceOut: 1.0,
    ctx: 128000,
    description: "Llama mit Online-Zugang. Kann aktuelle Infos aus dem Internet holen.",
  },
  {
    id: "openai/gpt-4o-mini",
    label: "GPT-4o mini",
    provider: "OpenAI",
    priceIn: 0.15,
    priceOut: 0.6,
    ctx: 128000,
    description:
      "OpenAI-Allrounder: sehr verlässlich, starker Kontext und Toolsupport – ideal, wenn es einfach laufen soll.",
  },
  {
    id: "google/gemini-2.0-flash-exp",
    label: "Gemini 2.0 Flash",
    provider: "Google",
    priceIn: 0.0,
    priceOut: 0.0,
    ctx: 1000000,
    description:
      "Googles neuestes Modell mit riesigem Kontext (1M Tokens!). Experimentell, aber sehr leistungsfähig.",
  },
  {
    id: "deepseek/deepseek-chat-v3.1",
    label: "DeepSeek V3.1",
    provider: "DeepSeek",
    priceIn: 0.27,
    priceOut: 1.1,
    ctx: 64000,
    description:
      "Logisches Denken, lange Begründungen – denkt erst, antwortet dann. Für knifflige Fragen und mehrstufige Erklärungen stark.",
  },
] as const;

const everydayModels = [
  {
    id: "meta-llama/llama-3.1-8b-instruct",
    label: "Llama 3.1 8B",
    provider: "Meta",
    priceIn: 0.02,
    priceOut: 0.03,
    ctx: 131072,
    description:
      "Sehr guter Allrounder für Gespräche, stabil und vorhersehbar – mein Standardtipp für produktive Chats.",
  },
  {
    id: "mistralai/mistral-small-3.2-24b-instruct",
    label: "Mistral Small 24B",
    provider: "Mistral",
    priceIn: 0.2,
    priceOut: 0.8,
    ctx: 32000,
    description:
      "Kompaktes Mistral mit 24B – schnell, präzise, gut für Analysen und strukturierte Antworten.",
  },
  {
    id: "mistralai/mistral-7b-instruct",
    label: "Mistral 7B",
    provider: "Mistral",
    priceIn: 0.028,
    priceOut: 0.054,
    ctx: 32768,
    description:
      "Schlank und schnell – perfekt für Dialoge und leichtere Aufgaben, wenn es besonders flott gehen soll.",
  },
  {
    id: "qwen/qwen-2.5-7b-instruct",
    label: "Qwen 2.5 7B",
    provider: "Qwen",
    priceIn: 0.04,
    priceOut: 0.1,
    ctx: 32768,
    description:
      "Preiswert und wortgewandt, oft etwas direkter Ton – ideal für schnelle Brainstorms.",
  },
  {
    id: "deepseek/deepseek-r1-distill-llama-8b",
    label: "DeepSeek R1 Distill 8B",
    provider: "DeepSeek",
    priceIn: 0.04,
    priceOut: 0.04,
    ctx: 65536,
    description:
      "Günstiges Reasoning-Light: angenehme Plauderei mit solider Struktur, symmetrische Kosten.",
  },
] as const;

const freeModels = [
  {
    id: "meta-llama/llama-3.3-70b-instruct:free",
    label: "Llama 3.3 70B (Free)",
    provider: "Meta",
    priceIn: 0,
    priceOut: 0,
    ctx: 131072,
    description:
      "Freies 70B-Flaggschiff – sehr stabil mit großer Kontexttiefe, wenn du etwas mehr Reserven willst.",
  },
  {
    id: "mistralai/mistral-nemo:free",
    label: "Mistral Nemo (Free)",
    provider: "Mistral",
    priceIn: 0,
    priceOut: 0,
    ctx: 131072,
    description:
      "Robustes Long-Context-Modell von Mistral. Solide Qualität bei null Kosten – super Standardwahl.",
  },
  {
    id: "qwen/qwen-2.5-72b-instruct:free",
    label: "Qwen 2.5 72B (Free)",
    provider: "Qwen",
    priceIn: 0,
    priceOut: 0,
    ctx: 32768,
    description:
      "Kostenlose 72B-Version. Premium-Qualität ohne Kosten – einer der besten Free-Modelle.",
  },
  {
    id: "meta-llama/llama-3.3-8b-instruct:free",
    label: "Llama 3.3 8B (Free)",
    provider: "Meta",
    priceIn: 0,
    priceOut: 0,
    ctx: 131072,
    description:
      "Kostenloses Test-Pferd für lockere Chats. Wenn es hakt, wechsel auf Llama 3.1 8B.",
  },
  {
    id: "qwen/qwen-2.5-7b-instruct:free",
    label: "Qwen 2.5 7B (Free)",
    provider: "Qwen",
    priceIn: 0,
    priceOut: 0,
    ctx: 32768,
    description: "Kostenlose Qwen-Variante für schnelle Experimente und einfache Aufgaben.",
  },
] as const;

const uncensoredModels = [
  {
    id: "thedrummer/cydonia-24b-v4.1",
    label: "Cydonia 24B v4.1",
    provider: "TheDrummer",
    priceIn: 1.2,
    priceOut: 1.2,
    ctx: 32768,
    description:
      "Kreatives Schreiben, Rollenspiel, wenig Filter. Klingt freier und fantasievoller als übliche Schulbuch-Bots.",
  },
  {
    id: "cognitivecomputations/dolphin3.0-mistral-24b",
    label: "Dolphin 3.0 Mistral 24B",
    provider: "CognitiveComputations",
    priceIn: 0.3,
    priceOut: 0.3,
    ctx: 32768,
    description:
      "Unkompliziertes Rollenspiel-Modell mit wenig Einschränkungen. Gut für kreative Szenarien.",
  },
  {
    id: "sao10k/l3.3-euryale-70b",
    label: "Euryale L3.3 70B",
    provider: "Sao10k",
    priceIn: 0.8,
    priceOut: 0.8,
    ctx: 131072,
    description:
      "Unzensiertes 70B-Modell für kreative Geschichten und Rollenspiel mit großem Kontext.",
  },
  {
    id: "venice/uncensored:free",
    label: "Venice Uncensored (Free)",
    provider: "Venice",
    priceIn: 0,
    priceOut: 0,
    ctx: 8192,
    description:
      "Kostenlose unzensierte Variante für Experimente. Qualität schwankt, aber ein guter Einstieg.",
  },
] as const;

const codeModels = [
  {
    id: "deepseek/deepseek-coder",
    label: "DeepSeek Coder",
    provider: "DeepSeek",
    priceIn: 0.2,
    priceOut: 0.8,
    ctx: 32768,
    description:
      "Spezialisiert auf Programmierung. Versteht Code-Kontext gut, erklärt und debuggt sauber.",
  },
  {
    id: "qwen/qwen-2.5-coder-32b-instruct",
    label: "Qwen 2.5 Coder 32B",
    provider: "Qwen",
    priceIn: 0.3,
    priceOut: 0.9,
    ctx: 32768,
    description:
      "Spezialisiertes Code-Qwen. Versteht Programmierung ausgezeichnet, erklärt und debuggt präzise.",
  },
] as const;

export default function ModelsPage() {
  const { activeRole } = useStudio();
  const toasts = useToasts();
  const [selected, setSelected] = useState(() => {
    try {
      return localStorage.getItem("disa_model") || "";
    } catch {
      return "";
    }
  });

  const selectModelById = (modelId: string, label?: string) => {
    setSelected(modelId);
    try {
      localStorage.setItem("disa_model", modelId);
    } catch {
      /* ignore */
    }
    toasts.push({
      kind: "success",
      title: "Modell gewählt",
      message: `${label || modelId} wird für neue Gespräche verwendet.`,
    });
  };

  const renderFeaturedCard = (item: {
    id: string;
    label: string;
    provider: string;
    priceIn: number;
    priceOut: number;
    ctx?: number;
    description: string;
  }) => {
    const isSelected = selected === item.id;

    return (
      <RoleCard
        key={item.id}
        title={item.label}
        description={`${item.description}\n\nIn: ${
          item.priceIn === 0 ? "Kostenlos" : `$${item.priceIn.toFixed(3)}/1M`
        } | Out: ${
          item.priceOut === 0 ? "Kostenlos" : `$${item.priceOut.toFixed(3)}/1M`
        }${item.ctx ? ` | Kontext: ${formatContext(item.ctx)}` : ""}`}
        onClick={() => selectModelById(item.id, item.label)}
        badge={item.provider}
        isActive={isSelected}
        className={cn("min-h-[140px]", isSelected && "ring-2 ring-brand")}
      />
    );
  };

  const activeRoleSummary =
    activeRole &&
    (activeRole.description?.trim() ||
      activeRole.systemPrompt.replace(/\s+/g, " ").trim() ||
      "Kein Beschreibungstext vorhanden.");

  return (
    <div className="flex h-full flex-col px-5 pb-8 pt-5">
      <header className="mb-6 space-y-2">
        <span className="brand-chip w-fit">Modelle</span>
        <h1 className="text-lg font-semibold text-text-0" data-testid="models-title">
          Modellkatalog
        </h1>
        <p className="text-sm leading-6 text-text-1">
          Finde das passende KI-Modell für deinen Anwendungsfall. Rollen lassen sich jetzt im{" "}
          <Link to="/roles" className="text-brand underline">
            Rollen-Studio
          </Link>{" "}
          auswählen.
        </p>
      </header>

      <section aria-labelledby="active-role-heading" className="mb-6">
        <h2 id="active-role-heading" className="sr-only">
          Aktive Rolle
        </h2>
        <div className="brand-panel card-depth space-y-3 p-4">
          <span className="brand-chip w-fit">Aktive Rolle</span>
          <h3 className="font-semibold text-text-0">Aktive Rolle</h3>
          {activeRole && activeRoleSummary ? (
            <>
              <p className="text-sm font-medium text-text-0">{activeRole.name}</p>
              <p className="whitespace-pre-line text-sm text-text-1">{activeRoleSummary}</p>
            </>
          ) : (
            <p className="text-sm text-text-1">Standard (keine Rolle ausgewählt)</p>
          )}
          <p className="text-xs text-text-2">
            Passe Stimme, Tonalität und Badges jetzt bequem im Rollen-Studio an.
          </p>
          <Link to="/roles">
            <Button variant="brand" size="sm" className="mt-4">
              Rollen öffnen
            </Button>
          </Link>
        </div>
      </section>

      <section aria-labelledby="premium-models-heading" className="grid grid-cols-1 gap-3 pb-8">
        <div className="space-y-1">
          <span className="brand-chip w-fit">Premium</span>
          <h2
            id="premium-models-heading"
            className="text-sm font-semibold uppercase tracking-wide text-text-0"
          >
            🏆 Premium Modelle
          </h2>
        </div>
        <p className="text-xs text-text-1">
          Top-Qualität für wichtige Aufgaben – GPT-4, Claude & DeepSeek V3
        </p>
        <div
          role="group"
          aria-labelledby="premium-models-heading"
          className="grid grid-cols-1 gap-4"
        >
          {premiumModels.map((item) => renderFeaturedCard(item))}
        </div>
      </section>

      <section aria-labelledby="everyday-models-heading" className="grid grid-cols-1 gap-3 pb-8">
        <div className="space-y-1">
          <span className="brand-chip w-fit">Alltag</span>
          <h2
            id="everyday-models-heading"
            className="text-sm font-semibold uppercase tracking-wide text-text-0"
          >
            💼 Alltags Modelle
          </h2>
        </div>
        <p className="text-xs text-text-1">
          Zuverlässige Modelle für tägliche Aufgaben – gutes Preis-Leistungs-Verhältnis
        </p>
        <div
          role="group"
          aria-labelledby="everyday-models-heading"
          className="grid grid-cols-1 gap-4"
        >
          {everydayModels.map((item) => renderFeaturedCard(item))}
        </div>
      </section>

      <section aria-labelledby="free-models-heading" className="grid grid-cols-1 gap-3 pb-8">
        <div className="space-y-1">
          <span className="brand-chip w-fit">Free</span>
          <h2
            id="free-models-heading"
            className="text-sm font-semibold uppercase tracking-wide text-text-0"
          >
            🎁 Free Modelle
          </h2>
        </div>
        <p className="text-xs text-text-1">
          Kostenlose Modelle zum Testen und Experimentieren – null Kosten, solide Qualität
        </p>
        <div role="group" aria-labelledby="free-models-heading" className="grid grid-cols-1 gap-4">
          {freeModels.map((item) => renderFeaturedCard(item))}
        </div>
      </section>

      <section aria-labelledby="uncensored-models-heading" className="grid grid-cols-1 gap-3 pb-8">
        <div className="space-y-1">
          <span className="brand-chip w-fit">Unzensiert</span>
          <h2
            id="uncensored-models-heading"
            className="text-sm font-semibold uppercase tracking-wide text-text-0"
          >
            🎭 Unzensiert Modelle
          </h2>
        </div>
        <p className="text-xs text-text-1">
          Kreatives Schreiben & Rollenspiel – weniger Filter, mehr Freiheit
        </p>
        <div
          role="group"
          aria-labelledby="uncensored-models-heading"
          className="grid grid-cols-1 gap-4"
        >
          {uncensoredModels.map((item) => renderFeaturedCard(item))}
        </div>
      </section>

      <section aria-labelledby="code-models-heading" className="grid grid-cols-1 gap-3 pb-8">
        <div className="space-y-1">
          <span className="brand-chip w-fit">Code</span>
          <h2
            id="code-models-heading"
            className="text-sm font-semibold uppercase tracking-wide text-text-0"
          >
            💻 Code-Modelle
          </h2>
        </div>
        <p className="text-xs text-text-1">
          Spezialisierte Modelle für Programmierung und Code-Analyse
        </p>
        <div role="group" aria-labelledby="code-models-heading" className="grid grid-cols-1 gap-4">
          {codeModels.map((item) => renderFeaturedCard(item))}
        </div>
      </section>
    </div>
  );
}
