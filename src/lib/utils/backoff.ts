/**
 * Configuration options for exponential backoff calculations
 */
export interface BackoffOptions {
  /** Base delay in milliseconds for the first attempt (default: 400) */
  baseMs?: number;
  /** Exponential growth factor for each retry (default: 2) */
  factor?: number;
  /** Random jitter factor between 0-1 to prevent thundering herd (default: 0.2) */
  jitter?: number;
  /** Maximum delay per attempt in milliseconds (default: 10,000) */
  maxMs?: number;
}

/**
 * Calculates an exponential backoff delay with optional jitter
 *
 * @param attempt - The current attempt number (0-based)
 * @param opts - Configuration options for the backoff calculation
 * @returns The delay in milliseconds for this attempt
 *
 * @example
 * ```typescript
 * // Default exponential backoff: 400ms, 800ms, 1600ms, 3200ms...
 * const delay1 = backoffDelay(0); // ~400ms
 * const delay2 = backoffDelay(1); // ~800ms
 *
 * // Custom backoff with reduced jitter
 * const delay = backoffDelay(2, { baseMs: 1000, jitter: 0.1 });
 * ```
 */
export function backoffDelay(attempt: number, opts: BackoffOptions = {}): number {
  const base = opts.baseMs ?? 400;
  const factor = opts.factor ?? 2;
  const maxMs = opts.maxMs ?? 10_000;
  const jitter = Math.max(0, Math.min(1, opts.jitter ?? 0.2));
  const raw = Math.min(maxMs, base * Math.pow(factor, Math.max(0, attempt)));
  const delta = raw * jitter * Math.random();
  // Apply random jitter: +- (delta/2)
  return Math.max(0, raw - delta / 2 + delta * Math.random());
}

/**
 * Creates a Promise that resolves after the specified delay
 *
 * @param ms - Delay in milliseconds
 * @returns Promise that resolves after the delay
 *
 * @example
 * ```typescript
 * await sleep(1000); // Wait 1 second
 * console.log('One second has passed');
 * ```
 */
export function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
