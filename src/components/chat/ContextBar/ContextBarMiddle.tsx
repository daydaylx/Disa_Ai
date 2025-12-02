import { MemorySelector } from "./MemoryDropdown";
import { StyleSelector } from "./StyleDropdown";

export function ContextBarMiddle() {
  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <StyleSelector />
      <div className="h-4 w-px bg-border-ink/50 mx-1" />
      <MemorySelector />
    </div>
  );
}
