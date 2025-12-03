import { useMemo } from "react";

import type { Conversation } from "../lib/conversation-manager-modern";

interface HistoryPage {
  id: string;
  title: string;
  date: string;
}

interface ConversationHistory {
  conversationList: Conversation[];
  conversationCount: number;
  activeConversation: Conversation | null;
  historyPages: HistoryPage[];
  activeHistoryPages: HistoryPage[];
  archivedHistoryPages: HistoryPage[];
}

export function useConversationHistory(
  conversations: Conversation[] | null | undefined,
  activeConversationId: string | null,
): ConversationHistory {
  return useMemo(() => {
    const conversationList = conversations ?? [];
    const conversationCount = conversationList.length;

    const activeConversation =
      conversationList.find((conversation) => conversation.id === activeConversationId) ?? null;

    const sortedConversations = [...conversationList].sort((a, b) => {
      const getTimestamp = (conversation: Conversation) =>
        new Date(conversation.updatedAt ?? conversation.createdAt ?? 0).getTime();

      return getTimestamp(b) - getTimestamp(a);
    });

    const formatConversationDate = (conversation: Conversation) => {
      const referenceDate = conversation.updatedAt || conversation.createdAt;
      if (!referenceDate) return "Unbekannt";

      return new Date(referenceDate).toLocaleDateString("de-DE", {
        day: "2-digit",
        month: "short",
      });
    };

    const historyPages = sortedConversations.map((conversation) => ({
      id: conversation.id,
      title: conversation.title || "Unbenannter Chat",
      date: formatConversationDate(conversation),
    }));

    return {
      conversationList,
      conversationCount,
      activeConversation,
      historyPages,
      activeHistoryPages: historyPages.slice(0, 3),
      archivedHistoryPages: historyPages.slice(3),
    };
  }, [activeConversationId, conversations]);
}
