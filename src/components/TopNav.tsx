import * as React from "react";

export type Tab = "chat" | "settings";

interface Props {
  tab: Tab;
  onChange: (t: Tab) => void;
}

export default function TopNav({ tab, onChange }: Props): JSX.Element {
  const LinkBtn = ({
    to,
    children,
  }: {
    to: Tab;
    children: React.ReactNode;
  }) => {
    const active = tab === to;
    return (
      <button
        type="button"
        onClick={() => onChange(to)}
        className={`px-3 py-1.5 rounded-lg text-sm border ${
          active
            ? "border-indigo-600 text-white bg-indigo-600"
            : "border-neutral-300 dark:border-neutral-700 text-neutral-200 hover:bg-neutral-900"
        }`}
        title={typeof children === "string" ? (children as string) : undefined}
      >
        {children}
      </button>
    );
  };

  return (
    <nav className="flex items-center gap-3 border-b border-neutral-800 px-4 py-2 bg-black/90">
      {/* Brand */}
      <div className="flex items-center gap-2 text-white font-semibold tracking-tight">
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
        className="ml-auto px-4 py-1.5 rounded-full text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-500 border border-indigo-600"
        title="Loslegen"
      >
        Loslegen
      </button>
    </nav>
  );
}
