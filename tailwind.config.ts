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
        success: withOpacity("--success"),
        warning: withOpacity("--warning"),
        danger: withOpacity("--danger"),
        muted: withOpacity("--muted"),
        ringc: withOpacity("--ring"),
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
      },
    },
  },
  plugins: [],
} satisfies Config;
