/* eslint-disable no-restricted-syntax */
import type { OrbSettings, OrbThemePreset } from "@/types/orb";

export const DEFAULT_ORB_SETTINGS: OrbSettings = {
  size: "auto",
  intensity: "normal",
  theme: "default",
  breathingEnabled: true,
  breathingSpeed: "normal",
  rotationSpeed: 1.0,
  particleDensity: "normal",
  enableTapResponse: true,
  dataRingOpacity: 30,
  particleOpacity: 40,
  glowIntensity: 50,
  rayCount: 24,
  noiseTextureOpacity: 30,
};

export const ORB_PRESETS: OrbThemePreset[] = [
  {
    id: "default",
    name: "Default",
    description: "Klares Cyan-Blau Design mit optimierter Leistung",
    settings: {
      theme: "default",
      intensity: "normal",
      breathingSpeed: "normal",
      particleDensity: "normal",
      glowIntensity: 50,
    },
  },
  {
    id: "matrix",
    name: "Matrix",
    description: "Digitales Grün-Design wie im Cyberspace",
    settings: {
      theme: "matrix",
      customColors: {
        primary: "#00ff00",
        secondary: "#00cc00",
        glow: "#00ff00",
        particle: "#00ff41",
      },
      intensity: "normal",
      breathingSpeed: "fast",
      particleDensity: "dense",
      glowIntensity: 70,
    },
  },
  {
    id: "solar",
    name: "Solar",
    description: "Warme Sonnenfarben mit energetischem Glühen",
    settings: {
      theme: "solar",
      customColors: {
        primary: "#fbbf24",
        secondary: "#f59e0b",
        glow: "#fde047",
        particle: "#facc15",
      },
      intensity: "strong",
      breathingSpeed: "slow",
      particleDensity: "normal",
      glowIntensity: 80,
    },
  },
  {
    id: "abyss",
    name: "Abyss",
    description: "Tiefe Ozeantöne mit geheimnisvollem Glühen",
    settings: {
      theme: "abyss",
      customColors: {
        primary: "#0891b2",
        secondary: "#0e7490",
        glow: "#06b6d4",
        particle: "#22d3ee",
      },
      intensity: "subtle",
      breathingSpeed: "slow",
      particleDensity: "sparse",
      glowIntensity: 40,
    },
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Reduziert auf das Wesentliche",
    settings: {
      theme: "default",
      intensity: "subtle",
      breathingEnabled: false,
      particleDensity: "sparse",
      glowIntensity: 30,
      dataRingOpacity: 20,
      particleOpacity: 25,
    },
  },
  {
    id: "energetic",
    name: "Energetisch",
    description: "Dynamisch und lebhaft",
    settings: {
      theme: "default",
      intensity: "strong",
      breathingSpeed: "fast",
      rotationSpeed: 1.5,
      particleDensity: "dense",
      glowIntensity: 90,
      enableTapResponse: true,
    },
  },
];

export const ORB_SIZE_OPTIONS = [
  { value: "mobile", label: "Mobil" },
  { value: "desktop", label: "Desktop" },
  { value: "auto", label: "Auto" },
] as const;

export const ORB_INTENSITY_OPTIONS = [
  { value: "subtle", label: "Dezent" },
  { value: "normal", label: "Normal" },
  { value: "strong", label: "Intensiv" },
] as const;

export const BREATHING_SPEED_OPTIONS = [
  { value: "slow", label: "Langsam", multiplier: 1.5 },
  { value: "normal", label: "Normal", multiplier: 1.0 },
  { value: "fast", label: "Schnell", multiplier: 0.7 },
] as const;

export const PARTICLE_DENSITY_OPTIONS = [
  { value: "sparse", label: "Wenig", multiplier: 0.5 },
  { value: "normal", label: "Normal", multiplier: 1.0 },
  { value: "dense", label: "Dicht", multiplier: 1.5 },
] as const;

export function getPresetById(id: string): OrbThemePreset | undefined {
  return ORB_PRESETS.find((preset) => preset.id === id);
}

export function applyPresetToSettings(
  currentSettings: OrbSettings,
  preset: OrbThemePreset,
): OrbSettings {
  return {
    ...currentSettings,
    ...preset.settings,
  };
}
