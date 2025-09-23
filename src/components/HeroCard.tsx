export default function HeroCard({ onStart }: { onStart: () => void }) {
  const suggestions = [
    "Explain complex topics",
    "Help with coding",
    "Creative writing",
    "Problem solving",
  ];

  return (
    <div className="space-y-8">
      {/* Main Hero Card */}
      <article className="card-elev2 flex items-center gap-6">
        <div
          aria-hidden
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-accent-teal/30 bg-glass-surface/10 backdrop-blur-sm"
        >
          <div className="h-6 w-6 animate-pulse rounded-full bg-gradient-to-br from-accent-teal/80 to-accent-violet/60 shadow-lg"></div>
        </div>
        <div className="flex-1 space-y-3">
          <p className="text-sm font-medium tracking-wide text-text-secondary/90">AI Assistant</p>
          <h2 className="text-xl font-semibold tracking-tight">Disa AI</h2>
          <p className="text-sm text-text-muted/85">Professional AI-powered conversation partner</p>
          <button
            onClick={onStart}
            className="glass-button glass-button--primary transition-transform hover:scale-105"
          >
            Start Conversation
          </button>
        </div>
      </article>

      {/* Quick Start Suggestions */}
      <div className="glass-card p-6">
        <h3 className="mb-4 text-base font-semibold text-text-primary">Quick Start Ideas</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={onStart}
              className="group flex items-center gap-3 rounded-xl border border-glass-border/30 bg-glass-surface/10 p-4 text-left transition-all hover:scale-[1.02] hover:border-accent-teal/40 hover:bg-glass-surface/20"
            >
              <div className="h-2 w-2 rounded-full bg-accent-teal/60 group-hover:bg-accent-teal"></div>
              <span className="text-sm font-medium text-text-secondary group-hover:text-text-primary">
                {suggestion}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Features Overview */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="glass-card p-4 text-center">
          <div className="mx-auto mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent-teal/20 to-accent-violet/20">
            <div className="h-3 w-3 rounded bg-accent-teal/80"></div>
          </div>
          <h4 className="mb-2 text-sm font-semibold text-text-primary">Smart Responses</h4>
          <p className="text-xs text-text-muted/80">Contextual and accurate answers</p>
        </div>

        <div className="glass-card p-4 text-center">
          <div className="mx-auto mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent-violet/20 to-accent-teal/20">
            <div className="h-3 w-3 rounded bg-accent-violet/80"></div>
          </div>
          <h4 className="mb-2 text-sm font-semibold text-text-primary">Multiple Styles</h4>
          <p className="text-xs text-text-muted/80">Adapt tone and approach</p>
        </div>

        <div className="glass-card p-4 text-center">
          <div className="mx-auto mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent-teal/20 to-accent-violet/20">
            <div className="h-3 w-3 rounded bg-gradient-to-r from-accent-teal/80 to-accent-violet/80"></div>
          </div>
          <h4 className="mb-2 text-sm font-semibold text-text-primary">Offline Ready</h4>
          <p className="text-xs text-text-muted/80">Works without internet</p>
        </div>
      </div>
    </div>
  );
}
