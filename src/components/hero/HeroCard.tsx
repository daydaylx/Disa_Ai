import React from "react";

// Logo entfernt (Quarantäne)
export type HeroCardProps = { onStart?: () => void };
const HeroCard: React.FC<HeroCardProps> = ({ onStart }) => (
  <section className="safe-pad mb-3 mt-2">
    <div className="card-round glass hero-card relative overflow-hidden p-3 shadow-soft">
      <div className="grad-surface grad-anim absolute inset-0 opacity-30" />
      <div className="aurora-orb" style={{ right: "-20px", top: "-20px" }} />
      <div className="relative flex items-center gap-3">
        <div className="rounded-full glass p-1">
          {/* Logo entfernt */}
        </div>
        <div className="min-w-0">
          <h2 className="h1">Hey, ich bin dein Assi.</h2>
          <p className="text-sm opacity-90">Frag mich alles – ich antworte direkt und hilfreich.</p>
        </div>
        {/* Optionaler Start-Trigger, wenn übergeben */}
        {onStart ? (
          <button onClick={onStart} className="ml-auto btn-outline !py-1.5 !px-3 text-sm rounded-[14px]">
            Start
          </button>
        ) : null}
      </div>
    </div>
  </section>
);
export default HeroCard;
