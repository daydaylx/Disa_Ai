import plugin from "tailwindcss/plugin";

export const neonGlassPlugin = plugin(function ({ addUtilities, addComponents }) {
  // Core neon-glass utility classes
  addUtilities({
    ".glass": {
      borderRadius: "20px",
      border: "1px solid var(--border-glass)",
      backgroundColor: "var(--bg-surface)",
      boxShadow: "0 10px 30px rgba(0,0,0,0.45)",
      backdropFilter: "blur(12px) saturate(115%)",
    },
    ".orb": {
      borderRadius: "9999px",
      backgroundImage: "var(--brand-gradient)",
      position: "relative",
      "&::after": {
        content: '""',
        position: "absolute",
        inset: "1px",
        borderRadius: "9999px",
        boxShadow: "inset 0 0 18px rgba(34,211,238,0.55)",
        pointerEvents: "none",
      },
    },
    ".glow": {
      boxShadow: "0 0 60px rgba(168,85,247,0.35)",
    },
    ".tile": {
      borderRadius: "16px",
      border: "1px solid var(--border-glass)",
      backgroundColor: "var(--bg-surface)",
      boxShadow: "0 10px 30px rgba(0,0,0,0.45)",
      backdropFilter: "blur(12px) saturate(115%)",
      transition: "transform 120ms cubic-bezier(0.2,0.8,0.2,1)",
      "&:active": {
        transform: "scale(0.98)",
      },
    },
    ".pill": {
      borderRadius: "9999px",
      height: "44px",
      minHeight: "44px",
      paddingLeft: "16px",
      paddingRight: "16px",
    },
    ".bg-radial-brand": {
      backgroundImage: `
        radial-gradient(60% 40% at 50% 0%, rgba(168,85,247,0.15), transparent 70%),
        radial-gradient(40% 30% at 20% 0%, rgba(34,211,238,0.1), transparent 60%),
        radial-gradient(50% 35% at 80% 0%, rgba(244,114,182,0.08), transparent 65%)
      `,
    },
  });

  // Component-level styles with proper motion preferences
  addComponents({
    ".orb-pulse": {
      animation: "orb-pulse 2s ease-in-out infinite",
      "@media (prefers-reduced-motion: reduce)": {
        animation: "none",
      },
    },
    ".orb-focus": {
      "&::before": {
        content: '""',
        position: "absolute",
        inset: "-4px",
        borderRadius: "9999px",
        background: "var(--brand-gradient)",
        opacity: "0.4",
        animation: "orb-focus-ring 1.5s ease-in-out infinite",
        zIndex: "-1",
      },
      "@media (prefers-reduced-motion: reduce)": {
        "&::before": {
          animation: "none",
          opacity: "0.2",
        },
      },
    },
    ".orb-listening": {
      "&::before": {
        content: '""',
        position: "absolute",
        inset: "-8px",
        borderRadius: "9999px",
        background: "var(--brand-gradient)",
        opacity: "0.3",
        animation: "orb-listening-ripple 2s ease-out infinite",
        zIndex: "-1",
      },
      "&::after": {
        content: '""',
        position: "absolute",
        inset: "-16px",
        borderRadius: "9999px",
        background: "var(--brand-gradient)",
        opacity: "0.15",
        animation: "orb-listening-ripple 2s ease-out infinite 0.5s",
        zIndex: "-1",
      },
      "@media (prefers-reduced-motion: reduce)": {
        "&::before, &::after": {
          animation: "none",
          opacity: "0.1",
        },
      },
    },
  });
});

// Keyframe animations - defined separately to avoid CSS-in-JS conflicts
export const neonAnimations = `
@keyframes orb-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.9; }
}

@keyframes orb-focus-ring {
  0%, 100% { transform: scale(1); opacity: 0.4; }
  50% { transform: scale(1.1); opacity: 0.2; }
}

@keyframes orb-listening-ripple {
  0% { transform: scale(1); opacity: 0.3; }
  100% { transform: scale(1.8); opacity: 0; }
}
`;
