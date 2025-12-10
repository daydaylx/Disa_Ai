/* eslint-disable */
import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

import { spacingCssVars } from "./src/styles/tokens/spacing";

const spacingScale = Object.fromEntries(
  Object.entries(spacingCssVars.scale).map(([key, cssVar]) => [key, `var(${cssVar})`]),
);

const semanticSpacingScale = Object.fromEntries(
  Object.entries(spacingCssVars.semantic).map(([key, cssVar]) => [key, `var(${cssVar})`]),
);

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  // Safelist for dynamic category colors from src/lib/categoryColors.ts
  // These classes are returned at runtime and need to be explicitly included
  safelist: [
    // Indigo theme
    "bg-indigo-500/5",
    "border-indigo-500/20",
    "text-indigo-400",
    "bg-indigo-400",
    "bg-indigo-500/10",
    "shadow-[0_0_20px_-10px_rgba(99,102,241,0.3)]",
    "hover:bg-indigo-500/5",
    "hover:border-indigo-500/20",
    "hover:shadow-[0_0_20px_-10px_rgba(99,102,241,0.3)]",
    "group-hover:bg-indigo-500/10",
    "group-hover:text-indigo-400",
    "group-hover:border-indigo-500/20",
    // Pink theme
    "bg-pink-500/5",
    "border-pink-500/20",
    "text-pink-400",
    "bg-pink-400",
    "bg-pink-500/10",
    "text-pink-300",
    "shadow-[0_0_20px_-10px_rgba(236,72,153,0.3)]",
    "hover:bg-pink-500/5",
    "hover:border-pink-500/20",
    "hover:shadow-[0_0_20px_-10px_rgba(236,72,153,0.3)]",
    "group-hover:bg-pink-500/10",
    "group-hover:text-pink-400",
    "group-hover:border-pink-500/20",
    // Amber theme
    "bg-amber-500/5",
    "border-amber-500/20",
    "text-amber-400",
    "bg-amber-400",
    "bg-amber-500/10",
    "text-amber-300",
    "shadow-[0_0_20px_-10px_rgba(245,158,11,0.3)]",
    "hover:bg-amber-500/5",
    "hover:border-amber-500/20",
    "hover:shadow-[0_0_20px_-10px_rgba(245,158,11,0.3)]",
    "group-hover:bg-amber-500/10",
    "group-hover:text-amber-400",
    "group-hover:border-amber-500/20",
    // Emerald theme
    "bg-emerald-500/5",
    "border-emerald-500/20",
    "text-emerald-400",
    "bg-emerald-400",
    "bg-emerald-500/10",
    "text-emerald-300",
    "shadow-[0_0_20px_-10px_rgba(16,185,129,0.3)]",
    "hover:bg-emerald-500/5",
    "hover:border-emerald-500/20",
    "hover:shadow-[0_0_20px_-10px_rgba(16,185,129,0.3)]",
    "group-hover:bg-emerald-500/10",
    "group-hover:text-emerald-400",
    "group-hover:border-emerald-500/20",
    // Cyan theme
    "bg-cyan-500/5",
    "border-cyan-500/20",
    "text-cyan-400",
    "bg-cyan-400",
    "bg-cyan-500/10",
    "text-cyan-300",
    "shadow-[0_0_20px_-10px_rgba(6,182,212,0.3)]",
    "hover:bg-cyan-500/5",
    "hover:border-cyan-500/20",
    "hover:shadow-[0_0_20px_-10px_rgba(6,182,212,0.3)]",
    "group-hover:bg-cyan-500/10",
    "group-hover:text-cyan-400",
    "group-hover:border-cyan-500/20",
    // Violet theme
    "bg-violet-500/5",
    "border-violet-500/20",
    "text-violet-400",
    "bg-violet-400",
    "bg-violet-500/10",
    "text-violet-300",
    "shadow-[0_0_20px_-10px_rgba(139,92,246,0.3)]",
    "hover:bg-violet-500/5",
    "hover:border-violet-500/20",
    "hover:shadow-[0_0_20px_-10px_rgba(139,92,246,0.3)]",
    "group-hover:bg-violet-500/10",
    "group-hover:text-violet-400",
    "group-hover:border-violet-500/20",
    // Rose theme
    "bg-rose-500/5",
    "border-rose-500/20",
    "text-rose-400",
    "bg-rose-400",
    "bg-rose-500/10",
    "text-rose-300",
    "shadow-[0_0_20px_-10px_rgba(244,63,94,0.3)]",
    "hover:bg-rose-500/5",
    "hover:border-rose-500/20",
    "hover:shadow-[0_0_20px_-10px_rgba(244,63,94,0.3)]",
    "group-hover:bg-rose-500/10",
    "group-hover:text-rose-400",
    "group-hover:border-rose-500/20",
    // Slate theme
    "bg-slate-500/5",
    "border-slate-500/20",
    "text-slate-400",
    "bg-slate-400",
    "bg-slate-500/10",
    "text-slate-300",
    "hover:bg-slate-500/5",
    "hover:border-slate-500/20",
    "group-hover:bg-slate-500/10",
    "group-hover:text-slate-400",
    "group-hover:border-slate-500/20",
  ],
  darkMode: ["class", "[data-theme='dark']"],
  theme: {
    extend: {
      colors: {
        // Vibrant Glass Theme - Deep Dark Base with Electric Accents
        bg: {
          app: "#09090B", // Zinc 950 (Deepest dark for OLED)
          surface: "#18181B", // Zinc 900 (Main content background)
        },
        surface: {
          glass: "rgba(24, 24, 27, 0.7)", // Glass effect base
          1: "#18181B", // Zinc 900 - Panels
          2: "#27272A", // Zinc 800 - Secondary/Hover
          3: "#3F3F46", // Zinc 700 - Borders/Active
          inset: "#000000", // Deep zones
        },
        brand: {
          primary: "#8b5cf6", // Violet 500 - Main Brand Color
          secondary: "#6366f1", // Indigo 500 - Secondary Accent
          tertiary: "#ec4899", // Pink 500 - Highlights
        },
        ink: {
          primary: "#FAFAFA", // Zinc 50 (Brighter White)
          secondary: "#D4D4D8", // Zinc 300 (Lighter Grey for better readability)
          tertiary: "#A1A1AA", // Zinc 400 (Meta text)
          muted: "#71717A", // Zinc 500
        },
        // Map old accent names to new brand colors for backward compatibility
        accent: {
          primary: "#8b5cf6", // Mapped to Brand Primary (Violet)
          "primary-dim": "rgba(139, 92, 246, 0.15)",
          secondary: "#6366f1", // Indigo
          tertiary: "#06b6d4", // Cyan (kept for info)
        },
        // === PAGE-SPECIFIC ACCENT SYSTEM ===
        // Each page/category gets a subtle, distinct accent for visual grouping
        "accent-chat": {
          DEFAULT: "#8b5cf6", // Violet - Primary brand, chat actions
          dim: "rgba(139, 92, 246, 0.12)",
          glow: "rgba(139, 92, 246, 0.25)",
          border: "rgba(139, 92, 246, 0.35)",
          surface: "rgba(139, 92, 246, 0.06)",
        },
        "accent-models": {
          DEFAULT: "#06b6d4", // Cyan/Teal - Cool, technical, AI models
          dim: "rgba(6, 182, 212, 0.12)",
          glow: "rgba(6, 182, 212, 0.25)",
          border: "rgba(6, 182, 212, 0.35)",
          surface: "rgba(6, 182, 212, 0.06)",
        },
        "accent-roles": {
          DEFAULT: "#f472b6", // Pink - Warm, creative, personas
          dim: "rgba(244, 114, 182, 0.12)",
          glow: "rgba(244, 114, 182, 0.25)",
          border: "rgba(244, 114, 182, 0.35)",
          surface: "rgba(244, 114, 182, 0.06)",
        },
        "accent-settings": {
          DEFAULT: "#a78bfa", // Light Violet - Calm, utility
          dim: "rgba(167, 139, 250, 0.10)",
          glow: "rgba(167, 139, 250, 0.20)",
          border: "rgba(167, 139, 250, 0.30)",
          surface: "rgba(167, 139, 250, 0.05)",
        },
        // === CATEGORY-SPECIFIC ACCENTS ===
        // Theme/Discussion categories
        "accent-wissenschaft": {
          DEFAULT: "#10b981", // Emerald 500 - Fresh, scientific, growth
          dim: "rgba(16, 185, 129, 0.12)",
          glow: "rgba(16, 185, 129, 0.25)",
          border: "rgba(16, 185, 129, 0.35)",
          surface: "rgba(16, 185, 129, 0.06)",
        },
        "accent-realpolitik": {
          DEFAULT: "#0ea5e9", // Sky 500 - Trustworthy, serious, stable
          dim: "rgba(14, 165, 233, 0.12)",
          glow: "rgba(14, 165, 233, 0.25)",
          border: "rgba(14, 165, 233, 0.35)",
          surface: "rgba(14, 165, 233, 0.06)",
        },
        "accent-hypothetisch": {
          DEFAULT: "#a855f7", // Purple 500 - Speculative, imaginative
          dim: "rgba(168, 85, 247, 0.12)",
          glow: "rgba(168, 85, 247, 0.25)",
          border: "rgba(168, 85, 247, 0.35)",
          surface: "rgba(168, 85, 247, 0.06)",
        },
        "accent-kultur": {
          DEFAULT: "#f59e0b", // Amber 500 - Warm, cultural, vibrant
          dim: "rgba(245, 158, 11, 0.12)",
          glow: "rgba(245, 158, 11, 0.25)",
          border: "rgba(245, 158, 11, 0.35)",
          surface: "rgba(245, 158, 11, 0.06)",
        },
        "accent-verschwörung": {
          DEFAULT: "#71717a", // Zinc 500 - Neutral, mysterious
          dim: "rgba(113, 113, 122, 0.12)",
          glow: "rgba(113, 113, 122, 0.20)",
          border: "rgba(113, 113, 122, 0.30)",
          surface: "rgba(113, 113, 122, 0.05)",
        },
        // Role categories
        "accent-technical": {
          DEFAULT: "#14b8a6", // Teal 500 - Technical, precise
          dim: "rgba(20, 184, 166, 0.12)",
          glow: "rgba(20, 184, 166, 0.25)",
          border: "rgba(20, 184, 166, 0.35)",
          surface: "rgba(20, 184, 166, 0.06)",
        },
        "accent-business": {
          DEFAULT: "#059669", // Emerald 600 - Professional, growth
          dim: "rgba(5, 150, 105, 0.12)",
          glow: "rgba(5, 150, 105, 0.25)",
          border: "rgba(5, 150, 105, 0.35)",
          surface: "rgba(5, 150, 105, 0.06)",
        },
        "accent-creative": {
          DEFAULT: "#fb7185", // Rose 400 - Creative, expressive
          dim: "rgba(251, 113, 133, 0.12)",
          glow: "rgba(251, 113, 133, 0.25)",
          border: "rgba(251, 113, 133, 0.35)",
          surface: "rgba(251, 113, 133, 0.06)",
        },
        "accent-assistance": {
          DEFAULT: "#818cf8", // Indigo 400 - Helpful, supportive
          dim: "rgba(129, 140, 248, 0.12)",
          glow: "rgba(129, 140, 248, 0.25)",
          border: "rgba(129, 140, 248, 0.35)",
          surface: "rgba(129, 140, 248, 0.06)",
        },
        "accent-analysis": {
          DEFAULT: "#22d3ee", // Cyan 400 - Analytical, clear
          dim: "rgba(34, 211, 238, 0.12)",
          glow: "rgba(34, 211, 238, 0.25)",
          border: "rgba(34, 211, 238, 0.35)",
          surface: "rgba(34, 211, 238, 0.06)",
        },
        "accent-research": {
          DEFAULT: "#34d399", // Emerald 400 - Exploratory, discovery
          dim: "rgba(52, 211, 153, 0.12)",
          glow: "rgba(52, 211, 153, 0.25)",
          border: "rgba(52, 211, 153, 0.35)",
          surface: "rgba(52, 211, 153, 0.06)",
        },
        "accent-education": {
          DEFAULT: "#fbbf24", // Amber 400 - Learning, enlightening
          dim: "rgba(251, 191, 36, 0.12)",
          glow: "rgba(251, 191, 36, 0.25)",
          border: "rgba(251, 191, 36, 0.35)",
          surface: "rgba(251, 191, 36, 0.06)",
        },
        "accent-entertainment": {
          DEFAULT: "#f472b6", // Pink 400 - Fun, engaging (same as roles)
          dim: "rgba(244, 114, 182, 0.12)",
          glow: "rgba(244, 114, 182, 0.25)",
          border: "rgba(244, 114, 182, 0.35)",
          surface: "rgba(244, 114, 182, 0.06)",
        },
        border: {
          DEFAULT: "rgba(255, 255, 255, 0.08)", // Lighter, cleaner border
          subtle: "rgba(255, 255, 255, 0.04)",
          medium: "rgba(255, 255, 255, 0.12)",
          strong: "rgba(255, 255, 255, 0.2)",
          highlight: "rgba(139, 92, 246, 0.5)", // Primary colored border
        },
        status: {
          error: "#ef4444", // Red 500
          success: "#10b981", // Emerald 500 (More vibrant than Green)
          warning: "#f59e0b", // Amber 500
          info: "#0ea5e9", // Sky 500
        },
      },
      fontFamily: {
        sans: [
          '"Inter"',
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        mono: ['"JetBrains Mono"', '"Fira Code"', "monospace"],
      },
      spacing: {
        ...spacingScale,
        ...semanticSpacingScale,
        "safe-bottom": "env(safe-area-inset-bottom)",
        "safe-top": "env(safe-area-inset-top)",
        header: "4rem", // Standard header height
      },
      borderRadius: {
        "3xl": "1.5rem",
        "2xl": "1rem",
        xl: "0.75rem",
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.15)",
        // Glow effects - Primary (Violet)
        "glow-sm": "0 0 10px rgba(139, 92, 246, 0.3)",
        "glow-md": "0 0 20px rgba(139, 92, 246, 0.4)",
        "glow-lg": "0 0 30px rgba(139, 92, 246, 0.5)",
        // Page-specific glow effects
        "glow-models": "0 0 12px rgba(6, 182, 212, 0.25)",
        "glow-models-lg": "0 0 24px rgba(6, 182, 212, 0.35)",
        "glow-roles": "0 0 12px rgba(244, 114, 182, 0.25)",
        "glow-roles-lg": "0 0 24px rgba(244, 114, 182, 0.35)",
        "glow-settings": "0 0 10px rgba(167, 139, 250, 0.20)",
        "glow-text": "0 0 10px rgba(139, 92, 246, 0.5)",
        // Category-specific glow effects
        "glow-wissenschaft": "0 0 12px rgba(16, 185, 129, 0.25)",
        "glow-realpolitik": "0 0 12px rgba(14, 165, 233, 0.25)",
        "glow-hypothetisch": "0 0 12px rgba(168, 85, 247, 0.25)",
        "glow-kultur": "0 0 12px rgba(245, 158, 11, 0.25)",
        "glow-technical": "0 0 12px rgba(20, 184, 166, 0.25)",
        "glow-business": "0 0 12px rgba(5, 150, 105, 0.25)",
        "glow-creative": "0 0 12px rgba(251, 113, 133, 0.25)",
        "glow-assistance": "0 0 12px rgba(129, 140, 248, 0.25)",
        "glow-analysis": "0 0 12px rgba(34, 211, 238, 0.25)",
        "glow-research": "0 0 12px rgba(52, 211, 153, 0.25)",
        "glow-education": "0 0 12px rgba(251, 191, 36, 0.25)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-glow": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "pulse-glow": "pulseGlow 4s ease-in-out infinite",
        blob: "blob 7s infinite",
        "cube-a-idle": "cubeFloatAIdle 3.6s ease-in-out infinite",
        "cube-b-idle": "cubeFloatBIdle 3.6s ease-in-out infinite",
        "cube-a-thinking": "cubeFloatAThinking 3s ease-in-out infinite",
        "cube-b-thinking": "cubeFloatBThinking 3s ease-in-out infinite",
        "cube-a-streaming": "cubeFloatAStreaming 2.4s ease-in-out infinite",
        "cube-b-streaming": "cubeFloatBStreaming 2.4s ease-in-out infinite",
        "cube-glitch": "cubeGlitch 0.7s ease-in-out",
        "cube-orbit": "cubeOrbit 12s linear infinite",
        "cube-wave": "cubeWave 2.4s ease-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
        },
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
        cubeFloatAIdle: {
          "0%": {
            transform:
              "translate3d(-4px, 3px, 0) rotateX(2deg) rotateY(-4deg) rotateZ(-3deg) scale(0.98)",
            opacity: "0.9",
          },
          "50%": {
            transform:
              "translate3d(5px, -5px, 0) rotateX(-2deg) rotateY(6deg) rotateZ(4deg) scale(1.02)",
            opacity: "1",
          },
          "100%": {
            transform:
              "translate3d(-4px, 3px, 0) rotateX(2deg) rotateY(-4deg) rotateZ(-3deg) scale(0.98)",
            opacity: "0.9",
          },
        },
        cubeFloatBIdle: {
          "0%": {
            transform:
              "translate3d(4px, -2px, 0) rotateX(-2deg) rotateY(3deg) rotateZ(2deg) scale(0.99)",
            opacity: "0.9",
          },
          "50%": {
            transform:
              "translate3d(-6px, 4px, 0) rotateX(3deg) rotateY(-6deg) rotateZ(-3deg) scale(1.02)",
            opacity: "1",
          },
          "100%": {
            transform:
              "translate3d(4px, -2px, 0) rotateX(-2deg) rotateY(3deg) rotateZ(2deg) scale(0.99)",
            opacity: "0.9",
          },
        },
        cubeFloatAThinking: {
          "0%": {
            transform:
              "translate3d(-6px, 4px, 0) rotateX(4deg) rotateY(-7deg) rotateZ(-5deg) scale(0.97)",
          },
          "50%": {
            transform:
              "translate3d(7px, -7px, 0) rotateX(-4deg) rotateY(9deg) rotateZ(6deg) scale(1.05)",
          },
          "100%": {
            transform:
              "translate3d(-6px, 4px, 0) rotateX(4deg) rotateY(-7deg) rotateZ(-5deg) scale(0.97)",
          },
        },
        cubeFloatBThinking: {
          "0%": {
            transform:
              "translate3d(6px, -4px, 0) rotateX(-4deg) rotateY(6deg) rotateZ(5deg) scale(1)",
          },
          "50%": {
            transform:
              "translate3d(-8px, 7px, 0) rotateX(5deg) rotateY(-9deg) rotateZ(-6deg) scale(1.06)",
          },
          "100%": {
            transform:
              "translate3d(6px, -4px, 0) rotateX(-4deg) rotateY(6deg) rotateZ(5deg) scale(1)",
          },
        },
        cubeFloatAStreaming: {
          "0%": {
            transform:
              "translate3d(-6px, 4px, 0) rotateX(6deg) rotateY(-9deg) rotateZ(-6deg) scale(0.97)",
          },
          "50%": {
            transform:
              "translate3d(9px, -9px, 0) rotateX(-6deg) rotateY(11deg) rotateZ(7deg) scale(1.07)",
          },
          "100%": {
            transform:
              "translate3d(-6px, 4px, 0) rotateX(6deg) rotateY(-9deg) rotateZ(-6deg) scale(0.97)",
          },
        },
        cubeFloatBStreaming: {
          "0%": {
            transform:
              "translate3d(7px, -5px, 0) rotateX(-6deg) rotateY(8deg) rotateZ(6deg) scale(1)",
          },
          "50%": {
            transform:
              "translate3d(-10px, 8px, 0) rotateX(7deg) rotateY(-11deg) rotateZ(-7deg) scale(1.08)",
          },
          "100%": {
            transform:
              "translate3d(7px, -5px, 0) rotateX(-6deg) rotateY(8deg) rotateZ(6deg) scale(1)",
          },
        },
        cubeGlitch: {
          "0%": { transform: "translate3d(0, 0, 0) rotateZ(0deg) scale(1)", opacity: "1" },
          "20%": {
            transform: "translate3d(-3px, 2px, 0) rotateZ(-3deg) scale(0.99)",
            opacity: "0.9",
          },
          "40%": {
            transform: "translate3d(4px, -2px, 0) rotateZ(2deg) scale(1.01)",
            opacity: "0.85",
          },
          "60%": {
            transform: "translate3d(-2px, -3px, 0) rotateZ(1deg) scale(1.02)",
            opacity: "0.9",
          },
          "80%": {
            transform: "translate3d(3px, 3px, 0) rotateZ(-2deg) scale(0.98)",
            opacity: "0.95",
          },
          "100%": { transform: "translate3d(0, 0, 0) rotateZ(0deg) scale(1)", opacity: "1" },
        },
        cubeOrbit: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        cubeWave: {
          "0%": { transform: "scale(1)", opacity: "0.5" },
          "100%": { transform: "scale(1.25)", opacity: "0" },
        },
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".no-scrollbar": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
        // Glass Utilities
        ".glass-panel": {
          "@apply bg-surface-glass backdrop-blur-xl border border-white/10 shadow-lg": {},
        },
        ".glass-header": {
          "@apply bg-bg-app/80 backdrop-blur-xl border-b border-white/5": {},
        },
        ".text-balance": {
          "text-wrap": "balance",
        },
      });
    }),
  ],
} satisfies Config;
