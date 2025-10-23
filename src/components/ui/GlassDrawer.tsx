import React, { useEffect, useRef } from "react";

import { cn } from "../../lib/utils";

interface GlassDrawerProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export const GlassDrawer: React.FC<GlassDrawerProps> = ({ open, onClose, children, className }) => {
  const drawerRef = useRef<HTMLDivElement>(null);

  // Body scroll lock
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
    return undefined;
  }, [open]);

  // ESC key handler
  useEffect(() => {
    if (!open) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  // Click outside handler
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-end pointer-events-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation drawer"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 transition-opacity duration-180 ease-out motion-reduce:transition-none"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={cn(
          // Base positioning and sizing
          "fixed right-0 top-0 h-full w-[88vw] max-h-[85dvh]",
          // Glass surface styling
          "bg-neutral-900/70 dark:bg-neutral-900/70 light:bg-white/8",
          "backdrop-blur-md motion-reduce:backdrop-blur-none",
          "border border-white/10",
          "shadow-xl",
          "rounded-2xl rounded-r-none",
          // Layout and overflow
          "overflow-y-auto",
          "flex flex-col",
          // Animation
          "transform transition-transform duration-180 ease-out motion-reduce:transition-none",
          "translate-x-0",
          // Text contrast for accessibility
          "text-neutral-100 dark:text-neutral-100 light:text-neutral-900",
          className,
        )}
        role="navigation"
        aria-label="Navigation menu"
      >
        {children}
      </div>
    </div>
  );
};

// Category tile component for use within drawer
interface CategoryTileProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  accent?: "sky" | "violet" | "emerald" | "amber";
  onClick?: () => void;
  className?: string;
}

export const CategoryTile: React.FC<CategoryTileProps> = ({
  title,
  description,
  icon,
  accent = "sky",
  onClick,
  className,
}) => {
  const accentClasses = {
    sky: "bg-sky-400/10 hover:bg-sky-400/20 focus-visible:ring-sky-400/50",
    violet: "bg-violet-400/10 hover:bg-violet-400/20 focus-visible:ring-violet-400/50",
    emerald: "bg-emerald-400/10 hover:bg-emerald-400/20 focus-visible:ring-emerald-400/50",
    amber: "bg-amber-400/10 hover:bg-amber-400/20 focus-visible:ring-amber-400/50",
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        // Base glass surface
        "relative rounded-xl border border-neutral-700/50",
        "bg-neutral-800/30 backdrop-blur-sm",
        "shadow-lg",
        // Accent layer
        accentClasses[accent],
        // Interactive states
        "transition-all duration-180 ease-out motion-reduce:transition-none",
        "hover:scale-[1.02] hover:shadow-xl",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
        "active:scale-[0.98]",
        // Layout
        "p-4 text-left w-full",
        // Text contrast (AA compliant)
        "text-neutral-100",
        className,
      )}
      role="button"
      tabIndex={0}
    >
      <div className="flex items-start gap-3">
        {icon && <div className="flex-shrink-0 text-neutral-300">{icon}</div>}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base leading-tight text-neutral-100">{title}</h3>
          {description && (
            <p className="mt-1 text-sm text-neutral-300 leading-relaxed">{description}</p>
          )}
        </div>
      </div>
    </button>
  );
};

// Example implementation with 4 category tiles
export const ExampleGlassDrawer: React.FC<{ open: boolean; onClose: () => void }> = ({
  open,
  onClose,
}) => {
  return (
    <GlassDrawer open={open} onClose={onClose}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10">
        <h2 className="text-xl font-bold text-neutral-100">Kategorien</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-180 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          aria-label="Drawer schließen"
        >
          <svg
            className="w-5 h-5 text-neutral-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Content - Category tiles */}
      <div className="flex-1 p-6 space-y-4">
        <CategoryTile
          title="Technologie"
          description="KI, Entwicklung und Innovation"
          accent="sky"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          }
          onClick={() => console.warn("Technologie selected")}
        />

        <CategoryTile
          title="Design"
          description="UI/UX, Kreativität und Ästhetik"
          accent="violet"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          }
          onClick={() => console.warn("Design selected")}
        />

        <CategoryTile
          title="Business"
          description="Strategie, Marketing und Wachstum"
          accent="emerald"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          }
          onClick={() => console.warn("Business selected")}
        />

        <CategoryTile
          title="Lifestyle"
          description="Gesundheit, Reisen und persönliche Entwicklung"
          accent="amber"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          }
          onClick={() => console.warn("Lifestyle selected")}
        />
      </div>
    </GlassDrawer>
  );
};
