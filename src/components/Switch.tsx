import React from "react";

type Props = { checked: boolean; onChange: (val: boolean) => void; id?: string; label?: string };

export default function Switch({ checked, onChange, id, label }: Props) {
  return (
    <label htmlFor={id} className="inline-flex cursor-pointer select-none items-center gap-3">
      {label && <span className="text-sm">{label}</span>}
      <span
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${checked ? "bg-blue-600" : "bg-neutral-300 dark:bg-neutral-700"}`}
      >
        <input
          id={id}
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition dark:bg-neutral-900 ${checked ? "translate-x-6" : "translate-x-1"}`}
        />
      </span>
    </label>
  );
}
