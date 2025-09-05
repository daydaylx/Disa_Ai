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
            className={`rounded-full border px-3 py-1.5 text-sm ${active ? "border-blue-600 bg-blue-600 text-white" : "border-neutral-300 hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"}`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
