import type * as THREE from "three";

import type { EyeOrbQualityTier } from "./qualityTier";

export type EyeOrbMaterialUniforms = {
  u_time: { value: number };
  u_resolution: { value: THREE.Vector2 };
  u_look: { value: THREE.Vector2 };
  u_activity: { value: number };
  u_errorFlash: { value: number };
  u_sclera: { value: THREE.Color };
  u_irisA: { value: THREE.Color };
  u_irisB: { value: THREE.Color };
  u_glow: { value: THREE.Color };
};

export const eyeOrbVertexShader = /* glsl */ `
  varying vec3 vNormalV;
  varying vec3 vViewDirV;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vNormalV = normalize(normalMatrix * normal);
    vViewDirV = normalize(-mvPosition.xyz);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export function makeEyeOrbFragmentShader(tier: Exclude<EyeOrbQualityTier, "low">): string {
  const fbmOctaves = tier === "high" ? 4 : 2;
  const irisDetail = tier === "high" ? 1.0 : 0.65;
  const bumpStrength = tier === "high" ? 1.0 : 0.0;

  return /* glsl */ `
    precision highp float;

    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec2 u_look;          // already clamped/smoothed in TS (subtle range)
    uniform float u_activity;     // 0..1
    uniform float u_errorFlash;   // 0..1
    uniform vec3 u_sclera;
    uniform vec3 u_irisA;
    uniform vec3 u_irisB;
    uniform vec3 u_glow;

    varying vec3 vNormalV;
    varying vec3 vViewDirV;

    float hash12(vec2 p) {
      vec3 p3 = fract(vec3(p.xyx) * 0.1031);
      p3 += dot(p3, p3.yzx + 33.33);
      return fract((p3.x + p3.y) * p3.z);
    }

    float noise2(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      float a = hash12(i);
      float b = hash12(i + vec2(1.0, 0.0));
      float c = hash12(i + vec2(0.0, 1.0));
      float d = hash12(i + vec2(1.0, 1.0));
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    float fbm(vec2 p) {
      float value = 0.0;
      float amplitude = 0.5;
      for (int i = 0; i < ${fbmOctaves}; i++) {
        value += amplitude * noise2(p);
        p = p * 2.02 + 17.0;
        amplitude *= 0.5;
      }
      return value;
    }

    void main() {
      vec3 n = normalize(vNormalV);
      vec3 v = normalize(vViewDirV);

      // Facing factor: 1 at center, 0 at silhouette (in view-space).
      float facing = clamp(n.z, 0.0, 1.0);

      // Project the sphere normal onto a 2D plane for iris/pupil work.
      vec2 p = n.xy;

      // "Hold focus": keep movement subtle, slightly dampened.
      vec2 irisCenter = u_look * 0.85;

      float r = length(p - irisCenter);
      float irisRadius = 0.50;
      float irisEdge = 0.03;

      float irisMask = smoothstep(irisRadius, irisRadius - irisEdge, r);
      // Only show iris on the front hemisphere (avoid wrapping artifacts).
      irisMask *= smoothstep(0.05, 0.22, facing);

      float pupilRadius = mix(0.155, 0.125, u_activity);
      float pupilSoft = 0.025;

      float irisNoise = fbm((p - irisCenter) * (7.0 * ${irisDetail}) + u_time * 0.06);
      float pupilWarp = (irisNoise - 0.5) * (0.018 * ${irisDetail});
      float pupilMask = smoothstep(pupilRadius, pupilRadius - pupilSoft, r + pupilWarp) * irisMask;

      // Iris pattern: radial rings + subtle turbulence (no flicker).
      float rings = sin((r * 18.0 + irisNoise * 1.4) * 12.0);
      float ringMix = 0.5 + 0.5 * rings;

      vec3 irisColor = mix(u_irisA, u_irisB, ringMix);

      // Radial shading inside iris (darker towards edge).
      float irisInner = smoothstep(irisRadius, pupilRadius * 1.1, r);
      irisColor *= mix(1.18, 0.62, irisInner);

      // Sclera with very subtle organic variation.
      float scleraNoise = fbm(p * 2.2 + vec2(11.0, -7.0));
      vec3 sclera = u_sclera * (0.92 + 0.08 * scleraNoise);

      // Cheap normal micro-variation for a soft subsurface impression (tier-dependent).
      float bump = (fbm(p * 6.0 + u_time * 0.02) - 0.5) * (0.06 * ${bumpStrength});
      vec3 nBumped = normalize(vec3(n.xy + bump * 0.25, n.z));

      // Base combine
      vec3 color = mix(sclera, irisColor, irisMask);
      color = mix(color, vec3(0.0), pupilMask);

      // Lighting
      vec3 lightDir = normalize(vec3(-0.18, 0.42, 0.88));
      float diffuse = clamp(dot(nBumped, lightDir), 0.0, 1.0);
      float shade = 0.46 + diffuse * 0.58;
      color *= shade;

      // Corneal specular highlight (stable, not animated).
      vec3 h = normalize(lightDir + v);
      float spec = pow(clamp(dot(nBumped, h), 0.0, 1.0), 90.0);
      float specTight = pow(clamp(dot(nBumped, h), 0.0, 1.0), 220.0);
      vec3 specColor = vec3(1.0) * (0.10 + u_activity * 0.08);
      color += specColor * spec;
      color += vec3(1.0) * specTight * 0.16;

      // Fresnel rim for glassy edge
      float fresnel = pow(1.0 - clamp(dot(nBumped, v), 0.0, 1.0), 3.0);
      color += u_glow * fresnel * (0.10 + 0.08 * u_activity);

      // Subtle glow breathing only via u_activity (no time-based flicker).
      color += u_glow * (0.025 + 0.02 * u_activity) * irisMask;

      // Error is an event: brief dim + gentle blink highlight.
      float flash = clamp(u_errorFlash, 0.0, 1.0);
      color *= (1.0 - flash * 0.48);
      color = mix(color, vec3(1.0), flash * 0.10);

      // Alpha: fade towards silhouette so it sits behind UI, not like a sticker.
      float alpha = smoothstep(0.0, 0.12, facing);
      alpha = pow(alpha, 1.35);

      gl_FragColor = vec4(color, alpha);
    }
  `;
}
