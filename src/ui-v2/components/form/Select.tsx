import React from "react";

type Option = { value: string; label: string; disabled?: boolean };
type Props = {
  value: string;
  onChange: (v: string) => void;
  options: Option[];
  id?: string;
};

export const Select: React.FC<Props> = ({ value, onChange, options, id }) => {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-11 w-full rounded-xl border border-white/15 bg-white/5 px-3 outline-none focus:border-accent-400"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value} disabled={opt.disabled}>
          {opt.label}
        </option>
      ))}
    </select>
  );
};
