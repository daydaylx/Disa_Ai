import { useNavigate } from "react-router-dom";

import type { Quickstart } from "@/config/quickstarts";
import { CATEGORY_LABELS, QUICKSTARTS } from "@/config/quickstarts";
import { Brain } from "@/lib/icons";
import { Button } from "@/ui";
import { PremiumCard } from "@/ui/PremiumCard";

const regularDiscussions = QUICKSTARTS.filter((q) => q.category !== "verschwörungstheorien");
const conspiracyDiscussions = QUICKSTARTS.filter((q) => q.category === "verschwörungstheorien");

export default function ThemenPage() {
  const navigate = useNavigate();

  const handleStartQuickstart = (quickstart: Quickstart) => {
    // Navigate to chat with quickstart param
    void navigate(`/chat?quickstart=${quickstart.id}&title=Diskussion: ${quickstart.title}`);
  };

  const renderCard = (quickstart: Quickstart) => {
    const categoryInfo = quickstart.category ? CATEGORY_LABELS[quickstart.category] : null;
    return (
      <PremiumCard
        key={quickstart.id}
        className="flex flex-col gap-4 p-6 hover:shadow-xl transition-all border border-border-ink rounded-2xl bg-bg-page/80 shadow-lg"
        onClick={() => handleStartQuickstart(quickstart)}
      >
        <div className="flex items-start gap-3">
          <div className="h-12 w-12 flex shrink-0 items-center justify-center rounded-xl bg-surface-2 border border-border-ink">
            <Brain className="h-6 w-6 text-ink-primary" />
          </div>
          <div className="flex-1 min-w-0 space-y-2">
            <h3 className="text-xl font-semibold text-ink-primary">{quickstart.title}</h3>
            <p className="text-sm text-ink-secondary leading-relaxed">{quickstart.description}</p>
            <div className="flex flex-wrap gap-2">
              {categoryInfo && (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border">
                  {categoryInfo.label}
                </span>
              )}
              {quickstart.speculative && (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border">
                  Hypothese
                </span>
              )}
            </div>
          </div>
        </div>
        <Button variant="secondary" className="w-full mt-auto border-dashed">
          Diskussion starten
        </Button>
      </PremiumCard>
    );
  };

  return (
    <div className="flex flex-col gap-8 p-6 sm:p-8 max-w-4xl mx-auto">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-ink-primary">Themen & Diskussionen</h1>
        <p className="text-xl text-ink-secondary max-w-2xl leading-relaxed">
          Hier kannst du vorbereitete Themen auswählen, um mit Disa eine lockere Diskussion zu
          starten.
        </p>
      </div>

      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Diskussionen</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularDiscussions.map(renderCard)}
          </div>
        </div>

        {conspiracyDiscussions.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              Verschwörungstheorien
              <span className="text-sm px-2 py-1 rounded-full bg-orange-100 text-orange-800 font-medium">
                Kontrovers
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {conspiracyDiscussions.map(renderCard)}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
