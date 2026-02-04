import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getCategoryStyle } from "@/lib/categoryColors";
import { MessageSquare, Trash2 } from "@/lib/icons";
import { useToasts } from "@/ui";
import { Button } from "@/ui/Button";
import { Card } from "@/ui/Card";

import {
  type Conversation,
  deleteConversation,
  getAllConversations,
} from "../lib/conversation-manager-modern";

export default function ChatHistoryPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const toasts = useToasts();
  const navigate = useNavigate();
  const theme = getCategoryStyle("generic"); // Fallback to Slate

  const loadConversations = useCallback(async () => {
    try {
      setLoading(true);
      const list = await getAllConversations();
      setConversations(list);
    } catch (error) {
      console.error("Failed to load conversations", error);
      toasts.push({
        kind: "error",
        title: "Fehler",
        message: "Konversationen konnten nicht geladen werden.",
      });
    } finally {
      setLoading(false);
    }
  }, [toasts]);

  useEffect(() => {
    void loadConversations();
  }, [loadConversations]);

  const handleOpen = (id: string) => {
    void navigate("/chat", { state: { conversationId: id } });
  };

  const handleDelete = async (id: string) => {
    if (
      !confirm("Konversation wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.")
    ) {
      return;
    }

    try {
      await deleteConversation(id);
      await loadConversations();
      toasts.push({ kind: "success", title: "Gelöscht", message: "Konversation entfernt." });
    } catch (error) {
      console.error("Failed to delete conversation", error);
      toasts.push({
        kind: "error",
        title: "Fehler",
        message: "Konversation konnte nicht gelöscht werden.",
      });
    }
  };

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-ink-primary">Gespeicherte Unterhaltungen</h2>
          <p className="text-sm text-ink-secondary mt-1">Deine vergangenen Chats im Überblick.</p>
        </div>
      </div>

      {loading && (
        <div className="space-y-3 animate-pulse">
          <div className="h-24 bg-surface-1 rounded-2xl w-full" />
          <div className="h-24 bg-surface-1 rounded-2xl w-full" />
          <div className="h-24 bg-surface-1 rounded-2xl w-full" />
        </div>
      )}

      {!loading && conversations.length === 0 && (
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

      <div className="grid gap-3">
        {conversations.map((conv) => (
          <Card
            key={conv.id}
            variant="interactive"
            padding="sm"
            style={{ background: theme.roleGradient }}
            className="flex items-center justify-between group border-white/5 hover:brightness-110"
            onClick={() => void handleOpen(conv.id)}
          >
            <div className="min-w-0 flex-1 pr-4">
              <h3 className="text-base font-semibold text-ink-primary truncate">
                {conv.title || "Unbenannte Unterhaltung"}
              </h3>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-surface-2/70 px-2 py-0.5 text-[10px] text-ink-secondary border border-white/5">
                  {new Date(conv.updatedAt || conv.createdAt || "").toLocaleString("de-DE", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <span className="rounded-full bg-surface-2/70 px-2 py-0.5 text-[10px] text-ink-secondary border border-white/5">
                  {conv.messageCount ?? conv.messages?.length ?? 0} Nachrichten
                </span>
              </div>
            </div>
            <div className="flex gap-2 opacity-70 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="text-ink-secondary hover:text-status-error hover:bg-status-error/10 h-10 w-10"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(conv.id).catch(console.error);
                }}
                title="Löschen"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
