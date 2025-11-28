import { X } from "@/lib/icons";
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
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-[85%] max-w-sm h-full bg-surface-1 shadow-raiseLg border-l border-border animate-in slide-in-from-right duration-200 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-surface-2/50">
          <h2 className="text-lg font-semibold text-text-primary">Deine Seiten</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Active Pages (Stack) */}
          <section>
            <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wider mb-3">
              Zuletzt verwendete Seiten
            </h3>
            <div className="space-y-2">
              {activePages.map((page) => (
                <button
                  key={page.id}
                  onClick={() => {
                    onSelectChat(page.id);
                    onClose();
                  }}
                  className={cn(
                    "w-full text-left p-3 rounded-lg border transition-colors",
                    activeChatId === page.id
                      ? "bg-accent/10 border-accent text-accent"
                      : "bg-surface-2 border-transparent hover:bg-surface-3 text-text-primary",
                  )}
                >
                  <div className="font-medium truncate">{page.title}</div>
                  {activeChatId === page.id && (
                    <div className="text-xs mt-1 opacity-80">Aktuelle Seite</div>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* Archived Pages */}
          <section>
            <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wider mb-3">
              Alle Chats
            </h3>
            <div className="space-y-1">
              {archivedPages.map((page) => (
                <button
                  key={page.id}
                  onClick={() => {
                    onSelectChat(page.id);
                    onClose();
                  }}
                  className="w-full text-left p-3 rounded-lg hover:bg-surface-2 transition-colors flex justify-between items-center group"
                >
                  <div className="truncate flex-1 pr-4">
                    <div className="text-text-primary group-hover:text-accent transition-colors">
                      {page.title}
                    </div>
                    <div className="text-xs text-text-secondary">{page.date}</div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
