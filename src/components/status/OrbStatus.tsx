type Props = {
  streaming: boolean;
  modelLabel: string;
};

export default function OrbStatus({ streaming, modelLabel }: Props) {
  return (
    <div className="mx-auto mb-2 mt-1 w-full max-w-3xl">
      <div className="shadow-soft flex items-center gap-3 rounded-xl border border-neutral-800 bg-neutral-900/70 px-3 py-2 backdrop-blur">
        <span
          aria-hidden
          className={[
            "inline-block h-2.5 w-2.5 rounded-full",
            streaming ? "animate-pulse bg-emerald-400" : "bg-neutral-400",
          ].join(" ")}
        />
        <div className="flex min-w-0 flex-col">
          <div className="truncate text-sm text-neutral-200">
            {streaming ? "Denke…" : "Bereit."}
          </div>
          <div className="truncate text-xs text-neutral-400">
            Modell: {modelLabel}
            <span className="mx-1 text-neutral-600">·</span>
            <a
              href="#/settings"
              className="text-violet-300 hover:text-violet-200 hover:underline"
              aria-label="Modell ändern in den Einstellungen"
            >
              Modell ändern
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
