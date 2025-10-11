import { useState } from "react";
import { Link } from "react-router-dom";

import { useStudio } from "../app/state/StudioContext";
import { RoleCard } from "../components/studio/RoleCard";
import { useToasts } from "../components/ui/toast/ToastsProvider";
import { useGlassPalette } from "../hooks/useGlassPalette";
import type { GlassTint } from "../lib/theme/glass";
import { FRIENDLY_TINTS } from "../lib/theme/glass";
import { cn } from "../lib/utils";

function formatContext(ctx?: number) {
  if (!ctx) return "Unbekannte Kontextlänge";
  if (ctx >= 1000000) return `${(ctx / 1000000).toFixed(1)} Mio. Token`;
  if (ctx >= 1000) return `${(ctx / 1000).toFixed(0)}k Token`;
  return `${ctx.toLocaleString()} Token`;
}

// Unused - keeping for potential future use
// function formatPrice(price?: number) {
//   if (price === undefined || price === null || typeof price !== "number") return "unbekannt";
//   if (price === 0) return "Kostenlos";
//   return `$${price.toFixed(3)}/1k`;
// }

const DEFAULT_TINT: GlassTint = FRIENDLY_TINTS[0]!;

// === Premium Modelle ===
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

// === Alltags Modelle ===
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

// === Free Modelle ===
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

// === Unzensiert Modelle ===
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

// === Code-Modelle ===
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
  const palette = useGlassPalette();
  const friendlyPalette = palette.length > 0 ? palette : FRIENDLY_TINTS;
  const toasts = useToasts();
  const [selected, setSelected] = useState(() => {
    try {
      return localStorage.getItem("disa_model") || "";
    } catch {
      return "";
    }
  });

  // Kategorie-spezifische Base-Tints für bessere Übersichtlichkeit
  const categoryKeys = ["premium", "everyday", "free", "uncensored", "code"] as const;
  const categoryTints = categoryKeys.reduce<Record<string, GlassTint>>((acc, key, index) => {
    acc[key] = friendlyPalette[index % friendlyPalette.length] ?? DEFAULT_TINT;
    return acc;
  }, {});

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

  // Helper für einheitliche Featured-Model-Karten
  const renderFeaturedCard = (
    item: {
      id: string;
      label: string;
      provider: string;
      priceIn: number;
      priceOut: number;
      ctx?: number;
      description: string;
    },
    categoryKey: "premium" | "everyday" | "free" | "uncensored" | "code",
  ) => {
    const isSelected = selected === item.id;
    // Use category-specific tint instead of palette offset
    const tint = categoryTints[categoryKey] ?? DEFAULT_TINT;

    return (
      <RoleCard
        key={item.id}
        title={item.label}
        description={`${item.description}\n\nIn: ${
          item.priceIn === 0 ? "Kostenlos" : `$${item.priceIn.toFixed(3)}/1M`
        } | Out: ${
          item.priceOut === 0 ? "Kostenlos" : `$${item.priceOut.toFixed(3)}/1M`
        }${item.ctx ? ` | Kontext: ${formatContext(item.ctx)}` : ""}`}
        tint={tint}
        onClick={() => selectModelById(item.id, item.label)}
        badge={item.provider}
        isActive={isSelected}
        className={cn(
          "min-h-[140px] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
          isSelected && "ring-2 ring-white/30",
        )}
      />
    );
  };

  return (
    <div className="flex h-full flex-col px-5 pb-8 pt-5">
      <header className="mb-4">
        <h1 className="text-lg font-semibold text-white" data-testid="models-title">
          Modellkatalog
        </h1>
        <p className="mt-1 text-sm leading-6 text-white/70">
          Finde das passende KI-Modell für deinen Anwendungsfall. Rollen lassen sich jetzt im{" "}
          <Link to="/roles" className="decoration-accent-300/60 text-accent-300 underline">
            Rollen-Studio
          </Link>{" "}
          auswählen.
        </p>
      </header>

      <section aria-labelledby="active-role-heading" className="mb-6">
        <h2 id="active-role-heading" className="sr-only">
          Aktive Rolle
        </h2>
        <RoleCard
          title="Aktive Rolle"
          description={`${activeRole ? activeRole.name : "Standard (keine Rolle ausgewählt)"} - Passe Stimme, Tonalität und Badges jetzt bequem im Rollen-Studio an.`}
          tint={friendlyPalette[0] ?? DEFAULT_TINT}
          onClick={() => {}}
          badge="Rollen-Studio"
          className="min-h-[100px]"
        >
          <div className="flex items-center justify-end">
            <Link
              to="/roles"
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold text-white transition hover:border-white/20 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              Rollen öffnen
            </Link>
          </div>
        </RoleCard>
      </section>

      <section aria-labelledby="premium-models-heading" className="grid grid-cols-1 gap-3 pb-8">
        <h2
          id="premium-models-heading"
          className="text-sm font-semibold uppercase tracking-wide text-white/90"
        >
          🏆 Premium Modelle
        </h2>
        <p className="text-xs text-white/60">
          Top-Qualität für wichtige Aufgaben – GPT-4, Claude & DeepSeek V3
        </p>
        <div
          role="group"
          aria-labelledby="premium-models-heading"
          className="grid grid-cols-1 gap-4"
        >
          {premiumModels.map((item) => renderFeaturedCard(item, "premium"))}
        </div>
      </section>

      <section aria-labelledby="everyday-models-heading" className="grid grid-cols-1 gap-3 pb-8">
        <h2
          id="everyday-models-heading"
          className="text-sm font-semibold uppercase tracking-wide text-white/90"
        >
          💼 Alltags Modelle
        </h2>
        <p className="text-xs text-white/60">
          Zuverlässige Modelle für tägliche Aufgaben – gutes Preis-Leistungs-Verhältnis
        </p>
        <div
          role="group"
          aria-labelledby="everyday-models-heading"
          className="grid grid-cols-1 gap-4"
        >
          {everydayModels.map((item) => renderFeaturedCard(item, "everyday"))}
        </div>
      </section>

      <section aria-labelledby="free-models-heading" className="grid grid-cols-1 gap-3 pb-8">
        <h2
          id="free-models-heading"
          className="text-sm font-semibold uppercase tracking-wide text-white/90"
        >
          🎁 Free Modelle
        </h2>
        <p className="text-xs text-white/60">
          Kostenlose Modelle zum Testen und Experimentieren – null Kosten, solide Qualität
        </p>
        <div role="group" aria-labelledby="free-models-heading" className="grid grid-cols-1 gap-4">
          {freeModels.map((item) => renderFeaturedCard(item, "free"))}
        </div>
      </section>

      <section aria-labelledby="uncensored-models-heading" className="grid grid-cols-1 gap-3 pb-8">
        <h2
          id="uncensored-models-heading"
          className="text-sm font-semibold uppercase tracking-wide text-white/90"
        >
          🎭 Unzensiert Modelle
        </h2>
        <p className="text-xs text-white/60">
          Kreatives Schreiben & Rollenspiel – weniger Filter, mehr Freiheit
        </p>
        <div
          role="group"
          aria-labelledby="uncensored-models-heading"
          className="grid grid-cols-1 gap-4"
        >
          {uncensoredModels.map((item) => renderFeaturedCard(item, "uncensored"))}
        </div>
      </section>

      <section aria-labelledby="code-models-heading" className="grid grid-cols-1 gap-3 pb-8">
        <h2
          id="code-models-heading"
          className="text-sm font-semibold uppercase tracking-wide text-white/90"
        >
          💻 Code-Modelle
        </h2>
        <p className="text-xs text-white/60">
          Spezialisierte Modelle für Programmierung und Code-Analyse
        </p>
        <div role="group" aria-labelledby="code-models-heading" className="grid grid-cols-1 gap-4">
          {codeModels.map((item) => renderFeaturedCard(item, "code"))}
        </div>
      </section>
    </div>
  );
}
