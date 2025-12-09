export type AccentName =
  | "chat"
  | "models"
  | "roles"
  | "settings"
  | "wissenschaft"
  | "realpolitik"
  | "hypothetisch"
  | "kultur"
  | "verschwörung"
  | "technical"
  | "business"
  | "creative"
  | "assistance"
  | "analysis"
  | "research"
  | "education"
  | "entertainment";

export const ACCENT_VARIANTS: Record<
  AccentName,
  {
    surface: string;
    border: string;
    glow: string;
    text: string;
    dim: string;
    hoverBorderAlpha: string; // hover:border-accent-*-border/50
    beforeBg: string; // before:bg-accent-*
    surfaceBorderAlpha: string; // border-accent-*-border/30
  }
> = {
  chat: {
    surface: "bg-accent-chat-surface",
    border: "border-accent-chat-border",
    glow: "shadow-glow-chat",
    text: "text-accent-chat",
    dim: "bg-accent-chat-dim",
    hoverBorderAlpha: "hover:border-accent-chat-border/50",
    beforeBg: "before:bg-accent-chat",
    surfaceBorderAlpha: "border-accent-chat-border/30",
  },
  models: {
    surface: "bg-accent-models-surface",
    border: "border-accent-models-border",
    glow: "shadow-glow-models",
    text: "text-accent-models",
    dim: "bg-accent-models-dim",
    hoverBorderAlpha: "hover:border-accent-models-border/50",
    beforeBg: "before:bg-accent-models",
    surfaceBorderAlpha: "border-accent-models-border/30",
  },
  roles: {
    surface: "bg-accent-roles-surface",
    border: "border-accent-roles-border",
    glow: "shadow-glow-roles",
    text: "text-accent-roles",
    dim: "bg-accent-roles-dim",
    hoverBorderAlpha: "hover:border-accent-roles-border/50",
    beforeBg: "before:bg-accent-roles",
    surfaceBorderAlpha: "border-accent-roles-border/30",
  },
  settings: {
    surface: "bg-accent-settings-surface",
    border: "border-accent-settings-border",
    glow: "shadow-glow-settings",
    text: "text-accent-settings",
    dim: "bg-accent-settings-dim",
    hoverBorderAlpha: "hover:border-accent-settings-border/50",
    beforeBg: "before:bg-accent-settings",
    surfaceBorderAlpha: "border-accent-settings-border/30",
  },
  wissenschaft: {
    surface: "bg-accent-wissenschaft-surface",
    border: "border-accent-wissenschaft-border",
    glow: "shadow-glow-wissenschaft",
    text: "text-accent-wissenschaft",
    dim: "bg-accent-wissenschaft-dim",
    hoverBorderAlpha: "hover:border-accent-wissenschaft-border/50",
    beforeBg: "before:bg-accent-wissenschaft",
    surfaceBorderAlpha: "border-accent-wissenschaft-border/30",
  },
  realpolitik: {
    surface: "bg-accent-realpolitik-surface",
    border: "border-accent-realpolitik-border",
    glow: "shadow-glow-realpolitik",
    text: "text-accent-realpolitik",
    dim: "bg-accent-realpolitik-dim",
    hoverBorderAlpha: "hover:border-accent-realpolitik-border/50",
    beforeBg: "before:bg-accent-realpolitik",
    surfaceBorderAlpha: "border-accent-realpolitik-border/30",
  },
  hypothetisch: {
    surface: "bg-accent-hypothetisch-surface",
    border: "border-accent-hypothetisch-border",
    glow: "shadow-glow-hypothetisch",
    text: "text-accent-hypothetisch",
    dim: "bg-accent-hypothetisch-dim",
    hoverBorderAlpha: "hover:border-accent-hypothetisch-border/50",
    beforeBg: "before:bg-accent-hypothetisch",
    surfaceBorderAlpha: "border-accent-hypothetisch-border/30",
  },
  kultur: {
    surface: "bg-accent-kultur-surface",
    border: "border-accent-kultur-border",
    glow: "shadow-glow-kultur",
    text: "text-accent-kultur",
    dim: "bg-accent-kultur-dim",
    hoverBorderAlpha: "hover:border-accent-kultur-border/50",
    beforeBg: "before:bg-accent-kultur",
    surfaceBorderAlpha: "border-accent-kultur-border/30",
  },
  verschwörung: {
    surface: "bg-accent-verschwörung-surface",
    border: "border-accent-verschwörung-border",
    glow: "shadow-glow-verschwörung", // Not defined in tailwind config explicitly? Let's check. Default glow might apply.
    text: "text-accent-verschwörung",
    dim: "bg-accent-verschwörung-dim",
    hoverBorderAlpha: "hover:border-accent-verschwörung-border/50",
    beforeBg: "before:bg-accent-verschwörung",
    surfaceBorderAlpha: "border-accent-verschwörung-border/30",
  },
  technical: {
    surface: "bg-accent-technical-surface",
    border: "border-accent-technical-border",
    glow: "shadow-glow-technical",
    text: "text-accent-technical",
    dim: "bg-accent-technical-dim",
    hoverBorderAlpha: "hover:border-accent-technical-border/50",
    beforeBg: "before:bg-accent-technical",
    surfaceBorderAlpha: "border-accent-technical-border/30",
  },
  business: {
    surface: "bg-accent-business-surface",
    border: "border-accent-business-border",
    glow: "shadow-glow-business",
    text: "text-accent-business",
    dim: "bg-accent-business-dim",
    hoverBorderAlpha: "hover:border-accent-business-border/50",
    beforeBg: "before:bg-accent-business",
    surfaceBorderAlpha: "border-accent-business-border/30",
  },
  creative: {
    surface: "bg-accent-creative-surface",
    border: "border-accent-creative-border",
    glow: "shadow-glow-creative",
    text: "text-accent-creative",
    dim: "bg-accent-creative-dim",
    hoverBorderAlpha: "hover:border-accent-creative-border/50",
    beforeBg: "before:bg-accent-creative",
    surfaceBorderAlpha: "border-accent-creative-border/30",
  },
  assistance: {
    surface: "bg-accent-assistance-surface",
    border: "border-accent-assistance-border",
    glow: "shadow-glow-assistance",
    text: "text-accent-assistance",
    dim: "bg-accent-assistance-dim",
    hoverBorderAlpha: "hover:border-accent-assistance-border/50",
    beforeBg: "before:bg-accent-assistance",
    surfaceBorderAlpha: "border-accent-assistance-border/30",
  },
  analysis: {
    surface: "bg-accent-analysis-surface",
    border: "border-accent-analysis-border",
    glow: "shadow-glow-analysis",
    text: "text-accent-analysis",
    dim: "bg-accent-analysis-dim",
    hoverBorderAlpha: "hover:border-accent-analysis-border/50",
    beforeBg: "before:bg-accent-analysis",
    surfaceBorderAlpha: "border-accent-analysis-border/30",
  },
  research: {
    surface: "bg-accent-research-surface",
    border: "border-accent-research-border",
    glow: "shadow-glow-research",
    text: "text-accent-research",
    dim: "bg-accent-research-dim",
    hoverBorderAlpha: "hover:border-accent-research-border/50",
    beforeBg: "before:bg-accent-research",
    surfaceBorderAlpha: "border-accent-research-border/30",
  },
  education: {
    surface: "bg-accent-education-surface",
    border: "border-accent-education-border",
    glow: "shadow-glow-education",
    text: "text-accent-education",
    dim: "bg-accent-education-dim",
    hoverBorderAlpha: "hover:border-accent-education-border/50",
    beforeBg: "before:bg-accent-education",
    surfaceBorderAlpha: "border-accent-education-border/30",
  },
  entertainment: {
    surface: "bg-accent-entertainment-surface",
    border: "border-accent-entertainment-border",
    glow: "shadow-glow-entertainment", // Falls back to roles glow usually? No, check config.
    text: "text-accent-entertainment",
    dim: "bg-accent-entertainment-dim",
    hoverBorderAlpha: "hover:border-accent-entertainment-border/50",
    beforeBg: "before:bg-accent-entertainment",
    surfaceBorderAlpha: "border-accent-entertainment-border/30",
  },
};
