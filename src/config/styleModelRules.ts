export function ruleForStyle(_personaId: string | null, _styleName?: string | null): null {
  // Aktuell keine Style->Modell-Einschränkungen aktiv.
  return null;
}

export function isModelAllowed(_rule: unknown, _modelId: string | null): boolean {
  // Alles erlaubt (Stub bleibt bewusst permissiv).
  return true;
}
