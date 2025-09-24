import { z } from "zod";

export const MessageSchema = z.object({
  id: z.string(),
  role: z.enum(["user", "assistant", "system"]),
  content: z.string(),
  ts: z.number().optional(),
});

export const ConversationSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  messages: z.array(MessageSchema),
});

export const ConversationListSchema = z.array(ConversationSchema);

export function parseConversations(raw: unknown) {
  const res = ConversationListSchema.safeParse(raw);
  return res.success ? res.data : [];
}
