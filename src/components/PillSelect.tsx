import React from "react";

type Opt = { value: string; label: string };
type Props = { value: string; options: Opt[]; onChange: (v: string) => void };

export default function PillSelect({ value, options, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={active ? "nav-pill nav-pill--active" : "nav-pill"}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
