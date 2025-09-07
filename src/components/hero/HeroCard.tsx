import React from "react";

import Logo from "../Logo";
export type HeroCardProps = { onStart?: () => void };
const HeroCard: React.FC<HeroCardProps> = ({ onStart }) => (
  <section className="safe-pad mb-3 mt-2">
    <div className="card-round glass hero-card relative overflow-hidden p-3 shadow-soft">
      <div className="grad-surface grad-anim absolute inset-0 opacity-30" />
      <div className="relative flex items-center gap-3">
        <div className="rounded-full bg-white/60 p-1 backdrop-blur-md shadow-soft">
          <Logo className="h-10 w-10" />
        </div>
        <div className="min-w-0">
          <h2 className="h1">Hey, ich bin dein Assi.</h2>
          <p className="text-sm opacity-90">Frag mich alles – ich antworte direkt und hilfreich.</p>
        </div>
        {/* Optionaler Start-Trigger, wenn übergeben */}
        {onStart ? (
          <button
            onClick={onStart}
            className="ml-auto rounded-[14px] border border-white/30 bg-white/60 px-3 py-1.5 text-sm backdrop-blur-md"
          >
            Start
          </button>
        ) : null}
      </div>
    </div>
  </section>
);
export default HeroCard;
