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
      fontSize: {
        display: "var(--font-size-display)",
        h1: "var(--font-size-h1)",
        h2: "var(--font-size-h2)",
        h3: "var(--font-size-h3)",
        body: "var(--font-size-body)",
        label: "var(--font-size-label)",
        caption: "var(--font-size-caption)",
      },
      fontWeight: {
        regular: "var(--font-weight-regular)",
        medium: "var(--font-weight-medium)",
        bold: "var(--font-weight-bold)",
      },
      colors: {
        // Legacy colors (maintaining compatibility)
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

        // Enhanced semantic color system
        text: {
          primary: withOpacity("--color-text-primary-rgb"),
          secondary: withOpacity("--color-text-secondary-rgb"),
          muted: withOpacity("--color-text-muted-rgb"),
          disabled: "var(--color-text-disabled)",
          inverse: "var(--color-text-inverse)",
        },
        background: {
          primary: withOpacity("--color-bg-primary-rgb"),
          secondary: withOpacity("--color-bg-secondary-rgb"),
          tertiary: withOpacity("--color-bg-tertiary-rgb"),
          elevated: "var(--color-bg-elevated)",
          overlay: "var(--color-bg-overlay)",
        },
        interactive: {
          primary: withOpacity("--color-interactive-primary-rgb"),
          "primary-hover": "var(--color-interactive-primary-hover)",
          "primary-active": "var(--color-interactive-primary-active)",
          secondary: withOpacity("--color-interactive-secondary-rgb"),
          "secondary-hover": "var(--color-interactive-secondary-hover)",
          "secondary-active": "var(--color-interactive-secondary-active)",
        },
        border: {
          primary: "var(--color-border-primary)",
          secondary: "var(--color-border-secondary)",
          tertiary: "var(--color-border-tertiary)",
          focus: "var(--color-border-focus)",
          error: "var(--color-border-error)",
        },
      },
      spacing: {
        0: "var(--space-0)",
        1: "var(--space-1)",
        2: "var(--space-2)",
        3: "var(--space-3)",
        4: "var(--space-4)",
        5: "var(--space-5)",
        6: "var(--space-6)",
        8: "var(--space-8)",
        10: "var(--space-10)",
        12: "var(--space-12)",
        16: "var(--space-16)",
        20: "var(--space-20)",
        24: "var(--space-24)",
        32: "var(--space-32)",
        40: "var(--space-40)",
        48: "var(--space-48)",
        56: "var(--space-56)",
        64: "var(--space-64)",
        "card-padding": "var(--space-card-padding)",
        "section-gap": "var(--space-section-gap)",
        "content-gap": "var(--space-content-gap)",
        "element-gap": "var(--space-element-gap)",
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
