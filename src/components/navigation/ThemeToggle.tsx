import { useTheme } from "../../hooks/useTheme";

export function ThemeToggle() {
  useTheme(); // ensures theme controller initialized
  return null;
}
