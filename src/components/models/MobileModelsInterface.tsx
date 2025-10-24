import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { useStudio } from "../../app/state/StudioContext";
import { Button, Card } from "../ui";
import { ModelCard } from "../ui/ModelCard";
import { useToasts } from "../ui/toast/ToastsProvider";

type ModelDefinition = {
  id: string;
  label: string;
  provider: string;
  priceIn: number;
  priceOut: number;
  ctx?: number;
  description: string;
};

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
] satisfies ModelDefinition[];

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
] satisfies ModelDefinition[];

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
] satisfies ModelDefinition[];

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
] satisfies ModelDefinition[];

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
] satisfies ModelDefinition[];

interface ModelGroup {
  id: string;
  badge: string;
  title: string;
  description: string;
  models: ModelDefinition[];
}

const modelGroups: ModelGroup[] = [
  {
    id: "premium",
    badge: "Premium",
    title: "🏆 Premium Modelle",
    description: "Top-Qualität für wichtige Aufgaben – GPT-4, Claude & DeepSeek V3",
    models: premiumModels,
  },
  {
    id: "everyday",
    badge: "Alltag",
    title: "💼 Alltags Modelle",
    description: "Zuverlässige Modelle für tägliche Aufgaben – starkes Preis-Leistungs-Verhältnis",
    models: everydayModels,
  },
  {
    id: "free",
    badge: "Free",
    title: "🎁 Free Modelle",
    description: "Kostenlose Modelle zum Testen und Experimentieren – null Kosten, solide Qualität",
    models: freeModels,
  },
  {
    id: "uncensored",
    badge: "Unzensiert",
    title: "🎭 Unzensiert Modelle",
    description: "Kreative Modelle mit wenig Filtern – ideal für Rollenspiel und Storytelling",
    models: uncensoredModels,
  },
  {
    id: "code",
    badge: "Code",
    title: "🧑‍💻 Code Modelle",
    description: "Spezialisiert auf Programmierung, Debugging und technische Analysen",
    models: codeModels,
  },
];

export function MobileModelsInterface() {
  const { activeRole } = useStudio();
  const toasts = useToasts();
  const [openId, setOpenId] = useState<string | null>(null);
  const [selected, setSelected] = useState(() => {
    try {
      return localStorage.getItem("disa_model") || "";
    } catch {
      return "";
    }
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const selectModelById = (modelId: string, label?: string) => {
    setSelected(modelId);
    setOpenId(null);
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

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const activeRoleSummary =
    activeRole &&
    (activeRole.description?.trim() ||
      activeRole.systemPrompt.replace(/\\s+/g, " ").trim() ||
      "Kein Beschreibungstext vorhanden.");

  const safeSelectedLabel = useMemo(() => {
    const allModels = modelGroups.flatMap((group) => group.models);
    return allModels.find((model) => model.id === selected)?.label;
  }, [selected]);

  // Filter models based on search term
  const filteredModelGroups = useMemo(() => {
    return modelGroups
      .map((group) => {
        const filteredModels = group.models.filter(
          (model) =>
            model.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
            model.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
            model.description.toLowerCase().includes(searchTerm.toLowerCase()),
        );
        return {
          ...group,
          models: filteredModels,
        };
      })
      .filter((group) => group.models.length > 0); // Only show groups that have matching models
  }, [searchTerm]);

  return (
    <div className="flex h-full flex-col gap-4 px-4 pb-16 pt-6 text-[var(--color-text-primary)] sm:px-6 lg:px-8">
      {/* Search Bar with mobile optimizations */}
      <div className="relative mb-2">
        <input
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Modelle suchen..."
          className="border-border bg-surface-1 text-text-0 placeholder:text-text-1 focus:border-brand focus:ring-brand min-h-[48px] w-full rounded-lg border py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 touch-target"
          aria-label="Modellsuche"
        />
        <svg
          className="text-text-1 pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      <header className="space-y-3 text-[var(--color-text-primary)]" data-testid="models-title">
        <span className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface-subtle px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] opacity-80">
          Modelle
        </span>
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold sm:text-3xl">Modellkatalog</h1>
          <p className="max-w-2xl text-sm leading-6 opacity-80 sm:text-base">
            Finde das passende KI-Modell für deinen Anwendungsfall. Rollen lassen sich im{" "}
            <Link to="/roles" className="font-medium underline">
              Rollen-Studio
            </Link>{" "}
            auswählen.
          </p>
        </div>
        {safeSelectedLabel && (
          <p className="text-xs opacity-65 sm:text-sm">
            Aktuell ausgewählt: <span className="font-semibold">{safeSelectedLabel}</span>
          </p>
        )}
      </header>

      <Card padding="md" className="space-y-4 text-[var(--color-text-primary)]">
        <div className="space-y-2">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/35 bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] opacity-70">
            Studio Fokus
          </span>
          <h2 className="text-lg font-semibold sm:text-xl">Aktive Rolle</h2>
        </div>
        {activeRole && activeRoleSummary ? (
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-sm font-semibold sm:text-base">
              <span>{activeRole.name}</span>
              {activeRole.category && (
                <span className="inline-flex items-center gap-1 rounded-full border border-white/30 bg-white/20 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide opacity-80">
                  {activeRole.category}
                </span>
              )}
            </div>
            <p className="text-sm leading-6 opacity-80 sm:text-base">{activeRoleSummary}</p>
          </div>
        ) : (
          <p className="text-sm opacity-75 sm:text-base">Standard (keine Rolle ausgewählt)</p>
        )}
        <p className="text-xs opacity-65 sm:text-sm">
          Passe Stimme, Tonalität und Badges flexibel im Rollen-Studio an.
        </p>
        <Link to="/roles" className="inline-flex">
          <Button variant="brand" size="sm">
            Rollen öffnen
          </Button>
        </Link>
      </Card>

      {filteredModelGroups.map((group) => {
        const isGroupExpanded = expandedGroups[group.id] ?? true;
        return (
          <section key={group.id} aria-labelledby={`models-${group.id}`} className="space-y-2">
            <div
              className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"
              onClick={() => toggleGroup(group.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggleGroup(group.id);
                }
              }}
            >
              <div className="space-y-1">
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border-subtle bg-surface-subtle px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] opacity-70">
                  {group.badge}
                </span>
                <h2 id={`models-${group.id}`} className="text-lg font-semibold sm:text-xl">
                  {group.title}
                  {!isGroupExpanded && (
                    <span className="text-xs font-normal text-text-muted ml-2">
                      ({group.models.length} Modelle)
                    </span>
                  )}
                </h2>
              </div>
              <span className="text-xs font-medium uppercase tracking-wide opacity-60 sm:text-sm">
                {group.models.length} Modelle
              </span>
            </div>

            <p className="max-w-2xl text-sm opacity-75 sm:text-base">{group.description}</p>

            {isGroupExpanded && (
              <div className="mobile-models-grid grid gap-3">
                {group.models.map((model) => (
                  <ModelCard
                    key={model.id}
                    id={model.id}
                    name={model.label}
                    provider={model.provider}
                    priceIn={model.priceIn}
                    priceOut={model.priceOut}
                    contextTokens={model.ctx}
                    description={model.description}
                    isSelected={selected === model.id}
                    isOpen={openId === model.id}
                    onSelect={() => selectModelById(model.id, model.label)}
                    onToggleDetails={() =>
                      setOpenId((current) => (current === model.id ? null : model.id))
                    }
                  />
                ))}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
