import { ArrowRight, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useStudio } from "../app/state/StudioContext";
import { RoleCard, type RoleTint } from "../components/studio/RoleCard";
import type { Role } from "../data/roles";
import { loadRoles } from "../data/roles";
import { useGlassPalette } from "../hooks/useGlassPalette";
import type { GlassTint } from "../lib/theme/glass";

// Removed unused ROLE_TINTS and RoleVisualConfig - now using useGlassPalette for consistent theming
// const _ROLE_TINTS: Record<string, RoleVisualConfig> = {
//   neutral: { tint: { from: "hsl(210 90% 60% / 0.22)", to: "hsl(50 95% 55% / 0.22)" } },
//   email_professional: { tint: { from: "hsl(195 100% 55% / 0.22)", to: "hsl(245 90% 60% / 0.22)" } },
//   sarcastic_direct: { tint: { from: "hsl(160 85% 45% / 0.22)", to: "hsl(190 85% 50% / 0.22)" } },
//   songwriter: { tint: { from: "hsl(30 95% 55% / 0.22)", to: "hsl(345 90% 60% / 0.22)" } },
//   creative_writer: { tint: { from: "hsl(265 90% 62% / 0.22)", to: "hsl(320 90% 62% / 0.22)" } },
// };

const DEFAULT_TINT: RoleTint = {
  from: "hsl(210 45% 55% / 0.20)",
  to: "hsl(250 60% 52% / 0.18)",
};

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
  const navigate = useNavigate();
  const palette = useGlassPalette();

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

  const orderedRoles = useMemo(() => {
    // Highlight the curated set first, keep remaining order for discoverability
    const featuredOrder = [
      "neutral",
      "email_professional",
      "sarcastic_direct",
      "songwriter",
      "creative_writer",
    ];
    return [...availableRoles].sort((a, b) => {
      const indexA = featuredOrder.indexOf(a.id);
      const indexB = featuredOrder.indexOf(b.id);
      if (indexA === -1 && indexB === -1) return 0;
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
  }, [availableRoles]);

  const handleResetRole = () => {
    setActiveRole(null);
  };

  const handleNavigateToChat = () => {
    void navigate("/chat");
  };

  // Kategorie-spezifische Farben für bessere Übersichtlichkeit
  const categoryTints: Record<string, GlassTint> = {
    Standard: {
      from: "hsl(210 80% 65% / 0.22)", // Helleres Blau
      to: "hsl(220 75% 70% / 0.22)",
    },
    Beruflich: {
      from: "hsl(180 80% 45% / 0.22)", // Teal
      to: "hsl(190 75% 50% / 0.22)",
    },
    Erwachsene: {
      from: "hsl(290 70% 50% / 0.22)", // Dunkelviolett
      to: "hsl(300 65% 55% / 0.22)",
    },
    Beratung: {
      from: "hsl(160 60% 50% / 0.22)", // Mintgrün
      to: "hsl(170 55% 55% / 0.22)",
    },
    Spezial: {
      from: "hsl(45 100% 50% / 0.22)", // Gold
      to: "hsl(55 95% 55% / 0.22)",
    },
    Experten: {
      from: "hsl(0 85% 55% / 0.22)", // Rot
      to: "hsl(15 80% 60% / 0.22)",
    },
    Kreativ: {
      from: "hsl(280 90% 60% / 0.22)", // Violett
      to: "hsl(300 85% 65% / 0.22)",
    },
    Lernen: {
      from: "hsl(40 95% 55% / 0.22)", // Gelb/Orange
      to: "hsl(50 90% 60% / 0.22)",
    },
    Persönlichkeit: {
      from: "hsl(330 90% 60% / 0.22)", // Pink
      to: "hsl(345 85% 65% / 0.22)",
    },
    Praktisch: {
      from: "hsl(120 85% 55% / 0.22)", // Grün
      to: "hsl(135 80% 60% / 0.22)",
    },
  };

  return (
    <div className="flex h-full flex-col px-5 pb-8 pt-5">
      <header className="mb-4">
        <h2 className="text-lg font-semibold text-white">Rollen-Studio</h2>
        <p className="mt-1 text-sm leading-6 text-white/70">
          Wähle eine Stimme für Disa AI. Die Karten sind mobile-first gestaltet – Tippen genügt.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-3 pb-8" data-testid="role-card-grid">
        {isLoadingRoles && orderedRoles.length === 0 ? (
          <div className="flex items-center justify-center rounded-2xl border border-white/[0.12] bg-white/[0.04] p-6 text-sm text-white/70">
            Rollen werden geladen ...
          </div>
        ) : null}
        {orderedRoles.map((role) => {
          // Use category-specific tint for better visual organization
          const categoryKey = role.category || "Standard";
          const tint = categoryTints[categoryKey] ?? (DEFAULT_TINT as GlassTint);
          return (
            <RoleCard
              key={role.id}
              title={role.name}
              description={summariseRole(role)}
              badge={role.category}
              tint={tint}
              contrastOverlay={false}
              isActive={activeRole?.id === role.id}
              onClick={() => setActiveRole(role)}
              aria-label={`Rolle ${role.name} auswählen`}
              data-testid={`role-card-${role.id}`}
            />
          );
        })}
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <button
          type="button"
          onClick={handleNavigateToChat}
          className="bg-white/6 relative flex h-12 items-center justify-center gap-2 overflow-hidden rounded-full border border-white/10 text-sm font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.10),0_4px_16px_rgba(0,0,0,0.35)] ring-1 ring-white/5 saturate-150 transition-all duration-200 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(to_bottom,rgba(255,255,255,0.18),rgba(255,255,255,0.06)_40%,rgba(255,255,255,0)_70%)] hover:ring-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 active:scale-[0.995] supports-[backdrop-filter]:backdrop-blur-md"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-50"
            style={{
              background: `linear-gradient(135deg, ${palette[0]?.from ?? "hsl(210 45% 55% / 0.20)"} 0%, ${palette[0]?.to ?? "hsl(250 60% 52% / 0.18)"} 100%)`,
            }}
          />
          <span className="relative z-10">Zum Chat mit aktueller Rolle</span>
          <ArrowRight className="relative z-10 h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={handleResetRole}
          disabled={!activeRole}
          className="bg-white/6 relative flex h-12 items-center justify-center gap-2 overflow-hidden rounded-full border border-white/10 text-sm font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.10),0_4px_16px_rgba(0,0,0,0.35)] ring-1 ring-white/5 saturate-150 transition-all duration-200 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(to_bottom,rgba(255,255,255,0.18),rgba(255,255,255,0.06)_40%,rgba(255,255,255,0)_70%)] hover:ring-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 active:scale-[0.995] disabled:opacity-50 disabled:grayscale disabled:active:scale-100 supports-[backdrop-filter]:backdrop-blur-md"
          aria-disabled={!activeRole}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-50"
            style={{
              background: `linear-gradient(135deg, ${palette[1]?.from ?? "hsl(210 45% 55% / 0.20)"} 0%, ${palette[1]?.to ?? "hsl(250 60% 52% / 0.18)"} 100%)`,
            }}
          />
          <RotateCcw className="relative z-10 h-4 w-4" aria-hidden="true" />
          <span className="relative z-10">Rolle zurücksetzen</span>
        </button>
      </div>
    </div>
  );
}

function StylesTab() {
  const {
    typographyScale,
    setTypographyScale,
    borderRadius,
    setBorderRadius,
    accentColor,
    setAccentColor,
  } = useStudio();

  return (
    <div className="flex h-full flex-col gap-6 px-5 pb-8 pt-5 text-white">
      <div>
        <h2 className="text-lg font-semibold text-white">Stile</h2>
        <p className="mt-1 text-sm leading-6 text-white/70">
          Passe Typografie, Rundungen und Akzentfarbe an – Änderungen sind sofort sichtbar.
        </p>
      </div>

      <label className="flex flex-col gap-2 text-sm text-white/70">
        <span className="font-medium text-white/90">
          Schriftgröße <span className="text-white/60">({typographyScale.toFixed(1)})</span>
        </span>
        <input
          type="range"
          min="0.8"
          max="1.5"
          step="0.1"
          value={typographyScale}
          onChange={(event) => setTypographyScale(parseFloat(event.target.value))}
          className="w-full accent-white/80"
        />
      </label>

      <label className="flex flex-col gap-2 text-sm text-white/70">
        <span className="font-medium text-white/90">
          Eckenradius <span className="text-white/60">({borderRadius.toFixed(1)})</span>
        </span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={borderRadius}
          onChange={(event) => setBorderRadius(parseFloat(event.target.value))}
          className="w-full accent-white/80"
        />
      </label>

      <label className="flex flex-col gap-2 text-sm text-white/70">
        <span className="font-medium text-white/90">Akzentfarbe</span>
        <input
          type="color"
          value={accentColor}
          onChange={(event) => setAccentColor(event.target.value)}
          className="h-12 w-20 cursor-pointer rounded-xl border border-white/[0.14] bg-white/[0.04]"
        />
      </label>
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
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
            activeTab === "roles" ? "bg-white/15 text-white" : "bg-white/[0.05] text-white/70"
          }`}
        >
          Rollen
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("styles")}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
            activeTab === "styles" ? "bg-white/15 text-white" : "bg-white/[0.05] text-white/70"
          }`}
        >
          Stile
        </button>
      </div>
      <div className="mt-2 flex flex-1 flex-col overflow-y-auto">
        {activeTab === "roles" ? <RolesTab /> : <StylesTab />}
      </div>
    </div>
  );
}
