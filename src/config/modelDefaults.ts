import modelsMetadata from "../../public/models_metadata.json";

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

// Kuratiertes Fallback aus public/models_metadata.json; wird auf leer gesetzt, falls entfernt.
const FALLBACK_MODEL_ID = "cognitivecomputations/dolphin-mistral-24b-venice-edition:free";
export const DEFAULT_MODEL_ID = isAllowedModelId(FALLBACK_MODEL_ID) ? FALLBACK_MODEL_ID : "";
