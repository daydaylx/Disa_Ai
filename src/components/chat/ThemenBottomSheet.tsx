import { CATEGORY_LABELS, type Quickstart, QUICKSTARTS } from "@/config/quickstarts";
import { Brain } from "@/lib/icons";
import { X } from "@/lib/icons";
import { getThemeCategoryAccent } from "@/lib/utils/categoryAccents";
import { cn } from "@/lib/utils";
import { Button } from "@/ui";
import { Dialog, DialogContent } from "@/ui/Dialog"; // Assuming shadcn Dialog

interface ThemenBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: (system: string, user: string, title: string) => void;
}

export function ThemenBottomSheet({ isOpen, onClose, onStart }: ThemenBottomSheetProps) {
  const handleStart = (quickstart: Quickstart) => {
    onStart(quickstart.system, quickstart.user, `Diskussion: ${quickstart.title}`);
    onClose();
  };

  const Icon = Brain; // Default icon for now

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md fixed bottom-0 left-0 right-0 sm:top-0 sm:left-auto sm:right-4 sm:w-96 rounded-t-3xl max-h-[90vh] p-0 border-0 bg-bg-page shadow-2xl">
        <div className="p-6 pb-4 border-b border-border-ink">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-ink-primary">Themen auswählen</h3>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="p-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 gap-3">
            {QUICKSTARTS.slice(0, 10).map((quickstart) => {
              // Limit for compact
              const categoryInfo = quickstart.category
                ? CATEGORY_LABELS[quickstart.category]
                : null;
              const accent = getThemeCategoryAccent(quickstart.category);
              return (
                <button
                  key={quickstart.id}
                  className={cn(
                    "relative flex items-center gap-3 w-full p-3 rounded-xl text-left transition-all",
                    "bg-surface-1/60 border border-white/10",
                    "hover:bg-surface-1/80 hover:shadow-sm",
                    `hover:border-accent-${accent}-border/50`,
                    `before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:rounded-r-full`,
                    `before:bg-accent-${accent} before:opacity-60 before:transition-opacity`,
                    `hover:before:opacity-100`,
                  )}
                  onClick={() => handleStart(quickstart)}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div
                      className={cn(
                        "h-10 w-10 flex shrink-0 items-center justify-center rounded-lg border transition-colors",
                        `bg-accent-${accent}-surface border-accent-${accent}-border/30`,
                        `text-accent-${accent}`,
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-ink-primary text-sm leading-tight">
                        {quickstart.title}
                      </p>
                      <p className="text-xs text-ink-secondary mt-1">{quickstart.description}</p>
                      {categoryInfo && (
                        <span
                          className={cn(
                            "inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium border",
                            categoryInfo.color,
                          )}
                        >
                          {categoryInfo.label}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
