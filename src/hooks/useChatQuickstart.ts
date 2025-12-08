import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { QUICKSTARTS } from "../config/quickstarts";

interface QuickstartOptions {
  onStartWithPreset: (system: string, user?: string) => void;
}

/**
 * Hook to handle quickstart functionality from URL parameters.
 * Processes ?quickstart=<id> query param and triggers preset initialization.
 */
export function useChatQuickstart({ onStartWithPreset }: QuickstartOptions) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const processedQuickstartRef = useRef<string | null>(null);

  useEffect(() => {
    const quickstartId = searchParams.get("quickstart");
    if (!quickstartId || QUICKSTARTS.length === 0) return;

    // Prevent processing the same quickstart ID multiple times
    if (processedQuickstartRef.current === quickstartId) return;

    const quickstart = QUICKSTARTS.find((q) => q.id === quickstartId);
    if (quickstart) {
      processedQuickstartRef.current = quickstartId;
      onStartWithPreset(quickstart.system, quickstart.user);
      // Clean URL by removing query param
      void navigate("/chat", { replace: true });
    }
  }, [searchParams, navigate, onStartWithPreset]);
}
