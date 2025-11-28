import { Book, Clock,X } from "@/lib/icons"; // Added Icons for better semantics
import { cn } from "@/lib/utils";
import { Button } from "@/ui/Button";

interface HistorySidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  activePages: Array<{ id: string; title: string }>;
  archivedPages: Array<{ id: string; title: string; date: string }>;
  activeChatId: string | null;
  onSelectChat: (id: string) => void;
}

export function HistorySidePanel({
  isOpen,
  onClose,
  activePages,
  archivedPages,
  activeChatId,
  onSelectChat,
}: HistorySidePanelProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-drawer flex justify-end isolate">
      {/* Overlay - Darkened Room metaphor */}
      <div
        className="absolute inset-0 bg-ink-primary/20 backdrop-blur-[2px] animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Panel - The Book Shelf */}
      <div className="relative w-[85%] max-w-sm h-full bg-bg-page shadow-2xl border-l border-border-ink animate-in slide-in-from-right duration-300 flex flex-col">
        {/* Header - Paper Texture */}
        <div className="flex items-center justify-between p-5 border-b border-border-ink bg-bg-surface/50">
          <div className="flex flex-col">
             <h2 className="text-lg font-serif font-bold text-ink-primary">Inhaltsverzeichnis</h2>
             <span className="text-xs text-ink-secondary">Deine Seiten & Geschichte</span>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Schließen">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-8">
          {/* Active Pages (Stack) */}
          <section>
            <div className="flex items-center gap-2 mb-3 text-accent">
                <Book className="w-4 h-4" />
                <h3 className="text-xs font-bold uppercase tracking-widest">Offene Seiten</h3>
            </div>

            <div className="space-y-3 pl-2 border-l-2 border-accent/20">
              {activePages.map((page) => (
                <button
                  key={page.id}
                  onClick={() => {
                    onSelectChat(page.id);
                    onClose();
                  }}
                  className={cn(
                    "w-full text-left p-3 rounded-md border transition-all duration-200",
                    activeChatId === page.id
                      ? "bg-white border-accent shadow-sm translate-x-1"
                      : "bg-bg-surface border-transparent hover:border-border-ink hover:bg-white text-ink-primary",
                  )}
                >
                  <div className="font-medium truncate font-serif text-base">{page.title}</div>
                  {activeChatId === page.id && (
                    <div className="text-xs mt-1 text-accent font-medium">Lesezeichen liegt hier</div>
                  )}
                </button>
              ))}
              {activePages.length === 0 && (
                 <div className="text-sm text-ink-secondary italic px-2">Keine offenen Seiten.</div>
              )}
            </div>
          </section>

          {/* Archived Pages */}
          <section>
             <div className="flex items-center gap-2 mb-3 text-ink-secondary">
                <Clock className="w-4 h-4" />
                <h3 className="text-xs font-bold uppercase tracking-widest">Archiv</h3>
            </div>
            <div className="space-y-1">
              {archivedPages.map((page) => (
                <button
                  key={page.id}
                  onClick={() => {
                    onSelectChat(page.id);
                    onClose();
                  }}
                  className="w-full text-left p-3 rounded-md hover:bg-bg-surface transition-colors flex justify-between items-center group border border-transparent hover:border-border-ink"
                >
                  <div className="truncate flex-1 pr-4">
                    <div className="text-ink-primary font-medium group-hover:text-accent transition-colors">
                      {page.title}
                    </div>
                    <div className="text-xs text-ink-secondary mt-0.5">{page.date}</div>
                  </div>
                </button>
              ))}
               {archivedPages.length === 0 && (
                 <div className="text-sm text-ink-secondary italic px-2">Das Archiv ist leer.</div>
              )}
            </div>
          </section>
        </div>

        {/* Footer Hint */}
        <div className="p-4 border-t border-border-ink bg-bg-surface/30 text-center">
             <p className="text-xs text-ink-secondary">Wische links für eine neue Seite.</p>
        </div>
      </div>
    </div>
  );
}
