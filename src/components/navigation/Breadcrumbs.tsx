import { Link, useLocation } from "react-router-dom";

import { cn } from "@/lib/utils";

import { ChevronRight } from "../../lib/icons";

interface BreadcrumbItem {
  label: string;
  path: string;
  current?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

// Settings page mapping for better labels
const SETTINGS_PAGES = {
  "/settings": "Übersicht",
  "/settings/memory": "Gedächtnis",
  "/settings/behavior": "KI Verhalten",
  "/settings/youth": "Jugendschutz",
  "/settings/api-data": "API & Daten",
  "/settings/extras": "Extras",
  "/settings/appearance": "Darstellung",
} as const;

// Auto-generate breadcrumbs based on current location
export function useBreadcrumbs(): BreadcrumbItem[] {
  const location = useLocation();
  const pathname = location.pathname;

  // Home page
  if (pathname === "/" || pathname === "/chat") {
    return [{ label: "Chat", path: "/", current: true }];
  }

  // Settings pages
  if (pathname.startsWith("/settings")) {
    const breadcrumbs: BreadcrumbItem[] = [
      { label: "Chat", path: "/" },
      { label: "Einstellungen", path: "/settings" },
    ];

    // Add specific settings page if not on overview
    if (pathname !== "/settings") {
      const pageLabel = SETTINGS_PAGES[pathname as keyof typeof SETTINGS_PAGES] || "Unbekannt";
      breadcrumbs.push({ label: pageLabel, path: pathname, current: true });
      const settingsCrumb = breadcrumbs[1];
      if (settingsCrumb) {
        settingsCrumb.current = false; // Remove current from parent
      }
    } else {
      const settingsCrumb = breadcrumbs[1];
      if (settingsCrumb) {
        settingsCrumb.current = true;
      }
    }

    return breadcrumbs;
  }

  // Roles page
  if (pathname === "/roles") {
    return [
      { label: "Chat", path: "/" },
      { label: "Rollen", path: "/roles", current: true },
    ];
  }

  // Models page
  if (pathname === "/models") {
    return [
      { label: "Chat", path: "/" },
      { label: "Modelle", path: "/models", current: true },
    ];
  }

  // Feedback page
  if (pathname === "/feedback") {
    return [
      { label: "Chat", path: "/" },
      { label: "Feedback", path: "/feedback", current: true },
    ];
  }

  // Chat history
  if (pathname === "/chat/history") {
    return [
      { label: "Chat", path: "/" },
      { label: "Verlauf", path: "/chat/history", current: true },
    ];
  }

  // Default fallback
  return [{ label: "Chat", path: "/", current: true }];
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  if (items.length <= 1) return null; // Don't show breadcrumbs for single page

  return (
    <nav className={cn("flex items-center space-x-1 text-sm", className)} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={item.path} className="flex items-center">
              {index > 0 && (
                <ChevronRight
                  className="h-3 w-3 text-text-tertiary mx-2 flex-shrink-0"
                  aria-hidden="true"
                />
              )}

              {isLast || item.current ? (
                <span
                  className="font-medium text-text-primary truncate max-w-[140px]"
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className="text-text-secondary hover:text-text-primary transition-colors truncate max-w-[120px] tap-target-sm"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// Auto breadcrumbs component that uses current location
export function AutoBreadcrumbs({ className }: { className?: string }) {
  const items = useBreadcrumbs();
  return <Breadcrumbs items={items} className={className} />;
}
