import { useMemo } from "react";

type Input = { models?: unknown[]; styles?: unknown[] } | undefined;

export default function PersonaProvider({ input }: { input?: Input }) {
  const models = useMemo(
    () => (Array.isArray(input?.models) ? (input!.models as unknown[]) : []),
    [input],
  );
  const styles = useMemo(
    () => (Array.isArray(input?.styles) ? (input!.styles as unknown[]) : []),
    [input],
  );

  // placeholder-light UI (stabil, nicht hübsch)
  return (
    <div className="p-2 text-sm">
      <div>Models: {models.length}</div>
      <div>Styles: {styles.length}</div>
    </div>
  );
}
