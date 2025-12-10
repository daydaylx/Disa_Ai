import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";
import * as THREE from "three";

export const EnergyEyeMaterial = shaderMaterial(
  {
    u_time: 0,
    u_colorMain: new THREE.Color(0.0, 0.8, 1.0),
    u_colorAccent: new THREE.Color(0.6, 0.0, 1.0),
    u_intensity: 0.5,
    u_zoom: 1.0,
    u_status: 0, // 0: idle, 1: thinking, 2: streaming, 3: error
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    uniform float u_time;
    uniform float u_intensity;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      
      // Subtle pulse based on intensity
      float pulse = sin(u_time * 2.0) * 0.02 * u_intensity;
      vec3 pos = position + normal * pulse;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  // Fragment Shader
  `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    uniform float u_time;
    uniform vec3 u_colorMain;
    uniform vec3 u_colorAccent;
    uniform float u_intensity;
    uniform float u_status; // 0=idle, 1=thinking, 2=streaming, 3=error

    // Simplex 2D noise
    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
    float snoise(vec2 v){
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
               -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
      + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m ;
      m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    void main() {
      // Center UV to -1.0 -> 1.0
      vec2 uv = vUv * 2.0 - 1.0;
      float r = length(uv);
      float angle = atan(uv.y, uv.x);

      // --- ANIMATION PARAMS ---
      float time = u_time * (0.5 + u_intensity * 1.5);
      
      // --- NOISE LAYERS ---
      // Base swirling noise
      float n1 = snoise(vec2(uv.x * 3.0 + cos(time * 0.2), uv.y * 3.0 + sin(time * 0.3)));
      
      // Radial noise lines (iris structure)
      float n2 = snoise(vec2(angle * 4.0 + time * 0.1, r * 2.0 - time * 0.5));
      
      // --- SHAPE MASKS ---
      // Pupil (center black hole)
      float pupilSize = 0.3 - (u_intensity * 0.05); // Dilate when active
      if (u_status > 2.5) { // Error
         pupilSize = 0.25 + snoise(vec2(time*8.0, 0.0)) * 0.02; // Subtle glitch pupil
      } else if (u_status > 1.5) { // Streaming
         pupilSize = 0.3 + sin(time * 5.0) * 0.02; // Pulse fast
      } else if (u_status > 0.5) { // Thinking
         pupilSize = 0.3 + sin(time * 2.0) * 0.04; // Breath slow
      }

      float pupilMask = smoothstep(pupilSize, pupilSize + 0.05, r);
      
      // Iris boundary
      float irisMask = smoothstep(0.9, 0.7, r);

      // --- COLOR MIXING ---
      vec3 color = mix(u_colorMain, u_colorAccent, n1 * 0.5 + 0.5);
      
      // Add data rings / structure
      float ring = smoothstep(0.02, 0.0, abs(r - 0.6 + sin(angle * 10.0 + time) * 0.02));
      color += ring * u_colorAccent * 0.5;

      // Highlights based on noise
      float highlight = smoothstep(0.4, 0.8, n2 * pupilMask);
      color += highlight * vec3(1.0) * 0.4;

      // --- STATE SPECIFIC EFFECTS ---
      
      // Streaming: Digital waves
      if (u_status > 1.5 && u_status < 2.5) {
        float wave = fract(r * 5.0 - time * 2.0);
        color += smoothstep(0.8, 1.0, wave) * u_colorMain * 0.5 * pupilMask;
      }
      
      // Error: Glitch overlay
      if (u_status > 2.5) {
         float glitch = step(0.98, fract(uv.y * 10.0 + time * 5.0));
         color += glitch * vec3(1.0, 0.0, 0.0) * 0.6;
         color.r += snoise(uv * 10.0 + time) * 0.1;
      }

      // Final Masking
      // Darken center
      vec3 finalColor = color * pupilMask;
      
      // Darken edges
      finalColor *= irisMask;
      
      // Add rim glow (fresnel-ish)
      float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
      finalColor += fresnel * u_colorMain * 0.5 * irisMask;

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `,
);

extend({ EnergyEyeMaterial });
