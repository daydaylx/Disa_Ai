import type { Config } from "tailwindcss";

const withOpacity =
  (variable: string) =>
  ({ opacityValue }: { opacityValue?: string }) => {
    if (opacityValue !== undefined) return `rgb(var(${variable}) / ${opacityValue})`;
    return `rgb(var(${variable}))`;
  };

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx,html}"],
  theme: {
    extend: {
      colors: {
        bg: withOpacity("--bg"),
        surface: withOpacity("--surface"),
        overlay: withOpacity("--overlay"),
        primary: withOpacity("--primary"),
        accent: withOpacity("--accent"),
        "accent-teal": withOpacity("--accent-teal-rgb"),
        "accent-violet": withOpacity("--accent-violet-rgb"),
        "accent-pink": withOpacity("--accent-pink-rgb"),
        success: withOpacity("--success"),
        warning: withOpacity("--warning"),
        danger: withOpacity("--danger"),
        muted: withOpacity("--muted"),
        ringc: withOpacity("--ring"),
        "glass-surface": withOpacity("--glass-surface-rgb"),
        "glass-border": withOpacity("--glass-border-rgb"),
        "text-primary": withOpacity("--text-primary"),
        "text-secondary": withOpacity("--text-secondary"),
        "text-muted": withOpacity("--text-muted"),
      },
      borderRadius: {
        xs: "4px",
        sm: "6px",
        md: "10px",
        lg: "14px",
        xl: "20px",
        "2xl": "28px",
      },
      boxShadow: {
        sm: "0 4px 12px rgba(0,0,0,0.12)",
        md: "0 8px 24px rgba(0,0,0,0.18)",
        glass: "var(--glass-shadow)",
      },
      backdropBlur: {
        xs: "var(--glass-blur-xs)",
        sm: "var(--glass-blur-sm)",
        md: "var(--glass-blur-md)",
        lg: "var(--glass-blur-lg)",
        xl: "var(--glass-blur-xl)",
        "2xl": "var(--glass-blur-2xl)",
      },
      backdropSaturate: {
        125: "125%",
        150: "150%",
        175: "175%",
        200: "200%",
      },
      backdropBrightness: {
        95: ".95",
        100: "1",
        105: "1.05",
        110: "1.1",
        115: "1.15",
      },
    },
  },
  plugins: [],
} satisfies Config;
