import React from "react";
export type QuickAction = { title: string; desc: string; prompt: string };
export type QuickActionsProps = { onPick?: (text: string) => void };
const PRESETS: QuickAction[] = [
  {
    title: "Alltag",
    desc: "5 Ideen für mehr Produktivität – kurz & konkret.",
    prompt: "Gib mir 5 schnelle, konkrete Produktivitätsideen für heute.",
  },
  {
    title: "Gesundheit",
    desc: "3-Tage-Plan für ausgewogene Ernährung.",
    prompt: "Erstelle mir einen realistischen 3-Tage-Ernährungsplan.",
  },
  {
    title: "Dev",
    desc: "Clean-Code in 7 Bulletpoints.",
    prompt: "Fasse Clean-Code-Prinzipien in 7 prägnanten Bulletpoints zusammen.",
  },
  {
    title: "Business",
    desc: "Kurze SWOT für Coffeeshop.",
    prompt: "Skizziere eine kurze SWOT-Analyse für einen Coffeeshop in Innenstadtlage.",
  },
];
function fillComposer(text: string) {
  const el = document.querySelector<HTMLTextAreaElement>('[data-testid="composer-input"]');
  if (!el) return;
  const setter = Object.getOwnPropertyDescriptor(
    window.HTMLTextAreaElement.prototype,
    "value",
  )?.set;
  setter?.call(el, text);
  el.dispatchEvent(new Event("input", { bubbles: true }));
  el.focus();
}
const QuickActions: React.FC<QuickActionsProps> = ({ onPick }) => (
  <div className="safe-pad mb-4 grid grid-cols-2 gap-3">
    {PRESETS.map((it) => (
      <button
        key={it.title}
        className="tile tap tilt-on-press text-left"
        onClick={() => (onPick ? onPick(it.prompt) : fillComposer(it.prompt))}
        aria-label={it.title}
      >
        <div className="h2 mb-1 text-base font-semibold">{it.title}</div>
        <div className="desc line-clamp-2 text-xs leading-snug">{it.desc}</div>
      </button>
    ))}
  </div>
);
export default QuickActions;
