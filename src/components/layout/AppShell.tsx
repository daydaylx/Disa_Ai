import { type ReactNode } from "react";

import { Menu } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/Button";

interface AppShellProps {
  children: ReactNode;
  title?: string;
  onMenuClick?: () => void;
  className?: string;
  headerActions?: ReactNode;
}

export function AppShell({
  children,
  title,
  onMenuClick,
  className,
  headerActions,
}: AppShellProps) {
  return (
    <div className="relative flex h-[calc(var(--vh,1vh)*100)] w-full flex-col bg-bg-app text-ink-primary overflow-hidden selection:bg-accent-primary/30">
      {/* Glass Header */}
      <header className="sticky top-0 z-header border-b border-white/10 bg-bg-app/80 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
          {/* Left: Hamburger Menu */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuClick}
              aria-label="Hauptmenü öffnen"
              className="text-ink-primary hover:bg-white/5"
            >
              <Menu className="h-5 w-5" />
            </Button>
            {title && (
              <h1 className="text-base font-semibold tracking-tight text-ink-primary sm:text-lg">
                {title}
              </h1>
            )}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">{headerActions}</div>
        </div>
      </header>

      {/* Main Page Content Area */}
      <main
        className={cn(
          "flex-1 relative flex flex-col w-full max-w-5xl mx-auto overflow-hidden px-4 sm:px-6",
          className,
        )}
      >
        {children}
      </main>
    </div>
  );
}
