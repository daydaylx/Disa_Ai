import React from "react";

export const HeroCard: React.FC<{ onStart?: () => void }> = ({ onStart }) => (
  <section className="safe-pad mt-3 mb-4">
    <div className="relative overflow-hidden card-round glass p-4">
      <div className="absolute inset-0 opacity-75 grad-surface grad-anim" />
      <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full blur-3xl"
           style={{ background: "radial-gradient(circle, rgba(255,142,209,.45), transparent 60%)" }} />
      <div className="absolute -bottom-10 -left-10 h-36 w-36 rounded-full blur-3xl"
           style={{ background: "radial-gradient(circle, rgba(40,215,255,.35), transparent 60%)" }} />
      <div className="relative flex items-center gap-3">
        <div className="orb float glow-pulse" aria-hidden="true" />
        <div className="min-w-0">
          <h2 className="text-xl font-semibold tracking-tight">Triff Disa</h2>
          <p className="text-sm opacity-90">Dein KI-Assistent. Direkt, ehrlich, schnell.</p>
        </div>
      </div>
      <button
        className="mt-4 tap pill btn-glow glow-pulse tilt-on-press px-4 py-2 text-sm font-semibold"
        onClick={onStart}
        data-testid="hero-start"
      >
        Los geht’s
      </button>
    </div>
  </section>
);

export default HeroCard;
