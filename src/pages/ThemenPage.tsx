import { useNavigate } from "react-router-dom";

import type { Quickstart } from "@/config/quickstarts";
import { CATEGORY_LABELS, QUICKSTARTS } from "@/config/quickstarts";
import { ArrowRight, Brain } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Button } from "@/ui";

const regularDiscussions = QUICKSTARTS.filter((q) => q.category !== "verschwörungstheorien");
const conspiracyDiscussions = QUICKSTARTS.filter((q) => q.category === "verschwörungstheorien");

export default function ThemenPage() {
  const navigate = useNavigate();

  const handleStartQuickstart = (quickstart: Quickstart) => {
    void navigate(`/chat?quickstart=${quickstart.id}&title=Diskussion: ${quickstart.title}`);
  };

  const renderCard = (quickstart: Quickstart) => {
    const categoryInfo = quickstart.category ? CATEGORY_LABELS[quickstart.category] : null;
    return (
      <button
        key={quickstart.id}
        onClick={() => handleStartQuickstart(quickstart)}
        className={cn(
          "w-full text-left p-4 rounded-xl border border-border-ink/20 bg-bg-page",
          "hover:border-accent-primary/30 hover:bg-surface-2/50 transition-all",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary",
          "active:scale-[0.99]",
        )}
      >
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-lg bg-accent-primary/10">
            <Brain className="h-5 w-5 text-accent-primary" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-ink-primary line-clamp-1">
              {quickstart.title}
            </h3>
            <p className="text-sm text-ink-secondary mt-1 line-clamp-2 leading-relaxed">
              {quickstart.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              {categoryInfo && (
                <span className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium bg-accent-primary/10 text-accent-primary">
                  {categoryInfo.label}
                </span>
              )}
              {quickstart.speculative && (
                <span className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium bg-warning/10 text-warning">
                  Hypothese
                </span>
              )}
            </div>
          </div>

          {/* Arrow */}
          <ArrowRight className="h-5 w-5 text-ink-tertiary flex-shrink-0 mt-1" />
        </div>
      </button>
    );
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-ink-primary">Themen & Diskussionen</h1>
        <p className="text-base text-ink-secondary leading-relaxed">
          Wähle ein Thema, um eine Diskussion mit Disa zu starten.
        </p>
      </div>

      {/* Regular Discussions */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-ink-primary">Diskussionen</h2>
        <div className="space-y-2">{regularDiscussions.map(renderCard)}</div>
      </section>

      {/* Conspiracy Theories Section */}
      {conspiracyDiscussions.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-ink-primary">Verschwörungstheorien</h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-warning/10 text-warning font-medium">
              Kontrovers
            </span>
          </div>
          <div className="space-y-2">{conspiracyDiscussions.map(renderCard)}</div>
        </section>
      )}

      {/* Back to Chat */}
      <div className="pt-4 border-t border-border-ink/10">
        <Button variant="ghost" onClick={() => navigate("/")} className="w-full justify-center">
          ← Zurück zum Chat
        </Button>
      </div>
    </div>
  );
}
