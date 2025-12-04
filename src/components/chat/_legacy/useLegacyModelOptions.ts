import { useMemo } from "react";

import { buildLegacyModelOptions } from "@/config/modelPresets";
import { useModelCatalog } from "@/contexts/ModelCatalogContext";

export function useLegacyModelOptions() {
  const { models } = useModelCatalog();

  const modelOptions = useMemo(() => buildLegacyModelOptions(models), [models]);

  return { modelOptions };
}
