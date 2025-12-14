export type EyeOrbQualityTier = "high" | "medium" | "low";

export type EyeOrbQualityDecision = {
  tier: EyeOrbQualityTier;
  reasons: string[];
  webgl: { supported: boolean; webgl2: boolean };
  prefersReducedMotion: boolean;
  deviceMemoryGb?: number;
};

function getPrefersReducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
}

function detectWebglSupport(): { supported: boolean; webgl2: boolean } {
  if (typeof document === "undefined") return { supported: false, webgl2: false };
  try {
    const canvas = document.createElement("canvas");
    const webgl2 = !!canvas.getContext("webgl2", { antialias: false, alpha: true });
    if (webgl2) return { supported: true, webgl2: true };
    const webgl = !!canvas.getContext("webgl", { antialias: false, alpha: true });
    return { supported: webgl, webgl2: false };
  } catch {
    return { supported: false, webgl2: false };
  }
}

export function getInitialEyeOrbQualityTier(): EyeOrbQualityDecision {
  const reasons: string[] = [];

  const prefersReducedMotion = getPrefersReducedMotion();
  const webgl = detectWebglSupport();

  const deviceMemoryGb =
    typeof navigator !== "undefined" && "deviceMemory" in navigator
      ? (navigator as Navigator & { deviceMemory?: number }).deviceMemory
      : undefined;

  if (!webgl.supported) {
    return {
      tier: "low",
      reasons: ["no_webgl"],
      webgl,
      prefersReducedMotion,
      deviceMemoryGb,
    };
  }

  let tier: EyeOrbQualityTier = "high";

  if (prefersReducedMotion) {
    tier = "medium";
    reasons.push("prefers_reduced_motion");
  }

  if (typeof deviceMemoryGb === "number" && deviceMemoryGb > 0 && deviceMemoryGb <= 4) {
    if (tier === "high") tier = "medium";
    reasons.push("low_device_memory");
  }

  // WebGL1-only devices tend to struggle with heavier shaders; start at medium.
  if (!webgl.webgl2 && tier === "high") {
    tier = "medium";
    reasons.push("webgl1_only");
  }

  return {
    tier,
    reasons,
    webgl,
    prefersReducedMotion,
    deviceMemoryGb,
  };
}
