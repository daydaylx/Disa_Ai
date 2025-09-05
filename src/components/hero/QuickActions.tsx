import React from "react";

export type QuickAction = {
  title: string;
  desc: string;
  prompt: string;
};

export type QuickActionsProps = {
  onPick?: (text: string) => void;
};

const PRESETS: QuickAction[] = [
  { title: "Alltag", desc: "5 Ideen für mehr Produktivität – kurz & konkret.", prompt: "Gib mir 5 schnelle, konkrete Produktivitätsideen für heute." },
  { title: "Gesundheit", desc: "3-Tage-Plan für ausgewogene Ernährung.", prompt: "Erstelle mir einen realistischen 3-Tage-Ernährungsplan." },
  { title: "Dev", desc: "Clean-Code in 7 Bulletpoints.", prompt: "Fasse Clean-Code-Prinzipien in 7 prägnanten Bulletpoints zusammen." },
  { title: "Business", desc: "Kurze SWOT für Coffeeshop.", prompt: "Skizziere eine kurze SWOT-Analyse für einen Coffeeshop in Innenstadtlage." },
];

function fillComposer(text: string) {
  const el = document.querySelector<HTMLTextAreaElement>('[data-testid="composer-input"]');
  if (!el) return;
  const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")?.set;
  setter?.call(el, text);
  el.dispatchEvent(new Event("input", { bubbles: true }));
  el.focus();
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onPick }) => {
  return (
    <div className="safe-pad grid grid-cols-2 gap-3 mb-4">
      {PRESETS.map((it) => (
        <button
          key={it.title}
          className="tile tap text-left tilt-on-press"
          onClick={() => (onPick ? onPick(it.prompt) : fillComposer(it.prompt))}
          aria-label={it.title}
        >
          <div className="text-base font-semibold mb-1 h2">{it.title}</div>
          <div className="text-xs desc leading-snug line-clamp-2">{it.desc}</div>
        </button>
      ))}
    </div>
  );
};

export default QuickActions;
