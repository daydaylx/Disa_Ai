import React from "react";

type Props = {
  disabled?: boolean;
  onSend: (text: string) => void;
};

export const Composer: React.FC<Props> = ({ disabled, onSend }) => {
  const [value, setValue] = React.useState("");

  const doSend = () => {
    const t = value.trim();
    if (!t || disabled) return;
    setValue("");
    onSend(t);
  };

  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-2">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            doSend();
          }
        }}
        className="h-11 max-h-40 min-h-[2.75rem] resize-y rounded-xl border border-white/15 bg-white/5 px-3 py-2 outline-none focus:border-accent-400"
        placeholder={
          disabled ? "Nicht verfügbar…" : "Nachricht eingeben… (Shift+Enter für Zeilenumbruch)"
        }
        disabled={disabled}
      />
      <button
        className="btn-primary"
        onClick={doSend}
        disabled={disabled || !value.trim()}
        aria-label="Senden"
        title="Senden"
      >
        Senden
      </button>
    </div>
  );
};
