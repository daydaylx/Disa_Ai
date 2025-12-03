import { useState } from "react";

import { Book, Clock, Database, X } from "../../lib/icons";

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
  const [activeTab, setActiveTab] = useState<"active" | "archived">("active");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-80 h-full bg-surface-bg border-r border-ink/20 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-ink/20">
          <h2 className="text-lg font-semibold text-ink-primary">Buch-Navigation</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-ink/10 rounded-lg transition-colors"
            aria-label="Schließen"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-ink/20">
          <button
            onClick={() => setActiveTab("active")}
            className={`
              flex-1 px-4 py-3 text-sm font-medium transition-colors
              ${
                activeTab === "active"
                  ? "text-accent-primary border-b-2 border-accent-primary"
                  : "text-ink-secondary hover:text-ink-primary"
              }
            `}
          >
            <Book className="w-4 h-4 inline mr-2" />
            Aktuelle Seiten ({activePages.length})
          </button>
          <button
            onClick={() => setActiveTab("archived")}
            className={`
              flex-1 px-4 py-3 text-sm font-medium transition-colors
              ${
                activeTab === "archived"
                  ? "text-accent-primary border-b-2 border-accent-primary"
                  : "text-ink-secondary hover:text-ink-primary"
              }
            `}
          >
            <Database className="w-4 h-4 inline mr-2" />
            Archiv ({archivedPages.length})
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "active" && (
            <div className="p-4 space-y-2">
              <div className="text-sm text-ink-tertiary mb-3">
                <Clock className="w-4 h-4 inline mr-1" />
                Aktuelle Lesezeichen - swipe zum Navigieren
              </div>
              {activePages.map((page, index) => (
                <button
                  key={page.id}
                  onClick={() => {
                    onSelectChat(page.id);
                    onClose();
                  }}
                  className={`
                    w-full text-left p-3 rounded-lg border transition-all
                    ${
                      activeChatId === page.id
                        ? "bg-accent-primary/10 border-accent-primary/30 shadow-sm"
                        : "bg-surface-bg border-ink/20 hover:bg-ink/5 hover:shadow-sm"
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-ink-primary truncate">
                        Seite {activePages.length - index}
                      </div>
                      <div className="text-sm text-ink-secondary truncate">{page.title}</div>
                    </div>
                    {activeChatId === page.id && (
                      <div className="w-2 h-2 bg-accent-primary rounded-full" />
                    )}
                  </div>
                </button>
              ))}
              {activePages.length === 0 && (
                <div className="text-center py-8 text-ink-tertiary">
                  <Book className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>Keine aktiven Seiten</p>
                  <p className="text-sm mt-1">Starte einen neuen Chat</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "archived" && (
            <div className="p-4 space-y-2">
              <div className="text-sm text-ink-tertiary mb-3">
                <Database className="w-4 h-4 inline mr-1" />
                Archivierte Unterhaltungen
              </div>
              {archivedPages.map((page) => (
                <button
                  key={page.id}
                  onClick={() => {
                    onSelectChat(page.id);
                    onClose();
                  }}
                  className={`
                    w-full text-left p-3 rounded-lg border transition-all
                    ${
                      activeChatId === page.id
                        ? "bg-accent-primary/10 border-accent-primary/30 shadow-sm"
                        : "bg-surface-bg border-ink/20 hover:bg-ink/5 hover:shadow-sm"
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-ink-primary truncate">{page.title}</div>
                      <div className="text-sm text-ink-secondary">{page.date}</div>
                    </div>
                    {activeChatId === page.id && (
                      <div className="w-2 h-2 bg-accent-primary rounded-full" />
                    )}
                  </div>
                </button>
              ))}
              {archivedPages.length === 0 && (
                <div className="text-center py-8 text-ink-tertiary">
                  <Database className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>Keine archivierten Seiten</p>
                  <p className="text-sm mt-1">Deine Chats erscheinen hier</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer mit Gamification-Hinweis */}
        <div className="p-4 border-t border-ink/20 bg-ink/5">
          <div className="text-xs text-ink-tertiary text-center">
            <div className="font-medium text-ink-secondary mb-1">📖 Buch-Navigation Tipps</div>
            <div className="space-y-1">
              <div>• Swipe ← → zum Blättern</div>
              <div>• Lange für Archiv-Zugriff</div>
              <div>• Lesezeichen speichert deinen Fortschritt</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
