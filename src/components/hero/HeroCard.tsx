import React from "react";

interface Props {
  onStart?: () => void;
}

export const HeroCard: React.FC<Props> = ({ onStart }) => {
  return (
    <section className="safe-pad mt-3 mb-4">
      <div className="relative overflow-hidden card-round glass p-4">
        {/* weiche Gradient-Füllung */}
        <div className="absolute inset-0 opacity-70 grad-surface" />
        {/* Deko-Glow */}
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full blur-3xl"
             style={{ background: "radial-gradient(circle, rgba(255,142,209,.55), transparent 60%)" }} />
        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full grad-surface" />
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Triff Disa</h2>
              <p className="text-sm opacity-90">Dein KI-Assistent. Direkt, ehrlich, schnell.</p>
            </div>
          </div>

          <button
            className="mt-4 tap pill btn-glow px-4 py-2 text-sm font-semibold"
            onClick={onStart}
            data-testid="hero-start"
          >
            Los geht’s
          </button>
        </div>
      </div>
    </section>
  );
};
