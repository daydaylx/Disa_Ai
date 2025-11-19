import { useMemo, useState } from "react";

import {
  Button,
  FilterChip,
  GlassCard,
  RoleCard,
  SectionHeader,
  Typography,
} from "@/ui";

import { cn } from "../lib/utils";

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
    <>
      <SectionHeader
        title="Rollen"
        subtitle="Nutze kuratierte Profile für verschiedene Aufgaben"
      />
      {/* Such-Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Rollen durchsuchen..."
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
          className="w-full rounded-full bg-surface-panel/80 p-4"
        />
      </div>

      {/* Categories als Filter-Chips mit Badge-Zahlen */}
      <div className="space-y-3">
        <Typography
          variant="body-xs"
          className="text-[var(--text-muted)] uppercase tracking-[0.16em]"
        >
          Kategorien
        </Typography>

        <div className="flex flex-wrap gap-2">
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

      {/* Results Info */}
      <div className="flex items-center justify-between">
        <Typography variant="body-sm" className="text-[var(--text-secondary)]">
          {filteredRoles.length} Rollen gefunden
          {searchQuery && ` für "${searchQuery}"`}
          {activeCategory !== "All" && ` in "${activeCategory}"`}
        </Typography>

        {(activeCategory !== "All" || searchQuery) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setActiveCategory("All");
              setSearchQuery("");
            }}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            Filter zurücksetzen
          </Button>
        )}
      </div>

      {/* Glow Card Grid */}
      <div
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 glow-card-grid"
        data-testid="roles-grid"
      >
        {filteredRoles.map((role) => (
          <GlassCard key={role.id}>
            <RoleCard
              role={{
                id: role.id,
                name: role.title,
                description: role.description,
              }}
              isActive={role.isActive}
              onActivate={() => handleActivateRole(role.id)}
              onDeactivate={() => handleActivateRole(role.id)}
            />
          </GlassCard>
        ))}
      </div>

      {/* Empty State */}
      {filteredRoles.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[var(--surface)] flex items-center justify-center">
            <span className="text-2xl">👥</span>
          </div>
          <Typography
            variant="body-lg"
            className="text-[var(--text-primary)] font-medium mb-2"
            aria-label="Roles page empty state heading"
          >
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
    </>
  );
}
