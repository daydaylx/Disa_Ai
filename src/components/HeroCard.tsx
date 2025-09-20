export default function HeroCard({ onStart }: { onStart: () => void }) {
  return (
    <article className="card-elev2 flex items-center gap-6">
      <div
        aria-hidden
        className="h-16 w-16 flex shrink-0 items-center justify-center rounded-full border border-border-strong bg-surface-200 text-2xl"
      >
        ✨
      </div>
      <div className="flex-1 space-y-2">
        <p className="text-sm text-text-secondary">Dein KI-Assistent</p>
        <h2 className="text-lg font-semibold">Triff Disa</h2>
        <p className="text-sm text-text-muted">Direkt, ehrlich, schnell.</p>
        <button onClick={onStart} className="btn btn-primary btn-sm">
          Los geht’s
        </button>
      </div>
    </article>
  );
}
