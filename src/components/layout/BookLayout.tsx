import type { ReactNode } from "react";

import { Bookmark } from "@/components/navigation/Bookmark";
import { Menu } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/Button";

interface BookLayoutProps {
  children: ReactNode;
  title?: string;
  onMenuClick?: () => void;
  onBookmarkClick?: () => void;
  className?: string;
}

export function BookLayout({
  children,
  title,
  onMenuClick,
  onBookmarkClick,
  className,
}: BookLayoutProps) {
  return (
    <div className="relative flex min-h-[calc(var(--vh,1vh)*100)] w-full flex-col bg-bg-app text-ink-primary overflow-hidden">
      {/* Header / Top Edge of the Page */}
      <header className="sticky top-0 z-header flex h-14 w-full items-center justify-between border-b border-border-ink/10 bg-bg-page/95 px-4 backdrop-blur supports-[backdrop-filter]:backdrop-blur-md">
        {/* Left: Hamburger Menu */}
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            aria-label="Hauptmenü öffnen"
            className="text-ink-primary hover:bg-ink-primary/5"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        {/* Center: Title / Date */}
        <div className="absolute left-1/2 -translate-x-1/2 text-center">
          <h1 className="text-base font-semibold tracking-tight text-ink-primary">
            {title || "Disa AI"}
          </h1>
        </div>
        {/* Right: Spacer or Secondary Actions (Bookmark is handled separately below) */}
        <div className="w-10" /> {/* Spacer to balance the layout */}
      </header>

      {/* Main Page Content Area */}
      <main
        className={cn(
          "flex-1 relative flex flex-col max-w-5xl mx-auto w-full bg-bg-page shadow-sm sm:my-4 sm:border sm:border-border-ink/20 sm:rounded-xl",
          className,
        )}
      >
        {children}

        {/* Bookmark Hanging on the Right Edge */}
        {onBookmarkClick && <Bookmark onClick={onBookmarkClick} />}
      </main>
    </div>
  );
}
