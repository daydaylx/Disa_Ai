export const BUILD_ID = "mock-build-id";

export function registerSW() {
  // Mock implementation
  return {
    updateServiceWorker: async () => {},
    offlineReady: false,
    needRefresh: false,
    registerError: false,
  };
}