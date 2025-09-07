import React from "react";

type Action = { id: string; label: string; hint?: string };

type Props = {
  onPick: (id: string) => void;
};

export default function QuickActions({ onPick }: Props) {
  const recommended: Action[] = [
    { id: "summarize", label: "Text zusammenfassen", hint: "Kompakt & klar" },
    { id: "code_help", label: "Code erklären", hint: "Schritt für Schritt" },
  ];
  const freeOrCheap: Action[] = [
    { id: "brainstorm", label: "Ideen sammeln", hint: "Varianten" },
    { id: "translate", label: "Übersetzen", hint: "DE ⇄ EN" },
  ];
  const advanced: Action[] = [
    { id: "optimize", label: "Code optimieren", hint: "Performance/Lesbarkeit" },
    { id: "spec", label: "Spezifikation erstellen", hint: "Akzeptanzkriterien" },
  ];

  return (
    <div className="mx-auto grid w-full max-w-3xl grid-cols-1 gap-3">
      <Section title="Empfohlen" actions={recommended} onPick={onPick} />
      <Section title="Kostenlos/Günstig" actions={freeOrCheap} onPick={onPick} />
      <Section title="Erweitert" actions={advanced} onPick={onPick} />
    </div>
  );
}

function Section({
  title,
  actions,
  onPick,
}: {
  title: string;
  actions: Action[];
  onPick: (id: string) => void;
}) {
  if (!actions?.length) return null;
  return (
    <section>
      <h3 className="mb-2 text-sm font-semibold text-text-muted">{title}</h3>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {actions.map((a) => (
          <button
            key={a.id}
            className="glass px-3 py-2 text-left text-sm active:scale-[.99]"
            onClick={() => onPick(a.id)}
          >
            <div className="truncate">{a.label}</div>
            {a.hint ? <div className="truncate text-xs text-text-muted">{a.hint}</div> : null}
          </button>
        ))}
      </div>
    </section>
  );
}
