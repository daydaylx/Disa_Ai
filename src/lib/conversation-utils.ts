import type { Conversation } from "./conversation-manager-modern";

const DAY_IN_MS = 24 * 60 * 60 * 1000;

const monthFormatter = new Intl.DateTimeFormat("de-DE", {
  month: "long",
  year: "numeric",
});

const startOfDay = (value: number) => {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
};

const getTimestamp = (conversation: Conversation): number => {
  const source = conversation.lastActivity ?? conversation.updatedAt ?? conversation.createdAt;
  const timestamp = typeof source === "number" ? source : Date.parse(source ?? "");
  return Number.isFinite(timestamp) ? timestamp : 0;
};

const getGroupLabel = (timestamp: number, todayStart: number, yesterdayStart: number) => {
  if (timestamp >= todayStart) {
    return "Heute";
  }
  if (timestamp >= yesterdayStart) {
    return "Gestern";
  }
  if (timestamp >= todayStart - 6 * DAY_IN_MS) {
    return "Letzte 7 Tage";
  }
  if (timestamp === 0) {
    return "Ohne Datum";
  }
  return monthFormatter.format(new Date(timestamp));
};

export type ConversationGroups = Record<string, Conversation[]>;

export function groupConversationsByDate(conversations: Conversation[]): ConversationGroups {
  const groups: ConversationGroups = {};
  const todayStart = startOfDay(Date.now());
  const yesterdayStart = todayStart - DAY_IN_MS;

  const sorted = [...conversations].sort((a, b) => getTimestamp(b) - getTimestamp(a));

  for (const conversation of sorted) {
    const timestamp = getTimestamp(conversation);
    const label = getGroupLabel(timestamp, todayStart, yesterdayStart);

    if (!groups[label]) {
      groups[label] = [];
    }

    groups[label].push(conversation);
  }

  return groups;
}
