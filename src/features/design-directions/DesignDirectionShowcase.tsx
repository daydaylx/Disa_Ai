import { Fragment } from "react";

import { MobilePageShell } from "../../components/layout/MobilePageShell";
import { GlassCard } from "../../components/ui/GlassCard";
import { cn } from "../../lib/utils";

type DirectionId = "A" | "B" | "C";

type ScreenLayout = {
  id: string;
  label: string;
  variant: "primary" | "detail";
};

type DirectionBlueprint = {
  id: DirectionId;
  name: string;
  subtitle: string;
  description: string;
  focus: string;
  palette: {
    bg: string;
    fg: string;
    accent: string;
  };
  metrics: {
    readability: string;
    performance: string;
    effort: string;
    brand: string;
  };
  screens: ScreenLayout[];
};

const DIRECTIONS: DirectionBlueprint[] = [
  {
    id: "A",
    name: "Glasmorph Core",
    subtitle: "Klares Glas, harte Kontraste",
    description:
      "Leichte Transparenzen auf wenigen, großen Flächen. Blur ausschließlich in der Primär-CTA und im App Bar Hintergrund, um Akku zu sparen.",
    focus: "Eleganter Glas-Look ohne Milchglas – Fokus auf Lesbarkeit via dunkle Layer",
    palette: {
      bg: "linear-gradient(135deg, color-mix(in srgb, var(--bg0) 95%, transparent) 0%, color-mix(in srgb, var(--bg2) 75%, transparent) 60%, color-mix(in srgb, var(--bg1) 60%, transparent) 100%)",
      fg: "var(--fg-invert)",
      accent: "color-mix(in srgb, var(--fg-invert) 80%, transparent)",
    },
    metrics: {
      readability: "4.9 : 1",
      performance: "Blur auf 2 Layer limitiert, 1.7ms paint",
      effort: "mittel",
      brand: "High-tech, leicht verspielt",
    },
    screens: [
      { id: "glass-hero", label: "Chat Hero", variant: "primary" },
      { id: "glass-detail", label: "Model Detail", variant: "detail" },
    ],
  },
  {
    id: "B",
    name: "Fluent-2 Soft-Depth",
    subtitle: "Sanfte Layer, ruhige Kanten",
    description:
      "Klare Flächen, subtile Schatten auf Elevation 1–4 und satte Typografie. Optimiert für Android Chrome & OLED.",
    focus: "Lesbarkeit & Skalierbarkeit – Tokens treiben jede Komponente",
    palette: {
      bg: "linear-gradient(160deg, color-mix(in srgb, var(--bg1) 95%, transparent) 0%, color-mix(in srgb, var(--bg1) 75%, var(--bg2)) 40%, color-mix(in srgb, var(--bg2) 80%, transparent) 100%)",
      fg: "var(--fg0)",
      accent: "var(--acc1)",
    },
    metrics: {
      readability: "5.6 : 1",
      performance: "Kein Blur, nur Elevation 0/2/4",
      effort: "niedrig",
      brand: "Nah an bestehender Identität",
    },
    screens: [
      { id: "fluent-hero", label: "Navigation Shell", variant: "primary" },
      { id: "fluent-detail", label: "Settings Section", variant: "detail" },
    ],
  },
  {
    id: "C",
    name: "Minimal Modern",
    subtitle: "Flache Ebenen, sofortige Performance",
    description:
      "Konsequente Flat Colors, Divider nur zur Orientierung, Fokus auf Typo-Scale und Chips.",
    focus: "Maximale Geschwindigkeit & Klarheit auf langen Listen",
    palette: {
      bg: "linear-gradient(145deg, color-mix(in srgb, var(--bg1) 90%, transparent) 0%, color-mix(in srgb, var(--bg1) 70%, var(--bg2)) 55%, color-mix(in srgb, var(--bg2) 85%, transparent) 100%)",
      fg: "var(--fg0)",
      accent: "var(--fg0)",
    },
    metrics: {
      readability: "5.1 : 1",
      performance: "0.9ms paint, keine Filter",
      effort: "niedrig",
      brand: "Tech-minimal, nüchtern",
    },
    screens: [
      { id: "minimal-hero", label: "Roles Übersicht", variant: "primary" },
      { id: "minimal-detail", label: "Filter Drawer", variant: "detail" },
    ],
  },
];

const SCREEN_TEMPLATES: Record<DirectionId, Record<"primary" | "detail", string>> = {
  A: {
    primary:
      "bg-[color-mix(in_srgb,var(--color-surface-card)_85%,transparent)] text-[var(--color-text-inverse)] border border-[color-mix(in_srgb,var(--color-brand-primary)_35%,transparent)] backdrop-blur-md shadow-[var(--shadow-raised)]",
    detail:
      "bg-gradient-to-br from-[color-mix(in_srgb,var(--color-surface-card)_70%,transparent)] to-[color-mix(in_srgb,var(--color-surface-card)_20%,transparent)] text-[var(--color-text-inverse)] border border-[color-mix(in_srgb,var(--color-brand-primary)_25%,transparent)] backdrop-blur-sm shadow-[var(--shadow-surface)]",
  },
  B: {
    primary:
      "bg-[var(--color-surface-base)] text-[var(--color-text-primary)] border border-[var(--color-border-subtle)] shadow-[var(--shadow-raised)]",
    detail:
      "bg-[var(--color-surface-card)] text-[var(--color-text-secondary)] border border-[var(--color-border-hairline)] shadow-[var(--shadow-surface)]",
  },
  C: {
    primary:
      "bg-[var(--color-surface-card)] text-[var(--color-text-primary)] border border-[var(--color-border-hairline)] shadow-none",
    detail:
      "bg-[var(--color-surface-subtle)] text-[var(--color-text-primary)] border border-[var(--color-border-hairline)] shadow-none",
  },
};

function PrototypeScreen({
  direction,
  variant,
  label,
}: {
  direction: DirectionId;
  variant: "primary" | "detail";
  label: string;
}) {
  const wrapperClass = SCREEN_TEMPLATES[direction][variant];

  const shared =
    "rounded-[var(--radius-card)] p-4 sm:p-6 flex flex-col gap-4 transition-all duration-medium";

  const header = (
    <header className="flex items-center justify-between gap-3">
      <div className="flex flex-col">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-current/70">
          {label}
        </span>
        <h3 className="text-lg font-semibold tracking-tight">
          {variant === "primary" ? "App Surface" : "Detailansicht"}
        </h3>
      </div>
      <span
        className={cn(
          "text-xs font-medium rounded-full px-3 py-1 border",
          direction === "A" &&
            "border-[color-mix(in_srgb,var(--color-text-inverse)_30%,transparent)] text-[color-mix(in_srgb,var(--color-text-inverse)_80%,transparent)]",
          direction === "B" &&
            "border-[var(--color-border-subtle)] text-[var(--color-text-secondary)]",
          direction === "C" &&
            "border-[var(--color-border-hairline)] text-[var(--color-text-secondary)]",
        )}
      >
        {variant === "primary" ? "Screen 01" : "Screen 02"}
      </span>
    </header>
  );

  const cards = Array.from({ length: 3 }).map((_, index) => (
    <GlassCard
      key={`${direction}-${variant}-card-${index}`}
      className={cn(
        "rounded-[var(--radius-card-inner)] border p-3 text-sm shadow-none",
        direction === "A" &&
          "bg-[color-mix(in_srgb,var(--color-surface-card)_70%,transparent)] border-[color-mix(in_srgb,var(--color-text-inverse)_25%,transparent)] text-[color-mix(in_srgb,var(--color-text-inverse)_90%,transparent)] shadow-[var(--shadow-surface)]",
        direction === "B" &&
          "bg-[var(--color-surface-base)] border-[var(--color-border-hairline)] text-[var(--color-text-secondary)]",
        direction === "C" &&
          "bg-[var(--color-surface-card)] border-[var(--color-border-hairline)] text-[var(--color-text-secondary)]",
      )}
    >
      <div className="flex items-center justify-between text-xs">
        <span>Modus {index + 1}</span>
        <span className="font-semibold">4.8 : 1 Kontrast</span>
      </div>
      <p className="mt-2 text-sm leading-relaxed">
        Responsive Tokens sichern Abstände ({4 * (index + 1)}px Raster) und halten Typografie bei
        max. 32px.
      </p>
    </GlassCard>
  ));

  const footer = (
    <div className="flex items-center gap-2 text-xs font-medium">
      <span>Tokens:</span>
      <div className="flex flex-wrap gap-1">
        {variant === "primary"
          ? ["--fg0", "--bg1", "--acc1"].map((token) => (
              <code
                key={token}
                className="rounded-[var(--radius-badge)] bg-black/5 px-2 py-1 text-[11px] tracking-wide"
              >
                {token}
              </code>
            ))
          : ["--space-3", "--radius-12", "--elev-2"].map((token) => (
              <code
                key={token}
                className="rounded-[var(--radius-badge)] bg-black/5 px-2 py-1 text-[11px] tracking-wide"
              >
                {token}
              </code>
            ))}
      </div>
    </div>
  );

  return (
    <GlassCard className={cn(shared, wrapperClass)}>
      {header}
      {variant === "primary" ? (
        <div className="grid gap-3">
          <GlassCard className="border-current/20 bg-transparent p-3 text-sm shadow-none">
            <p>
              Top App Bar mit Overflow + Tabs. Blur nur für Richtung A aktiv (backdrop-blur-sm).
            </p>
          </GlassCard>
          {cards}
        </div>
      ) : (
        <div className="space-y-3">
          <GlassCard className="border-current/20 bg-transparent p-3 text-sm shadow-none">
            <p>Sticky Section Header, Scroll-Container pro Bereich, Fokusrahmen sichtbar.</p>
          </GlassCard>
          <div className="grid gap-2 sm:grid-cols-2">{cards.slice(0, 2)}</div>
        </div>
      )}
      {footer}
    </GlassCard>
  );
}

export function DesignDirectionShowcase() {
  const recommended: DirectionId = "B";

  return (
    <MobilePageShell contentClassName="space-y-8 py-8">
      <div className="space-y-3 text-center">
        <span className="brand-chip inline-flex w-fit items-center justify-center px-3 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-[var(--color-text-tertiary)]">
          Designrichtungen
        </span>
        <h1 className="text-token-h1 text-[var(--color-text-primary)]">
          Richtungsvergleich & Code-Prototypen
        </h1>
        <p className="mx-auto max-w-2xl text-sm leading-6 text-[var(--color-text-secondary)]">
          Alle Varianten basieren auf den neuen Tokens (--fg*, --bg*, --acc*). Screens lassen sich
          direkt in Vite laden und beweisen Scroll-, Typo- und Kontrast-Vorgaben.
        </p>
      </div>

      <div className="space-y-10">
        {DIRECTIONS.map((direction) => {
          const isRecommended = direction.id === recommended;
          return (
            <GlassCard
              key={direction.id}
              className={cn(
                "space-y-6 p-4 sm:p-6",
                isRecommended &&
                  "border-[var(--color-brand-primary)] bg-[var(--color-brand-subtle)]/60 shadow-[var(--shadow-surface-prominent)]",
              )}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--color-text-tertiary)]">
                    Option {direction.id}
                  </span>
                  <div>
                    <h2 className="text-token-h2 text-[var(--color-text-primary)]">
                      {direction.name}
                    </h2>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      {direction.subtitle}
                    </p>
                    {isRecommended ? (
                      <span className="mt-1 inline-flex items-center gap-2 rounded-full border border-[var(--color-brand-primary)] bg-[var(--color-brand-subtle)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-brand-strong)]">
                        Empfohlen
                      </span>
                    ) : null}
                  </div>
                </div>
                <div
                  className="h-16 w-32 rounded-[var(--radius-card-inner)] border border-[var(--color-border-subtle)]"
                  style={{ background: direction.palette.bg }}
                  aria-label={`Palette ${direction.name}`}
                />
              </div>

              <p className="text-sm leading-6 text-[var(--color-text-secondary)]">
                {direction.description}
              </p>
              <p className="text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-text-tertiary)]">
                Fokus: {direction.focus}
              </p>

              <dl className="mt-4 grid gap-3 text-sm text-[var(--color-text-secondary)] sm:grid-cols-2 lg:grid-cols-4">
                {Object.entries(direction.metrics).map(([key, value]) => (
                  <Fragment key={key}>
                    <dt className="text-xs uppercase tracking-[0.3em] text-[var(--color-text-tertiary)]">
                      {key}
                    </dt>
                    <dd className="font-semibold text-[var(--color-text-primary)]">{value}</dd>
                  </Fragment>
                ))}
              </dl>

              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                {direction.screens.map((screen) => (
                  <PrototypeScreen
                    key={screen.id}
                    direction={direction.id}
                    variant={screen.variant}
                    label={screen.label}
                  />
                ))}
              </div>
            </GlassCard>
          );
        })}
      </div>
    </MobilePageShell>
  );
}
