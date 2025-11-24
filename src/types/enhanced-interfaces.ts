/**
 * Enhanced Data Interfaces for Performance-First Mobile UX
 *
 * Hybrid approach: Extends existing interfaces with breaking changes where needed
 * Focus: Favorites System + Usage Tracking + Performance Optimization
 */

// ============================================================================
// CORE ENHANCED INTERFACES
// ============================================================================

/** Enhanced Role Interface - extends existing with favorites and usage tracking */
export interface EnhancedRole {
  // Core properties (existing)
  id: string;
  name: string;
  description?: string;
  systemPrompt: string;
  allowedModels?: string[];
  tags?: string[];
  category?: string;
  examples?: string[];
  styleHints: {
    typographyScale: number;
    borderRadius: number;
    accentColor: string;
  };

  // NEW: Favorites & Usage System
  isFavorite: boolean;
  lastUsed: Date | null;
  usage: {
    count: number;
    lastAccess: Date | null;
    averageSessionLength?: number; // in minutes
  };

  // NEW: Performance hints for mobile
  performance: {
    priority: "high" | "medium" | "low"; // For preloading/caching
    estimatedLoadTime?: number; // in ms
  };

  // NEW: Enhanced metadata for better UX
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    version: string;
    author?: string;
    isBuiltIn: boolean; // default vs external roles
  };
}

/** Enhanced Model Interface - unified and extended */
export interface EnhancedModel {
  // Core properties (unified from AIModel + ModelDefinition)
  id: string;
  label: string;
  provider: string;
  description: string;

  // Pricing (unified property names)
  pricing: {
    inputPrice: number; // per 1K tokens in USD
    outputPrice: number; // per 1K tokens in USD
    currency: "USD"; // future-proofing
    isFree: boolean; // computed property for quick filtering
  };

  // Context & Performance
  context: {
    maxTokens: number;
    effectiveTokens?: number; // real-world usable context
  };

  // Optional raw context meta for UI badges
  contextK?: number;
  contextTokens?: number;

  // NEW: Performance Scores (0-100 scale)
  performance: {
    speed: number; // Response time score
    reliability: number; // Uptime/stability score
    quality: number; // Output quality score
    efficiency: number; // Cost/performance ratio
  };

  // Optional quality/openness scores from catalog
  qualityScore?: number;
  contextScore?: number; // 0-100 normalized context score
  openness?: number;
  censorScore?: number;

  // Enhanced tags and categorization
  tags: string[];
  category: ModelCategory;
  tier: "free" | "budget" | "premium" | "enterprise";

  // Optional catalog notes
  notes?: string;

  // NEW: Favorites & Usage System
  isFavorite: boolean;
  lastUsed: Date | null;
  usage: {
    count: number;
    totalTokensUsed: number;
    averageSessionTokens: number;
    lastAccess: Date | null;
  };

  // NEW: Capabilities for better filtering
  capabilities: {
    multimodal: boolean;
    codeGeneration: boolean;
    reasoning: boolean;
    creative: boolean;
    analysis: boolean;
    translation: boolean;
  };

  // NEW: Mobile-specific optimizations
  mobile: {
    recommendedForMobile: boolean;
    minBandwidth?: number; // Kbps required
    offlineCapable: boolean;
  };
}

/** Model Categories for consistent grouping */
export type ModelCategory =
  | "quick-free" // ⚡ Schnelle Kostenlose
  | "strong-free" // 🚀 Starke Kostenlose
  | "chat-allrounder" // 💬 Chat-Allrounder
  | "multimodal" // 🖼️ Multimodale Modelle
  | "creative-uncensored" // 🎭 Kreativ & Uncensored
  | "budget-specialist" // 💰 Budget-Spezialist
  | "premium-models"; // 🏆 Premium Modelle

/** Role Categories for consistent grouping */
export type RoleCategory =
  | "alltag" // Alltag
  | "business-karriere" // Business & Karriere
  | "kreativ-unterhaltung" // Kreativ & Unterhaltung
  | "lernen-bildung" // Lernen & Bildung
  | "leben-familie" // Leben & Familie
  | "experten-beratung" // Experten & Beratung
  | "erwachsene" // Erwachsene
  | "spezial"; // Spezial

// ============================================================================
// FAVORITES & USAGE MANAGEMENT
// ============================================================================

/** Favorites System State */
export interface FavoritesState {
  roles: {
    items: string[]; // role IDs
    maxCount: number;
    lastUpdated: Date;
  };
  models: {
    items: string[]; // model IDs
    maxCount: number;
    lastUpdated: Date;
  };
}

/** Usage Analytics Data */
export interface UsageAnalytics {
  roles: Record<
    string,
    {
      count: number;
      totalDuration: number; // minutes
      lastUsed: Date;
      averageSessionLength: number;
    }
  >;
  models: Record<
    string,
    {
      count: number;
      totalTokens: number;
      totalCost: number;
      lastUsed: Date;
      averageTokensPerSession: number;
    }
  >;
  lastSync: Date;
}

/** Performance Metrics for monitoring */
export interface PerformanceMetrics {
  loadTimes: {
    rolesList: number;
    modelsList: number;
    categorySwitch: number;
    search: number;
  };
  userInteractions: {
    averageTimeToSelect: number;
    searchUsageRate: number;
    favoritesUsageRate: number;
    categoryDiscoveryRate: number;
  };
  errors: {
    loadFailures: number;
    searchErrors: number;
    lastErrorTime: Date | null;
  };
  lastMeasurement: Date;
}

// ============================================================================
// FILTER & SEARCH
// ============================================================================

/** Enhanced Filter State for Performance-First UX */
export interface FilterState {
  // Text search
  searchQuery: string;
  searchHistory: string[]; // Recent searches

  // Category filters
  selectedCategories: string[];
  excludedCategories: string[];

  // Quick filters
  showFavoritesOnly: boolean;
  showRecentlyUsed: boolean;
  showBuiltInOnly: boolean;
  hideMatureContent?: boolean; // WCAG: Content filtering for age-appropriate content

  // Model-specific filters
  models: {
    showFreeOnly: boolean;
    showPremiumOnly: boolean;
    minPerformanceScore: number;
    requiredCapabilities: string[];
    maxPriceRange: [number, number]; // [min, max] USD per 1K tokens
  };

  // Sorting
  sortBy: "name" | "lastUsed" | "usage" | "performance" | "price" | "category";
  sortDirection: "asc" | "desc";
}

/** Search Result with relevance scoring */
export interface SearchResult<T> {
  item: T;
  score: number; // 0-100 relevance score
  matchType: "exact" | "fuzzy" | "tag" | "category";
  highlightRanges: Array<[number, number]>; // For highlighting matches
}

// ============================================================================
// UI STATE MANAGEMENT
// ============================================================================

/** UI State for Performance-First Mobile UX */
export interface UIState {
  // Navigation state
  currentView: "roles" | "models";
  activeTab: string;
  expandedCategories: Set<string>;

  // Performance optimizations
  virtualScrollEnabled: boolean;
  lazyLoadingEnabled: boolean;
  prefetchingEnabled: boolean;

  // Mobile-specific
  bottomSheetOpen: boolean;
  selectedItemForDetails: string | null;
  swipeGesturesEnabled: boolean;
  hapticFeedbackEnabled: boolean;

  // Loading states
  isLoading: boolean;
  isSearching: boolean;
  loadingStates: Record<string, boolean>;

  // Error handling
  errors: Array<{
    id: string;
    type: "network" | "data" | "ui" | "performance";
    message: string;
    timestamp: Date;
    resolved: boolean;
  }>;
}

// ============================================================================
// MIGRATION HELPERS
// ============================================================================

/** Migration helper to convert legacy Role to EnhancedRole */
export function migrateRole(legacyRole: any): EnhancedRole {
  const now = new Date();

  return {
    // Preserve existing properties
    id: legacyRole.id,
    name: legacyRole.name,
    description: legacyRole.description,
    systemPrompt: legacyRole.systemPrompt,
    allowedModels: legacyRole.allowedModels,
    tags: legacyRole.tags || [],
    category: legacyRole.category,
    styleHints: legacyRole.styleHints,

    // Add new properties with defaults
    isFavorite: false,
    lastUsed: null,
    usage: {
      count: 0,
      lastAccess: null,
      averageSessionLength: 0,
    },
    performance: {
      priority: "medium",
      estimatedLoadTime: 100,
    },
    metadata: {
      createdAt: now,
      updatedAt: now,
      version: "1.0.0",
      author: "system",
      isBuiltIn: true,
    },
  };
}

/** Migration helper to convert legacy AIModel to EnhancedModel */
export function migrateModel(legacyModel: any): EnhancedModel {
  const isFree = (legacyModel.inputPrice || legacyModel.priceIn || 0) === 0;

  return {
    // Unified core properties
    id: legacyModel.id,
    label: legacyModel.label,
    provider: extractProvider(legacyModel.id),
    description: legacyModel.description || `${legacyModel.label} AI model`,

    // Unified pricing
    pricing: {
      inputPrice: legacyModel.inputPrice || legacyModel.priceIn || 0,
      outputPrice: legacyModel.outputPrice || legacyModel.priceOut || 0,
      currency: "USD",
      isFree,
    },

    // Context handling
    context: {
      maxTokens: legacyModel.context || legacyModel.ctx || 4096,
      effectiveTokens: Math.floor((legacyModel.context || legacyModel.ctx || 4096) * 0.8),
    },

    // Default performance scores (to be calibrated)
    performance: {
      speed: isFree ? 70 : 85,
      reliability: 90,
      quality: isFree ? 75 : 90,
      efficiency: isFree ? 95 : 80,
    },

    // Enhanced categorization
    tags: legacyModel.tags || [],
    category: categorizeModel(legacyModel),
    tier: isFree ? "free" : determineTier(legacyModel.inputPrice || legacyModel.priceIn || 0),

    // New properties with defaults
    isFavorite: false,
    lastUsed: null,
    usage: {
      count: 0,
      totalTokensUsed: 0,
      averageSessionTokens: 0,
      lastAccess: null,
    },
    capabilities: inferCapabilities(legacyModel),
    mobile: {
      recommendedForMobile: true,
      offlineCapable: false,
    },
  };
}

// Helper functions for migration
function extractProvider(modelId: string): string {
  return modelId.split("/")[0] || "unknown";
}

function categorizeModel(model: any): ModelCategory {
  const tags = model.tags || [];
  const isFree = (model.inputPrice || model.priceIn || 0) === 0;

  if (isFree && tags.includes("fast")) return "quick-free";
  if (isFree) return "strong-free";
  if (tags.includes("multimodal")) return "multimodal";
  if (tags.includes("creative")) return "creative-uncensored";
  if (tags.includes("budget")) return "budget-specialist";
  if (tags.includes("premium")) return "premium-models";
  return "chat-allrounder";
}

function determineTier(price: number): "free" | "budget" | "premium" | "enterprise" {
  if (price === 0) return "free";
  if (price < 0.001) return "budget";
  if (price < 0.01) return "premium";
  return "enterprise";
}

function inferCapabilities(model: any) {
  const tags = model.tags || [];
  const id = model.id.toLowerCase();

  return {
    multimodal: tags.includes("multimodal") || id.includes("vision"),
    codeGeneration: tags.includes("coding") || id.includes("code"),
    reasoning: tags.includes("reasoning") || tags.includes("advanced"),
    creative: tags.includes("creative") || id.includes("creative"),
    analysis: tags.includes("analysis") || tags.includes("reasoning"),
    translation: true, // Assume most models can translate
  };
}

// ============================================================================
// TYPE GUARDS
// ============================================================================

export function isEnhancedRole(role: any): role is EnhancedRole {
  return (
    typeof role === "object" &&
    typeof role.id === "string" &&
    typeof role.isFavorite === "boolean" &&
    typeof role.usage === "object" &&
    typeof role.performance === "object" &&
    typeof role.metadata === "object"
  );
}

export function isEnhancedModel(model: any): model is EnhancedModel {
  return (
    typeof model === "object" &&
    typeof model.id === "string" &&
    typeof model.pricing === "object" &&
    typeof model.performance === "object" &&
    typeof model.isFavorite === "boolean" &&
    typeof model.capabilities === "object"
  );
}
