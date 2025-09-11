/**
 * Concurrency control for network requests
 * Ensures only one request per key is active at a time
 */

interface ActiveRequest {
  controller: AbortController;
  promise: Promise<unknown>;
  startedAt: number;
}

class ConcurrencyManager {
  private activeRequests = new Map<string, ActiveRequest>();
  
  /**
   * Start a new request, aborting any existing request with the same key
   */
  startRequest<T>(
    key: string,
    requestFn: (signal: AbortSignal) => Promise<T>
  ): Promise<T> {
    // Abort existing request with same key
    this.abortRequest(key);
    
    const controller = new AbortController();
    const promise = requestFn(controller.signal);
    
    const activeRequest: ActiveRequest = {
      controller,
      promise: promise.catch(() => {}), // Prevent unhandled rejection
      startedAt: Date.now(),
    };
    
    this.activeRequests.set(key, activeRequest);
    
    // Clean up when request completes (success or failure)
    promise.finally(() => {
      if (this.activeRequests.get(key) === activeRequest) {
        this.activeRequests.delete(key);
      }
    });
    
    return promise;
  }
  
  /**
   * Abort an active request by key
   */
  abortRequest(key: string): boolean {
    const activeRequest = this.activeRequests.get(key);
    if (activeRequest) {
      activeRequest.controller.abort();
      this.activeRequests.delete(key);
      return true;
    }
    return false;
  }
  
  /**
   * Abort all active requests
   */
  abortAll(): void {
    for (const [key] of this.activeRequests) {
      this.abortRequest(key);
    }
  }
  
  /**
   * Check if a request is active for the given key
   */
  isRequestActive(key: string): boolean {
    return this.activeRequests.has(key);
  }
  
  /**
   * Get info about active requests
   */
  getActiveRequests(): Array<{ key: string; duration: number }> {
    const now = Date.now();
    return Array.from(this.activeRequests.entries()).map(([key, req]) => ({
      key,
      duration: now - req.startedAt,
    }));
  }
  
  /**
   * Clean up stale requests (older than maxAge)
   */
  cleanupStale(maxAgeMs = 60000): void {
    const now = Date.now();
    for (const [key, req] of this.activeRequests) {
      if (now - req.startedAt > maxAgeMs) {
        this.abortRequest(key);
      }
    }
  }
}

// Global singleton for chat requests
export const chatConcurrency = new ConcurrencyManager();

// Export the class for other use cases
export { ConcurrencyManager };