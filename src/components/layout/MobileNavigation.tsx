import { NavLink } from "react-router-dom";

import { Bot, MessageCircle, Settings, Users } from "../../lib/icons";
import { cn } from "../../lib/utils";

const navItems = [
  { path: "/chat", icon: MessageCircle, label: "Chat" },
  { path: "/roles", icon: Users, label: "Rollen" },
  { path: "/models", icon: Bot, label: "Modelle" },
  { path: "/settings", icon: Settings, label: "Einstellungen" },
];

interface MobileNavigationProps {
  variant?:
    | "neo-dock"
    | "neo-floating"
    | "neo-dramatic"
    | "neo-glass"
    | "default"
    | "neumorphic"
    | "glass"
    | "floating";
}

export function MobileNavigation({ variant = "neo-dock" }: MobileNavigationProps) {
  const navClasses = {
    // === NEW DRAMATIC NEOMORPHIC VARIANTS ===
    "neo-dock": [
      "bottom-navigation fixed bottom-2 left-2 right-2 z-50",
      "mx-auto max-w-sm rounded-[var(--radius-2xl)]",
      // Dramatic Dock Foundation
      "bg-gradient-to-r from-[var(--acc2)]/12 via-[var(--surface-neumorphic-floating)] to-[var(--surface-neumorphic-floating)]",
      "shadow-[var(--shadow-neumorphic-dramatic)]",
      "border-[var(--border-neumorphic-light)]",
      // Enhanced Blur and Effects
      "backdrop-blur-xl",
      "before:absolute before:inset-0 before:rounded-[var(--radius-2xl)]",
      "before:bg-gradient-to-r before:from-[var(--acc2)]/18 before:via-white/12 before:to-[var(--acc1)]/14",
      "before:pointer-events-none",
      // Hover Enhancement
      "transition-all duration-300 ease-out",
    ].join(" "),

    "neo-floating": [
      "bottom-navigation fixed bottom-4 left-4 right-4 z-50",
      "mx-auto max-w-md rounded-[var(--radius-xl)]",
      // Floating Platform
      "bg-[var(--surface-neumorphic-raised)]",
      "shadow-[var(--shadow-neumorphic-xl)]",
      "border-[var(--border-neumorphic-light)]",
      "backdrop-blur-lg",
      // Floating Animation
      "transition-all duration-500 ease-out",
      "hover:shadow-[var(--shadow-neumorphic-dramatic)]",
      "hover:-translate-y-1",
    ].join(" "),

    "neo-dramatic": [
      "bottom-navigation fixed bottom-0 z-50 w-full",
      // Dramatic Foundation
      "bg-gradient-to-r from-[var(--surface-neumorphic-floating)] via-[var(--surface-neumorphic-raised)] to-[var(--surface-neumorphic-floating)]",
      "shadow-[var(--shadow-neumorphic-extreme)]",
      "border-t-[var(--border-neumorphic-light)]",
      // Multi-layer Effects
      "backdrop-blur-2xl",
      "before:absolute before:inset-0",
      "before:bg-gradient-to-t before:from-transparent before:via-white/5 before:to-white/10",
      "before:pointer-events-none",
    ].join(" "),

    "neo-glass": [
      "bottom-navigation fixed bottom-3 left-3 right-3 z-50",
      "mx-auto max-w-lg rounded-[var(--radius-xl)]",
      // Glass Foundation
      "bg-[var(--surface-neumorphic-floating)]/80",
      "shadow-[var(--shadow-neumorphic-lg)]",
      "border-[var(--border-neumorphic-light)]",
      "backdrop-blur-2xl backdrop-saturate-150",
      // Glass Effects
      "before:absolute before:inset-0 before:rounded-[var(--radius-xl)]",
      "before:bg-gradient-to-br before:from-white/15 before:via-white/5 before:to-transparent",
      "before:pointer-events-none",
    ].join(" "),

    // === LEGACY VARIANTS (Updated) ===
    /** @deprecated Use neo-dock instead */
    default: [
      "bottom-navigation fixed bottom-0 z-20 w-full",
      "bg-[var(--surface-neumorphic-raised)]",
      "shadow-[var(--shadow-neumorphic-md)]",
      "border-t-[var(--border-neumorphic-subtle)]",
      "backdrop-blur-xl",
    ].join(" "),

    /** @deprecated Use neo-floating instead */
    neumorphic: [
      "bottom-navigation fixed bottom-0 z-20 w-full",
      "bg-[var(--surface-neumorphic-raised)]",
      "shadow-[var(--shadow-neumorphic-lg)]",
      "border-t-[var(--border-neumorphic-light)]",
      "backdrop-blur-xl",
      "transition-shadow duration-200",
      "hover:shadow-[var(--shadow-neumorphic-xl)]",
    ].join(" "),

    /** @deprecated Use neo-glass instead */
    glass: [
      "bottom-navigation fixed bottom-0 z-20 w-full",
      "bg-[var(--surface-neumorphic-floating)]/80",
      "shadow-[var(--shadow-neumorphic-md)]",
      "border-t-[var(--border-neumorphic-subtle)]/40",
      "backdrop-blur-2xl",
    ].join(" "),

    /** @deprecated Use neo-floating instead */
    floating: [
      "bottom-navigation fixed bottom-0 z-20 w-full",
      "bg-[var(--surface-neumorphic-floating)]",
      "shadow-[var(--shadow-neumorphic-lg)]",
      "border-t-[var(--border-neumorphic-light)]/30",
      "backdrop-blur-xl",
      "transition-all duration-200",
      "hover:shadow-[var(--shadow-neumorphic-xl)]",
    ].join(" "),
  };

  const getNavItemClasses = (isActive: boolean) => {
    const baseClasses = [
      "nav-item flex flex-col items-center justify-center",
      "text-sm font-medium",
      "transition-all duration-300 ease-out",
      "touch-target-preferred",
      "relative isolate",
    ].join(" ");

    const variantClasses = {
      // === NEW DRAMATIC NEOMORPHIC VARIANTS ===
      "neo-dock": isActive
        ? [
            "text-[var(--fg-invert)] font-semibold",
            "bg-[var(--acc2)]",
            "shadow-[var(--shadow-glow-accent-subtle)]",
            "rounded-[var(--radius-lg)] p-2 m-1",
          ].join(" ")
        : [
            // Inactive State
            "text-[var(--color-text-secondary)]",
            "rounded-[var(--radius-lg)] p-2 m-1",
            // Hover State
            "hover:text-[var(--color-border-focus)]",
            "hover:bg-[var(--surface-neumorphic-raised)]",
            "hover:shadow-[var(--shadow-glow-accent-subtle)]",
            "hover:-translate-y-0.5",
          ].join(" "),

      "neo-floating": isActive
        ? [
            "text-[var(--color-border-focus)] font-semibold",
            "bg-[var(--surface-neumorphic-floating)]",
            "shadow-[var(--shadow-glow-accent-subtle)]",
            "rounded-[var(--radius-xl)] p-3 m-1",
            "border-[var(--color-border-focus)]/60",
            "-translate-y-1",
          ].join(" ")
        : [
            "text-[var(--color-text-secondary)]",
            "rounded-[var(--radius-lg)] p-2 m-1",
            "hover:text-[var(--color-border-focus)]",
            "hover:bg-[var(--surface-neumorphic-raised)]",
            "hover:shadow-[var(--shadow-glow-accent-subtle)]",
            "hover:-translate-y-0.5",
          ].join(" "),

      "neo-dramatic": isActive
        ? [
            "text-[var(--color-border-focus)] font-bold",
            "bg-gradient-to-br from-[var(--surface-neumorphic-floating)] to-[var(--surface-neumorphic-raised)]",
            "shadow-[var(--shadow-glow-accent)]",
            "rounded-[var(--radius-lg)] p-3 m-2",
            "border-[var(--color-border-focus)]/60",
          ].join(" ")
        : [
            "text-[var(--color-text-secondary)]",
            "rounded-[var(--radius-md)] p-2 m-1",
            "hover:text-[var(--color-border-focus)]",
            "hover:bg-[var(--surface-neumorphic-raised)]",
            "hover:shadow-[var(--shadow-glow-accent-subtle)]",
          ].join(" "),

      "neo-glass": isActive
        ? [
            "text-[var(--color-border-focus)] font-semibold",
            "bg-[var(--surface-neumorphic-floating)]/90",
            "shadow-[var(--shadow-glow-accent-subtle)]",
            "backdrop-blur-xl backdrop-saturate-150",
            "rounded-[var(--radius-lg)] p-2 m-1",
            "border-[var(--color-border-focus)]/60",
          ].join(" ")
        : [
            "text-[var(--color-text-secondary)]",
            "rounded-[var(--radius-md)] p-2 m-1",
            "hover:text-[var(--color-border-focus)]",
            "hover:bg-[var(--surface-neumorphic-floating)]/60",
            "hover:backdrop-blur-lg",
            "hover:shadow-[var(--shadow-neumorphic-sm)]",
          ].join(" "),

      // === LEGACY VARIANTS (Updated) ===
      /** @deprecated Use neo-dock instead */
      default: isActive
        ? "text-[var(--color-border-focus)] bg-[var(--surface-neumorphic-raised)] shadow-[var(--shadow-glow-accent-subtle)] rounded-lg p-2 border border-[var(--color-border-focus)]/60"
        : "text-[var(--color-text-secondary)] hover:text-[var(--color-border-focus)] hover:bg-[var(--surface-neumorphic-raised)] hover:rounded-lg hover:p-2 hover:shadow-[var(--shadow-glow-accent-subtle)]",

      /** @deprecated Use neo-floating instead */
      neumorphic: isActive
        ? [
            "text-[var(--color-border-focus)]",
            "bg-[var(--surface-neumorphic-raised)]",
            "shadow-[var(--shadow-glow-accent-subtle)]",
            "border-[var(--color-border-focus)]/60",
            "rounded-lg p-2",
          ].join(" ")
        : [
            "text-[var(--color-text-secondary)]",
            "hover:text-[var(--color-border-focus)]",
            "hover:bg-[var(--surface-neumorphic-raised)]",
            "hover:shadow-[var(--shadow-glow-accent-subtle)]",
            "hover:rounded-lg hover:p-2",
          ].join(" "),

      /** @deprecated Use neo-glass instead */
      glass: isActive
        ? "text-[var(--acc1)] bg-[var(--acc1)]/10 backdrop-blur-sm rounded-lg p-2"
        : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--surface-neumorphic-floating)]/40 hover:backdrop-blur-sm hover:rounded-lg hover:p-2",

      /** @deprecated Use neo-floating instead */
      floating: isActive
        ? "text-[var(--acc1)] bg-[var(--surface-neumorphic-raised)] shadow-[var(--shadow-neumorphic-md)] rounded-lg p-2"
        : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--surface-neumorphic-raised)] hover:shadow-[var(--shadow-neumorphic-md)] hover:rounded-lg hover:p-2 hover:-translate-y-0.5",
    };

    return cn(baseClasses, variantClasses[variant]);
  };

  return (
    <nav className={navClasses[variant]} role="navigation" aria-label="Hauptnavigation">
      <div className="mx-auto flex h-16 max-w-[var(--max-content-width)] items-center justify-around px-4 pb-[env(safe-area-inset-bottom,0px)]">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => getNavItemClasses(isActive)}
            aria-label={item.label}
          >
            <item.icon className="nav-icon h-6 w-6" aria-hidden="true" />
            <span className="nav-label text-[11px] mt-1">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
