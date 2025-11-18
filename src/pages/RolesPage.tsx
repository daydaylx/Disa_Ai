import { useMemo, useState } from "react";

import { Button, FilterChip, RoleCard, SectionHeader, Typography } from "@/ui";

// Mock data für Rollen - würde normalerweise aus API kommen
interface Role {
  id: string;
  title: string;
  description: string;
  tags: string[];
  usageCount: number;
  modelsCount: number;
  isDefault?: boolean;
  isActive?: boolean;
  category: string;
}

const mockRoles: Role[] = [
  {
    id: "adult-roleplay",
    title: "Adult Roleplay",
    description: "Erweiterte Rollenspiel-Funktionen für erwachsene Nutzer mit kreativen Szenarien.",
    tags: ["roleplay", "nsfw", "creative"],
    usageCount: 45,
    modelsCount: 3,
    isDefault: false,
    isActive: false,
    category: "Alltag",
  },
  {
    id: "berufsberater",
    title: "Berufsberater",
    description: "Professionelle Beratung für Karriereentscheidungen und berufliche Entwicklung.",
    tags: ["career", "business", "professional"],
    usageCount: 23,
    modelsCount: 2,
    isDefault: true,
    isActive: true,
    category: "Business",
  },
  {
    id: "creative-writer",
    title: "Creative Writer",
    description: "Kreative Schreibunterstützung für Geschichten, Gedichte und literarische Texte.",
    tags: ["creative", "writing", "literature"],
    usageCount: 67,
    modelsCount: 4,
    isDefault: false,
    isActive: false,
    category: "Kreativ",
  },
  {
    id: "code-assistant",
    title: "Code Assistant",
    description: "Programmierhilfe für verschiedene Programmiersprachen und Entwicklungsaufgaben.",
    tags: ["coding", "programming", "development"],
    usageCount: 89,
    modelsCount: 5,
    isDefault: false,
    isActive: true,
    category: "Technisch",
  },
  {
    id: "language-tutor",
    title: "Language Tutor",
    description: "Sprachunterricht und Übersetzungshilfe für verschiedene Sprachen.",
    tags: ["language", "education", "translation"],
    usageCount: 34,
    modelsCount: 3,
    isDefault: false,
    isActive: false,
    category: "Bildung",
  },
  {
    id: "fitness-coach",
    title: "Fitness Coach",
    description: "Personal Trainer für Fitness, Ernährung und gesunden Lebensstil.",
    tags: ["fitness", "health", "lifestyle"],
    usageCount: 12,
    modelsCount: 2,
    isDefault: false,
    isActive: false,
    category: "Gesundheit",
  },
  {
    id: "business-consultant",
    title: "Business Consultant",
    description: "Strategische Beratung für Unternehmen und Geschäftsentscheidungen.",
    tags: ["business", "strategy", "consulting"],
    usageCount: 18,
    modelsCount: 3,
    isDefault: false,
    isActive: false,
    category: "Business",
  },
  {
    id: "therapist",
    title: "Therapeut",
    description: "Emotionale Unterstützung und therapeutische Gesprächsführung.",
    tags: ["therapy", "mental-health", "support"],
    usageCount: 56,
    modelsCount: 2,
    isDefault: false,
    isActive: false,
    category: "Gesundheit",
  },
];

// Kategorien mit Badge-Zahlen
const categories = [
  { name: "Alltag", count: 1 },
  { name: "Business", count: 2 },
  { name: "Kreativ", count: 1 },
  { name: "Technisch", count: 1 },
  { name: "Bildung", count: 1 },
  { name: "Gesundheit", count: 2 },
];

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Optimized role filtering with useMemo for better performance
  const filteredRoles = useMemo(() => {
    const searchLower = searchQuery.toLowerCase();

    return roles.filter((role) => {
      const matchesCategory = activeCategory === "All" || role.category === activeCategory;
      const matchesSearch =
        role.title.toLowerCase().includes(searchLower) ||
        role.description.toLowerCase().includes(searchLower) ||
        role.tags.some((tag) => tag.toLowerCase().includes(searchLower));

      return matchesCategory && matchesSearch;
    });
  }, [roles, activeCategory, searchQuery]);

  const handleActivateRole = (roleId: string) => {
    setRoles((prev) =>
      prev.map((role) => (role.id === roleId ? { ...role, isActive: !role.isActive } : role)),
    );
  };

  const getCategoryCount = (categoryName: string) => {
    if (categoryName === "All") return roles.length;
    return roles.filter((role) => role.category === categoryName).length;
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Personas"
        title="Rollen"
        description="Aktiviere vorkonfigurierte Assistent:innen oder erstelle eigene Templates"
      />

      <div className="space-y-3 rounded-2xl border border-[var(--glass-border-soft)] bg-[var(--surface-card)]/70 p-3 shadow-[var(--shadow-sm)]">
        <input
          type="text"
          placeholder="Rollen durchsuchen"
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-[var(--glass-border-soft)] bg-[var(--surface)] px-3 py-2 text-[var(--text-primary)]"
        />

        <div className="space-y-2">
          <Typography
            variant="body-xs"
            className="uppercase tracking-[0.16em] text-[var(--text-muted)]"
          >
            Kategorien
          </Typography>
          <div className="flex flex-wrap gap-1.5">
            <FilterChip
              count={getCategoryCount("All")}
              isActive={activeCategory === "All"}
              onClick={() => setActiveCategory("All")}
            >
              Alle
            </FilterChip>
            {categories.map((category) => (
              <FilterChip
                key={category.name}
                count={getCategoryCount(category.name)}
                isActive={activeCategory === category.name}
                onClick={() => setActiveCategory(category.name)}
              >
                {category.name}
              </FilterChip>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-[var(--text-secondary)]">
          <span>
            {filteredRoles.length} Rollen gefunden
            {searchQuery && ` für "${searchQuery}"`}
            {activeCategory !== "All" && ` in "${activeCategory}"`}
          </span>
          {(activeCategory !== "All" || searchQuery) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setActiveCategory("All");
                setSearchQuery("");
              }}
            >
              Filter zurücksetzen
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4" data-testid="roles-grid">
        {filteredRoles.map((role) => (
          <RoleCard
            key={role.id}
            role={{
              id: role.id,
              name: role.title,
              description: role.description,
              tags: role.tags,
              systemPrompt: "",
              allowedModels: Array(role.modelsCount).fill(""),
              usage: {
                count: role.usageCount,
                lastAccess: null,
              },
              metadata: {
                isBuiltIn: role.isDefault || false,
                createdAt: new Date(),
                updatedAt: new Date(),
                version: "1.0.0",
              },
              styleHints: {
                typographyScale: 1,
                borderRadius: 8,
                accentColor: "var(--color-primary-500)",
              },
              isFavorite: false,
              lastUsed: null,
              performance: {
                priority: "medium" as const,
              },
            }}
            isActive={role.isActive}
            onActivate={() => handleActivateRole(role.id)}
            onDeactivate={() => handleActivateRole(role.id)}
          />
        ))}
      </div>

      {filteredRoles.length === 0 && (
        <div className="rounded-3xl border border-[var(--glass-border-soft)] bg-[var(--surface-card)]/70 p-10 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface)]">
            👥
          </div>
          <Typography variant="body-lg" className="font-semibold">
            Keine Rollen gefunden
          </Typography>
          <Typography variant="body-sm" className="text-[var(--text-secondary)]">
            {searchQuery
              ? `Keine Ergebnisse für "${searchQuery}"`
              : activeCategory !== "All"
                ? `Keine Rollen in der Kategorie "${activeCategory}"`
                : "Versuche es mit anderen Filtereinstellungen"}
          </Typography>
        </div>
      )}
    </div>
  );
}
