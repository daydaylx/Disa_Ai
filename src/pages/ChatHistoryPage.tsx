import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ConversationCard } from "@/components/conversation/ConversationCard";
import { AlertCircle, Edit2, MessageSquare, Share2, Trash2 } from "@/lib/icons";
import { ContextMenu, EmptyState, PullToRefresh, useToasts } from "@/ui";
import { Button } from "@/ui/Button";
import type { ContextMenuItem } from "@/ui/ContextMenu";

import {
  type Conversation,
  deleteConversation,
  getAllConversations,
} from "../lib/conversation-manager-modern";

export default function ChatHistoryPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [expandedConvs, setExpandedConvs] = useState<Set<string>>(new Set());
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const { push } = useToasts();
  const navigate = useNavigate();

  const toggleConversationExpansion = useCallback((convId: string) => {
    setExpandedConvs((prev) => {
      const next = new Set(prev);
      if (next.has(convId)) next.delete(convId);
      else next.add(convId);
      return next;
    });
  }, []);

  const loadConversations = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError(null);
      const list = await getAllConversations();
      setConversations(list);
    } catch (error) {
      console.error("Failed to load conversations", error);
      setLoadError("Konversationen konnten nicht geladen werden.");
      push({
        kind: "error",
        title: "Fehler",
        message: "Konversationen konnten nicht geladen werden.",
      });
    } finally {
      setLoading(false);
    }
  }, [push]);

  useEffect(() => {
    void loadConversations();
  }, [loadConversations]);

  const handleOpen = (id: string) => {
    void navigate("/chat", { state: { conversationId: id } });
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteConversation(id);
      await loadConversations();
      push({ kind: "success", title: "Gelöscht", message: "Konversation entfernt." });
    } catch (error) {
      console.error("Failed to delete conversation", error);
      push({
        kind: "error",
        title: "Fehler",
        message: "Konversation konnte nicht gelöscht werden.",
      });
    }
  };

  const handleRename = (id: string) => {
    const conv = conversations.find((c) => c.id === id);
    if (!conv) return;

    const newTitle = prompt("Neuer Titel für die Unterhaltung:", conv.title);
    if (newTitle && newTitle.trim()) {
      push({
        kind: "info",
        title: "Umbenennen",
        message: "Umbenennen wird in einer zukünftigen Version unterstützt.",
      });
    }
  };

  const handleShare = async (id: string) => {
    const conv = conversations.find((c) => c.id === id);
    if (!conv) return;

    if (navigator.share) {
      try {
        const shareText = `Disa AI Chat: ${conv.title}\n\n${conv.messages
          ?.slice(-3)
          .map((m) => `${m.role === "user" ? "Du" : "Disa"}: ${m.content}`)
          .join("\n\n")}`;
        await navigator.share({
          title: `Disa AI - ${conv.title}`,
          text: shareText,
        });
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("Share failed", error);
        }
      }
    } else {
      push({
        kind: "warning",
        title: "Nicht verfügbar",
        message: "Teilen wird auf diesem Gerät nicht unterstützt.",
      });
    }
  };

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-ink-primary">Gespeicherte Unterhaltungen</h2>
          <p className="text-sm text-ink-secondary mt-1">Deine vergangenen Chats im Überblick.</p>
        </div>
      </div>

      <PullToRefresh onRefresh={loadConversations} className="flex-1">
        {loading && (
          <div className="space-y-3 animate-pulse">
            <div className="h-24 bg-surface-1 rounded-2xl w-full" />
            <div className="h-24 bg-surface-1 rounded-2xl w-full" />
            <div className="h-24 bg-surface-1 rounded-2xl w-full" />
          </div>
        )}

        {!loading && loadError && (
          <EmptyState
            icon={<AlertCircle className="h-6 w-6" />}
            title="Verlauf konnte nicht geladen werden"
            description={loadError}
            className="rounded-2xl border border-status-error/25 bg-status-error/10"
            action={
              <Button variant="secondary" size="sm" onClick={() => void loadConversations()}>
                Erneut versuchen
              </Button>
            }
          />
        )}

        {!loading && !loadError && conversations.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-white/10 rounded-2xl bg-surface-1/30">
            <div className="h-12 w-12 bg-surface-2 rounded-full flex items-center justify-center mb-4 text-ink-tertiary">
              <MessageSquare className="h-6 w-6" />
            </div>
            <p className="text-ink-primary font-medium">Noch keine Unterhaltungen</p>
            <p className="text-sm text-ink-secondary mt-1">
              Starte einen neuen Chat, um ihn hier zu sehen.
            </p>
            <Button
              variant="primary"
              size="sm"
              className="mt-4"
              onClick={() => void navigate("/chat")}
            >
              Neuen Chat starten
            </Button>
          </div>
        )}

        {!loading && !loadError && (
          <div className="grid gap-3">
            {conversations.map((conv) => (
              <ConversationCard
                key={conv.id}
                conversation={conv}
                isExpanded={expandedConvs.has(conv.id)}
                onOpen={handleOpen}
                onDelete={handleDelete}
                onToggleExpansion={toggleConversationExpansion}
                onLongPress={() => {
                  setSelectedConvId(conv.id);
                  setShowContextMenu(true);
                }}
              />
            ))}
          </div>
        )}
      </PullToRefresh>

      {/* Context Menu (Long-Press) */}
      {showContextMenu &&
        selectedConvId &&
        (() => {
          const hasShareAPI = typeof navigator !== "undefined" && !!navigator.share;
          const contextMenuItems: ContextMenuItem[] = [
            {
              icon: Edit2,
              label: "Umbenennen",
              onClick: () => handleRename(selectedConvId),
            },
            ...(hasShareAPI
              ? [
                  {
                    icon: Share2,
                    label: "Teilen",
                    onClick: () => {
                      void handleShare(selectedConvId);
                    },
                  },
                ]
              : []),
            {
              icon: Trash2,
              label: "Löschen",
              onClick: () => {
                void handleDelete(selectedConvId);
              },
              danger: true,
            },
          ];

          return (
            <ContextMenu
              title="Unterhaltung"
              items={contextMenuItems}
              onClose={() => {
                setShowContextMenu(false);
                setSelectedConvId(null);
              }}
            />
          );
        })()}
    </div>
  );
}
