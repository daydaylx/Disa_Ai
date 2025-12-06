import { useSettingsContext } from "../contexts/SettingsContext";

/**
 * Hook to access settings from the global SettingsContext.
 * Now wraps the context to maintain API compatibility.
 */
export function useSettings() {
  return useSettingsContext();
}
