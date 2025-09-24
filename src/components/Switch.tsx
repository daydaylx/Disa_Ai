type Props = { checked: boolean; onChange: (val: boolean) => void; id?: string; label?: string };

export default function Switch({ checked, onChange, id, label }: Props) {
  return (
    <label htmlFor={id} className="inline-flex cursor-pointer select-none items-center gap-3">
      {label && <span className="text-sm text-text-secondary">{label}</span>}
      <span
        className={`duration-fast relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? "bg-accent" : "bg-surface-300"}`}
      >
        <input
          id={id}
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span
          className={`bg-surface-100 duration-fast inline-block h-5 w-5 transform rounded-full shadow transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`}
        />
      </span>
    </label>
  );
}
