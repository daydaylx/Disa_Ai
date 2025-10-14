import { ArrowRight, Filter, RotateCcw, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useStudio } from "../app/state/StudioContext";
import { RoleCard, type RoleTint } from "../components/studio/RoleCard";
import type { Role } from "../data/roles";
import { loadRoles } from "../data/roles";
import type { GlassTint } from "../lib/theme/glass";
import { FRIENDLY_TINTS } from "../lib/theme/glass";
import { cn } from "../lib/utils";

// Neon-inspirierte Gradient-Palette als Fallback
const STATIC_CATEGORY_TINTS: GlassTint[] = [
  {
    from: "hsla(265, 88%, 64%, 0.62)",
    to: "hsla(188, 92%, 58%, 0.42)",
  },
  {
    from: "hsla(52, 92%, 62%, 0.58)",
    to: "hsla(138, 88%, 58%, 0.38)",
  },
  {
    from: "hsla(320, 90%, 65%, 0.58)",
    to: "hsla(260, 88%, 60%, 0.42)",
  },
  {
    from: "hsla(185, 90%, 60%, 0.6)",
    to: "hsla(45, 92%, 62%, 0.4)",
  },
  {
    from: "hsla(110, 90%, 58%, 0.58)",
    to: "hsla(24, 88%, 58%, 0.4)",
  },
  {
    from: "hsla(290, 92%, 64%, 0.6)",
    to: "hsla(200, 90%, 60%, 0.42)",
  },
];

const CATEGORY_ORDER = [
  "Alltag",
  "Business & Karriere",
  "Kreativ & Unterhaltung",
  "Lernen & Bildung",
  "Leben & Familie",
  "Experten & Beratung",
  "Erwachsene",
  "Spezial",
] as const;

type CategoryKey = (typeof CATEGORY_ORDER)[number];

// Removed unused ROLE_TINTS and RoleVisualConfig - now using useGlassPalette for consistent theming
// const _ROLE_TINTS: Record<string, RoleVisualConfig> = {
//   neutral: { tint: { from: "hsl(210 90% 60% / 0.22)", to: "hsl(50 95% 55% / 0.22)" } },
//   email_professional: { tint: { from: "hsl(195 100% 55% / 0.22)", to: "hsl(245 90% 60% / 0.22)" } },
//   sarcastic_direct: { tint: { from: "hsl(160 85% 45% / 0.22)", to: "hsl(190 85% 50% / 0.22)" } },
//   songwriter: { tint: { from: "hsl(30 95% 55% / 0.22)", to: "hsl(345 90% 60% / 0.22)" } },
//   creative_writer: { tint: { from: "hsl(265 90% 62% / 0.22)", to: "hsl(320 90% 62% / 0.22)" } },
// };

const DEFAULT_TINT: RoleTint = FRIENDLY_TINTS[0] ?? {
  from: "hsla(262, 82%, 74%, 0.78)",
  to: "hsla(200, 87%, 68%, 0.55)",
};

const FALLBACK_CATEGORY: CategoryKey = "Spezial";

function normalizeCategory(category?: string): CategoryKey {
  if (!category) return FALLBACK_CATEGORY;
  return CATEGORY_ORDER.includes(category as CategoryKey)
    ? (category as CategoryKey)
    : FALLBACK_CATEGORY;
}

function summariseRole(role: Role): string {
  if (role.description) return role.description;

  const normalized = role.systemPrompt.replace(/\s+/g, " ").trim();
  if (!normalized) return "Kein Beschreibungstext vorhanden.";

  const [firstSentence] = normalized.split(/(?<=[.!?])\s+/);
  if (!firstSentence) return normalized.slice(0, 140);

  const summary = firstSentence.trim();
  return summary.length > 160 ? `${summary.slice(0, 157)}…` : summary;
}

function RolesTab() {
  const { roles, activeRole, setActiveRole } = useStudio();
  const [roleList, setRoleList] = useState<Role[]>(roles);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"all" | CategoryKey>("all");
  const navigate = useNavigate();
  const staticPalette = STATIC_CATEGORY_TINTS;

  useEffect(() => {
    let mounted = true;
    const fetchRoles = async () => {
      try {
        setIsLoadingRoles(true);
        const loaded = await loadRoles();
        if (!mounted) return;
        const merged = [...roles, ...loaded];
        const uniqueById = merged.reduce<Role[]>((acc, entry) => {
          if (!acc.some((item) => item.id === entry.id)) {
            acc.push(entry);
          }
          return acc;
        }, []);
        setRoleList(uniqueById);
      } catch (error) {
        console.warn("Konnte zusätzliche Rollen nicht laden:", error);
        setRoleList(roles);
      } finally {
        if (mounted) {
          setIsLoadingRoles(false);
        }
      }
    };

    void fetchRoles();
    return () => {
      mounted = false;
    };
  }, [roles]);

  const availableRoles = useMemo(() => {
    if (activeRole && !roleList.some((role) => role.id === activeRole.id)) {
      return [...roleList, activeRole];
    }
    return roleList;
  }, [roleList, activeRole]);

  const handleResetRole = () => {
    setActiveRole(null);
  };

  const handleNavigateToChat = () => {
    void navigate("/chat");
  };

  const orderedRoles = useMemo(() => {
    // Sortiere Rollen nach optimierten Kategorien für bessere Benutzerführung
    return [...availableRoles].sort((a, b) => {
      const categoryA = normalizeCategory(a.category);
      const categoryB = normalizeCategory(b.category);

      const indexA = CATEGORY_ORDER.indexOf(categoryA);
      const indexB = CATEGORY_ORDER.indexOf(categoryB);

      // Kategorien sortieren
      if (indexA !== indexB) {
        const orderA = indexA === -1 ? CATEGORY_ORDER.length : indexA;
        const orderB = indexB === -1 ? CATEGORY_ORDER.length : indexB;
        return orderA - orderB;
      }

      // Innerhalb der Kategorie alphabetisch sortieren
      return a.name.localeCompare(b.name);
    });
  }, [availableRoles]);

  const filteredRoles = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    return orderedRoles.filter((role) => {
      const category = normalizeCategory(role.category);
      const matchesCategory = selectedCategory === "all" ? true : category === selectedCategory;
      if (!matchesCategory) return false;
      if (!normalizedSearch) return true;
      const haystack = `${role.name} ${summariseRole(role)}`.toLowerCase();
      return haystack.includes(normalizedSearch);
    });
  }, [orderedRoles, searchTerm, selectedCategory]);

  const categoriesInUse = useMemo(() => {
    return filteredRoles.reduce<Record<CategoryKey, number>>(
      (acc, role) => {
        const category = normalizeCategory(role.category);
        acc[category] = (acc[category] ?? 0) + 1;
        return acc;
      },
      {} as Record<CategoryKey, number>,
    );
  }, [filteredRoles]);

  const categoryTints: Record<CategoryKey, GlassTint> = CATEGORY_ORDER.reduce(
    (acc, category, index) => {
      acc[category] = staticPalette[index % staticPalette.length] ?? DEFAULT_TINT;
      return acc;
    },
    {} as Record<CategoryKey, GlassTint>,
  );

  const resolvedCategoriesToRender =
    selectedCategory === "all" ? CATEGORY_ORDER : [selectedCategory];

  const totalMatchCount = filteredRoles.length;

  const groupedRoles = useMemo(() => {
    return filteredRoles.reduce<Record<CategoryKey, Role[]>>(
      (acc, role) => {
        const category = normalizeCategory(role.category);
        if (!acc[category]) acc[category] = [];
        acc[category].push(role);
        return acc;
      },
      {} as Record<CategoryKey, Role[]>,
    );
  }, [filteredRoles]);

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const handleSelectCategory = (categoryKey: "all" | CategoryKey) => {
    setSelectedCategory((current) => {
      if (current === categoryKey) {
        return "all";
      }
      return categoryKey;
    });
  };

  return (
    <div className="flex h-full flex-col px-5 pb-8 pt-5">
      <header className="mb-6 space-y-5">
        <div>
          <h2 className="text-balance text-xl font-semibold text-white sm:text-2xl">
            Rollen-Studio
          </h2>
          <p className="mt-1 text-pretty text-sm leading-7 text-white/70 sm:text-base">
            Wähle eine Stimme für Disa AI. Nutze Suche oder Filter, um schneller passende Rollen zu
            entdecken.
          </p>
        </div>

        {activeRole ? (
          <div className="border-white/12 bg-white/8 flex items-start justify-between gap-4 rounded-2xl border px-5 py-4 text-xs text-white/80">
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-white/45">
                Aktive Rolle
              </p>
              <p className="text-sm font-semibold text-white sm:text-base">{activeRole.name}</p>
              <p className="text-xs leading-5 text-white/60 sm:text-sm">
                {summariseRole(activeRole)}
              </p>
            </div>
            <button
              type="button"
              onClick={handleResetRole}
              className="hover:bg-white/12 inline-flex items-center gap-1 rounded-full border border-white/15 px-3 py-1.5 text-xs font-medium text-white/80 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              <RotateCcw className="h-3.5 w-3.5 text-white/75" />
              Zurücksetzen
            </button>
          </div>
        ) : null}

        <div className="space-y-3">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Rollen durchsuchen …"
                className="border-white/12 bg-white/6 min-h-[48px] w-full rounded-xl border py-2.5 pl-10 pr-12 text-sm text-white placeholder:text-white/40 focus:border-white/25 focus:outline-none focus:ring-2 focus:ring-white/25"
                aria-label="Rollen durchsuchen"
              />
              {searchTerm ? (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="border-white/12 absolute right-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border bg-white/10 text-white/70 transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35"
                  aria-label="Suche zurücksetzen"
                >
                  <X className="h-3.5 w-3.5 text-white/70" />
                </button>
              ) : null}
            </div>
            <div className="flex items-center gap-3 text-xs text-white/60">
              <Filter className="hidden h-5 w-5 text-white/40 sm:block" />
              <span className="border-white/12 bg-white/8 rounded-full border px-4 py-2 text-white/70">
                {totalMatchCount} von {orderedRoles.length} Rollen sichtbar
              </span>
            </div>
          </div>

          <div className="-mx-2 flex items-center gap-3 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => handleSelectCategory("all")}
              className={cn(
                "min-h-[48px] shrink-0 rounded-full px-4 py-3 text-sm font-medium transition",
                selectedCategory === "all"
                  ? "text-white shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"
                  : "text-white/70",
              )}
            >
              Alle
            </button>
            {CATEGORY_ORDER.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => handleSelectCategory(category)}
                className={cn(
                  "min-h-[48px] shrink-0 rounded-full px-4 py-3 text-sm font-medium transition",
                  selectedCategory === category
                    ? "text-white shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"
                    : "text-white/70",
                )}
                aria-pressed={selectedCategory === category}
              >
                {category}
                <span className="ml-1 text-white/60">
                  {categoriesInUse[category] ? `· ${categoriesInUse[category]}` : ""}
                </span>
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="space-y-7 pb-8" data-testid="role-card-grid">
        {isLoadingRoles && orderedRoles.length === 0 ? (
          <div className="glass-card flex items-center justify-center p-6 text-sm text-white/70">
            Rollen werden geladen ...
          </div>
        ) : null}
        {totalMatchCount === 0 ? (
          <div className="glass-card space-y-3 p-6 text-center text-sm text-white/70">
            <p>Keine Rollen gefunden.</p>
            <p className="text-xs text-white/50">
              Passe die Filter an oder lösche den Suchbegriff, um alle Rollen erneut zu sehen.
            </p>
          </div>
        ) : (
          resolvedCategoriesToRender.map((category) => {
            const roles = groupedRoles[category];
            if (!roles || roles.length === 0) return null;

            return (
              <section key={category} className="space-y-4 sm:space-y-5">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-balance text-sm font-semibold text-white/85 sm:text-base">
                    {category}
                    <span className="ml-2 text-xs font-medium text-white/55 sm:text-[13px]">
                      {roles.length}
                    </span>
                  </h3>
                  {selectedCategory !== "all" ? (
                    <button
                      type="button"
                      onClick={() => handleSelectCategory("all")}
                      className="text-xs text-white/60 underline-offset-4 transition hover:text-white/80 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                    >
                      Filter aufheben
                    </button>
                  ) : null}
                </div>
                <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
                  {roles.map((role) => {
                    const tint = categoryTints[category] ?? DEFAULT_TINT;
                    const accentColor = tint.from ?? "rgba(255, 255, 255, 0.28)";

                    return (
                      <RoleCard
                        key={role.id}
                        title={role.name}
                        description={summariseRole(role)}
                        badge={role.category}
                        tint={tint}
                        variant="minimal"
                        badgeStyle={{
                          borderColor: accentColor,
                          background: "transparent",
                        }}
                        badgeClassName="text-white/70 uppercase tracking-wide"
                        isActive={activeRole?.id === role.id}
                        onClick={() => setActiveRole(role)}
                        aria-label={`Rolle ${role.name} auswählen`}
                        data-testid={`role-card-${role.id}`}
                      />
                    );
                  })}
                </div>
              </section>
            );
          })
        )}
      </div>

      <div className="mt-5 flex flex-col gap-2.5">
        <button
          type="button"
          onClick={handleNavigateToChat}
          className="border-white/12 bg-white/6 hover:border-white/18 relative flex h-12 items-center justify-center gap-2 rounded-2xl border px-4 text-sm font-medium text-white transition-all duration-200 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/45 active:scale-[0.99] sm:h-14 sm:text-base"
        >
          <span className="text-pretty">Zum Chat mit aktueller Rolle</span>
          <ArrowRight className="h-4 w-4 text-white/75 sm:h-5 sm:w-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={handleResetRole}
          disabled={!activeRole}
          className="border-white/12 bg-white/6 hover:bg-white/9 hover:border-white/18 relative flex h-12 items-center justify-center gap-2 rounded-2xl border px-4 text-sm font-medium text-white/80 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 active:scale-[0.99] disabled:opacity-55 disabled:grayscale disabled:active:scale-100 sm:h-14 sm:text-base"
          aria-disabled={!activeRole}
        >
          <RotateCcw className="h-4 w-4 text-white/70 sm:h-5 sm:w-5" aria-hidden="true" />
          <span>Rolle zurücksetzen</span>
        </button>
      </div>
    </div>
  );
}

function GamesTab() {
  const navigate = useNavigate();

  // Define the games that will be displayed
  const games = [
    {
      id: "wer-bin-ich" as const,
      title: "Wer bin ich?",
      description: "Errate die von mir gedachte Entität in 20 Ja/Nein-Fragen",
    },
    {
      id: "quiz" as const,
      title: "Quiz",
      description: "Teste dein Wissen mit Multiple-Choice-Fragen",
    },
    {
      id: "zwei-wahrheiten-eine-lüge" as const,
      title: "Zwei Wahrheiten, eine Lüge",
      description: "Finde die falsche Aussage unter dreien",
    },
    {
      id: "black-story" as const,
      title: "Black Story",
      description: "Löse mysteriöse Szenarien durch Ja/Nein-Fragen",
    },
    {
      id: "film-oder-fake" as const,
      title: "Film oder Fake?",
      description: "Entscheide, ob Filmhandlungen echt oder erfunden sind",
    },
  ];

  const handleGameStart = (gameId: (typeof games)[number]["id"]) => {
    // Navigate to chat with the game
    void navigate("/chat", { state: { gameId } });
  };

  return (
    <div className="flex h-full flex-col gap-7 px-5 pb-8 pt-5 text-white">
      <div>
        <h2 className="text-balance text-xl font-semibold text-white sm:text-2xl">Spiele</h2>
        <p className="mt-1 text-pretty text-sm leading-7 text-white/70 sm:text-base">
          Wähle ein Spiel aus, um eine neue Spielrunde zu starten.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        {games.map((game) => (
          <div
            key={game.id}
            className="border-white/12 bg-white/6 hover:border-white/18 flex min-h-[120px] cursor-pointer flex-col gap-3 rounded-2xl border p-4 transition-all duration-200 hover:bg-white/10 sm:p-5"
            onClick={() => handleGameStart(game.id)}
          >
            <h3 className="text-balance text-sm font-semibold text-white/85 sm:text-base">
              {game.title}
            </h3>
            <p className="text-pretty text-sm leading-6 text-white/70 sm:text-base">
              {game.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Studio() {
  const [activeTab, setActiveTab] = useState<"roles" | "styles">("roles");

  return (
    <div className="flex h-full flex-col bg-transparent text-white">
      <div className="flex items-center gap-2 px-5 pt-4">
        <button
          type="button"
          onClick={() => setActiveTab("roles")}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35 ${
            activeTab === "roles"
              ? "border-white/18 border bg-white/10 text-white"
              : "hover:border-white/12 hover:bg-white/8 border border-transparent text-white/60"
          }`}
        >
          Rollen
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("styles")}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35 ${
            activeTab === "styles"
              ? "border-white/18 border bg-white/10 text-white"
              : "hover:border-white/12 hover:bg-white/8 border border-transparent text-white/60"
          }`}
        >
          Spiele
        </button>
      </div>
      <div className="mt-2 flex flex-1 flex-col overflow-y-auto">
        {activeTab === "roles" ? <RolesTab /> : <GamesTab />}
      </div>
    </div>
  );
}
