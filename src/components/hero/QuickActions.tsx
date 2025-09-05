import React from "react";

export interface QuickAction {
  title: string; desc: string; onClick: () => void;
}

export const QuickActions: React.FC<{ items: QuickAction[] }> = ({ items }) => {
  return (
    <section className="safe-pad">
      <div className="grid grid-cols-2 gap-3">
        {items.map((it, idx) => (
          <button
            key={idx}
            className="tile tap text-left tilt-on-press"
            onClick={it.onClick}
          >
            <div className="text-base font-semibold mb-1 h2">{it.title}</div>
            <div className="text-xs desc leading-snug line-clamp-2">{it.desc}</div>
          </button>
        ))}
      </div>
    </section>
  );
};
