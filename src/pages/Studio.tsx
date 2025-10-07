import { ArrowRight, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useStudio } from "../app/state/StudioContext";
import { RoleCard, type RoleTint } from "../components/studio/RoleCard";
import type { Role } from "../data/roles";

type RoleVisualConfig = {
  tint: RoleTint;
  contrastOverlay?: boolean;
};

const ROLE_TINTS: Record<string, RoleVisualConfig> = {
  neutral: {
    tint: {
      from: "hsl(210 90% 60% / 0.22)",
      to: "hsl(50 95% 55% / 0.22)",
    },
  },
  email_professional: {
    tint: {
      from: "hsl(195 100% 55% / 0.22)",
      to: "hsl(245 90% 60% / 0.22)",
    },
  },
  sarcastic_direct: {
    tint: {
      from: "hsl(160 85% 45% / 0.22)",
      to: "hsl(190 85% 50% / 0.22)",
    },
  },
  songwriter: {
    tint: {
      from: "hsl(30 95% 55% / 0.22)",
      to: "hsl(345 90% 60% / 0.22)",
    },
  },
  creative_writer: {
    tint: {
      from: "hsl(265 90% 62% / 0.22)",
      to: "hsl(320 90% 62% / 0.22)",
    },
  },
};

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
  const navigate = useNavigate();

  const orderedRoles = useMemo(() => {
    // Highlight the curated set first, keep remaining order for discoverability
    const featuredOrder = [
      "neutral",
      "email_professional",
      "sarcastic_direct",
      "songwriter",
      "creative_writer",
    ];
    return [...roles].sort((a, b) => {
      const indexA = featuredOrder.indexOf(a.id);
      const indexB = featuredOrder.indexOf(b.id);
      if (indexA === -1 && indexB === -1) return 0;
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
  }, [roles]);

  const handleResetRole = () => {
    setActiveRole(null);
  };

  const handleNavigateToChat = () => {
    void navigate("/chat");
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
        {orderedRoles.map((role) => {
          const visual = ROLE_TINTS[role.id] ?? { tint: DEFAULT_TINT };
          return (
            <RoleCard
              key={role.id}
              title={role.name}
              description={summariseRole(role)}
              badge={role.category}
              tint={visual.tint}
              contrastOverlay={visual.contrastOverlay}
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
          className="card-cta flex h-12 items-center justify-center gap-2 rounded-full border border-white/[0.10] bg-white/[0.03] text-sm font-medium text-white/90 backdrop-blur-sm transition-transform duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 active:scale-[0.995]"
        >
          <span>Zum Chat mit aktueller Rolle</span>
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={handleResetRole}
          disabled={!activeRole}
          className="card-cta flex h-12 items-center justify-center gap-2 rounded-full border border-white/[0.10] bg-white/[0.03] text-sm font-medium text-white/80 backdrop-blur-sm transition-transform duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 active:scale-[0.995] disabled:opacity-50 disabled:grayscale disabled:active:scale-100"
          aria-disabled={!activeRole}
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          <span>Rolle zurücksetzen</span>
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
