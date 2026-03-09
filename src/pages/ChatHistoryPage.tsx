import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ConversationCard } from "@/components/conversation/ConversationCard";
import { AlertCircle, Edit2, MessageSquare, Share2, Trash2 } from "@/lib/icons";
import {
  Badge,
  ContextMenu,
  EmptyState,
  PageHero,
  PageHeroStat,
  PullToRefresh,
  useToasts,
} from "@/ui";
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

  const latestConversation = conversations[0];
  const latestTimestamp = latestConversation?.updatedAt || latestConversation?.createdAt;
  const latestLabel = latestTimestamp
    ? new Date(latestTimestamp).toLocaleString("de-DE", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Noch keine Chats";

  return (
    <div className="relative isolate flex h-full w-full max-w-3xl flex-col gap-4">
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-56 w-56 -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(56,189,248,0.14) 0%, rgba(139,92,246,0.08) 55%, transparent 72%)",
          opacity: 0.45,
        }}
        aria-hidden="true"
      />

      <PageHero
        title="Gespeicherte Unterhaltungen"
        titleAs="h2"
        eyebrow="Verlauf"
        description="Hier findest du deine letzten Gespräche wieder. Öffne sie erneut, springe zurück in den Kontext oder räume ältere Chats auf."
        countLabel={
          loading && conversations.length === 0
            ? "Verlauf wird geladen…"
            : `${conversations.length} Chats gespeichert`
        }
        icon={<MessageSquare className="h-5 w-5" />}
        gradientStyle="linear-gradient(135deg, rgba(56,189,248,0.14) 0%, rgba(139,92,246,0.08) 55%, rgba(15,23,42,0.18) 100%)"
        action={
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              void navigate("/chat");
            }}
            className="flex-1 sm:flex-none"
          >
            Neuen Chat starten
          </Button>
        }
        meta={
          <>
            <Badge variant="chat">Alle Gespräche bleiben lokal</Badge>
            <Badge className="rounded-full border-white/10 bg-white/[0.06] text-ink-secondary">
              Langdruck öffnet weitere Aktionen
            </Badge>
          </>
        }
      >
        <div className="grid gap-2 sm:grid-cols-3">
          <PageHeroStat
            label="Chats"
            value={`${conversations.length}`}
            helper="Gespeicherte Unterhaltungen in deinem Verlauf."
            icon={<MessageSquare className="h-4 w-4" />}
          />
          <PageHeroStat
            label="Zuletzt aktiv"
            value={latestLabel}
            helper={
              latestConversation?.title
                ? `Letzter Chat: ${latestConversation.title}`
                : "Sobald du chattest, erscheint hier dein letzter Eintrag."
            }
            icon={<Share2 className="h-4 w-4" />}
          />
          <PageHeroStat
            label="Geöffnete Vorschauen"
            value={`${expandedConvs.size}`}
            helper="Praktisch, wenn du kurz in ältere Antworten reinschauen willst."
            icon={<Edit2 className="h-4 w-4" />}
          />
        </div>
      </PageHero>

      <PullToRefresh onRefresh={loadConversations} className="flex-1 pb-4">
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
          <EmptyState
            icon={<MessageSquare className="h-6 w-6" />}
            title="Noch keine Unterhaltungen"
            description="Starte einen neuen Chat, um ihn hier wiederzufinden."
            action={
              <Button variant="secondary" size="sm" onClick={() => void navigate("/chat")}>
                Neuen Chat starten
              </Button>
            }
          />
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
