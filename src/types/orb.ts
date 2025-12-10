export type CoreStatus = "idle" | "thinking" | "streaming" | "error";

export type OrbSize = "mobile" | "desktop" | "auto";
export type OrbIntensity = "subtle" | "normal" | "strong";
export type OrbTheme = "default" | "matrix" | "solar" | "abyss" | "custom";
export type BreathingSpeed = "slow" | "normal" | "fast";
export type ParticleDensity = "sparse" | "normal" | "dense";

export interface CustomColors {
  primary: string;
  secondary: string;
  glow: string;
  particle: string;
}

export interface OrbSettings {
  // Basic Props
  size: OrbSize;
  intensity: OrbIntensity;

  // Visual Themes
  theme: OrbTheme;
  customColors?: CustomColors;

  // Animation Controls
  breathingEnabled: boolean;
  breathingSpeed: BreathingSpeed;
  rotationSpeed: number; // 0.5x to 3x
  particleDensity: ParticleDensity;
  enableTapResponse: boolean;

  // Advanced Visual Settings
  dataRingOpacity: number; // 0-100%
  particleOpacity: number; // 0-100%
  glowIntensity: number; // 0-100%
  rayCount: number; // 8-32
  noiseTextureOpacity: number; // 0-100%
}

export interface OrbThemePreset {
  id: string;
  name: string;
  description: string;
  settings: Partial<OrbSettings>;
}

export interface OrbPreviewProps {
  status: CoreStatus;
  config: Partial<OrbSettings>;
  size?: "small" | "medium";
}
