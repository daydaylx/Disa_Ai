import { useMemo } from "react";

import { useStudio } from "../app/state/StudioContext";
import {
  createGlassGradientVariants,
  FRIENDLY_TINTS,
  type GlassTint,
  gradientToTint,
} from "../lib/theme/glass";

export function useGlassPalette(): GlassTint[] {
  const { accentColor } = useStudio();

  return useMemo(() => {
    const gradients = createGlassGradientVariants(accentColor);
    const mapped = gradients.map((gradient) => {
      const tint = gradientToTint(gradient);
      return (
        tint || {
          from: "hsla(220, 26%, 28%, 0.9)",
          to: "hsla(220, 30%, 20%, 0.78)",
        }
      );
    });
    return mapped.length > 0 ? mapped : FRIENDLY_TINTS;
  }, [accentColor]);
}
