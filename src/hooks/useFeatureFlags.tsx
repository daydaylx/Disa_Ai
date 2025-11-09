/**
 * React Hooks für Feature-Flag-System
 *
 * Workflow-konforme React-Integration für Feature-Flags
 */

import React, { useMemo } from "react";

import {
  areAllFeaturesEnabled,
  areAnyFeaturesEnabled,
  featureFlagMetadata,
  type FeatureFlags,
  getFeatureFlags,
  isFeatureEnabled,
} from "../config/flags";

/**
 * Hook für einzelnen Feature-Flag
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const isNewDrawerEnabled = useFeatureFlag('newDrawer');
 *
 *   return isNewDrawerEnabled ? <NewDrawer /> : <OldDrawer />;
 * }
 * ```
 */
export function useFeatureFlag(flag: keyof FeatureFlags): boolean {
  return useMemo(() => isFeatureEnabled(flag), [flag]);
}

/**
 * Hook für alle Feature-Flags
 *
 * @example
 * ```tsx
 * function DebugPanel() {
 *   const flags = useFeatureFlags();
 *
 *   return <pre>{JSON.stringify(flags, null, 2)}</pre>;
 * }
 * ```
 */
export function useFeatureFlags(): FeatureFlags {
  return useMemo(() => getFeatureFlags(), []);
}

/**
 * Hook für mehrere Feature-Flags (ANY Logik)
 *
 * @example
 * ```tsx
 * function AdvancedFeatures() {
 *   const hasAdvancedFeatures = useAnyFeatureFlags(['discussionMode', 'analyticsOptIn']);
 *
 *   return hasAdvancedFeatures ? <AdvancedUI /> : <BasicUI />;
 * }
 * ```
 */
export function useAnyFeatureFlags(flags: (keyof FeatureFlags)[]): boolean {
  return useMemo(() => areAnyFeaturesEnabled(flags), [flags]);
}

/**
 * Hook für mehrere Feature-Flags (ALL Logik)
 *
 * @example
 * ```tsx
 * function BetaFeatures() {
 *   const allBetaEnabled = useAllFeatureFlags(['debugMode', 'performanceMetrics']);
 *
 *   return allBetaEnabled ? <BetaPanel /> : null;
 * }
 * ```
 */
export function useAllFeatureFlags(flags: (keyof FeatureFlags)[]): boolean {
  return useMemo(() => areAllFeaturesEnabled(flags), [flags]);
}

/**
 * Hook für aktive Feature-Flags (nur die aktivierten)
 *
 * @example
 * ```tsx
 * function FeatureIndicator() {
 *   const activeFlags = useActiveFeatureFlags();
 *
 *   return (
 *     <div>
 *       Active features: {activeFlags.map(f => f.name).join(', ')}
 *     </div>
 *   );
 * }
 * ```
 */
export function useActiveFeatureFlags() {
  return useMemo(() => {
    const flags = getFeatureFlags();

    return featureFlagMetadata.filter((meta) => flags[meta.key]);
  }, []);
}

/**
 * Hook für Feature-Flag-Debugging (nur in Development)
 *
 * @example
 * ```tsx
 * function App() {
 *   const debugInfo = useFeatureFlagDebug();
 *
 *   return (
 *     <div>
 *       {debugInfo.isDev && <FeatureFlagDebugPanel {...debugInfo} />}
 *       <MainContent />
 *     </div>
 *   );
 * }
 * ```
 */
export function useFeatureFlagDebug() {
  return useMemo(() => {
    const flags = getFeatureFlags();
    const activeFlags = featureFlagMetadata.filter((meta) => flags[meta.key]);
    const inactiveFlags = featureFlagMetadata.filter((meta) => !flags[meta.key]);

    return {
      isDev: import.meta.env.DEV,
      allFlags: flags,
      activeFlags,
      inactiveFlags,
      activeCount: activeFlags.length,
      totalCount: featureFlagMetadata.length,
      hasAnyActive: activeFlags.length > 0,
      environmentFlags: getEnvironmentActiveFlags(),
      queryFlags: getQueryActiveFlags(),
    };
  }, []);
}

/**
 * Hilfsfunktion: Umgebungsvariablen-basierte aktive Flags
 */
function getEnvironmentActiveFlags(): string[] {
  const envFlags: string[] = [];

  Object.keys(getFeatureFlags()).forEach((key) => {
    const envKey = `VITE_FF_${key.toUpperCase()}`;
    const envValue = import.meta.env[envKey];

    if (envValue === "true" || envValue === "1") {
      envFlags.push(key);
    }
  });

  return envFlags;
}

/**
 * Hilfsfunktion: Query-Parameter-basierte aktive Flags
 */
function getQueryActiveFlags(): string[] {
  if (typeof window === "undefined") return [];

  const urlParams = new URLSearchParams(window.location.search);
  const ffParam = urlParams.get("ff");

  if (!ffParam) return [];

  return ffParam
    .split(",")
    .map((f) => f.trim())
    .filter(Boolean);
}

/**
 * HOC für Feature-Flag-basierte Komponenten-Rendering
 */
export function withFeatureFlag<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  flag: keyof FeatureFlags,
  options: { fallback?: React.ComponentType<P> } = {},
) {
  const WithFeatureFlagComponent: React.FC<P> = (props) => {
    const flagEnabled = useFeatureFlag(flag);

    if (flagEnabled) {
      return <WrappedComponent {...(props as any)} />;
    }

    if (options.fallback) {
      const FallbackComponent = options.fallback;
      return <FallbackComponent {...(props as any)} />;
    }

    return null;
  };

  WithFeatureFlagComponent.displayName = `withFeatureFlag(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return WithFeatureFlagComponent;
}
