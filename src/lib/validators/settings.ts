import { z } from "zod";

export const SettingsSchema = z.object({
  theme: z.enum(["light","dark"]).optional(),
  modelId: z.string().min(1).optional(),
  nsfw: z.boolean().optional(),
});

export type Settings = z.infer<typeof SettingsSchema>;

export function parseSettings(raw: unknown): Settings {
  const res = SettingsSchema.safeParse(raw);
  return res.success ? res.data : {};
}
