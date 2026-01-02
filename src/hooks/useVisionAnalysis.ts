import { useCallback, useRef, useState } from "react";

import { analyzeImage, VisionApiError } from "../api/zaiVision";

/**
 * State for vision analysis
 */
export interface VisionAnalysisState {
  isAnalyzing: boolean;
  error: VisionApiError | null;
}

/**
 * Hook for handling Z.ai Vision image analysis
 */
export function useVisionAnalysis() {
  const [state, setState] = useState<VisionAnalysisState>({
    isAnalyzing: false,
    error: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Analyze an image with the given prompt
   */
  const analyze = useCallback(
    async (
      imageDataUrl: string,
      prompt: string,
      options?: {
        onSuccess?: (text: string) => void;
        onError?: (error: VisionApiError) => void;
      },
    ): Promise<string | null> => {
      // Cancel any pending request
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      setState({ isAnalyzing: true, error: null });

      try {
        const result = await analyzeImage(imageDataUrl, prompt, {
          signal: abortControllerRef.current.signal,
        });

        setState({ isAnalyzing: false, error: null });
        options?.onSuccess?.(result.text);
        return result.text;
      } catch (error) {
        const visionError =
          error instanceof VisionApiError
            ? error
            : new VisionApiError(
                error instanceof Error ? error.message : "Unbekannter Fehler",
                "INTERNAL_ERROR",
              );

        setState({ isAnalyzing: false, error: visionError });
        options?.onError?.(visionError);
        return null;
      }
    },
    [],
  );

  /**
   * Cancel any pending analysis
   */
  const cancel = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setState({ isAnalyzing: false, error: null });
  }, []);

  /**
   * Clear any error state
   */
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    isAnalyzing: state.isAnalyzing,
    error: state.error,
    analyze,
    cancel,
    clearError,
  };
}
