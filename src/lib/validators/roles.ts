import { z } from "zod";

export const safetySchema = z.union([
  z.literal("any"),
  z.literal("moderate"),
  z.literal("strict"),
  z.literal("loose"),
]);

export const RoleSchema = z.object({
  id: z.string().trim().min(1).max(64),
  name: z.string().trim().min(1).max(128),
  system: z.string().trim().min(1).max(4000).optional(),
  allow: z.array(z.string().trim().min(1)).optional(),
  policy: safetySchema.optional(),
  styleOverlay: z.string().trim().min(1).max(128).optional(),
  tags: z.array(z.string().trim().min(1).max(32)).optional(),
});

export const RoleListSchema = z.array(RoleSchema);
export type Role = z.infer<typeof RoleSchema>;

export function parseRoles(raw: unknown): Role[] {
  const res = RoleListSchema.safeParse(raw);
  return res.success ? res.data : [];
}
