import modelsMetadata from "./models_metadata.json";

const curatedModelIds = new Set(Object.keys(modelsMetadata));

type ModelLike = { id: string };

export function isAllowedModelId(
  modelId: string | null | undefined,
  availableModels?: ModelLike[],
): modelId is string {
  if (!modelId) return false;
  if (availableModels?.some((model) => model.id === modelId)) return true;
  return curatedModelIds.has(modelId);
}

// Kuratierte Fallback-ID; Metadatenquelle ist src/config/models_metadata.json
// und wird für Runtime-Fetch nach public/models_metadata.json synchronisiert.
export const FALLBACK_MODEL_ID = "cognitivecomputations/dolphin-mistral-24b-venice-edition:free";
