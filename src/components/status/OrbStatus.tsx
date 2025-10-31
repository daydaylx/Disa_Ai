type Props = {
  streaming: boolean;
  modelLabel: string;
};

export default function OrbStatus({ streaming, modelLabel }: Props) {
  return (
    <div className="mx-auto mb-2 mt-1 w-full max-w-3xl">
      <div className="border-border bg-surface-card flex items-center gap-3 rounded-lg border px-3 py-2">
        <span
          aria-hidden
          className={[
            "inline-block h-2.5 w-2.5 rounded-full",
            streaming ? "bg-success animate-pulse" : "bg-text-1",
          ].join(" ")}
        />
        <div className="flex min-w-0 flex-col">
          <div className="text-text-primary truncate text-sm">
            {streaming ? "Denke…" : "Bereit."}
          </div>
          <div className="text-text-secondary truncate text-xs">
            Modell: {modelLabel}
            <span className="text-text-secondary mx-1">·</span>
            <a
              href="#/settings/api"
              className="text-brand hover:underline"
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
