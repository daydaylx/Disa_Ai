// src/components/eye/shaders/eyeShaders.ts

export const eyeVertexShader = `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
  vUv = uv;
  vec3 objectNormal = normalize(normal);
  vec3 transformedNormal = normalMatrix * objectNormal;
  vNormal = normalize(transformedNormal);

  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vViewPosition = -mvPosition.xyz;

  gl_Position = projectionMatrix * mvPosition;
}
`;

export const eyeFragmentShader = `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;

uniform float uTime;
uniform vec3 uColorIris;
uniform vec3 uColorPupil;
uniform vec3 uColorSclera;
uniform vec2 uPupilScale; // x: size, y: dilation
uniform vec2 uLook; // look direction offset

// Noise functions
float hash(float n) { return fract(sin(n) * 1e4); }
float noise(vec3 x) {
    const vec3 step = vec3(110, 241, 171);
    vec3 i = floor(x);
    vec3 f = fract(x);
    float n = dot(i, step);
    vec3 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix( hash(n + dot(step, vec3(0, 0, 0))), hash(n + dot(step, vec3(1, 0, 0))), u.x),
                   mix( hash(n + dot(step, vec3(0, 1, 0))), hash(n + dot(step, vec3(1, 1, 0))), u.x), u.y),
               mix(mix( hash(n + dot(step, vec3(0, 0, 1))), hash(n + dot(step, vec3(1, 0, 1))), u.x),
                   mix( hash(n + dot(step, vec3(0, 1, 1))), hash(n + dot(step, vec3(1, 1, 1))), u.x), u.y), u.z);
}

float fbm(vec3 x) {
    float v = 0.0;
    float a = 0.5;
    vec3 shift = vec3(100);
    for (int i = 0; i < 5; ++i) {
        v += a * noise(x);
        x = x * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}

void main() {
    vec3 viewDir = normalize(vViewPosition);
    vec3 normal = normalize(vNormal);

    // Iris / Pupil Mapping
    // We map UVs to polar coordinates centered at 0.5, 0.5
    // But we need to account for the sphere shape and look direction.
    // For a simple eye look, we can cheat by offsetting UVs or rotating the mesh.
    // Here we assume the mesh rotates, so UV center (0.5, 0.5) is always the pupil center.

    vec2 centeredUv = vUv - 0.5;
    float r = length(centeredUv) * 2.0; // 0 to 1 radius from center
    float theta = atan(centeredUv.y, centeredUv.x);

    // Pupil
    float pupilSize = uPupilScale.x * uPupilScale.y;
    float pupilEdge = 0.02;
    float pupilMask = smoothstep(pupilSize + pupilEdge, pupilSize, r);

    // Iris
    float irisRadius = 0.5; // Iris takes up half the UV space (front of eye)
    float irisEdge = 0.05;
    float irisMask = smoothstep(irisRadius + irisEdge, irisRadius, r) - pupilMask;

    // Sclera
    float scleraMask = 1.0 - smoothstep(irisRadius, irisRadius + irisEdge, r);

    // Procedural Iris Texture
    float noiseVal = fbm(vec3(r * 3.0, theta * 4.0, uTime * 0.1));
    float radialLines = abs(sin(theta * 20.0 + fbm(vec3(theta * 5.0, 0.0, 0.0)) * 2.0));

    vec3 irisColor = mix(uColorIris * 0.5, uColorIris * 1.5, noiseVal);
    irisColor += radialLines * 0.2 * uColorIris;

    // Add depth to iris (darker at outer edge, lighter near pupil)
    irisColor *= smoothstep(irisRadius, 0.0, r);
    irisColor += smoothstep(0.0, irisRadius, r) * 0.2;

    // Combine
    vec3 color = vec3(0.0);
    color = mix(color, uColorSclera, scleraMask);
    color = mix(color, irisColor, irisMask);
    color = mix(color, uColorPupil, pupilMask);

    // Specular Highlight (Fake Reflection)
    vec3 lightDir = normalize(vec3(1.0, 1.0, 2.0));
    vec3 halfVec = normalize(lightDir + viewDir);
    float NdotH = max(0.0, dot(normal, halfVec));
    float spec = pow(NdotH, 60.0); // Sharp highlight
    float spec2 = pow(NdotH, 20.0) * 0.3; // Softer bloom

    // Fresnel Rim for "Glassy" look
    float fresnel = pow(1.0 - max(0.0, dot(normal, viewDir)), 3.0);

    // Apply lighting
    color += vec3(spec + spec2) * 0.8;
    color += vec3(fresnel) * 0.2 * uColorIris;

    // Vignette / Sclera shadowing
    float vignette = smoothstep(1.0, 0.3, r);
    // This darkens the back/edges of the eye sphere which might not be visible depending on geometry
    // But helpful if we see the side

    gl_FragColor = vec4(color, 1.0);
}
`;
