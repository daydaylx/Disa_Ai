/**
 * Service Worker Versioning and Cache Management
 * ==============================================
 *
 * This module provides versioned cache management for the Service Worker.
 * When a new version is deployed, old caches are automatically invalidated.
 *
 * Architecture:
 * - Each build has a unique BUILD_ID (from git commit SHA)
 * - Cache names include the BUILD_ID for versioning
 * - On SW activation, caches from old builds are deleted
 * - BroadcastChannel notifies the app when a new version is available
 */

import { BUILD_ID, BUILD_TOKEN } from "./registerSW";

export const CACHE_VERSION = BUILD_ID;
export const CACHE_PREFIX = "disa-ai-v";

/**
 * Generate a versioned cache name
 * @param cacheName - Base name for the cache
 * @returns Versioned cache name (e.g., "disa-ai-v1234-assets")
 */
export function getVersionedCacheName(cacheName: string): string {
  return `${CACHE_PREFIX}${CACHE_VERSION}-${cacheName}`;
}

/**
 * Check if a cache name belongs to the current version
 * @param cacheName - Cache name to check
 * @returns True if cache belongs to current version
 */
export function isCurrentVersionCache(cacheName: string): boolean {
  return cacheName.startsWith(`${CACHE_PREFIX}${CACHE_VERSION}-`);
}

/**
 * Delete all caches that don't match the current version
 * Should be called during Service Worker activation
 */
export async function deleteOldCaches(): Promise<void> {
  if (typeof caches === "undefined") {
    return;
  }

  const cacheNames = await caches.keys();
  const oldCaches = cacheNames.filter(
    (name) => name.startsWith(CACHE_PREFIX) && !isCurrentVersionCache(name)
  );

  await Promise.all(
    oldCaches.map(async (cacheName) => {
      console.log(`[SW] Deleting old cache: ${cacheName}`);
      await caches.delete(cacheName);
    })
  );

  if (oldCaches.length > 0) {
    console.log(`[SW] Deleted ${oldCaches.length} old cache(s)`);
  }
}

/**
 * BroadcastChannel for notifying clients about SW updates
 */
export const SW_UPDATE_CHANNEL = "disa-sw-updates";

export interface ServiceWorkerUpdateMessage {
  type: "SW_UPDATE_AVAILABLE" | "SW_ACTIVATED" | "CACHE_CLEARED";
  buildId: string;
  buildToken: string;
  timestamp: number;
}

/**
 * Broadcast a Service Worker update message to all clients
 * @param type - Type of update message
 */
export function broadcastSWUpdate(type: ServiceWorkerUpdateMessage["type"]): void {
  if (typeof BroadcastChannel === "undefined") {
    return;
  }

  try {
    const channel = new BroadcastChannel(SW_UPDATE_CHANNEL);
    const message: ServiceWorkerUpdateMessage = {
      type,
      buildId: BUILD_ID,
      buildToken: BUILD_TOKEN,
      timestamp: Date.now(),
    };
    channel.postMessage(message);
    channel.close();
  } catch (error) {
    console.error("[SW] Failed to broadcast update:", error);
  }
}

/**
 * Listen for Service Worker update messages
 * @param callback - Function to call when an update message is received
 * @returns Cleanup function to stop listening
 */
export function listenForSWUpdates(
  callback: (message: ServiceWorkerUpdateMessage) => void
): () => void {
  if (typeof BroadcastChannel === "undefined") {
    return () => {}; // No-op cleanup
  }

  const channel = new BroadcastChannel(SW_UPDATE_CHANNEL);

  const handler = (event: MessageEvent<ServiceWorkerUpdateMessage>) => {
    if (event.data && typeof event.data === "object" && "type" in event.data) {
      callback(event.data);
    }
  };

  channel.addEventListener("message", handler);

  return () => {
    channel.removeEventListener("message", handler);
    channel.close();
  };
}

/**
 * Get current cache statistics
 * @returns Cache statistics including count and size estimates
 */
export async function getCacheStats(): Promise<{
  count: number;
  currentVersionCount: number;
  oldVersionCount: number;
  cacheNames: string[];
}> {
  if (typeof caches === "undefined") {
    return {
      count: 0,
      currentVersionCount: 0,
      oldVersionCount: 0,
      cacheNames: [],
    };
  }

  const cacheNames = await caches.keys();
  const disaCaches = cacheNames.filter((name) => name.startsWith(CACHE_PREFIX));
  const currentVersionCaches = disaCaches.filter(isCurrentVersionCache);
  const oldVersionCaches = disaCaches.filter((name) => !isCurrentVersionCache(name));

  return {
    count: disaCaches.length,
    currentVersionCount: currentVersionCaches.length,
    oldVersionCount: oldVersionCaches.length,
    cacheNames: disaCaches,
  };
}
