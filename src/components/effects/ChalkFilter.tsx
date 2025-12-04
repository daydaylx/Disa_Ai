/**
 * ChalkFilter Component
 *
 * Provides SVG filters for creating hand-drawn chalk effects on UI elements.
 * These filters simulate the irregular, organic nature of chalk on slate.
 */

export function ChalkFilter() {
  return (
    <svg
      style={{
        position: 'absolute',
        width: 0,
        height: 0,
        overflow: 'hidden',
      }}
      aria-hidden="true"
    >
      <defs>
        {/* Chalk Sketch Filter - Creates hand-drawn, irregular borders */}
        <filter id="chalk-sketch" x="-50%" y="-50%" width="200%" height="200%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.05"
            numOctaves="3"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="2"
            xChannelSelector="R"
            yChannelSelector="G"
            result="displaced"
          />
          <feGaussianBlur in="displaced" stdDeviation="0.3" result="blurred" />
          <feComposite in="blurred" in2="SourceAlpha" operator="in" />
        </filter>

        {/* Chalk Glow Filter - Soft white glow around chalk strokes */}
        <filter id="chalk-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
          <feFlood floodColor="rgba(236, 236, 236, 0.3)" result="color" />
          <feComposite in="color" in2="blur" operator="in" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Strong Chalk Glow - More pronounced glow for emphasis */}
        <filter id="chalk-glow-strong" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur1" />
          <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" result="blur2" />
          <feFlood floodColor="rgba(236, 236, 236, 0.4)" result="color1" />
          <feFlood floodColor="rgba(236, 236, 236, 0.2)" result="color2" />
          <feComposite in="color1" in2="blur1" operator="in" result="glow1" />
          <feComposite in="color2" in2="blur2" operator="in" result="glow2" />
          <feMerge>
            <feMergeNode in="glow1" />
            <feMergeNode in="glow2" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Chalk Texture Filter - Adds grainy texture */}
        <filter id="chalk-texture">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="4"
            seed="2"
            result="texture"
          />
          <feColorMatrix
            in="texture"
            type="saturate"
            values="0"
            result="grayscale"
          />
          <feBlend in="SourceGraphic" in2="grayscale" mode="overlay" />
        </filter>

        {/* Rough Edge Filter - Creates imperfect, hand-drawn edges */}
        <filter id="rough-edge" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence
            type="turbulence"
            baseFrequency="0.02"
            numOctaves="2"
            result="turbulence"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="turbulence"
            scale="3"
            xChannelSelector="R"
            yChannelSelector="G"
            result="displacement"
          />
        </filter>

        {/* Slate Texture Pattern */}
        <pattern
          id="slate-texture"
          x="0"
          y="0"
          width="300"
          height="300"
          patternUnits="userSpaceOnUse"
        >
          <rect width="300" height="300" fill="#131314" />
          <filter id="slate-noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="4"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect
            width="300"
            height="300"
            filter="url(#slate-noise)"
            opacity="0.08"
          />
        </pattern>

        {/* Hand-drawn Circle for Buttons */}
        <symbol id="chalk-circle" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            filter="url(#rough-edge)"
            opacity="0.8"
          />
        </symbol>

        {/* Hand-drawn Rounded Rectangle */}
        <symbol id="chalk-rect" viewBox="0 0 200 100">
          <rect
            x="5"
            y="5"
            width="190"
            height="90"
            rx="12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            filter="url(#rough-edge)"
            opacity="0.8"
          />
        </symbol>
      </defs>
    </svg>
  );
}
