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
            className={`rounded-full px-3 py-1.5 text-sm backdrop-blur-md ${
              active
                ? "text-white [background-image:linear-gradient(135deg,#7C4DFF_0%,#5B8CFF_100%)] border border-transparent"
                : "border border-white/30 bg-white/60 hover:bg-white/70"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
