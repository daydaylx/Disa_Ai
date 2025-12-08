import { useNavigate } from "react-router-dom";

import type { Quickstart } from "@/config/quickstarts";
import { CATEGORY_LABELS, QUICKSTARTS } from "@/config/quickstarts";
import { AlertTriangle, ArrowRight, Brain } from "@/lib/icons";
import { Badge, Button, Card, PageHeader } from "@/ui";

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
      <Card
        key={quickstart.id}
        variant="interactive"
        role="button"
        onClick={() => handleStartQuickstart(quickstart)}
        className="group relative flex items-start gap-4 p-4 transition-all duration-300 bg-surface-1/60 border-white/5 hover:bg-surface-1/80 hover:border-white/10 shadow-sm"
      >
        {/* Icon */}
        <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-surface-2/80 flex items-center justify-center text-accent-chat transition-colors group-hover:bg-accent-chat/10 group-hover:text-accent-chat">
          <Brain className="h-5 w-5" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-ink-primary truncate">{quickstart.title}</h3>
            <ArrowRight className="h-4 w-4 text-ink-tertiary opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
          </div>

          <p className="text-xs text-ink-secondary line-clamp-2 leading-relaxed">
            {quickstart.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {categoryInfo && (
              <Badge
                variant="secondary"
                className="text-[10px] px-2 h-5 bg-surface-3/50 border-white/5"
              >
                {categoryInfo.label}
              </Badge>
            )}
            {quickstart.speculative && (
              <Badge variant="warning" className="text-[10px] px-2 h-5">
                Hypothese
              </Badge>
            )}
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header Zone - Vibrant Glass */}
      <div className="flex-none sticky top-[3.5rem] lg:top-[4rem] z-sticky-content pt-4 px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-bg-app/80 shadow-lg backdrop-blur-xl">
          {/* Ambient Header Glow - Chat accent for discussion topics */}
          <div className="absolute inset-0 bg-gradient-to-r from-accent-chat/10 via-transparent to-transparent pointer-events-none" />

          <div className="relative p-4 sm:p-5">
            <PageHeader
              title="Themen & Diskussionen"
              description="Wähle ein Thema, um eine Diskussion mit Disa zu starten."
              className="mb-0"
            />
          </div>
        </div>
      </div>

      {/* Content Zone - Scrollable List */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-8">
        {/* Regular Discussions */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-ink-secondary uppercase tracking-wider px-1">
            Diskussionen
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {regularDiscussions.map(renderCard)}
          </div>
        </section>

        {/* Conspiracy Theories Section */}
        {conspiracyDiscussions.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <AlertTriangle className="h-4 w-4 text-status-warning" />
              <h2 className="text-sm font-semibold text-ink-secondary uppercase tracking-wider">
                Verschwörungstheorien
              </h2>
              <Badge
                variant="outline"
                className="ml-auto border-status-warning/30 text-status-warning text-[10px] h-5"
              >
                Kontrovers
              </Badge>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {conspiracyDiscussions.map(renderCard)}
            </div>
          </section>
        )}

        {/* Back to Chat Action */}
        <div className="pt-8 pb-4 flex justify-center">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-ink-secondary hover:text-ink-primary"
          >
            ← Zurück zum Chat
          </Button>
        </div>
      </div>
    </div>
  );
}
