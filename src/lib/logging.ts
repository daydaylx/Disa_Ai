// Centralized lightweight client-side logging helpers.
// Avoids throwing in production; can be wired to Sentry/monitoring.

const baseLog = console;

export function logInfo(message: string, ...args: unknown[]): void {
  if (import.meta.env.DEV) {
    baseLog.info(message, ...args);
  }
}

export function logWarn(message: string, ...args: unknown[]): void {
  if (import.meta.env.DEV) {
    baseLog.warn(message, ...args);
  }
}

export function logError(message: string, ...args: unknown[]): void {
  // In prod keep minimal but present; hookable to Sentry.
  baseLog.error(message, ...args);
}
