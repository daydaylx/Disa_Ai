import React from "react";
export type HeroCardProps = { onStart?: () => void };
const HeroCard: React.FC<HeroCardProps> = ({ onStart }) => (
  <section className="safe-pad mb-4 mt-3">
    <div className="card-round glass hero-card relative overflow-hidden p-4">
      <div className="grad-surface grad-anim absolute inset-0 opacity-75" />
      <div
        className="absolute -right-10 -top-10 h-40 w-40 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(255,142,209,.45), transparent 60%)" }}
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-10 -left-10 h-36 w-36 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(40,215,255,.35), transparent 60%)" }}
        aria-hidden="true"
      />
      <div className="relative flex items-center gap-3">
        <div className="orb float glow-pulse" aria-hidden="true" />
        <div className="min-w-0">
          <h2 className="h1">Triff Disa</h2>
          <p className="text-sm opacity-90">Dein KI-Assistent. Direkt, ehrlich, schnell.</p>
        </div>
      </div>
      <button
        className="tap pill btn-glow glow-pulse tilt-on-press mt-4 px-4 py-2 text-sm font-semibold"
        onClick={onStart}
        data-testid="hero-start"
      >
        Los geht’s
      </button>
    </div>
  </section>
);
export default HeroCard;
