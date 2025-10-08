import { useMemo } from "react";

import { useStudio } from "../app/state/StudioContext";
import { createGlassGradientVariants } from "../lib/theme/glass";

export function useGlassPalette() {
  const { accentColor } = useStudio();

  return useMemo(() => createGlassGradientVariants(accentColor), [accentColor]);
}
