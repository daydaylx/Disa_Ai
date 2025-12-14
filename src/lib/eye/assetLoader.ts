import * as THREE from "three";

import type { EyeOrbQualityTier } from "@/components/eye/qualityTier";

import { resolvePublicAssetUrl } from "../publicAssets";

export type EyeAssets = {
  irisAtlas: THREE.Texture;
} | null;

/**
 * Loads Eye-Orb texture assets for given quality tier.
 *
 * @param tier - Quality tier (high/medium/low)
 * @returns Loaded textures or null on failure/low tier
 * @throws Never - falls back to FBM on error
 *
 * High tier: Full 512x512 texture
 * Medium tier: Downsampled to 256x256 in-memory (saves GPU bandwidth)
 * Low tier: Returns null (CSS fallback, no WebGL)
 */
export async function loadEyeAssets(tier: EyeOrbQualityTier): Promise<EyeAssets> {
  if (tier === "low") {
    return null;
  }

  const url = resolvePublicAssetUrl("/eye-textures/iris-atlas.png");
  const loader = new THREE.TextureLoader();

  try {
    const texture = await loader.loadAsync(url);

    // Configure texture for optimal quality/performance
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = true;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;

    // Medium tier: downsample to 256x256 to save GPU bandwidth
    if (tier === "medium") {
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        console.warn("[EyeOrb] Canvas 2D context unavailable, using full-res texture");
        return { irisAtlas: texture };
      }

      ctx.drawImage(texture.image, 0, 0, 256, 256);
      texture.image = canvas as unknown as HTMLImageElement;
      texture.needsUpdate = true;
    }

    return { irisAtlas: texture };
  } catch (error) {
    console.warn("[EyeOrb] Failed to load iris texture, falling back to FBM", error);
    return null;
  }
}
