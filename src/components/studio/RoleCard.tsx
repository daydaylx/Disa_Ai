import { Info } from "../../lib/icons";
import { forwardRef, type HTMLAttributes, useState } from "react";

import { cn } from "../../lib/utils";
import { getCategoryData, normalizeCategoryKey } from "../../utils/category-mapping";
import { Card } from "../ui/card";

export interface RoleCardProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title: string;
  description: string;
  badge?: string;
  category?: string;
  isActive?: boolean;
  defaultExpanded?: boolean;
  disabled?: boolean;
  isMobile?: boolean;
}

export const RoleCard = forwardRef<HTMLDivElement, RoleCardProps>(
  (
    {
      title,
      description,
      badge,
      category,
      isActive = false,
      className,
      defaultExpanded = false,
      onClick,
      disabled,
      isMobile = false,
      ...props
    },
    ref,
  ) => {
    const [expanded, setExpanded] = useState(defaultExpanded);
    const detailId = `${title.replace(/\s+/g, "-").toLowerCase()}-details`;

    // Normalize category and get data
    const categoryKey = normalizeCategoryKey(category);
    const categoryData = getCategoryData(category);

    const handleInfoToggle = (event: React.MouseEvent | React.KeyboardEvent) => {
      event.stopPropagation();
      setExpanded((prev) => !prev);
    };

    const handleCardClick = (
      event: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>,
    ) => {
      // If clicking on the info button, don't trigger the card click
      const target = event.target as HTMLElement;
      if (
        target.closest('[aria-label="Details zur Rolle"]') ||
        target.closest(".info-button-container")
      ) {
        event.stopPropagation(); // Prevent card click when info button is clicked
        return;
      }

      if (!disabled && onClick) {
        onClick(event as React.MouseEvent<HTMLDivElement>);
      }
    };

    // Create accessible info toggle that's not a nested button - using div with button role
    const InfoToggle = ({ className }: { className?: string }) => (
      <div
        role="button"
        tabIndex={0}
        onClick={handleInfoToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleInfoToggle(e);
          }
        }}
        aria-label="Details zur Rolle"
        aria-expanded={expanded}
        aria-controls={detailId}
        className={cn(
          "info-button-container",
          "absolute top-3 right-3 z-20",
          "flex items-center justify-center",
          // Dramatic Neomorphic Info Button
          "bg-[var(--surface-neumorphic-floating)]",
          "shadow-[var(--shadow-neumorphic-md)]",
          "border border-[var(--border-neumorphic-light)]",
          "rounded-[var(--radius-lg)]",
          "backdrop-blur-xl",
          // Enhanced States
          "text-[var(--color-text-secondary)]",
          "hover:text-[var(--acc1)]",
          "hover:shadow-[var(--shadow-neumorphic-lg)]",
          "hover:-translate-y-0.5",
          "hover:scale-105",
          "hover:bg-[var(--surface-neumorphic-raised)]",
          "active:shadow-[var(--shadow-inset-subtle)]",
          "active:scale-95",
          // Focus States
          "focus:outline-none focus:ring-2 focus:ring-[var(--acc1)]/50 focus:ring-offset-2",
          // Enhanced Touch Targets
          isMobile ? "h-12 w-12 touch-target" : "h-11 w-11",
          // Dramatic Animation
          "transition-all duration-300 ease-out",
          "cursor-pointer",
          className,
        )}
      >
        <Info
          className={cn(
            "info-icon transition-all duration-300",
            "group-hover:rotate-12",
            expanded && "rotate-180 text-[var(--acc1)]",
            isMobile ? "h-5 w-5" : "h-4 w-4",
          )}
        />

        {/* Glow Effect on Hover */}
        <div
          className="absolute inset-0 rounded-[var(--radius-lg)] opacity-0 hover:opacity-30 transition-opacity duration-300 pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(75,99,255,0.4) 0%, transparent 70%)",
            filter: "blur(8px)",
          }}
        />
      </div>
    );

    return (
      <div className={cn("relative group", className)}>
        <Card
          ref={ref as any}
          tone={isActive ? "neo-floating" : "neo-raised"}
          interactive={isActive ? "dramatic" : "gentle"}
          padding="lg"
          data-cat={categoryKey}
          className={cn(
            "text-left transition-all duration-500 ease-out",
            !disabled && "cursor-pointer",
            disabled && "cursor-not-allowed opacity-60",
            // Dramatic Active State
            isActive &&
              [
                "bg-gradient-to-br from-[var(--acc1)]/10 via-transparent to-[var(--acc1)]/5",
                "border-[var(--acc1)]/30",
                "shadow-[0_0_30px_rgba(75,99,255,0.15)]",
                "ring-2 ring-[var(--acc1)]/30",
              ].join(" "),
            // Enhanced Hover States
            !disabled &&
              !isActive &&
              [
                "hover:shadow-[var(--shadow-neumorphic-lg)]",
                "hover:-translate-y-1",
                "hover:scale-[1.02]",
              ].join(" "),
            isActive &&
              [
                "hover:shadow-[var(--shadow-neumorphic-dramatic)]",
                "hover:-translate-y-2",
                "hover:scale-[1.03]",
                "hover:shadow-[0_0_40px_rgba(75,99,255,0.25)]",
              ].join(" "),
            isMobile && "mobile-role-card touch-target",
            // Enhanced padding for info button
            isMobile ? "pr-20" : "pr-16",
          )}
          onClick={handleCardClick}
          onKeyDown={(e) => {
            if ((e.key === "Enter" || e.key === " ") && !disabled) {
              e.preventDefault();
              handleCardClick(e as any);
            }
          }}
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-pressed={isActive}
          aria-label={`${title} ${isActive ? "ausgewählt" : "auswählen"}`}
          data-testid={`role-card-${title.replace(/\s+/g, "_").toLowerCase()}`}
          {...props}
        >
          <div className="flex w-full items-start gap-4">
            {/* Dramatic Avatar with Neomorphic Design */}
            <div
              className={cn(
                "flex shrink-0 items-center justify-center rounded-full font-bold uppercase text-white transition-all duration-300",
                // Neomorphic Avatar Base
                "bg-gradient-to-br from-[var(--acc1)] to-[var(--acc2)]",
                "shadow-[var(--shadow-neumorphic-md)]",
                "border-2 border-white/20",
                // Enhanced States
                "group-hover:shadow-[var(--shadow-neumorphic-lg)]",
                "group-hover:scale-110",
                isActive &&
                  [
                    "shadow-[var(--shadow-neumorphic-lg)]",
                    "shadow-[0_0_20px_rgba(75,99,255,0.4)]",
                    "scale-105",
                  ].join(" "),
                isMobile ? "h-14 w-14 text-lg touch-target" : "h-12 w-12 text-base",
              )}
            >
              {title.slice(0, 1)}
            </div>

            <div className="flex flex-1 flex-col gap-3">
              <div className="min-w-0 flex-1">
                <h3
                  className={cn(
                    "font-bold text-[var(--color-text-primary)] transition-colors duration-200",
                    "group-hover:text-[var(--acc1)]",
                    isActive && "text-[var(--acc1)]",
                    isMobile ? "text-lg" : "text-base",
                  )}
                >
                  {title}
                </h3>

                {/* Enhanced Badge System */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {badge && (
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full font-semibold uppercase tracking-wide transition-all duration-200",
                        // Neomorphic Badge Design
                        "bg-[var(--surface-neumorphic-raised)]",
                        "shadow-[var(--shadow-neumorphic-sm)]",
                        "border border-[var(--border-neumorphic-light)]",
                        "text-[var(--color-text-secondary)]",
                        "hover:shadow-[var(--shadow-neumorphic-md)]",
                        "hover:text-[var(--color-text-primary)]",
                        isMobile ? "px-3 py-1.5 text-xs touch-target" : "px-2.5 py-1 text-[10px]",
                      )}
                    >
                      <span
                        className={cn(
                          "rounded-full bg-[var(--acc2)]",
                          "shadow-[0_0_6px_rgba(245,93,105,0.5)]",
                          isMobile ? "h-2 w-2" : "h-1.5 w-1.5",
                        )}
                      />
                      {badge}
                    </span>
                  )}
                  {category && (
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full font-medium uppercase tracking-wide transition-all duration-200",
                        // Category Badge with Icon
                        "bg-gradient-to-r from-[var(--surface-neumorphic-floating)] to-[var(--surface-neumorphic-raised)]",
                        "shadow-[var(--shadow-neumorphic-sm)]",
                        "border border-[var(--border-neumorphic-light)]",
                        "text-[var(--color-text-secondary)]",
                        "hover:shadow-[var(--shadow-neumorphic-md)]",
                        "hover:text-[var(--color-text-primary)]",
                        isMobile
                          ? "gap-2 px-3 py-1.5 text-xs touch-target"
                          : "gap-1.5 px-2.5 py-1 text-[10px]",
                      )}
                    >
                      <span className={isMobile ? "text-sm" : "text-xs"}>{categoryData.icon}</span>
                      {categoryData.label}
                    </span>
                  )}
                  {isActive && (
                    <span
                      className={cn(
                        "text-xs rounded-full font-semibold transition-all duration-200",
                        // Active Badge with Glow
                        "bg-gradient-to-r from-[var(--succ)]/20 to-[var(--succ)]/10",
                        "text-[var(--succ)]",
                        "shadow-[var(--shadow-neumorphic-sm)]",
                        "border border-[var(--succ)]/30",
                        "shadow-[0_0_10px_rgba(34,197,94,0.3)]",
                        isMobile ? "px-3 py-1.5 touch-target" : "px-2.5 py-1",
                      )}
                    >
                      ✓ Aktiv
                    </span>
                  )}
                </div>
              </div>

              <div className="role-text">
                <p
                  id={detailId}
                  className={cn(
                    "text-[var(--color-text-secondary)] leading-relaxed transition-colors duration-200",
                    "group-hover:text-[var(--color-text-primary)]",
                    isMobile ? "text-sm" : "text-xs",
                    !expanded && (isMobile ? "line-clamp-3" : "line-clamp-2"),
                  )}
                >
                  {description}
                </p>
              </div>
            </div>
          </div>

          {/* Dramatic Glow Effect for Active State */}
          {isActive && (
            <div
              className="absolute inset-0 rounded-[var(--radius-lg)] pointer-events-none opacity-20"
              style={{
                background:
                  "radial-gradient(circle at center, rgba(75,99,255,0.3) 0%, transparent 70%)",
                filter: "blur(25px)",
              }}
            />
          )}
        </Card>

        {/* Enhanced Info Toggle with Neomorphic Design */}
        <InfoToggle />
      </div>
    );
  },
);

RoleCard.displayName = "RoleCard";
