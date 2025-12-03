import type { ModelEntry } from "@/config/models";

export function resolveInitialModelId(
  preferredId: string | null | undefined,
  catalog: ModelEntry[] | null,
): string | null {
  if (!catalog || catalog.length === 0) return null;
  const normalizedPreferredId = preferredId?.trim();
  if (!normalizedPreferredId) return null;

  const found = catalog.find((entry) => entry.id === normalizedPreferredId);
  return found ? found.id : null;
}
