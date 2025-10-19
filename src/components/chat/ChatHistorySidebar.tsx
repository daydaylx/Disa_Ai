import { ArrowLeft, Clock, MessageSquare, Plus, Search, Star, X } from "lucide-react";
import { useEffect, useState } from "react";

import type { Conversation } from "../../lib/conversation-manager";
import { groupConversationsByDate } from "../../lib/conversation-utils";
import { formatRelativeTime } from "../../lib/formatRelativeTime";
import { cn } from "../../lib/utils";
import { Badge } from "../ui/badge";
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

  useEffect(() => {
    let filtered = [...conversations];

    if (searchQuery) {
      filtered = filtered.filter((conversation) => {
        const title = conversation.title?.toLowerCase() || "";
        const lastMessage =
          conversation.messages?.[conversation.messages.length - 1]?.content?.toLowerCase() || "";
        const query = searchQuery.toLowerCase();

        return title.includes(query) || lastMessage.includes(query);
      });
    }

    if (filterType === "favorites") {
      filtered = filtered.filter(
        (conversation) =>
          conversation.isFavorite || conversation.title?.toLowerCase().includes("favorit"),
      );
    } else if (filterType === "recent") {
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
      <div className="fixed inset-0 bg-black/50 md:hidden" onClick={onClose} />

      <div
        className="fixed right-0 top-0 h-full w-full max-w-sm bg-surface-1 shadow-level md:relative md:right-auto md:top-auto md:h-auto md:max-w-none md:rounded-lg md:border md:border-border md:shadow-none"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 80px)" }}
      >
        <div className="sticky top-0 z-10 border-b border-border bg-surface-1">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={onClose} aria-label="Zurück zum Chat">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h2 className="text-lg font-semibold text-text-0">Chat-Verlauf</h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              aria-label="Chat-Verlauf schließen"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="px-4 pb-4">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-1" />
              <input
                type="text"
                placeholder="Chats durchsuchen..."
                className="w-full rounded-lg border border-border bg-surface-2 py-2 pl-10 pr-4 text-text-0 placeholder:text-text-1 focus:outline-none focus:ring-2 focus:ring-brand"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilterType("all")}
                className={cn(
                  "rounded-base border border-transparent px-3 py-1.5 text-[11px] uppercase tracking-[0.08em]",
                  filterType === "all" && "border-brand/40 bg-brand/15 text-brand",
                )}
              >
                <MessageSquare className="h-3 w-3" />
                Alle
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilterType("favorites")}
                className={cn(
                  "rounded-base border border-transparent px-3 py-1.5 text-[11px] uppercase tracking-[0.08em]",
                  filterType === "favorites" && "border-brand/40 bg-brand/15 text-brand",
                )}
              >
                <Star className="h-3 w-3" />
                Favoriten
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilterType("recent")}
                className={cn(
                  "rounded-base border border-transparent px-3 py-1.5 text-[11px] uppercase tracking-[0.08em]",
                  filterType === "recent" && "border-brand/40 bg-brand/15 text-brand",
                )}
              >
                <Clock className="h-3 w-3" />
                Kürzlich
              </Button>
            </div>
          </div>
        </div>

        <div className="h-[calc(100vh-220px)] overflow-y-auto px-4 pb-4 md:h-[calc(100%-140px)]">
          {Object.entries(groupedConversations).map(([groupName, groupConversations]) => (
            <div key={groupName} className="mb-6">
              <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-text-1">
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
                          "group relative cursor-pointer rounded-lg border border-border bg-surface-2 p-4 text-left text-text-0 transition-colors hover:bg-surface-1",
                          isActive && "ring-2 ring-brand",
                        )}
                        onClick={() => onSelect(conversation.id)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <div className="mb-1 flex items-center gap-2">
                              <p className="truncate text-sm font-semibold text-text-0">
                                {conversation.title}
                              </p>
                              {isActive && <Badge variant="secondary">Aktiv</Badge>}
                            </div>
                            <p
                              className="truncate text-xs text-text-1"
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
                              <span className="text-xs text-text-1">
                                {formatRelativeTime(lastActivity)}
                              </span>
                            )}
                            <div className="flex items-center gap-1 text-xs text-text-1">
                              <MessageSquare className="h-3 w-3" />
                              <span>{messageCount}</span>
                            </div>
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(event) => {
                            event.stopPropagation();
                            onDelete(conversation.id);
                          }}
                          className="absolute right-2 top-2 h-8 w-8 text-text-1 opacity-0 hover:bg-surface-2 hover:text-danger group-hover:opacity-100"
                          aria-label="Konversation löschen"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          {filteredConversations.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center px-4 text-center">
              <div className="max-w-xs space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-border bg-surface-2">
                  <MessageSquare className="h-8 w-8 text-text-1" />
                </div>
                <div className="space-y-2">
                  <h3 className="typo-h5 text-text-0">
                    {searchQuery ? "Keine Treffer gefunden" : "Noch kein Verlauf"}
                  </h3>
                  <p className="typo-body-sm text-text-1">
                    {searchQuery
                      ? "Versuche es mit anderen Suchbegriffen oder prüfe deine Filter."
                      : "Unterhaltungen werden automatisch gesichert, sobald du Nachrichten austauschst."}
                  </p>
                </div>
                {!searchQuery && (
                  <Button variant="default" size="sm" onClick={onClose} className="mx-auto">
                    <Plus className="h-4 w-4" />
                    Neuen Chat starten
                  </Button>
                )}
                {searchQuery && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSearchQuery("")}
                    className="mx-auto"
                  >
                    Suche zurücksetzen
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
