import { ArrowLeft, Clock, MessageSquare, Plus, Search, Star, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Badge } from "@/ui/Badge";
import { Button } from "@/ui/Button";

import type { Conversation } from "../../lib/conversation-manager-modern";
import { groupConversationsByDate } from "../../lib/conversation-utils";
import { formatRelativeTime } from "../../lib/formatRelativeTime";
import { cn } from "../../lib/utils";

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
    <div className="fixed inset-0 z-30">
      <div className="fixed inset-0 bg-black/50 md:hidden" onClick={onClose} />

      <div className="fixed right-0 top-0 flex h-full w-full max-w-sm px-[clamp(12px,4vw,24px)] py-[clamp(16px,5vw,28px)] md:relative md:right-auto md:top-auto md:h-auto md:max-w-none md:px-0 md:py-0">
        <div className="flex h-full w-full flex-col rounded-[var(--radius-xl)] border border-[var(--border-neumorphic-subtle)] bg-[var(--surface-neumorphic-floating)] shadow-neo-md md:rounded-lg">
          <div className="flex h-full flex-col overflow-hidden">
            <div className="flex flex-col gap-4 px-[clamp(12px,4vw,20px)] pt-4 md:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    aria-label="Zurück zum Chat"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <h2 className="text-text-strong text-lg font-semibold">Chat-Verlauf</h2>
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

              <div className="space-y-3">
                <div className="relative">
                  <Search className="text-text-muted absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Chats durchsuchen..."
                    className="h-11 w-full rounded-[var(--radius-lg)] border border-[var(--border-neumorphic-subtle)] bg-[var(--surface-neumorphic-raised)] pl-11 pr-4 text-sm text-text-primary placeholder:text-text-muted shadow-[var(--shadow-inset-subtle)] focus-visible:border-[var(--acc1)] focus-visible:outline-none focus-visible:shadow-focus-neo"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFilterType("all")}
                    className={cn(
                      "rounded-lg border border-transparent px-3 py-1.5 text-[11px] uppercase tracking-[0.06em] text-text-muted transition-[color,background,box-shadow]",
                      filterType === "all" &&
                        "border-brand/30 bg-brand/12 text-brand shadow-[var(--shadow-glow-brand-subtle)]",
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
                      "rounded-lg border border-transparent px-3 py-1.5 text-[11px] uppercase tracking-[0.06em] text-text-muted transition-[color,background,box-shadow]",
                      filterType === "favorites" &&
                        "border-brand/30 bg-brand/12 text-brand shadow-[var(--shadow-glow-brand-subtle)]",
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
                      "rounded-lg border border-transparent px-3 py-1.5 text-[11px] uppercase tracking-[0.06em] text-text-muted transition-[color,background,box-shadow]",
                      filterType === "recent" &&
                        "border-brand/30 bg-brand/12 text-brand shadow-[var(--shadow-glow-brand-subtle)]",
                    )}
                  >
                    <Clock className="h-3 w-3" />
                    Kürzlich
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-2 flex-1 overflow-y-auto px-[clamp(12px,4vw,20px)] pb-4 md:px-6 scroll-pt-[72px]">
              {Object.entries(groupedConversations).map(([groupName, groupConversations]) => (
                <div key={groupName} className="mb-6">
                  <h3 className="text-text-tertiary mb-2 px-1 text-xs font-semibold uppercase tracking-[0.12em]">
                    {groupName}
                  </h3>
                  <ul className="space-y-2" role="listbox" aria-label="Gespeicherte Chats">
                    {groupConversations.map((conversation) => {
                      const messageCount =
                        conversation.messageCount ?? conversation.messages?.length ?? 0;
                      const lastMessage =
                        conversation.messages?.[conversation.messages.length - 1]?.content ?? "";
                      const lastActivityString =
                        conversation.lastActivity ?? conversation.updatedAt;
                      const lastActivity = new Date(lastActivityString).getTime();
                      const preview = lastMessage.trim() || EMPTY_PREVIEW;
                      const isActive = conversation.id === activeId;

                      return (
                        <li key={conversation.id} role="presentation">
                          <div
                            className={cn(
                              "group relative flex cursor-pointer rounded-[var(--radius-lg)] border border-[var(--border-neumorphic-subtle)] bg-[var(--surface-neumorphic-floating)] p-[clamp(16px,4vw,20px)] shadow-none transition-[transform,box-shadow,border] duration-200",
                              "hover:-translate-y-[2px] hover:shadow-neo-sm",
                              isActive &&
                                "border-[var(--acc1)] shadow-[var(--shadow-glow-brand-subtle)]",
                            )}
                            onClick={() => onSelect(conversation.id)}
                            role="option"
                            aria-selected={isActive}
                            tabIndex={0}
                            onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) => {
                              if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault();
                                onSelect(conversation.id);
                              }
                            }}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0 flex-1">
                                <div className="mb-1 flex items-center gap-2">
                                  <p className="truncate text-sm font-semibold text-[var(--color-text-primary)]">
                                    {conversation.title}
                                  </p>
                                  {isActive && <Badge variant="secondary">Aktiv</Badge>}
                                </div>
                                <p
                                  className="text-xs text-text-muted"
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
                              <div className="flex flex-col items-end gap-1 text-xs text-text-secondary">
                                {Number.isFinite(lastActivity) && (
                                  <span>{formatRelativeTime(lastActivity)}</span>
                                )}
                                <div className="flex items-center gap-1">
                                  <MessageSquare className="h-3 w-3" />
                                  <span>{messageCount}</span>
                                </div>
                              </div>
                            </div>

                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                                event.stopPropagation();
                                onDelete(conversation.id);
                              }}
                              className="absolute right-2 top-2 h-8 w-8 text-text-muted opacity-0 transition-opacity duration-150 hover:text-danger focus-visible:shadow-focus-neo focus-visible:outline-none group-hover:opacity-100"
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
                    <div className="border-border mx-auto flex h-16 w-16 items-center justify-center rounded-full border bg-[var(--surface-neumorphic-floating)]">
                      <MessageSquare className="h-8 w-8 text-text-muted" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="typo-h5 text-text-strong">
                        {searchQuery ? "Keine Treffer gefunden" : "Noch kein Verlauf"}
                      </h3>
                      <p className="typo-body-sm text-text-muted">
                        {searchQuery
                          ? "Versuche es mit anderen Suchbegriffen oder prüfe deine Filter."
                          : "Unterhaltungen werden automatisch gesichert, sobald du Nachrichten austauschst."}
                      </p>
                    </div>
                    {!searchQuery && (
                      <Button variant="secondary" size="sm" onClick={onClose} className="mx-auto">
                        <Plus className="h-4 w-4" />
                        Neuen Chat starten
                      </Button>
                    )}
                    {searchQuery && (
                      <Button
                        variant="ghost"
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
      </div>
    </div>
  );
}
