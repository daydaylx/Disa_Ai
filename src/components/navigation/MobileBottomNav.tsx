import { PrimaryNavigation } from "@/components/navigation/PrimaryNavigation";
import { cn } from "@/lib/utils";

interface MobileBottomNavProps {
  className?: string;
}

export function MobileBottomNav({ className }: MobileBottomNavProps) {
  return (
    <div
      className={cn("fixed inset-x-0 bottom-0 z-bottom-nav lg:hidden", className)}
      data-testid="mobile-bottom-nav"
    >
      <div className="mx-auto w-full max-w-4xl px-2 pb-[env(safe-area-inset-bottom,0px)]">
        <div className="min-h-[var(--app-bottom-nav-height)] rounded-t-2xl border border-white/10 bg-surface-2/90 shadow-md backdrop-blur-xl">
          <PrimaryNavigation orientation="bottom" />
        </div>
      </div>
    </div>
  );
}
