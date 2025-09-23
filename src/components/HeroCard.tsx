export default function HeroCard({ onStart }: { onStart: () => void }) {
  return (
    <article className="card-elev2 flex items-center gap-6">
      <div
        aria-hidden
        className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-accent-teal/30 bg-glass-surface/10 backdrop-blur-sm"
      >
        <div className="h-6 w-6 rounded-full bg-gradient-to-br from-accent-teal/80 to-accent-violet/60 shadow-lg"></div>
      </div>
      <div className="flex-1 space-y-3">
        <p className="text-sm font-medium tracking-wide text-text-secondary/90">AI Assistant</p>
        <h2 className="text-xl font-semibold tracking-tight">Disa AI</h2>
        <p className="text-sm text-text-muted/85">Professional AI-powered conversation partner</p>
        <button onClick={onStart} className="glass-button glass-button--primary">
          Get Started
        </button>
      </div>
    </article>
  );
}
