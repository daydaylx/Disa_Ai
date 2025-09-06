import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,html}",
    "./tests/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // shadcn/ui Token-Mapping (erzeugt u. a. 'border-border')
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        // projekt-spezifisch
        "kl-bg": "rgb(15 15 18)",
        "kl-fg": "rgb(230 230 234)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "1rem",
      },
      boxShadow: {
        soft: "0 10px 20px -5px rgba(0,0,0,.3)",
      },
    },
  },
  plugins: [],
};

export default config;
