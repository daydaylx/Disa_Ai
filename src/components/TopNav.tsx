import * as React from "react";

export type Tab = "chat" | "settings";

interface Props {
  tab: Tab;
  onChange: (t: Tab) => void;
}

export default function TopNav({ tab, onChange }: Props): JSX.Element {
  const LinkBtn = ({ to, children }: { to: Tab; children: React.ReactNode }) => {
    const active = tab === to;
    return (
      <button
        type="button"
        onClick={() => onChange(to)}
        className={`rounded-lg border px-3 py-1.5 text-sm ${
          active
            ? "border-indigo-600 bg-indigo-600 text-white"
            : "border-neutral-300 text-neutral-200 hover:bg-neutral-900 dark:border-neutral-700"
        }`}
        title={typeof children === "string" ? (children as string) : undefined}
      >
        {children}
      </button>
    );
  };

  return (
    <nav className="flex items-center gap-3 border-b border-neutral-800 bg-black/90 px-4 py-2">
      {/* Brand */}
      <div className="flex items-center gap-2 font-semibold tracking-tight text-white">
        <span className="inline-block h-2 w-2 rounded-full bg-gradient-to-tr from-indigo-400 to-fuchsia-400" />
        <span>Disa AI</span>
      </div>

      {/* Nav-Links */}
      <div className="ml-3 flex items-center gap-2">
        <LinkBtn to="chat">Home</LinkBtn>
        <LinkBtn to="chat">Chat</LinkBtn>
        <LinkBtn to="settings">Einstellungen</LinkBtn>
      </div>

      {/* CTA rechts */}
      <button
        type="button"
        onClick={() => onChange("chat")}
        className="ml-auto rounded-full border border-indigo-600 bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-indigo-500"
        title="Loslegen"
      >
        Loslegen
      </button>
    </nav>
  );
}
