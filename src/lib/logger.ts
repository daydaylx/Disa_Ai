/**
 * Centralized logging system with optional Sentry integration
 *
 * In development: Logs to console
 * In production: Logs to console + optional Sentry (if VITE_SENTRY_DSN is set)
 *
 * Features:
 * - Structured logging with metadata
 * - PII-safe logging (no sensitive data)
 * - Dynamic Sentry import to avoid bundle bloat
 * - TypeScript strict types
 */

export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogContext {
  [key: string]: any;
  // Common fields that should never contain PII
  timestamp?: string;
  userAgent?: string;
  url?: string;
  component?: string;
  action?: string;
  duration?: number;
  status?: number;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

interface Logger {
  debug(message: string, context?: LogContext): void;
  info(message: string, context?: LogContext): void;
  warn(message: string, context?: LogContext): void;
  error(message: string, context?: LogContext): void;
}

// Sentry instance (lazily loaded)
let sentryInstance: any = null;
let sentryInitialized = false;

function initializeSentry(): Promise<void> {
  if (sentryInitialized) return Promise.resolve();

  // Sentry is not installed in this project, so skip initialization
  console.warn("Sentry integration disabled - @sentry/browser not installed");
  sentryInitialized = true;
  return Promise.resolve();
}

function sanitizeContext(context: LogContext = {}): LogContext {
  // Remove potentially sensitive data
  const sanitized = { ...context };

  // Remove common PII fields if accidentally included
  const piiFields = ["email", "password", "token", "key", "apiKey", "secret"];
  piiFields.forEach((field) => {
    if (field in sanitized) {
      delete sanitized[field];
    }
  });

  // Add timestamp if not present
  if (!sanitized.timestamp) {
    sanitized.timestamp = new Date().toISOString();
  }

  return sanitized;
}

function logToConsole(level: LogLevel, message: string, context?: LogContext): void {
  const sanitizedContext = sanitizeContext(context);
  const timestamp = sanitizedContext.timestamp;

  const prefix = `[${timestamp}] ${level.toUpperCase()}:`;

  switch (level) {
    case "debug":
      console.warn(prefix, message, sanitizedContext);
      break;
    case "info":
      console.warn(prefix, message, sanitizedContext);
      break;
    case "warn":
      console.warn(prefix, message, sanitizedContext);
      break;
    case "error":
      console.error(prefix, message, sanitizedContext);
      break;
  }
}

async function logToSentry(level: LogLevel, message: string, context?: LogContext): Promise<void> {
  if (!sentryInitialized) {
    await initializeSentry();
  }

  if (!sentryInstance) return;

  const sanitizedContext = sanitizeContext(context);

  try {
    // Set context for this log entry
    sentryInstance.setContext("logContext", sanitizedContext);

    switch (level) {
      case "debug":
        sentryInstance.addBreadcrumb({
          message,
          level: "debug",
          data: sanitizedContext,
        });
        break;
      case "info":
        sentryInstance.addBreadcrumb({
          message,
          level: "info",
          data: sanitizedContext,
        });
        break;
      case "warn":
        sentryInstance.captureMessage(message, "warning");
        break;
      case "error":
        if (sanitizedContext.error) {
          // Create Error object for better stack traces
          const error = new Error(sanitizedContext.error.message);
          error.name = sanitizedContext.error.name;
          if (sanitizedContext.error.stack) {
            error.stack = sanitizedContext.error.stack;
          }
          sentryInstance.captureException(error);
        } else {
          sentryInstance.captureMessage(message, "error");
        }
        break;
    }
  } catch (error) {
    console.warn("Failed to log to Sentry:", error);
  }
}

function createLogMethod(level: LogLevel) {
  return (message: string, context?: LogContext): void => {
    // Always log to console
    logToConsole(level, message, context);

    // Log to Sentry in production (async, non-blocking)
    if (import.meta.env.PROD) {
      logToSentry(level, message, context).catch((error) => {
        console.warn("Sentry logging failed:", error);
      });
    }
  };
}

export const logger: Logger = {
  debug: createLogMethod("debug"),
  info: createLogMethod("info"),
  warn: createLogMethod("warn"),
  error: createLogMethod("error"),
};

// Initialize Sentry on first import in production
if (import.meta.env.PROD) {
  initializeSentry().catch((error) => {
    console.warn("Failed to initialize Sentry on startup:", error);
  });
}
