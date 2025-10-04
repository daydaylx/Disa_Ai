/**
 * Storage Quota Manager - Verwaltet Browser-Storage-Limits intelligent
 */

import { useEffect, useState } from "react";

interface StorageQuota {
  quota: number;
  usage: number;
  usagePercentage: number;
  available: number;
  estimate?: StorageEstimate;
}

interface StorageCleanupResult {
  freedBytes: number;
  itemsRemoved: number;
  strategy: string;
}

class StorageQuotaManager {
  private warningThreshold = 0.8; // 80%
  private criticalThreshold = 0.95; // 95%
  private cleanupTarget = 0.7; // Clean to 70%

  private observers: Array<(quota: StorageQuota) => void> = [];
  private checkInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.startMonitoring();
  }

  private startMonitoring(): void {
    // Initial check
    void this.checkQuota();

    // Check every 30 seconds
    this.checkInterval = setInterval(() => {
      void this.checkQuota();
    }, 30000);
  }

  async getQuotaInfo(): Promise<StorageQuota> {
    try {
      if ("storage" in navigator && "estimate" in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        const quota = estimate.quota || 0;
        const usage = estimate.usage || 0;
        const available = quota - usage;
        const usagePercentage = quota > 0 ? usage / quota : 0;

        return {
          quota,
          usage,
          usagePercentage,
          available,
          estimate,
        };
      }
    } catch (error) {
      console.warn("Storage estimation not available:", error);
    }

    // Fallback: Schätze basierend auf localStorage
    return this.estimateStorageFromLocalStorage();
  }

  private estimateStorageFromLocalStorage(): StorageQuota {
    let totalSize = 0;

    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const value = localStorage.getItem(key) || "";
          totalSize += key.length + value.length;
        }
      }
    } catch (error) {
      console.warn("Error estimating localStorage size:", error);
    }

    // Schätze 5MB als typisches localStorage-Limit
    const estimatedQuota = 5 * 1024 * 1024; // 5MB
    const usage = totalSize * 2; // UTF-16 encoding
    const available = estimatedQuota - usage;
    const usagePercentage = usage / estimatedQuota;

    return {
      quota: estimatedQuota,
      usage,
      usagePercentage,
      available,
    };
  }

  private async checkQuota(): Promise<void> {
    const quota = await this.getQuotaInfo();

    if (quota.usagePercentage > this.criticalThreshold) {
      await this.performEmergencyCleanup();
    } else if (quota.usagePercentage > this.warningThreshold) {
      await this.performSmartCleanup();
    }

    this.notifyObservers(quota);
  }

  async performSmartCleanup(): Promise<StorageCleanupResult> {
    const strategies = [
      () => this.cleanupOldConversations(),
      () => this.cleanupCache(),
      () => this.cleanupTempData(),
    ];

    let totalFreed = 0;
    let totalItemsRemoved = 0;
    let usedStrategy = "";

    for (const strategy of strategies) {
      const quota = await this.getQuotaInfo();
      if (quota.usagePercentage <= this.cleanupTarget) break;

      const result = strategy();
      totalFreed += result.freedBytes;
      totalItemsRemoved += result.itemsRemoved;
      usedStrategy += result.strategy + "; ";
    }

    return {
      freedBytes: totalFreed,
      itemsRemoved: totalItemsRemoved,
      strategy: usedStrategy,
    };
  }

  async performEmergencyCleanup(): Promise<StorageCleanupResult> {
    // Aggressivere Cleanup-Strategien bei kritischem Storage
    const result = this.cleanupOldConversations(0.5); // Entferne mehr Conversations

    const quota = await this.getQuotaInfo();
    if (quota.usagePercentage > this.criticalThreshold) {
      // Entferne auch cached API responses
      const cacheResult = this.cleanupCache(true);
      result.freedBytes += cacheResult.freedBytes;
      result.itemsRemoved += cacheResult.itemsRemoved;
      result.strategy += cacheResult.strategy;
    }

    return result;
  }

  private cleanupOldConversations(aggressiveness = 0.2): StorageCleanupResult {
    let freedBytes = 0;
    let itemsRemoved = 0;

    try {
      // Lade Conversations aus localStorage
      const conversationsKey = "disa:convs";
      const conversationsData = localStorage.getItem(conversationsKey);

      if (conversationsData) {
        const conversations = JSON.parse(conversationsData);

        if (Array.isArray(conversations)) {
          // Sortiere nach lastModified (älteste zuerst)
          conversations.sort((a, b) => (a.lastModified || 0) - (b.lastModified || 0));

          const removeCount = Math.floor(conversations.length * aggressiveness);
          const toRemove = conversations.slice(0, removeCount);
          const toKeep = conversations.slice(removeCount);

          // Berechne freigegebene Bytes
          freedBytes = toRemove.reduce((sum, conv) => {
            return sum + JSON.stringify(conv).length * 2; // UTF-16
          }, 0);

          itemsRemoved = removeCount;

          // Speichere reduzierte Liste
          localStorage.setItem(conversationsKey, JSON.stringify(toKeep));

          // Entferne auch zugehörige Memory-Daten
          toRemove.forEach((conv) => {
            const memoryKey = `disa:mem:${conv.id}`;
            localStorage.removeItem(memoryKey);
          });
        }
      }
    } catch (error) {
      console.warn("Error cleaning up conversations:", error);
    }

    return {
      freedBytes,
      itemsRemoved,
      strategy: "old-conversations",
    };
  }

  private cleanupCache(aggressive = false): StorageCleanupResult {
    let freedBytes = 0;
    let itemsRemoved = 0;

    try {
      const keysToClean = [];

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          // Cache-Keys identifizieren
          if (
            key.startsWith("disa:cache:") ||
            key.startsWith("disa:models:") ||
            (aggressive && key.startsWith("disa:roles:"))
          ) {
            keysToClean.push(key);
          }
        }
      }

      keysToClean.forEach((key) => {
        const value = localStorage.getItem(key);
        if (value) {
          freedBytes += (key.length + value.length) * 2;
          localStorage.removeItem(key);
          itemsRemoved++;
        }
      });
    } catch (error) {
      console.warn("Error cleaning up cache:", error);
    }

    return {
      freedBytes,
      itemsRemoved,
      strategy: aggressive ? "aggressive-cache" : "cache",
    };
  }

  private cleanupTempData(): StorageCleanupResult {
    let freedBytes = 0;
    let itemsRemoved = 0;

    try {
      const keysToClean = [];

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          // Temporäre Keys identifizieren
          if (
            key.startsWith("disa:temp:") ||
            key.startsWith("disa:prefill") ||
            key.includes(":tmp:")
          ) {
            keysToClean.push(key);
          }
        }
      }

      keysToClean.forEach((key) => {
        const value = localStorage.getItem(key);
        if (value) {
          freedBytes += (key.length + value.length) * 2;
          localStorage.removeItem(key);
          itemsRemoved++;
        }
      });
    } catch (error) {
      console.warn("Error cleaning up temp data:", error);
    }

    return {
      freedBytes,
      itemsRemoved,
      strategy: "temp-data",
    };
  }

  // Storage Request mit Quota-Check
  async requestStorage(estimatedBytes: number): Promise<boolean> {
    const quota = await this.getQuotaInfo();

    if (quota.available < estimatedBytes) {
      // Versuche Cleanup um Platz zu schaffen
      await this.performSmartCleanup();

      const newQuota = await this.getQuotaInfo();
      if (newQuota.available < estimatedBytes) {
        // Immer noch nicht genug Platz
        return false;
      }
    }

    return true;
  }

  // Safe Storage Operation
  async safeSetItem(key: string, value: string): Promise<boolean> {
    const estimatedBytes = (key.length + value.length) * 2;

    const canStore = await this.requestStorage(estimatedBytes);
    if (!canStore) {
      console.warn(`Storage quota exceeded, cannot store ${key}`);
      return false;
    }

    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      if (error instanceof DOMException && error.name === "QuotaExceededError") {
        // Versuche Emergency Cleanup
        await this.performEmergencyCleanup();

        try {
          localStorage.setItem(key, value);
          return true;
        } catch (retryError) {
          console.error("Storage quota exceeded after cleanup:", retryError);
          return false;
        }
      }

      console.error("Error storing data:", error);
      return false;
    }
  }

  onQuotaChange(callback: (quota: StorageQuota) => void): () => void {
    this.observers.push(callback);

    // Return unsubscribe function
    return () => {
      const index = this.observers.indexOf(callback);
      if (index > -1) {
        this.observers.splice(index, 1);
      }
    };
  }

  private notifyObservers(quota: StorageQuota): void {
    this.observers.forEach((callback) => {
      try {
        callback(quota);
      } catch (error) {
        console.error("Error in quota observer:", error);
      }
    });
  }

  destroy(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
    this.observers.length = 0;
  }
}

// Singleton instance
export const quotaManager = new StorageQuotaManager();

// React hook
export function useStorageQuota() {
  const [quota, setQuota] = useState<StorageQuota | null>(null);

  useEffect(() => {
    void quotaManager.getQuotaInfo().then(setQuota);

    const unsubscribe = quotaManager.onQuotaChange(setQuota);
    return unsubscribe;
  }, []);

  return quota;
}

// Utility functions
export function formatBytes(bytes: number): string {
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

export function getStorageHealthStatus(quota: StorageQuota): "healthy" | "warning" | "critical" {
  if (quota.usagePercentage > 0.95) return "critical";
  if (quota.usagePercentage > 0.8) return "warning";
  return "healthy";
}

export default quotaManager;
