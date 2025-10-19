import { ArrowRight, Filter, RotateCcw, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useStudio } from "../app/state/StudioContext";
import { RoleCard } from "../components/studio/RoleCard";
import { Button } from "../components/ui";
import { useToasts } from "../components/ui/toast/ToastsProvider";
import type { Role } from "../data/roles";
import { loadRoles } from "../data/roles";

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
  const toasts = useToasts();

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
        toasts.push({
          kind: "error",
          title: "Fehler beim Laden zusätzlicher Rollen",
          message: error instanceof Error ? error.message : String(error),
        });
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
  }, [roles, toasts]);

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
    return [...availableRoles].sort((a, b) => {
      const categoryA = normalizeCategory(a.category);
      const categoryB = normalizeCategory(b.category);

      const indexA = CATEGORY_ORDER.indexOf(categoryA);
      const indexB = CATEGORY_ORDER.indexOf(categoryB);

      if (indexA !== indexB) {
        const orderA = indexA === -1 ? CATEGORY_ORDER.length : indexA;
        const orderB = indexB === -1 ? CATEGORY_ORDER.length : indexB;
        return orderA - orderB;
      }

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
        <div className="space-y-2">
          <span className="brand-chip w-fit">Studio</span>
          <h1 className="text-balance text-xl font-semibold text-text-0 sm:text-2xl">
            Rollen-Studio
          </h1>
          <p className="mt-1 text-pretty text-sm leading-7 text-text-1 sm:text-base">
            Wähle eine Stimme für Disa AI. Nutze Suche oder Filter, um schneller passende Rollen zu
            entdecken.
          </p>
        </div>

        {activeRole ? (
          <aside
            className="brand-panel card-depth flex items-start justify-between gap-4 px-5 py-4 text-xs text-text-1"
            aria-label="Aktive Rolle"
          >
            <div className="space-y-1">
              <span className="brand-chip w-fit">Aktiv</span>
              <p className="text-xs font-semibold uppercase tracking-wide text-text-1">
                Aktive Rolle
              </p>
              <p className="text-sm font-semibold text-text-0 sm:text-base">{activeRole.name}</p>
              <p className="text-xs leading-5 text-text-1 sm:text-sm">
                {summariseRole(activeRole)}
              </p>
            </div>
            <Button
              variant="ghost"
              onClick={handleResetRole}
              aria-label="Aktive Rolle zurücksetzen"
            >
              <RotateCcw className="h-3.5 w-3.5 text-text-1" />
              Zurücksetzen
            </Button>
          </aside>
        ) : null}

        <div className="space-y-3">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-1"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Rollen durchsuchen …"
                className="min-h-[48px] w-full rounded-lg border border-border bg-surface-1 py-2.5 pl-10 pr-12 text-sm text-text-0 placeholder:text-text-1 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand"
                aria-label="Rollen durchsuchen"
              />
              {searchTerm ? (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClearSearch}
                  className="absolute right-2 top-1/2 h-10 w-10 -translate-y-1/2 text-text-1"
                  aria-label="Suche zurücksetzen"
                >
                  <X className="h-4 w-4" />
                </Button>
              ) : null}
            </div>
            <div className="flex items-center gap-3 text-xs text-text-1">
              <Filter className="hidden h-5 w-5 text-text-1 sm:block" />
              <span className="rounded-full border border-border bg-surface-1 px-4 py-2 text-text-1">
                {totalMatchCount} von {orderedRoles.length} Rollen sichtbar
              </span>
            </div>
          </div>

          <div className="-mx-2 flex items-center gap-3 overflow-x-auto pb-1">
            <Button
              variant={selectedCategory === "all" ? "secondary" : "ghost"}
              onClick={() => handleSelectCategory("all")}
            >
              Alle
            </Button>
            {CATEGORY_ORDER.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "secondary" : "ghost"}
                onClick={() => handleSelectCategory(category)}
                aria-pressed={selectedCategory === category}
              >
                {category}
                <span className="ml-1 text-text-1">
                  {categoriesInUse[category] ? `· ${categoriesInUse[category]}` : ""}
                </span>
              </Button>
            ))}
          </div>
        </div>
      </header>

      <div className="space-y-7 pb-8" data-testid="role-card-grid">
        {isLoadingRoles && orderedRoles.length === 0 ? (
          <div className="flex items-center justify-center rounded-lg border border-border bg-surface-1 p-6 text-sm text-text-1">
            Rollen werden geladen ...
          </div>
        ) : null}
        {totalMatchCount === 0 ? (
          <div className="space-y-3 rounded-lg border border-border bg-surface-1 p-6 text-center text-sm text-text-1">
            <p>Keine Rollen gefunden.</p>
            <p className="text-xs text-text-1">
              Passe die Filter an oder lösche den Suchbegriff, um alle Rollen erneut zu sehen.
            </p>
          </div>
        ) : (
          resolvedCategoriesToRender.map((category) => {
            const roles = groupedRoles[category];
            if (!roles || roles.length === 0) return null;

            return (
              <section
                key={category}
                className="space-y-4 sm:space-y-5"
                aria-labelledby={`category-${category}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <h2
                    id={`category-${category}`}
                    className="text-balance text-sm font-semibold text-text-1 sm:text-base"
                  >
                    {category}
                    <span className="ml-2 text-xs font-medium text-text-1 sm:text-[13px]">
                      {roles.length}
                    </span>
                  </h2>
                  {selectedCategory !== "all" ? (
                    <Button variant="link" onClick={() => handleSelectCategory("all")}>
                      Filter aufheben
                    </Button>
                  ) : null}
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {roles.map((role) => (
                    <RoleCard
                      key={role.id}
                      title={role.name}
                      description={summariseRole(role)}
                      badge={role.category}
                      isActive={activeRole?.id === role.id}
                      onClick={() => setActiveRole(role)}
                      aria-label={`Rolle ${role.name} auswählen`}
                      data-testid={`role-card-${role.id}`}
                    />
                  ))}
                </div>
              </section>
            );
          })
        )}
      </div>

      <div className="mt-5 flex flex-col gap-2.5">
        <Button onClick={handleNavigateToChat}>
          <span className="text-pretty">Zum Chat mit aktueller Rolle</span>
          <ArrowRight className="h-4 w-4 text-text-1 sm:h-5 sm:w-5" aria-hidden="true" />
        </Button>
        <Button
          variant="outline"
          onClick={handleResetRole}
          disabled={!activeRole}
          aria-disabled={!activeRole}
        >
          <RotateCcw className="h-4 w-4 text-text-1 sm:h-5 sm:w-5" aria-hidden="true" />
          <span>Rolle zurücksetzen</span>
        </Button>
      </div>
    </div>
  );
}

function GamesTab() {
  const navigate = useNavigate();

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
    void navigate("/chat", { state: { gameId } });
  };

  return (
    <div className="flex h-full flex-col gap-7 px-5 pb-8 pt-5 text-text-0">
      <header>
        <h1 className="text-balance text-xl font-semibold text-text-0 sm:text-2xl">Spiele</h1>
        <p className="mt-1 text-pretty text-sm leading-7 text-text-1 sm:text-base">
          Wähle ein Spiel aus, um eine neue Spielrunde zu starten.
        </p>
      </header>

      <section aria-label="Verfügbare Spiele">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {games.map((game) => (
            <article
              key={game.id}
              className="flex min-h-[96px] cursor-pointer flex-col gap-2.5 rounded-lg border border-border bg-surface-1 p-3 transition-all duration-200 hover:border-brand sm:p-4"
              onClick={() => handleGameStart(game.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleGameStart(game.id);
                }
              }}
              aria-label={`Spiel ${game.title} starten`}
            >
              <h2 className="text-balance text-sm font-semibold text-text-1 sm:text-base">
                {game.title}
              </h2>
              <p className="text-pretty text-sm leading-6 text-text-1 sm:text-base">
                {game.description}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default function Studio() {
  const [activeTab, setActiveTab] = useState<"roles" | "styles">("roles");

  return (
    <div className="flex h-full flex-col bg-transparent text-text-0">
      <nav aria-label="Studio Navigation">
        <div className="flex items-center gap-2 px-5 pt-4" role="tablist">
          <Button
            variant={activeTab === "roles" ? "secondary" : "ghost"}
            onClick={() => setActiveTab("roles")}
            role="tab"
            aria-selected={activeTab === "roles"}
            aria-controls="roles-panel"
            id="roles-tab"
          >
            Rollen
          </Button>
          <Button
            variant={activeTab === "styles" ? "secondary" : "ghost"}
            onClick={() => setActiveTab("styles")}
            role="tab"
            aria-selected={activeTab === "styles"}
            aria-controls="styles-panel"
            id="styles-tab"
          >
            Spiele
          </Button>
        </div>
      </nav>
      <div className="mt-2 flex flex-1 flex-col overflow-y-auto">
        <div
          role="tabpanel"
          id="roles-panel"
          aria-labelledby="roles-tab"
          hidden={activeTab !== "roles"}
        >
          {activeTab === "roles" && <RolesTab />}
        </div>
        <div
          role="tabpanel"
          id="styles-panel"
          aria-labelledby="styles-tab"
          hidden={activeTab !== "styles"}
        >
          {activeTab === "styles" && <GamesTab />}
        </div>
      </div>
    </div>
  );
}
