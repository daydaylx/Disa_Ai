import { ArrowRight, Filter, RotateCcw, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useStudio } from "../app/state/StudioContext";
import { RoleCard } from "../components/studio/RoleCard";
import { Button } from "../components/ui";
import { useToasts } from "../components/ui/toast/ToastsProvider";
import type { Role } from "../data/roles";
import { loadRoles } from "../data/roles";
import { useTranslation } from "../hooks/useTranslation";

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
  if (role.description) return role.description.trim();

  const normalized = role.systemPrompt.replace(/\s+/g, " ").trim();
  if (!normalized) return "Kein Beschreibungstext vorhanden.";

  return normalized;
}

function RolesTab() {
  const { roles, activeRole, setActiveRole } = useStudio();
  const { t } = useTranslation();
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
    <div className="px-page-x pb-page-y pt-page-y flex h-full flex-col">
      <header className="mb-section-gap space-y-stack-gap">
        <div className="space-y-2">
          <span className="brand-chip w-fit">{t.studio.chip}</span>
          <h1 className="text-text-0 text-balance text-xl font-semibold sm:text-2xl">
            {t.studio.title}
          </h1>
          <p className="text-text-1 mt-1 text-pretty text-sm leading-7 sm:text-base">
            {t.studio.description}
          </p>
        </div>

        {activeRole ? (
          <aside
            className="brand-panel card-depth text-text-1 flex items-start justify-between gap-4 px-5 py-4 text-xs"
            aria-label={t.studio.activeRole.label}
          >
            <div className="space-y-1">
              <span className="brand-chip w-fit">{t.studio.activeRole.chip}</span>
              <p className="text-text-1 text-xs font-semibold uppercase tracking-wide">
                {t.studio.activeRole.label}
              </p>
              <p className="text-text-0 text-sm font-semibold sm:text-base">{activeRole.name}</p>
              <p className="text-text-1 whitespace-pre-line text-xs leading-5 sm:text-sm">
                {summariseRole(activeRole)}
              </p>
            </div>
            <Button
              variant="ghost"
              onClick={handleResetRole}
              aria-label={t.studio.activeRole.resetAria}
            >
              <RotateCcw className="text-text-1 h-3.5 w-3.5" />
              {t.studio.activeRole.reset}
            </Button>
          </aside>
        ) : null}

        <div className="space-y-3">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search
                className="text-text-1 pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder={t.studio.search.placeholder}
                className="border-border bg-surface-1 text-text-0 placeholder:text-text-1 focus:border-brand focus:ring-brand min-h-[48px] w-full rounded-lg border py-2.5 pl-10 pr-12 text-sm focus:outline-none focus:ring-2"
                aria-label={t.studio.search.ariaLabel}
              />
              {searchTerm ? (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClearSearch}
                  className="text-text-1 absolute right-2 top-1/2 h-10 w-10 -translate-y-1/2"
                  aria-label={t.studio.search.clearAria}
                >
                  <X className="h-4 w-4" />
                </Button>
              ) : null}
            </div>
            <div className="text-text-1 flex items-center gap-3 text-xs">
              <Filter className="text-text-1 hidden h-5 w-5 sm:block" />
              <span className="border-border bg-surface-1 text-text-1 rounded-full border px-4 py-2">
                {t.studio.filter.visible(totalMatchCount, orderedRoles.length)}
              </span>
            </div>
          </div>

          <div className="gap-inline-gap flex items-center overflow-x-auto pb-1">
            <Button
              variant={selectedCategory === "all" ? "secondary" : "ghost"}
              onClick={() => handleSelectCategory("all")}
            >
              {t.studio.filter.all}
            </Button>
            {CATEGORY_ORDER.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "secondary" : "ghost"}
                onClick={() => handleSelectCategory(category)}
                aria-pressed={selectedCategory === category}
              >
                {category}
                <span className="text-text-1 ml-1">
                  {categoriesInUse[category] ? `· ${categoriesInUse[category]}` : ""}
                </span>
              </Button>
            ))}
          </div>
        </div>
      </header>

      <div className="space-y-section-gap pb-page-y" data-testid="role-card-grid">
        {isLoadingRoles && orderedRoles.length === 0 ? (
          <div className="border-border bg-surface-1 text-text-1 flex items-center justify-center rounded-lg border p-6 text-sm">
            {t.studio.loading}
          </div>
        ) : null}
        {totalMatchCount === 0 ? (
          <div className="border-border bg-surface-1 text-text-1 space-y-3 rounded-lg border p-6 text-center text-sm">
            <p>{t.studio.noResults}</p>
            <p className="text-text-1 text-xs">{t.studio.noResultsHint}</p>
          </div>
        ) : (
          resolvedCategoriesToRender.map((category) => {
            const roles = groupedRoles[category];
            if (!roles || roles.length === 0) return null;

            return (
              <section
                key={category}
                className="space-y-stack-gap"
                aria-labelledby={`category-${category}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <h2
                    id={`category-${category}`}
                    className="text-text-1 text-balance text-sm font-semibold sm:text-base"
                  >
                    {category}
                    <span className="text-text-1 ml-2 text-xs font-medium sm:text-[13px]">
                      {roles.length}
                    </span>
                  </h2>
                  {selectedCategory !== "all" ? (
                    <Button variant="link" onClick={() => handleSelectCategory("all")}>
                      {t.studio.filter.clearFilter}
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
                      defaultExpanded={activeRole?.id === role.id}
                      aria-label={t.studio.actions.selectRole(role.name)}
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
          <span className="text-pretty">{t.studio.actions.goToChat}</span>
          <ArrowRight className="text-text-1 h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
        </Button>
        <Button
          variant="outline"
          onClick={handleResetRole}
          disabled={!activeRole}
          aria-disabled={!activeRole}
        >
          <RotateCcw className="text-text-1 h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
          <span>{t.studio.actions.resetRole}</span>
        </Button>
      </div>
    </div>
  );
}

function GamesTab() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const games = [
    {
      id: "wer-bin-ich" as const,
      ...t.games.list["wer-bin-ich"],
    },
    {
      id: "quiz" as const,
      ...t.games.list.quiz,
    },
    {
      id: "zwei-wahrheiten-eine-lüge" as const,
      ...t.games.list["zwei-wahrheiten-eine-lüge"],
    },
    {
      id: "black-story" as const,
      ...t.games.list["black-story"],
    },
    {
      id: "film-oder-fake" as const,
      ...t.games.list["film-oder-fake"],
    },
  ];

  const handleGameStart = (gameId: (typeof games)[number]["id"]) => {
    void navigate("/chat", { state: { gameId } });
  };

  return (
    <div className="gap-section-gap px-page-x pb-page-y pt-page-y text-text-0 flex h-full flex-col">
      <header>
        <h1 className="text-text-0 text-balance text-xl font-semibold sm:text-2xl">
          {t.games.title}
        </h1>
        <p className="text-text-1 mt-1 text-pretty text-sm leading-7 sm:text-base">
          {t.games.description}
        </p>
      </header>

      <section aria-label={t.games.sectionLabel}>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {games.map((game) => (
            <article
              key={game.id}
              className="border-border bg-surface-1 hover:border-brand flex min-h-[96px] cursor-pointer flex-col gap-2.5 rounded-lg border p-3 transition-all duration-200 sm:p-4"
              onClick={() => handleGameStart(game.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleGameStart(game.id);
                }
              }}
              aria-label={t.games.startGame(game.title)}
            >
              <h2 className="text-text-1 text-balance text-sm font-semibold sm:text-base">
                {game.title}
              </h2>
              <p className="text-text-1 text-pretty text-sm leading-6 sm:text-base">
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
    <div className="text-text-0 flex h-full flex-col bg-transparent">
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
