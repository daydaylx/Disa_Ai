import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Button, PremiumCard, SectionHeader, Typography, useToasts } from "@/ui";

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

    await deleteConversation(id);
    await loadConversations();
    toasts.push({ kind: "success", title: "Gelöscht", message: "Konversation entfernt." });
  };

  return (
    <div className="relative flex flex-col text-text-primary h-full">
      <div className="flex items-center gap-2 px-4 pt-4 pb-2">
        <Link to="/chat">
          <Button variant="ghost" size="sm">
            ← Zurück zum Chat
          </Button>
        </Link>
      </div>

      <div className="space-y-4 sm:space-y-6 px-[var(--spacing-4)] py-3 sm:py-[var(--spacing-6)]">
        <SectionHeader title="Verlauf" subtitle="Gespeicherte Unterhaltungen" />

        {loading && (
          <Typography variant="body-sm" className="text-text-secondary px-2">
            Lade Konversationen …
          </Typography>
        )}

        {!loading && conversations.length === 0 && (
          <Typography variant="body-sm" className="text-text-secondary px-2">
            Noch keine gespeicherten Konversationen.
          </Typography>
        )}

        <div className="grid gap-3">
          {conversations.map((conv) => (
            <PremiumCard key={conv.id} className="p-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-text-primary">{conv.title}</h3>
                <p className="text-xs text-text-secondary">
                  {new Date(conv.updatedAt || conv.createdAt || "").toLocaleString()}
                  {" • "}
                  {conv.messageCount ?? conv.messages?.length ?? 0} Nachrichten
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={() => handleOpen(conv.id)}>
                  Öffnen
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(conv.id)}>
                  Löschen
                </Button>
              </div>
            </PremiumCard>
          ))}
        </div>
      </div>
    </div>
  );
}
