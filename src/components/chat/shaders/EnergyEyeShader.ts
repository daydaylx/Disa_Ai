/* eslint-disable no-restricted-syntax */
import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";
import * as THREE from "three";

export const EnergyEyeMaterial = shaderMaterial(
  {
    u_time: 0,
    u_status: 0,
    u_intensity: 1,
    u_glow: 1,
    u_shock: 0,
    u_colorCore: new THREE.Color("#67e8f9"),
    u_colorIris: new THREE.Color("#a855f7"),
    u_colorEdge: new THREE.Color("#7dd3fc"),
  },
  /* glsl */ `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPos;

    uniform float u_time;
    uniform float u_intensity;
    uniform float u_status;
    uniform float u_shock;

    // Lightweight value noise
    float hash(float n) {
      return fract(sin(n) * 43758.5453123);
    }

    float noise(vec3 x) {
      vec3 p = floor(x);
      vec3 f = fract(x);
      f = f * f * (3.0 - 2.0 * f);

      float n = p.x + p.y * 57.0 + 113.0 * p.z;

      float res = mix(
        mix(mix(hash(n + 0.0), hash(n + 1.0), f.x), mix(hash(n + 57.0), hash(n + 58.0), f.x), f.y),
        mix(mix(hash(n + 113.0), hash(n + 114.0), f.x), mix(hash(n + 170.0), hash(n + 171.0), f.x), f.y),
        f.z
      );
      return res;
    }

    float fbm(vec3 p) {
      float a = 0.5;
      float n = 0.0;
      for (int i = 0; i < 5; i++) {
        n += a * noise(p);
        p = p * 2.1 + 4.0;
        a *= 0.5;
      }
      return n;
    }

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);

      float t = u_time * (0.65 + u_intensity * 0.9);
      vec3 displaced = position;

      // Organic surface motion
      float surf = fbm(normal * 3.0 + vec3(t * 0.6));
      float breathing = sin(t * 1.3) * 0.05 * (0.3 + u_intensity);
      float statusLift = mix(0.0, 0.06, clamp(u_status / 2.0, 0.0, 1.0));
      float shock = sin(length(position) * 8.0 - t * 6.0) * 0.035 * u_shock;

      displaced += normal * (surf * 0.08 * (0.4 + u_intensity) + breathing + statusLift + shock);

      vec4 world = modelMatrix * vec4(displaced, 1.0);
      vWorldPos = world.xyz;

      gl_Position = projectionMatrix * viewMatrix * world;
    }
  `,
  /* glsl */ `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPos;

    uniform float u_time;
    uniform float u_status; // 0 idle, 1 thinking, 2 streaming, 3 error
    uniform float u_intensity;
    uniform float u_glow;
    uniform float u_shock;
    uniform vec3 u_colorCore;
    uniform vec3 u_colorIris;
    uniform vec3 u_colorEdge;

    float hash(float n) {
      return fract(sin(n) * 43758.5453123);
    }

    float noise(vec3 x) {
      vec3 p = floor(x);
      vec3 f = fract(x);
      f = f * f * (3.0 - 2.0 * f);

      float n = p.x + p.y * 57.0 + 113.0 * p.z;

      float res = mix(
        mix(mix(hash(n + 0.0), hash(n + 1.0), f.x), mix(hash(n + 57.0), hash(n + 58.0), f.x), f.y),
        mix(mix(hash(n + 113.0), hash(n + 114.0), f.x), mix(hash(n + 170.0), hash(n + 171.0), f.x), f.y),
        f.z
      );
      return res;
    }

    float fbm(vec3 p) {
      float a = 0.5;
      float n = 0.0;
      for (int i = 0; i < 5; i++) {
        n += a * noise(p);
        p = p * 2.1 + 3.5;
        a *= 0.5;
      }
      return n;
    }

    float pulse(float t, float freq) {
      return 0.5 + 0.5 * sin(t * freq);
    }

    void main() {
      vec2 uv = vUv * 2.0 - 1.0;
      float r = length(uv);
      float angle = atan(uv.y, uv.x);
      float time = u_time;

      // Status weights
      float isThinking = smoothstep(0.4, 0.6, abs(u_status - 1.0));
      float isStreaming = smoothstep(0.4, 0.6, abs(u_status - 2.0));
      float isError = step(2.5, u_status);

      // Dynamic pupil size
      float pupil = 0.28;
      pupil -= 0.05 * isStreaming;
      pupil -= 0.03 * isThinking;
      pupil += 0.06 * isError;
      pupil += sin(time * (2.0 + isStreaming * 3.0)) * 0.02 * (isThinking + isStreaming);

      float pupilMask = smoothstep(pupil, pupil + 0.045, r);
      float irisMask = 1.0 - smoothstep(0.94, 1.08, r);

      // Iris layering
      float swirl = fbm(vec3(uv * 3.6, time * 0.35));
      float fibers = smoothstep(0.35, 0.95, abs(sin(angle * 18.0 + swirl * 6.0 + time * 1.1)));
      float fractures = smoothstep(0.0, 0.7, fbm(vec3(uv * 9.5, time * 2.2)));

      // Streaming shockwaves & data
      float waveA = sin(r * 12.0 - time * 6.0);
      float waveB = sin(r * 20.0 - time * 9.0);
      float streamingWaves = smoothstep(0.2, 0.85, waveA + waveB) * isStreaming;

      float ringSweep = smoothstep(0.0, 0.03, abs(fract(r * 3.2 - time * 1.5) - 0.5));
      float dataRays = smoothstep(0.28, 0.92, 1.0 - r) * smoothstep(0.6, 1.0, sin(angle * 12.0 + time * 2.5));

      // Error glitch
      float glitch = 0.0;
      if (isError > 0.0) {
        float block = step(0.82, fract(sin(dot(floor(uv * 32.0) + time * 7.0, vec2(12.9898, 78.233))) * 43758.5453));
        glitch = block;
        uv.x += (block - 0.5) * 0.08;
      }

      vec3 irisColor = mix(u_colorCore, u_colorIris, swirl * 0.5 + 0.5);
      irisColor += fibers * u_colorEdge * 0.65;
      irisColor += fractures * u_colorIris * 0.35;
      irisColor += streamingWaves * (u_colorEdge + vec3(0.1, 0.2, 0.3));
      irisColor += ringSweep * u_colorEdge * 0.4;
      irisColor += dataRays * u_colorCore * 0.6;

      // Shock burst when streaming
      irisColor += u_shock * vec3(1.0, 0.95, 0.8) * smoothstep(0.3, 0.0, abs(r - pulse(time, 0.6)));

      // Glitch desaturation
      irisColor = mix(irisColor, vec3(0.08, 0.01, 0.0), glitch * 0.6);

      // Fresnel edge
      float fresnel = pow(1.0 - abs(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0))), 2.4);
      vec3 rim = u_colorEdge * fresnel * (1.2 + u_glow * 0.8);

      vec3 finalColor = irisColor * pupilMask;
      finalColor += rim * irisMask;

      // Halo glow
      float halo = smoothstep(0.52, 0.0, abs(r - 0.62));
      finalColor += u_colorEdge * halo * (0.4 + u_glow);

      // Subtle vignette towards edges
      float vignette = smoothstep(0.7, 1.05, r);
      finalColor = mix(finalColor, finalColor * 0.35, vignette);

      float alpha = clamp(irisMask + (1.0 - pupilMask) * 0.35, 0.0, 1.0);
      gl_FragColor = vec4(finalColor, alpha);
    }
  `,
);

extend({ EnergyEyeMaterial });
