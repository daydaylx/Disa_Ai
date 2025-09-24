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
      <article className="hover:shadow-accent/10 flex items-center gap-6 rounded-xl bg-bg-elevated p-6 transition-all duration-300 hover:scale-[1.01] hover:shadow-xl">
        <div
          aria-hidden
          className="border-accent/30 bg-bg-base/10 hover:border-accent/50 hover:bg-bg-base/20 flex h-16 w-16 shrink-0 items-center justify-center rounded-full border backdrop-blur-sm transition-all duration-300"
        >
          <div className="from-accent/80 to-primary/60 h-6 w-6 animate-pulse rounded-full bg-gradient-to-br shadow-lg transition-all duration-300 hover:scale-110"></div>
        </div>
        <div className="flex-1 space-y-3">
          <p className="text-sm font-medium tracking-wide text-text-muted">AI Assistant</p>
          <h2 className="text-xl font-semibold tracking-tight text-text-default">Disa AI</h2>
          <p className="text-sm text-text-muted">Professional AI-powered conversation partner</p>
          <button
            onClick={onStart}
            className="hover:bg-primary/90 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-text-inverted transition-all duration-200 hover:scale-105 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Start Conversation
          </button>
        </div>
      </article>

      {/* Quick Start Suggestions */}
      <div className="hover:bg-bg-elevated/80 hover:shadow-accent/5 rounded-xl bg-bg-elevated p-6 transition-all duration-300 hover:shadow-lg">
        <h3 className="mb-4 text-base font-semibold text-text-default">Quick Start Ideas</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={onStart}
              className="bg-bg-base/40 hover:border-accent/40 hover:bg-bg-base/80 hover:shadow-accent/10 group flex items-center gap-3 rounded-lg border border-white/10 p-4 text-left transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
            >
              <div className="bg-accent/60 h-2 w-2 rounded-full transition-all duration-200 group-hover:scale-125 group-hover:bg-accent"></div>
              <span className="text-sm font-medium text-text-muted group-hover:text-text-default">
                {suggestion}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Features Overview */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="hover:bg-bg-elevated/80 hover:shadow-accent/10 rounded-xl bg-bg-elevated p-4 text-center transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
          <div className="from-accent/20 to-primary/20 hover:from-accent/30 hover:to-primary/30 mx-auto mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br transition-all duration-300 hover:scale-110">
            <div className="bg-accent/80 h-3 w-3 rounded transition-all duration-300 hover:scale-125"></div>
          </div>
          <h4 className="mb-2 text-sm font-semibold text-text-default">Smart Responses</h4>
          <p className="text-xs text-text-muted">Contextual and accurate answers</p>
        </div>

        <div className="hover:bg-bg-elevated/80 hover:shadow-primary/10 rounded-xl bg-bg-elevated p-4 text-center transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
          <div className="from-primary/20 to-accent/20 hover:from-primary/30 hover:to-accent/30 mx-auto mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br transition-all duration-300 hover:scale-110">
            <div className="bg-primary/80 h-3 w-3 rounded transition-all duration-300 hover:scale-125"></div>
          </div>
          <h4 className="mb-2 text-sm font-semibold text-text-default">Multiple Styles</h4>
          <p className="text-xs text-text-muted">Adapt tone and approach</p>
        </div>

        <div className="hover:bg-bg-elevated/80 hover:shadow-accent/10 rounded-xl bg-bg-elevated p-4 text-center transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
          <div className="from-accent/20 to-primary/20 hover:from-accent/30 hover:to-primary/30 mx-auto mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br transition-all duration-300 hover:scale-110">
            <div className="from-accent/80 to-primary/80 h-3 w-3 rounded bg-gradient-to-r transition-all duration-300 hover:scale-125"></div>
          </div>
          <h4 className="mb-2 text-sm font-semibold text-text-default">Offline Ready</h4>
          <p className="text-xs text-text-muted">Works without internet</p>
        </div>
      </div>
    </div>
  );
}
