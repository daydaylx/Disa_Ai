import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { useStudio } from "../app/state/StudioContext";
import { Button, Card } from "../components/ui";
import { ModelCard } from "../components/ui/ModelCard";
import { useToasts } from "../components/ui/toast/ToastsProvider";

type ModelDefinition = {
  id: string;
  label: string;
  provider: string;
  priceIn: number;
  priceOut: number;
  ctx?: number;
  description: string;
};

// Schnelle kostenlose Modelle für alltägliche Chats
const quickFreeModels = [
  {
    id: "google/gemma-3n-e4b-it:free",
    label: "Gemma 3N 4B",
    provider: "Google",
    priceIn: 0.0,
    priceOut: 0.0,
    ctx: 8192,
    description: "Leichtes Modell, läuft schnell und spart Ressourcen.",
  },
  {
    id: "qwen/qwen3-8b:free",
    label: "Qwen 3 8B",
    provider: "Qwen",
    priceIn: 0.0,
    priceOut: 0.0,
    ctx: 32768,
    description: "Freundlicher Mehrsprachler mit klarem Schreibstil.",
  },
  {
    id: "deepseek/deepseek-r1-0528-qwen3-8b:free",
    label: "Deepseek R1 Qwen 8B",
    provider: "DeepSeek",
    priceIn: 0.0,
    priceOut: 0.0,
    ctx: 32768,
    description: "Kleines, logisches Modell, das gut nachdenkt.",
  },
  {
    id: "nvidia/nemotron-nano-9b-v2:free",
    label: "Nemotron Nano 9B",
    provider: "NVIDIA",
    priceIn: 0.0,
    priceOut: 0.0,
    ctx: 16384,
    description: "Schnell und leicht, versteht einfache Logik.",
  },
] satisfies ModelDefinition[];

// Starke kostenlose Modelle für komplexe Aufgaben
const powerfulFreeModels = [
  {
    id: "alibaba/tongyi-deepresearch-30b-a3b:free",
    label: "Tongyi DeepResearch 30B",
    provider: "Alibaba",
    priceIn: 0.0,
    priceOut: 0.0,
    ctx: 64000,
    description: "Denkt logisch und gründlich, ideal für lange Fragen.",
  },
  {
    id: "shisa-ai/shisa-v2-llama3.3-70b:free",
    label: "Shisa Llama 3.3 70B",
    provider: "Shisa AI",
    priceIn: 0.0,
    priceOut: 0.0,
    ctx: 131072,
    description: "Stark in Japanisch und Englisch, natürlich und höflich.",
  },
  {
    id: "google/gemma-3-27b-it:free",
    label: "Gemma 3 27B",
    provider: "Google",
    priceIn: 0.0,
    priceOut: 0.0,
    ctx: 65536,
    description: "Großes, freundliches Modell für vielseitige Chats.",
  },
  {
    id: "meituan/longcat-flash-chat:free",
    label: "Longcat Flash Chat",
    provider: "Meituan",
    priceIn: 0.0,
    priceOut: 0.0,
    ctx: 128000,
    description: "Sehr schnelles Chat-Modell, merkt sich lange Gespräche.",
  },
] satisfies ModelDefinition[];

// Premium spezialisierte Modelle
const premiumModels = [
  {
    id: "z-ai/glm-4-32b",
    label: "GLM 4 32B",
    provider: "Z-AI",
    priceIn: 0.1,
    priceOut: 0.1,
    ctx: 128000,
    description: "Versteht lange Texte gut und bleibt konzentriert.",
  },
  {
    id: "opengvlab/internvl3-78b",
    label: "InternVL3 78B",
    provider: "OpenGVLab",
    priceIn: 0.07,
    priceOut: 0.26,
    ctx: 32768,
    description: "Kann Bilder und Text gemeinsam analysieren.",
  },
  {
    id: "baidu/ernie-4.5-21b-a3b",
    label: "Ernie 4.5 21B",
    provider: "Baidu",
    priceIn: 0.07,
    priceOut: 0.28,
    ctx: 65536,
    description: "Sehr gut bei logischem Denken und längeren Themen.",
  },
  {
    id: "qwen/qwen-2.5-72b-instruct",
    label: "Qwen 2.5 72B",
    provider: "Qwen",
    priceIn: 0.07,
    priceOut: 0.26,
    ctx: 131072,
    description: "Starker Allrounder für lange, natürliche Chats.",
  },
  {
    id: "x-ai/grok-4-fast",
    label: "Grok 4 Fast",
    provider: "xAI",
    priceIn: 0.2,
    priceOut: 0.5,
    ctx: 128000,
    description: "Antwortet schnell und kann viel Kontext behalten.",
  },
  {
    id: "deepseek/deepseek-chat",
    label: "Deepseek Chat",
    provider: "DeepSeek",
    priceIn: 0.24,
    priceOut: 0.84,
    ctx: 65536,
    description: "Standardmodell, freundlich und zuverlässig.",
  },
  {
    id: "meta-llama/llama-4-maverick",
    label: "Llama 4 Maverick",
    provider: "Meta",
    priceIn: 0.15,
    priceOut: 0.6,
    ctx: 131072,
    description: "Großes Modell für vielseitige Gespräche.",
  },
  {
    id: "meta-llama/llama-3.1-70b-instruct",
    label: "Llama 3.1 70B",
    provider: "Meta",
    priceIn: 0.4,
    priceOut: 0.4,
    ctx: 131072,
    description: "Sehr bewährtes Chat-Modell mit klaren Antworten.",
  },
] satisfies ModelDefinition[];

// Multimodale Modelle für Text + Bilder
const multimodalModels = [
  {
    id: "openrouter/andromeda-alpha",
    label: "Andromeda Alpha",
    provider: "OpenRouter",
    priceIn: 0.0,
    priceOut: 0.0,
    ctx: 32768,
    description: "Versteht Text und Bilder, erklärt Inhalte visuell.",
  },
  {
    id: "opengvlab/internvl3-78b",
    label: "InternVL3 78B",
    provider: "OpenGVLab",
    priceIn: 0.07,
    priceOut: 0.26,
    ctx: 32768,
    description: "Kann Bilder und Text gemeinsam analysieren.",
  },
] satisfies ModelDefinition[];

// Kreative und ungefilterte Modelle
const creativeModels = [
  {
    id: "venice/uncensored:free",
    label: "Venice Uncensored",
    provider: "Venice",
    priceIn: 0.0,
    priceOut: 0.0,
    ctx: 32768,
    description: "Redet frei und ungefiltert, ideal für ehrliche Gespräche.",
  },
  {
    id: "cognitivecomputations/dolphin-mistral-24b-venice-edition:free",
    label: "Dolphin Mistral Venice",
    provider: "Cognitive Computations",
    priceIn: 0.0,
    priceOut: 0.0,
    ctx: 65536,
    description: "Sehr freies Modell ohne starke Filter, kreativ und offen.",
  },
  {
    id: "arliai/qwq-32b-arliai-rpr-v1:free",
    label: "QwQ 32B Arliai",
    provider: "Arliai",
    priceIn: 0.0,
    priceOut: 0.0,
    ctx: 65536,
    description: "Kreatives Modell für Geschichten oder Rollenspiele.",
  },
] satisfies ModelDefinition[];

// Chat-Allrounder für vielseitige Gespräche
const chatModels = [
  {
    id: "deepseek/deepseek-chat-v3-0324:free",
    label: "Deepseek Chat V3",
    provider: "DeepSeek",
    priceIn: 0.0,
    priceOut: 0.0,
    ctx: 65536,
    description: "Redet natürlich, kann aber auch nachdenken, wenn nötig.",
  },
  {
    id: "tencent/hunyuan-a13b-instruct:free",
    label: "Hunyuan A13B",
    provider: "Tencent",
    priceIn: 0.0,
    priceOut: 0.0,
    ctx: 32768,
    description: "Allrounder für Gespräche und Erklärungen, ruhig und klar.",
  },
  {
    id: "z-ai/glm-4.5-air:free",
    label: "GLM 4.5 Air",
    provider: "Z-AI",
    priceIn: 0.0,
    priceOut: 0.0,
    ctx: 32768,
    description: "Leichtes Modell mit optionalem Denkmodus.",
  },
  {
    id: "tngtech/deepseek-r1t2-chimera:free",
    label: "Deepseek R1T2 Chimera",
    provider: "TNG Technology",
    priceIn: 0.0,
    priceOut: 0.0,
    ctx: 65536,
    description: "Kombiniert zwei Denkmodelle, gut bei Problemlösungen.",
  },
] satisfies ModelDefinition[];

// Günstige spezialisierte Modelle
const budgetModels = [
  {
    id: "arcee-ai/afm-4.5b",
    label: "AFM 4.5B",
    provider: "Arcee AI",
    priceIn: 0.05,
    priceOut: 0.15,
    ctx: 16384,
    description: "Kleines, stabiles Modell für einfache Aufgaben.",
  },
  {
    id: "openai/gpt-oss-20b",
    label: "GPT OSS 20B",
    provider: "OpenAI",
    priceIn: 0.03,
    priceOut: 0.14,
    ctx: 32768,
    description: "Offenes OpenAI-Modell, vielseitig und stabil.",
  },
  {
    id: "mistralai/mistral-nemo",
    label: "Mistral Nemo",
    provider: "Mistral",
    priceIn: 0.02,
    priceOut: 0.04,
    ctx: 128000,
    description: "Sehr günstig und flink im Gespräch.",
  },
  {
    id: "mistralai/mistral-7b-instruct-v0.3",
    label: "Mistral 7B",
    provider: "Mistral",
    priceIn: 0.03,
    priceOut: 0.05,
    ctx: 32768,
    description: "Kleines, schnelles Modell für kurze Chats.",
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
    id: "quick-free",
    badge: "Schnell & Kostenlos",
    title: "⚡ Schnelle Kostenlose",
    description: "Leichte, blitzschnelle Modelle für alltägliche Chats und schnelle Antworten",
    models: quickFreeModels,
  },
  {
    id: "powerful-free",
    badge: "Stark & Kostenlos",
    title: "🚀 Starke Kostenlose",
    description: "Große, leistungsstarke Modelle für komplexe Aufgaben – ohne Kosten",
    models: powerfulFreeModels,
  },
  {
    id: "chat",
    badge: "Chat",
    title: "💬 Chat-Allrounder",
    description: "Vielseitige Gesprächsmodelle für natürliche Unterhaltungen",
    models: chatModels,
  },
  {
    id: "multimodal",
    badge: "Multimodal",
    title: "🖼️ Multimodale Modelle",
    description: "Verstehen Text und Bilder gemeinsam – für visuelle Aufgaben",
    models: multimodalModels,
  },
  {
    id: "creative",
    badge: "Kreativ",
    title: "🎭 Kreativ & Uncensored",
    description: "Freie, ungefilterte Modelle für kreative Geschichten und Rollenspiele",
    models: creativeModels,
  },
  {
    id: "budget",
    badge: "Budget",
    title: "💰 Budget-Spezialist",
    description: "Günstige, spezialisierte Modelle für gezielte Aufgaben",
    models: budgetModels,
  },
  {
    id: "premium",
    badge: "Premium",
    title: "🏆 Premium Modelle",
    description: "Top-Qualität für anspruchsvolle Aufgaben – beste Leistung zu fairen Preisen",
    models: premiumModels,
  },
];

export default function MobileModels() {
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
    <div className="mobile-models-container flex h-full flex-col gap-4 px-4 pb-16 pt-6 text-[var(--color-text-primary)] sm:px-6 lg:px-8">
      {/* Mobile-optimized search bar */}
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
              className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between touch-target"
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
                    isMobile={true}
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
