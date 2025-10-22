import type { LucideProps } from "lucide-react";
import { Monitor, Moon, Sun } from "lucide-react";
import type { ComponentType } from "react";

import { useTheme } from "../../hooks/useTheme";
import type { ThemePreference } from "../../styles/theme";
import { Button } from "../ui/button";

const LABELS: Record<ThemePreference, string> = {
  system: "Systemmodus",
  light: "Lichtmodus",
  dark: "Dunkelmodus",
};

const ICONS: Record<ThemePreference, ComponentType<LucideProps>> = {
  system: Monitor,
  light: Sun,
  dark: Moon,
};

const order: ThemePreference[] = ["system", "light", "dark"];

function nextPreference(current: ThemePreference): ThemePreference {
  const index = order.indexOf(current);
  const next = (index + 1 + order.length) % order.length;
  return order[next] ?? "system";
}

export function ThemeToggle() {
  const { preference, setPreference, mode } = useTheme();
  const safePreference = preference ?? "system";
  const Icon = ICONS[safePreference];
  const label = LABELS[safePreference];

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={`${label} aktivieren`}
      title={`${label} – tippen zum Wechseln`}
      onClick={() => setPreference(nextPreference(safePreference))}
    >
      <Icon className="h-5 w-5" data-theme-mode={mode} />
    </Button>
  );
}
