import { ArrowLeft, Clock, MessageSquare, Search, Star, X } from "lucide-react";
import { useEffect, useState } from "react";

import type { Conversation } from "../../lib/conversation-manager";
import { groupConversationsByDate } from "../../lib/conversation-utils";
import { formatRelativeTime } from "../../lib/formatRelativeTime";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";

interface ChatHistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

const EMPTY_PREVIEW = "Starte eine Unterhaltung, um sie hier später wiederzufinden.";

export function ChatHistorySidebar({
  isOpen,
  onClose,
  conversations,
  activeId,
  onSelect,
  onDelete,
}: ChatHistorySidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "favorites" | "recent">("all");
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>(conversations);

  // Filter conversations based on search query and filter type
  useEffect(() => {
    let filtered = [...conversations];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter((conversation) => {
        const title = conversation.title?.toLowerCase() || "";
        const lastMessage =
          conversation.messages?.[conversation.messages.length - 1]?.content?.toLowerCase() || "";
        const query = searchQuery.toLowerCase();

        return title.includes(query) || lastMessage.includes(query);
      });
    }

    // Apply type filter
    if (filterType === "favorites") {
      // Filter by conversations marked as favorites
      filtered = filtered.filter(
        (conversation) =>
          conversation.isFavorite || conversation.title?.toLowerCase().includes("favorit"),
      );
    } else if (filterType === "recent") {
      // Show only conversations from the last 7 days
      const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      filtered = filtered.filter((conversation) => {
        const lastActivity = conversation.lastActivity ?? conversation.updatedAt;
        return typeof lastActivity === "number" && lastActivity > sevenDaysAgo;
      });
    }

    setFilteredConversations(filtered);
  }, [searchQuery, filterType, conversations]);

  const groupedConversations = groupConversationsByDate(filteredConversations);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop - only visible on mobile */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm md:hidden" onClick={onClose} />

      {/* Sidebar - responsive design with bottom padding for navigation */}
      <div
        className="fixed right-0 top-0 h-full w-full max-w-sm bg-[#0a0d25] shadow-2xl md:relative md:right-auto md:top-auto md:h-auto md:max-w-none md:rounded-2xl md:shadow-none"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 80px)" }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-white/10 bg-[#0a0d25]/80 backdrop-blur-xl">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                aria-label="Zurück zum Chat"
                className="tile-glass h-10 w-10 rounded-xl p-0 text-white"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h2 className="text-lg font-semibold text-white">Chat-Verlauf</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              aria-label="Chat-Verlauf schließen"
              className="tile-glass h-10 w-10 rounded-xl p-0 text-white"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="px-4 pb-4">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
              <input
                type="text"
                placeholder="Chats durchsuchen..."
                className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-10 pr-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2">
              <button
                className={cn(
                  "flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                  filterType === "all"
                    ? "bg-white/20 text-white"
                    : "bg-white/5 text-white/70 hover:bg-white/10",
                )}
                onClick={() => setFilterType("all")}
              >
                <MessageSquare className="h-3 w-3" />
                Alle
              </button>
              <button
                className={cn(
                  "flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                  filterType === "favorites"
                    ? "bg-white/20 text-white"
                    : "bg-white/5 text-white/70 hover:bg-white/10",
                )}
                onClick={() => setFilterType("favorites")}
              >
                <Star className="h-3 w-3" />
                Favoriten
              </button>
              <button
                className={cn(
                  "flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                  filterType === "recent"
                    ? "bg-white/20 text-white"
                    : "bg-white/5 text-white/70 hover:bg-white/10",
                )}
                onClick={() => setFilterType("recent")}
              >
                <Clock className="h-3 w-3" />
                Kürzlich
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="h-[calc(100vh-220px)] overflow-y-auto px-4 pb-4 md:h-[calc(100%-140px)]">
          {Object.entries(groupedConversations).map(([groupName, groupConversations]) => (
            <div key={groupName} className="mb-6">
              <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-white/50">
                {groupName}
              </h3>
              <ul className="space-y-2">
                {groupConversations.map((conversation) => {
                  const messageCount =
                    conversation.messageCount ?? conversation.messages?.length ?? 0;
                  const lastMessage =
                    conversation.messages?.[conversation.messages.length - 1]?.content ?? "";
                  const lastActivity = conversation.lastActivity ?? conversation.updatedAt;
                  const preview = lastMessage.trim() || EMPTY_PREVIEW;
                  const isActive = conversation.id === activeId;

                  return (
                    <li key={conversation.id}>
                      <div
                        className={cn(
                          "glass-card group relative cursor-pointer border border-white/20 bg-white/10 p-4 px-4 py-3 text-left text-white shadow-lg backdrop-blur-lg transition-all duration-200 hover:-translate-y-[1px] hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)]",
                          isActive &&
                            "border-white/25 shadow-[0_8px_24px_rgba(0,0,0,0.5)] ring-2 ring-white/20",
                        )}
                        onClick={() => onSelect(conversation.id)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <div className="mb-1 flex items-center gap-2">
                              <p className="truncate text-sm font-semibold text-white">
                                {conversation.title}
                              </p>
                              {isActive && (
                                <span className="rounded-full border border-white/20 bg-white/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                                  Aktiv
                                </span>
                              )}
                            </div>
                            <p
                              className="truncate text-xs text-white/80"
                              style={{
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                              }}
                            >
                              {preview}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            {Number.isFinite(lastActivity) && (
                              <span className="text-[10px] text-white/60">
                                {formatRelativeTime(lastActivity)}
                              </span>
                            )}
                            <div className="flex items-center gap-1 text-[10px] text-white/60">
                              <MessageSquare className="h-3 w-3" />
                              <span>{messageCount}</span>
                            </div>
                          </div>
                        </div>

                        {/* Delete button */}
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            onDelete(conversation.id);
                          }}
                          className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white opacity-0 backdrop-blur-md transition-all duration-200 hover:scale-105 hover:border-red-400/40 hover:bg-red-500/25 hover:text-red-100 group-hover:opacity-100"
                          aria-label="Konversation löschen"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          {filteredConversations.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <MessageSquare className="h-12 w-12 text-white/20" />
              <h3 className="mt-4 text-lg font-medium text-white">
                {searchQuery ? "Keine Treffer gefunden" : "Noch kein Verlauf"}
              </h3>
              <p className="mt-2 text-sm text-white/70">
                {searchQuery
                  ? "Versuchen Sie es mit anderen Suchbegriffen."
                  : "Unterhaltungen werden automatisch gesichert, sobald du Nachrichten austauschst."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
