import React from "react";

type Props = {
  checked: boolean;
  onChange: (v: boolean) => void;
  id?: string;
  label?: string;
};

export const Switch: React.FC<Props> = ({ checked, onChange, id, label }) => {
  return (
    <button
      id={id}
      type="button"
      aria-pressed={checked}
      onClick={() => onChange(!checked)}
      className={[
        "relative h-8 w-[3.25rem] rounded-full border transition-colors",
        checked ? "border-accent-400 bg-accent-500/70" : "border-white/20 bg-white/5",
      ].join(" ")}
    >
      <span
        className={[
          "absolute left-1 top-1 h-6 w-6 rounded-full bg-white/90 transition-transform",
          checked ? "translate-x-[1.25rem]" : "",
        ].join(" ")}
      />
      {label ? <span className="sr-only">{label}</span> : null}
    </button>
  );
};
