import type { Conversation } from "./conversation-manager";

/**
 * Groups conversations by date categories
 * @param conversations Array of conversations to group
 * @returns Object with grouped conversations by date categories
 */
export function groupConversationsByDate(
  conversations: Conversation[],
): Record<string, Conversation[]> {
  const groups: Record<string, Conversation[]> = {
    Heute: [],
    Gestern: [],
    "Diese Woche": [],
    "Letzte Woche": [],
    Älter: [],
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1));

  const startOfLastWeek = new Date(startOfWeek);
  startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);

  conversations.forEach((conversation) => {
    const lastActivity = conversation.lastActivity ?? conversation.updatedAt;
    if (typeof lastActivity === "number") {
      const date = new Date(lastActivity);
      date.setHours(0, 0, 0, 0);

      if (date.getTime() === today.getTime()) {
        groups["Heute"]?.push(conversation);
      } else if (date.getTime() === yesterday.getTime()) {
        groups["Gestern"]?.push(conversation);
      } else if (date >= startOfWeek) {
        groups["Diese Woche"]?.push(conversation);
      } else if (date >= startOfLastWeek) {
        groups["Letzte Woche"]?.push(conversation);
      } else {
        groups["Älter"]?.push(conversation);
      }
    } else {
      groups["Älter"]?.push(conversation);
    }
  });

  // Remove empty groups and sort conversations within groups
  Object.keys(groups).forEach((key) => {
    if (groups[key]?.length === 0) {
      delete groups[key];
    } else {
      // Sort conversations by last activity (newest first)
      groups[key]?.sort((a, b) => {
        const lastActivityA = a.lastActivity ?? a.updatedAt;
        const lastActivityB = b.lastActivity ?? b.updatedAt;

        if (typeof lastActivityA === "number" && typeof lastActivityB === "number") {
          return lastActivityB - lastActivityA;
        }
        return 0;
      });
    }
  });

  return groups;
}
