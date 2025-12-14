# Eye-Orb Texture Assets

This directory contains the iris texture atlas for photorealistic eye rendering.

## Required Asset

### `iris-atlas.png`

- **Dimensions**: 512x512px
- **Format**: PNG with alpha channel
- **Size Target**: ~85-120KB (compressed)

**Layout** (vertical split):

- **Top half (512x256)**: RGB iris diffuse pattern
  - Radial fiber texture (hazel/blue/brown)
  - High contrast radial lines
  - Natural color variation
- **Bottom half (512x256)**: RG normal map (tangent-space)
  - R channel: X-axis normals
  - G channel: Y-axis normals
  - B channel: Reconstructed in shader
  - Adds depth/bump to iris

**Alpha channel** (full 512x512):

- Opacity mask for pupil hole + iris boundary
- Black (0) = pupil/transparent
- White (255) = iris/opaque

## Generation Options

### 1. AI Generation (Recommended for MVP)

Use Stable Diffusion or Midjourney:

```
Prompt: "macro photograph of human iris, hazel blue color, radial fibers,
high detail, no pupil, centered, symmetrical, medical photography style"

Negative: "eyelashes, sclera, skin, face"
```

Post-process:

1. Center-crop to perfect circle
2. Remove pupil (fill with black, alpha = 0)
3. Generate normal map (Photoshop: Filter → 3D → Generate Normal Map)
4. Combine: Top = diffuse, Bottom = normal map (RG channels only)
5. Compress (TinyPNG, Squoosh)

### 2. Stock Photography

Sources:

- Unsplash: `https://unsplash.com/s/photos/iris-macro`
- Pexels: `https://www.pexels.com/search/eye%20macro/`

Requires manual cleanup + normal extraction.

### 3. Procedural Baking (Fallback Parity)

Offline-render current FBM shader to texture:

```bash
# Using Blender shader baking or custom Node.js script
# Keeps visual parity with FBM fallback
```

## Fallback Behavior

If `iris-atlas.png` is missing or fails to load:

- Shader automatically falls back to procedural FBM rendering
- No visual regression, just less photorealistic
- Performance: ~2-3ms slower (FBM is expensive)

## Testing

Place `iris-atlas.png` in this directory, then:

```bash
npm run dev
# Navigate to /chat
# Eye should render with texture on high/medium tier
```

Check browser console for load errors:

```
[EyeOrb] Failed to load iris texture, falling back to FBM
```
