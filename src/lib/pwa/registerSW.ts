import { hapticFeedback } from "../touch/haptics";

export const BUILD_ID = "mock-build-id";

export function registerSW() {
  // Mock implementation with error handling
  return {
    updateServiceWorker: async () => {
      // In a real implementation, this would update the service worker
      // eslint-disable-next-line no-console
      console.log("[PWA] Service worker update requested");
      hapticFeedback.success();
      return Promise.resolve();
    },
    offlineReady: false,
    needRefresh: false,
    registerError: false,
  };
}
