// Safe, defensive storage wrapper for browser environments.
// Uses try/catch around localStorage/sessionStorage and falls back to in-memory storage when unavailable.

export interface SafeStorage {
  isAvailable: boolean;
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  clear(): void;
}

function createMemoryStorage(): SafeStorage {
  const store = new Map<string, string>();

  return {
    isAvailable: false,
    getItem(key) {
      return store.has(key) ? store.get(key)! : null;
    },
    setItem(key, value) {
      store.set(key, value);
    },
    removeItem(key) {
      store.delete(key);
    },
    clear() {
      store.clear();
    },
  };
}

export function createSafeStorage(
  storage: Storage | undefined = typeof window !== "undefined" ? window.localStorage : undefined,
): SafeStorage {
  if (typeof window === "undefined" || !storage) return createMemoryStorage();

  try {
    const testKey = "__disa_safe_storage_test__";
    storage.setItem(testKey, "1");
    storage.removeItem(testKey);

    return {
      isAvailable: true,
      getItem(key) {
        try {
          return storage.getItem(key);
        } catch {
          return null;
        }
      },
      setItem(key, value) {
        try {
          storage.setItem(key, value);
        } catch {
          // ignore quota / privacy errors
        }
      },
      removeItem(key) {
        try {
          storage.removeItem(key);
        } catch {
          // ignore
        }
      },
      clear() {
        try {
          storage.clear();
        } catch {
          // ignore
        }
      },
    };
  } catch {
    return createMemoryStorage();
  }
}

export const safeStorage: SafeStorage = createSafeStorage();
