/**
 * Feature Flags System - Disa AI
 *
 * Workflow-Regel #4: Feature-Flags pflicht für neue oder riskante Features
 * Flags liegen in `src/config/flags.ts`. Standard: deaktiviert.
 */

export interface FeatureFlags {
  // Sprint 3 Features
  discussionMode: boolean;
  analyticsOptIn: boolean;

  // UI Features
  newDrawer: boolean;
  edgeSwipeNavigation: boolean;
  enhancedNavigation: boolean;

  // Performance Features
  lazyHighlighter: boolean;
  deferredDataFetch: boolean;

  // Development Features
  debugMode: boolean;
  performanceMetrics: boolean;
}

/**
 * Default feature flags - alle standardmäßig deaktiviert
 * Aktivierung per:
 * - .env.local: VITE_FF_FLAGNAME=true
 * - Query: ?ff=flagname
 * - Multiple: ?ff=flag1,flag2
 */
export const defaultFeatureFlags: FeatureFlags = {
  // Sprint 3 Features
  discussionMode: false,
  analyticsOptIn: false,

  // UI Features
  newDrawer: false,
  edgeSwipeNavigation: false,
  enhancedNavigation: false,

  // Performance Features
  lazyHighlighter: false,
  deferredDataFetch: false,

  // Development Features
  debugMode: false,
  performanceMetrics: false,
};

/**
 * Umgebungsvariablen-basierte Flags laden
 */
function getEnvFlags(): Partial<FeatureFlags> {
  const envFlags: Partial<FeatureFlags> = {};

  // VITE_FF_* Umgebungsvariablen verarbeiten
  Object.keys(defaultFeatureFlags).forEach((key) => {
    const envKey = `VITE_FF_${key.toUpperCase()}`;
    const envValue = import.meta.env[envKey];

    if (envValue === "true" || envValue === "1") {
      envFlags[key as keyof FeatureFlags] = true;
    }
  });

  return envFlags;
}

/**
 * Query-Parameter-basierte Flags laden (?ff=flagname oder ?ff=flag1,flag2)
 */
function getQueryFlags(): Partial<FeatureFlags> {
  const queryFlags: Partial<FeatureFlags> = {};

  if (typeof window === "undefined") return queryFlags;

  const urlParams = new URLSearchParams(window.location.search);
  const ffParam = urlParams.get("ff");

  if (ffParam) {
    const flagNames = ffParam.split(",").map((f) => f.trim());

    flagNames.forEach((flagName) => {
      if (flagName in defaultFeatureFlags) {
        queryFlags[flagName as keyof FeatureFlags] = true;
      } else {
        console.warn(`[Feature Flags] Unknown flag: ${flagName}`);
      }
    });
  }

  return queryFlags;
}

/**
 * Aktuelle Feature-Flags ermitteln
 * Priorität: Query Parameter > Umgebungsvariablen > Defaults
 */
export function getFeatureFlags(): FeatureFlags {
  const envFlags = getEnvFlags();
  const queryFlags = getQueryFlags();

  const flags = {
    ...defaultFeatureFlags,
    ...envFlags,
    ...queryFlags,
  };

  // Debug-Ausgabe in development
  if (import.meta.env.DEV) {
    const activeFlags = Object.entries(flags)
      .filter(([, value]) => value)
      .map(([key]) => key);

    if (activeFlags.length > 0) {
      console.warn("[Feature Flags] Active flags:", activeFlags);
    }
  }

  return flags;
}

/**
 * Einzelnen Flag-Status prüfen
 */
export function isFeatureEnabled(flag: keyof FeatureFlags): boolean {
  return getFeatureFlags()[flag];
}

/**
 * Mehrere Flags gleichzeitig prüfen
 */
export function areAnyFeaturesEnabled(flags: (keyof FeatureFlags)[]): boolean {
  const currentFlags = getFeatureFlags();
  return flags.some((flag) => currentFlags[flag]);
}

/**
 * Alle Flags gleichzeitig prüfen
 */
export function areAllFeaturesEnabled(flags: (keyof FeatureFlags)[]): boolean {
  const currentFlags = getFeatureFlags();
  return flags.every((flag) => currentFlags[flag]);
}

/**
 * Feature-Flag Metadaten für Dev-UI
 */
export interface FeatureFlagMeta {
  key: keyof FeatureFlags;
  name: string;
  description: string;
  sprint?: number;
  riskLevel: "low" | "medium" | "high";
}

export const featureFlagMetadata: FeatureFlagMeta[] = [
  {
    key: "discussionMode",
    name: "Strukturierte Diskussion",
    description: "Shape-basierte strukturierte Diskussionsführung",
    sprint: 3,
    riskLevel: "medium",
  },
  {
    key: "analyticsOptIn",
    name: "Analytics Opt-In",
    description: "Benutzer-Analytics mit Opt-In und Export",
    sprint: 3,
    riskLevel: "low",
  },
  {
    key: "newDrawer",
    name: "Neues Drawer-Design",
    description: "Überarbeitetes Bottom-Sheet/Drawer Interface",
    sprint: 2,
    riskLevel: "medium",
  },
  {
    key: "enhancedNavigation",
    name: "Erweiterte Navigation",
    description: "Aktiviert das neue Mobile-Bottom-Navigationserlebnis",
    sprint: 5,
    riskLevel: "medium",
  },
  {
    key: "edgeSwipeNavigation",
    name: "Edge-Swipe Navigation",
    description: "Rand-Swipe für Drawer auf Touch-Geräten",
    sprint: 2,
    riskLevel: "high",
  },
  {
    key: "lazyHighlighter",
    name: "Lazy Syntax Highlighter",
    description: "On-demand Laden des Syntax-Highlighters",
    sprint: 1,
    riskLevel: "low",
  },
  {
    key: "deferredDataFetch",
    name: "Deferred Data Fetching",
    description: "Verzögertes Laden von Rollen/Modellen/Tools",
    sprint: 1,
    riskLevel: "medium",
  },
  {
    key: "debugMode",
    name: "Debug-Modus",
    description: "Erweiterte Debug-Informationen und Logs",
    riskLevel: "low",
  },
  {
    key: "performanceMetrics",
    name: "Performance-Metriken",
    description: "Bundle-Größe und Performance-Monitoring",
    riskLevel: "low",
  },
];
