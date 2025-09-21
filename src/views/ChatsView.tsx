import * as React from "react";

import { GlassCard } from "../components/glass/GlassCard";
import { Button } from "../components/ui/Button";
import { useConversations } from "../hooks/useConversations";
import { TouchGestureHandler } from "../lib/touch/gestures";
import { hapticFeedback } from "../lib/touch/haptics";

type Props = { onOpen: (id: string) => void };

export default function ChatsView({ onOpen }: Props) {
  const conv = useConversations();
  const [title, setTitle] = React.useState("");
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Pull-to-refresh functionality
  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handler = new TouchGestureHandler(container, {
      swipeThreshold: 100,
      preventDefaultSwipe: false,
    });

    handler.onSwipeGesture((event) => {
      // Pull down to refresh when at top of list
      if (event.direction === "down" && container.scrollTop === 0 && !isRefreshing) {
        setIsRefreshing(true);
        hapticFeedback.success();

        // Simulate refresh (reload conversations)
        setTimeout(() => {
          conv.refresh?.(); // If refresh method exists
          setIsRefreshing(false);
          hapticFeedback.tap();
        }, 1000);
      }
    });

    return () => handler.destroy();
  }, [conv, isRefreshing]);

  return (
    <div
      ref={containerRef}
      className="scroll-container mx-auto w-full max-w-4xl space-y-6 px-4 py-6"
    >
      {/* Pull-to-refresh indicator */}
      {isRefreshing && (
        <GlassCard variant="floating" className="flex items-center justify-center py-4">
          <div className="border-accent-500 h-6 w-6 animate-spin rounded-full border-2 border-t-transparent" />
          <span className="text-neutral-300 ml-2 text-sm">Aktualisiere...</span>
        </GlassCard>
      )}

      <GlassCard variant="floating" tint="mint" className="p-8">
        <div className="mb-6 flex items-center justify-center gap-3">
          <div className="bg-mint-500/20 rounded-xl p-3">
            <span className="text-3xl">💬</span>
          </div>
          <div className="text-left">
            <h1 className="text-3xl from-mint-400 to-cyan-400 bg-gradient-to-r bg-clip-text font-bold text-transparent">
              Unterhaltungen
            </h1>
            <p className="text-neutral-300 text-lg">Deine Chat-Historie verwalten</p>
          </div>
        </div>

        <div className="flex justify-center gap-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titel (optional)"
            className="glass-input max-w-xs flex-1"
            aria-label="Titel der neuen Unterhaltung"
            data-testid="chats-title-input"
          />
          <Button
            variant="primary"
            onClick={() => {
              const meta = conv.create(title.trim() || "Neue Unterhaltung");
              setTitle("");
              onOpen(meta.id);
            }}
            data-testid="chats-new"
          >
            Neu erstellen
          </Button>
        </div>
      </GlassCard>

      <section className="grid gap-4">
        {conv.items.map((m) => (
          <GlassCard
            key={m.id}
            variant="soft"
            className="p-4 transition-all duration-200 hover:scale-[1.02]"
            interactive
            enhanced
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h3 className="text-white truncate font-medium">{m.title}</h3>
                <div className="mt-1 space-y-1">
                  <div className="glass-badge glass-badge--accent text-xs">
                    {new Date(m.updatedAt).toLocaleString()}
                  </div>
                  <div className="text-neutral-400 truncate font-mono text-xs">{m.id}</div>
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => onOpen(m.id)}
                  aria-label="Öffnen"
                  data-testid="chats-open"
                >
                  Öffnen
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => conv.remove(m.id)}
                  aria-label="Löschen"
                  data-testid="chats-delete"
                >
                  Löschen
                </Button>
              </div>
            </div>
          </GlassCard>
        ))}
        {conv.items.length === 0 && (
          <GlassCard variant="soft" className="p-8 text-center">
            <div className="space-y-3">
              <div className="text-4xl">💭</div>
              <h3 className="text-white font-medium">Noch keine Unterhaltungen</h3>
              <p className="text-neutral-400 text-sm">Erstelle oben deine erste Unterhaltung</p>
            </div>
          </GlassCard>
        )}
      </section>
    </div>
  );
}

export { ChatsView };
