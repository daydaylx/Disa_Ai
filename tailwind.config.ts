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
          tertiary: "#f472b6", // Pink 400 - Highlights (palette-reduced)
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
          DEFAULT: "#6366f1", // Indigo 500 - Calm, utility (palette-reduced)
          dim: "rgba(99, 102, 241, 0.10)",
          glow: "rgba(99, 102, 241, 0.20)",
          border: "rgba(99, 102, 241, 0.30)",
          surface: "rgba(99, 102, 241, 0.05)",
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
          DEFAULT: "#6366f1", // Indigo 500 - Trustworthy, serious, stable (palette-reduced)
          dim: "rgba(99, 102, 241, 0.12)",
          glow: "rgba(99, 102, 241, 0.25)",
          border: "rgba(99, 102, 241, 0.35)",
          surface: "rgba(99, 102, 241, 0.06)",
        },
        "accent-hypothetisch": {
          DEFAULT: "#8b5cf6", // Violet 500 - Speculative, imaginative (palette-reduced)
          dim: "rgba(139, 92, 246, 0.12)",
          glow: "rgba(139, 92, 246, 0.25)",
          border: "rgba(139, 92, 246, 0.35)",
          surface: "rgba(139, 92, 246, 0.06)",
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
          DEFAULT: "#06b6d4", // Cyan 500 - Technical, precise (palette-reduced)
          dim: "rgba(6, 182, 212, 0.12)",
          glow: "rgba(6, 182, 212, 0.25)",
          border: "rgba(6, 182, 212, 0.35)",
          surface: "rgba(6, 182, 212, 0.06)",
        },
        "accent-business": {
          DEFAULT: "#6366f1", // Indigo 500 - Professional, growth (palette-reduced)
          dim: "rgba(99, 102, 241, 0.12)",
          glow: "rgba(99, 102, 241, 0.25)",
          border: "rgba(99, 102, 241, 0.35)",
          surface: "rgba(99, 102, 241, 0.06)",
        },
        "accent-creative": {
          DEFAULT: "#fb7185", // Rose 400 - Creative, expressive
          dim: "rgba(251, 113, 133, 0.12)",
          glow: "rgba(251, 113, 133, 0.25)",
          border: "rgba(251, 113, 133, 0.35)",
          surface: "rgba(251, 113, 133, 0.06)",
        },
        "accent-assistance": {
          DEFAULT: "#6366f1", // Indigo 500 - Helpful, supportive (palette-reduced)
          dim: "rgba(99, 102, 241, 0.12)",
          glow: "rgba(99, 102, 241, 0.25)",
          border: "rgba(99, 102, 241, 0.35)",
          surface: "rgba(99, 102, 241, 0.06)",
        },
        "accent-analysis": {
          DEFAULT: "#06b6d4", // Cyan 500 - Analytical, clear (palette-reduced)
          dim: "rgba(6, 182, 212, 0.12)",
          glow: "rgba(6, 182, 212, 0.25)",
          border: "rgba(6, 182, 212, 0.35)",
          surface: "rgba(6, 182, 212, 0.06)",
        },
        "accent-research": {
          DEFAULT: "#10b981", // Emerald 500 - Exploratory, discovery (palette-reduced)
          dim: "rgba(16, 185, 129, 0.12)",
          glow: "rgba(16, 185, 129, 0.25)",
          border: "rgba(16, 185, 129, 0.35)",
          surface: "rgba(16, 185, 129, 0.06)",
        },
        "accent-education": {
          DEFAULT: "#f59e0b", // Amber 500 - Learning, enlightening (palette-reduced)
          dim: "rgba(245, 158, 11, 0.12)",
          glow: "rgba(245, 158, 11, 0.25)",
          border: "rgba(245, 158, 11, 0.35)",
          surface: "rgba(245, 158, 11, 0.06)",
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
          info: "#06b6d4", // Cyan 500 (palette-reduced)
        },
      },
      fontFamily: {
        sans: [
          '"Syne"',
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
        header: "3.4rem", // Standard header height (reduced by 15%)
      },
      borderRadius: {
        "3xl": "1.275rem", // (reduced by 15%)
        "2xl": "0.85rem", // (reduced by 15%)
        xl: "0.6375rem", // (reduced by 15%)
        lg: "0.425rem", // (reduced by 15%)
        md: "0.31875rem", // (reduced by 15%)
        sm: "0.2125rem", // (reduced by 15%)
      },
      boxShadow: {
        sm: "0 0.85px 1.7px 0 rgba(0, 0, 0, 0.05)", // (reduced by 15%)
        md: "0 3.4px 5.1px -0.85px rgba(0, 0, 0, 0.2), 0 1.7px 3.4px -0.85px rgba(0, 0, 0, 0.1)", // (reduced by 15%)
        lg: "0 8.5px 12.75px -2.55px rgba(0, 0, 0, 0.3), 0 3.4px 5.1px -1.7px rgba(0, 0, 0, 0.15)", // (reduced by 15%)
        // Glow effects - Primary (Violet) (reduced by 15%)
        "glow-sm": "0 0 8.5px rgba(139, 92, 246, 0.3)",
        "glow-md": "0 0 17px rgba(139, 92, 246, 0.4)",
        "glow-lg": "0 0 25.5px rgba(139, 92, 246, 0.5)",
        // Page-specific glow effects (reduced by 15%)
        "glow-models": "0 0 10.2px rgba(6, 182, 212, 0.25)",
        "glow-models-lg": "0 0 20.4px rgba(6, 182, 212, 0.35)",
        "glow-roles": "0 0 10.2px rgba(244, 114, 182, 0.25)",
        "glow-roles-lg": "0 0 20.4px rgba(244, 114, 182, 0.35)",
        "glow-settings": "0 0 8.5px rgba(99, 102, 241, 0.20)",
        "glow-text": "0 0 8.5px rgba(139, 92, 246, 0.5)",
        // Category-specific glow effects (reduced by 15%)
        "glow-wissenschaft": "0 0 10.2px rgba(16, 185, 129, 0.25)",
        "glow-realpolitik": "0 0 10.2px rgba(99, 102, 241, 0.25)",
        "glow-hypothetisch": "0 0 10.2px rgba(139, 92, 246, 0.25)",
        "glow-kultur": "0 0 10.2px rgba(245, 158, 11, 0.25)",
        "glow-technical": "0 0 10.2px rgba(6, 182, 212, 0.25)",
        "glow-business": "0 0 10.2px rgba(99, 102, 241, 0.25)",
        "glow-creative": "0 0 10.2px rgba(251, 113, 133, 0.25)",
        "glow-assistance": "0 0 10.2px rgba(99, 102, 241, 0.25)",
        "glow-analysis": "0 0 10.2px rgba(6, 182, 212, 0.25)",
        "glow-research": "0 0 10.2px rgba(16, 185, 129, 0.25)",
        "glow-education": "0 0 10.2px rgba(245, 158, 11, 0.25)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-glow": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        // Core animations
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "pulse-glow": "pulseGlow 4s ease-in-out infinite",
        blob: "blob 7s infinite",
        // Utility animations
        "pulse-subtle": "pulse-subtle 3s ease-in-out infinite",
        "ping-slow": "pingSlow 3s cubic-bezier(0, 0, 0.2, 1) infinite",
        // Note: Neko animations defined in components.css (actively used)
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(17px)", opacity: "0" }, // 20px -> 17px (reduced by 15%)
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.0425)" }, // 1.05 -> 1.0425 (reduced by 15%)
        },
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(25.5px, -42.5px) scale(1.085)", opacity: "0.7" }, // reduced by 15%
          "66%": { transform: "translate(-17px, 17px) scale(0.915)", opacity: "0.6" }, // reduced by 15%
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
        "blob-float-1": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)", opacity: "0.5" },
          "33%": { transform: "translate(25.5px, -25.5px) scale(1.085)", opacity: "0.7" }, // reduced by 15%
          "66%": { transform: "translate(-17px, 17px) scale(0.915)", opacity: "0.6" }, // reduced by 15%
        },
        "blob-float-2": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)", opacity: "0.5" },
          "50%": { transform: "translate(-25.5px, 34px) scale(1.085)", opacity: "0.7" }, // reduced by 15%
        },
        "blob-float-3": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)", opacity: "0.5" },
          "50%": { transform: "translate(17px, -17px) scale(1.0425)", opacity: "0.7" }, // reduced by 15%
        },
        "pulse-subtle": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.5" },
        },
        pingSlow: {
          "75%, 100%": {
            transform: "scale(1.7)", // 2 -> 1.7 (reduced by 15%)
            opacity: "0",
          },
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
          backgroundColor: "var(--glass-bg-1)",
          border: "1px solid var(--glass-border-1)",
          boxShadow: "var(--glass-shadow-1)",
          // Backdrop blur is ignored when unsupported; safe fallback is just bg/border/shadow
          backdropFilter: "blur(var(--glass-blur-1))",
          WebkitBackdropFilter: "blur(var(--glass-blur-1))",
        },
        ".glass-header": {
          backgroundColor: "var(--glass-bg-2)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
          backdropFilter: "blur(var(--glass-blur-2))",
          WebkitBackdropFilter: "blur(var(--glass-blur-2))",
        },
        ".text-balance": {
          "text-wrap": "balance",
        },
      });
    }),
  ],
} satisfies Config;
