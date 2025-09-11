import { z } from "zod";

export const RoleSchema = z.object({
  id: z.string(),
  name: z.string(),
  systemPrompt: z.string().optional(),
});

export const RoleListSchema = z.array(RoleSchema);
export type Role = z.infer<typeof RoleSchema>;

export function parseRoles(raw: unknown): Role[] {
  const res = RoleListSchema.safeParse(raw);
  return res.success ? res.data : [];
}
