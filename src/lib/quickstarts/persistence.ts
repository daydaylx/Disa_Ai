/**
 * Quickstart Persistence & State Management
 * Implements Issue #105 - "Zuletzt genutzt" ordering and pinning
 */

import type { QuickstartAction } from "../../config/quickstarts";

interface QuickstartState {
  id: string;
  lastUsed: number;
  isPinned: boolean;
  useCount: number;
}

interface QuickstartStorage {
  states: Record<string, QuickstartState>;
  version: number;
}

const STORAGE_KEY = "disa-quickstarts";
const STORAGE_VERSION = 1;

class QuickstartPersistence {
  private storage: QuickstartStorage;

  constructor() {
    this.storage = this.loadFromStorage();
  }

  private loadFromStorage(): QuickstartStorage {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as QuickstartStorage;
        if (parsed.version === STORAGE_VERSION) {
          return parsed;
        }
      }
    } catch (error) {
      console.warn("Failed to load quickstart storage:", error);
    }

    // Return default storage
    return {
      states: {},
      version: STORAGE_VERSION,
    };
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.storage));
    } catch (error) {
      console.warn("Failed to save quickstart storage:", error);
    }
  }

  private getState(id: string): QuickstartState {
    return (
      this.storage.states[id] || {
        id,
        lastUsed: 0,
        isPinned: false,
        useCount: 0,
      }
    );
  }

  private setState(id: string, state: QuickstartState): void {
    this.storage.states[id] = state;
    this.saveToStorage();
  }

  /**
   * Mark a quickstart as used (updates lastUsed and useCount)
   */
  markAsUsed(id: string): void {
    const state = this.getState(id);
    this.setState(id, {
      ...state,
      lastUsed: Date.now(),
      useCount: state.useCount + 1,
    });
  }

  /**
   * Toggle pin status for a quickstart
   */
  togglePin(id: string): boolean {
    const state = this.getState(id);
    const newPinned = !state.isPinned;
    this.setState(id, {
      ...state,
      isPinned: newPinned,
    });
    return newPinned;
  }

  /**
   * Check if a quickstart is pinned
   */
  isPinned(id: string): boolean {
    return this.getState(id).isPinned;
  }

  /**
   * Get last used timestamp for a quickstart
   */
  getLastUsed(id: string): number {
    return this.getState(id).lastUsed;
  }

  /**
   * Get use count for a quickstart
   */
  getUseCount(id: string): number {
    return this.getState(id).useCount;
  }

  /**
   * Sort quickstarts by priority: pinned first, then by last used, then by use count
   */
  sortQuickstarts(quickstarts: QuickstartAction[]): QuickstartAction[] {
    return [...quickstarts].sort((a, b) => {
      const stateA = this.getState(a.id);
      const stateB = this.getState(b.id);

      // 1. Pinned items first
      if (stateA.isPinned && !stateB.isPinned) return -1;
      if (!stateA.isPinned && stateB.isPinned) return 1;

      // 2. Among pinned or unpinned: last used first
      if (stateA.lastUsed !== stateB.lastUsed) {
        return stateB.lastUsed - stateA.lastUsed;
      }

      // 3. If same last used: use count
      if (stateA.useCount !== stateB.useCount) {
        return stateB.useCount - stateA.useCount;
      }

      // 4. Fallback: alphabetical by title
      return a.title.localeCompare(b.title);
    });
  }

  /**
   * Get all quickstart states (for debugging)
   */
  getAllStates(): Record<string, QuickstartState> {
    return { ...this.storage.states };
  }

  /**
   * Clear all quickstart data (for debugging/reset)
   */
  clear(): void {
    this.storage = {
      states: {},
      version: STORAGE_VERSION,
    };
    this.saveToStorage();
  }
}

// Singleton instance
export const quickstartPersistence = new QuickstartPersistence();
