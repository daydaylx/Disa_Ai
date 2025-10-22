import { useEffect, useState } from "react";

import {
  type ColorMode,
  themeController,
  type ThemePreference,
  type ThemeState,
} from "../styles/theme";

export function useTheme(): {
  preference: ThemePreference;
  mode: ColorMode;
  setPreference: (preference: ThemePreference) => void;
  toggle: () => void;
} {
  const [state, setState] = useState<ThemeState>(themeController.getState());

  useEffect(() => {
    themeController.init();
    return themeController.subscribe(setState);
  }, []);

  const setPreference = (preference: ThemePreference) => {
    themeController.setPreference(preference);
  };

  const toggle = () => {
    themeController.toggle();
  };

  return {
    preference: state.preference,
    mode: state.mode,
    setPreference,
    toggle,
  };
}
