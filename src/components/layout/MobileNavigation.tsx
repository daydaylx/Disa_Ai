import { Bot, MessageCircle, Settings, Users } from "../../lib/icons";
import { NavLink } from "react-router-dom";

import { cn } from "../../lib/utils";

const navItems = [
  { path: "/chat", icon: MessageCircle, label: "Chat" },
  { path: "/roles", icon: Users, label: "Rollen" },
  { path: "/models", icon: Bot, label: "Modelle" },
  { path: "/settings", icon: Settings, label: "Einstellungen" },
];

interface MobileNavigationProps {
  variant?: "neo-dock" | "neo-floating" | "neo-glass";
}

export function MobileNavigation({ variant = "neo-dock" }: MobileNavigationProps) {
  const navClasses = {
    "neo-dock": [
      "bottom-navigation fixed bottom-0 left-0 right-0 z-50 w-full",
      // Android-optimized: Clean, performant base
      "bg-[var(--surface-neumorphic-raised)]",
      "shadow-[var(--shadow-neumorphic-lg)]",
      "border-t-[var(--border-neumorphic-light)]",
      "safe-area-bottom",
    ].join(" "),

    "neo-floating": [
      "bottom-navigation fixed bottom-4 left-4 right-4 z-50",
      "mx-auto max-w-md rounded-[var(--radius-xl)]",
      // Floating variant for better visual separation
      "bg-[var(--surface-neumorphic-floating)]",
      "shadow-[var(--shadow-neumorphic-xl)]",
      "border-[var(--border-neumorphic-light)]",
      // Reduced animations for better performance
      "transition-all duration-300 ease-out",
    ].join(" "),

    "neo-glass": [
      "bottom-navigation fixed bottom-0 left-0 right-0 z-50 w-full",
      // Glass variant with backdrop blur
      "bg-[var(--surface-neumorphic-floating)]/90",
      "backdrop-blur-md",
      "shadow-[var(--shadow-neumorphic-md)]",
      "border-t-[var(--border-neumorphic-light)]",
      "safe-area-bottom",
    ].join(" "),
  };

  const getNavItemClasses = (isActive: boolean) => {
    const baseClasses = [
      "nav-item flex flex-col items-center justify-center",
      "text-xs font-medium",
      "transition-all duration-200 ease-out",
      "min-h-[44px] min-w-[44px]", // Android touch target minimum
      "py-2 px-3", // Adequate padding for touch
      "relative isolate",
    ].join(" ");

    const variantClasses = {
      "neo-dock": isActive
        ? [
            "text-[var(--color-brand-primary)] font-semibold",
            "bg-[var(--color-brand-subtle)]/30",
            "shadow-[var(--shadow-neumorphic-sm)]",
            "rounded-[var(--radius-lg)]",
          ].join(" ")
        : [
            "text-[var(--color-text-secondary)]",
            "hover:text-[var(--color-text-primary)]",
            "hover:bg-[var(--surface-neumorphic-raised)]/50",
            "hover:rounded-[var(--radius-lg)]",
          ].join(" "),

      "neo-floating": isActive
        ? [
            "text-[var(--color-brand-primary)] font-semibold",
            "bg-[var(--surface-neumorphic-floating)]",
            "shadow-[var(--shadow-neumorphic-md)]",
            "rounded-[var(--radius-lg)]",
            "transform scale-105",
          ].join(" ")
        : [
            "text-[var(--color-text-secondary)]",
            "hover:text-[var(--color-text-primary)]",
            "hover:bg-[var(--surface-neumorphic-raised)]/60",
            "hover:rounded-[var(--radius-lg)]",
            "hover:transform hover:scale-102",
          ].join(" "),

      "neo-glass": isActive
        ? [
            "text-[var(--color-brand-primary)] font-semibold",
            "bg-[var(--surface-neumorphic-floating)]/80",
            "shadow-[var(--shadow-neumorphic-sm)]",
            "rounded-[var(--radius-lg)]",
          ].join(" ")
        : [
            "text-[var(--color-text-secondary)]",
            "hover:text-[var(--color-text-primary)]",
            "hover:bg-[var(--surface-neumorphic-floating)]/40",
            "hover:rounded-[var(--radius-lg)]",
          ].join(" "),
    };

    return cn(baseClasses, variantClasses[variant]);
  };

  return (
    <nav className={navClasses[variant]} role="navigation" aria-label="Hauptnavigation">
      <div className="mx-auto flex h-20 max-w-[var(--max-content-width)] items-center justify-around px-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => getNavItemClasses(isActive)}
            aria-label={item.label}
          >
            <item.icon className="nav-icon h-5 w-5" aria-hidden="true" />
            <span className="nav-label text-[10px] mt-1 font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
