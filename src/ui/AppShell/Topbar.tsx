import { ModelPicker } from "../components/ModelPicker";
import { Badge } from "../primitives/Badge";
import { useModel } from "../state/modelContext";

export function Topbar() {
  const { selectedModel, selectedModelId, setSelectedModelId } = useModel();

  return (
    <header className="sticky top-0 z-30 border-b border-[hsl(var(--text-muted)/0.2)] bg-[hsl(var(--bg-base)/0.55)] backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between gap-2 px-4">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <div className="u-ring h-7 w-7 shrink-0 rounded-full bg-[hsl(var(--accent-primary)/0.3)]" />
          <strong className="truncate">Disa Orion</strong>
        </div>
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <ModelPicker
            selectedModelId={selectedModelId}
            onModelChange={setSelectedModelId}
            className="w-full min-w-0 sm:min-w-[250px]"
          />
          <Badge variant="accent" className="hidden sm:inline-flex">
            {selectedModel ? selectedModel.label : "Kein Modell"}
          </Badge>
        </div>
      </div>
    </header>
  );
}
