import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { cn } from "@/lib/utils";
import { Button } from "@/ui/Button";

import { ChevronLeft } from "../../lib/icons";

interface MobileBackButtonProps {
  className?: string;
  onBack?: () => void;
}

// Define navigation hierarchy for automatic back navigation
const NAV_HIERARCHY = {
  // Settings pages go back to settings overview
  "/settings/memory": "/settings",
  "/settings/behavior": "/settings",
  "/settings/youth": "/settings",
  "/settings/api-data": "/settings",
  "/settings/extras": "/settings",
  "/settings/appearance": "/settings",

  // Other pages go back to main chat
  "/settings": "/",
  "/roles": "/",
  "/models": "/",
  "/feedback": "/",
  "/chat/history": "/",
  "/impressum": "/",
  "/datenschutz": "/",
} as const;

export function useMobileBackNavigation() {
  const location = useLocation();
  const navigate = useNavigate();

  const getBackPath = useCallback(() => {
    const currentPath = location.pathname;
    return NAV_HIERARCHY[currentPath as keyof typeof NAV_HIERARCHY] || "/";
  }, [location.pathname]);

  const canGoBack = useCallback(() => {
    const currentPath = location.pathname;
    return currentPath !== "/" && currentPath !== "/chat";
  }, [location.pathname]);

  const goBack = useCallback(() => {
    const backPath = getBackPath();
    void navigate(backPath);
  }, [navigate, getBackPath]);

  return { canGoBack: canGoBack(), goBack, backPath: getBackPath() };
}

export function MobileBackButton({ className, onBack }: MobileBackButtonProps) {
  const { canGoBack, goBack } = useMobileBackNavigation();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      goBack();
    }
  };

  if (!canGoBack) return null;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleBack}
      className={cn(
        "-ml-2 md:hidden", // Only show on mobile
        "flex items-center gap-1 text-text-secondary hover:text-text-primary transition-colors tap-target",
        className,
      )}
      aria-label="Zurück"
    >
      <ChevronLeft className="h-4 w-4" />
      <span className="text-sm">Zurück</span>
    </Button>
  );
}

// Hook for programmatic back navigation with proper hierarchy
export function useSmartBack() {
  const navigate = useNavigate();
  const location = useLocation();

  return useCallback(() => {
    const currentPath = location.pathname;
    const backPath = NAV_HIERARCHY[currentPath as keyof typeof NAV_HIERARCHY];

    if (backPath) {
      void navigate(backPath);
    } else if (window.history.length > 1) {
      // Fallback to browser back if no hierarchy defined and history exists
      window.history.back();
    } else {
      // Ultimate fallback to home
      void navigate("/");
    }
  }, [navigate, location.pathname]);
}
