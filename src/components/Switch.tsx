type Props = { checked: boolean; onChange: (val: boolean) => void; id?: string; label?: string };

export default function Switch({ checked, onChange, id, label }: Props) {
  return (
    <label htmlFor={id} className="inline-flex cursor-pointer select-none items-center gap-3">
      {label && <span className="text-sm text-text-secondary">{label}</span>}
      <span
        className={`w-11 relative inline-flex h-6 items-center rounded-full transition-colors duration-fast ${checked ? "bg-accent" : "bg-surface-300"}`}
      >
        <input
          id={id}
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span
          className={`h-5 w-5 shadow inline-block transform rounded-full bg-surface-100 transition-transform duration-fast ${checked ? "translate-x-6" : "translate-x-1"}`}
        />
      </span>
    </label>
  );
}
