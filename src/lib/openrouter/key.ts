// Canonical key name for the application
const CANONICAL_KEY = "openrouter-key";

// Default OpenRouter key provided by the application
export const DEFAULT_API_KEY =
  "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";

// Flag to determine whether the user has overridden the default key
const OVERRIDE_FLAG = "openrouter-key-override";

// Legacy keys for backward compatibility (read-only migration)
const LEGACY_CANDIDATES = [
  "disa_api_key",
  "openrouter_key",
  "OPENROUTER_API_KEY",
  "disa:openrouter:key",
] as const;

function safeGet(key: string): string | null {
  try {
    // Priority: sessionStorage (session-only, more secure)
    const sessionVal = sessionStorage.getItem(key);
    if (sessionVal) {
      const trimmed = sessionVal.replace(/^"+|"+$/g, "").trim();
      return trimmed.length ? trimmed : null;
    }

    // Fallback: localStorage (migrate to session)
    const localVal = localStorage.getItem(key);
    if (localVal) {
      const trimmed = localVal.replace(/^"+|"+$/g, "").trim();
      if (trimmed.length) {
        // Migrate to sessionStorage and remove from localStorage
        try {
          sessionStorage.setItem(key, trimmed);
          localStorage.removeItem(key);
        } catch {
          /* Migration failed, keep in localStorage */
        }
        return trimmed;
      }
    }

    return null;
  } catch {
    return null;
  }
}

export function readApiKey(): string | null {
  // First, try the canonical key
  const canonical = safeGet(CANONICAL_KEY);
  if (canonical) return canonical;

  // For backward compatibility, check legacy keys and migrate
  for (const legacyKey of LEGACY_CANDIDATES) {
    const legacyValue = safeGet(legacyKey);
    if (legacyValue) {
      // Migrate to canonical key and clean up legacy keys
      try {
        sessionStorage.setItem(CANONICAL_KEY, legacyValue);
        // Clear the legacy key after successful migration
        sessionStorage.removeItem(legacyKey);
        localStorage.removeItem(legacyKey);
      } catch {
        // If migration fails, continue using the legacy value
      }
      return legacyValue;
    }
  }

  // If no key has been set and the user has not overridden the default,
  // fall back to the bundled default key.
  if (!hasOverrideFlag()) {
    try {
      sessionStorage.setItem(CANONICAL_KEY, DEFAULT_API_KEY);
    } catch {
      /* ignore */
    }
    return DEFAULT_API_KEY;
  }

  return null;
}

export function writeApiKey(v: string | null | undefined): void {
  const val = (v ?? "").trim();

  try {
    if (val) {
      // Store only in canonical key (sessionStorage for security)
      sessionStorage.setItem(CANONICAL_KEY, val);
    } else {
      // Clear canonical key
      sessionStorage.removeItem(CANONICAL_KEY);
    }
    // Always clear from localStorage (migration)
    localStorage.removeItem(CANONICAL_KEY);
  } catch {
    /* Safe: storage operation failed */
  }

  markOverrideFlag();

  // Clean up any legacy keys during write operations
  for (const legacyKey of LEGACY_CANDIDATES) {
    try {
      sessionStorage.removeItem(legacyKey);
      localStorage.removeItem(legacyKey);
    } catch {
      /* Safe: continue with next candidate */
    }
  }
}

export function clearAllApiKeys(): void {
  markOverrideFlag();
  // Clear canonical key
  try {
    sessionStorage.removeItem(CANONICAL_KEY);
    localStorage.removeItem(CANONICAL_KEY);
  } catch {
    /* Safe: storage operation failed */
  }

  // Clear all legacy key candidates from both storages
  for (const legacyKey of LEGACY_CANDIDATES) {
    try {
      sessionStorage.removeItem(legacyKey);
      localStorage.removeItem(legacyKey);
    } catch {
      /* Safe: continue with next candidate */
    }
  }
}

export function hasApiKey(): boolean {
  return Boolean(readApiKey());
}

function hasOverrideFlag(): boolean {
  try {
    return sessionStorage.getItem(OVERRIDE_FLAG) === "true";
  } catch {
    return false;
  }
}

function markOverrideFlag(): void {
  try {
    sessionStorage.setItem(OVERRIDE_FLAG, "true");
  } catch {
    /* ignore */
  }
}
