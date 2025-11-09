/**
 * Sentry Error Tracking Configuration
 *
 * Comprehensive error monitoring setup for production use.
 * Includes performance monitoring, privacy-first configuration,
 * and development-friendly error handling.
 */

import * as Sentry from "@sentry/react";
// React Router v6 integration imports
import React from "react";
import { createRoutesFromChildren, matchRoutes } from "react-router";
import { useLocation, useNavigationType } from "react-router-dom";

/**
 * Initialize Sentry error tracking
 * Only runs in production with proper DSN configuration
 */
export function initializeSentry() {
  // Only initialize in production
  if (import.meta.env.DEV) {
    console.warn("[Sentry] Skipping initialization in development mode");
    return;
  }

  // Require DSN for initialization
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn) {
    console.warn("[Sentry] No DSN configured, skipping initialization");
    return;
  }

  try {
    Sentry.init({
      dsn,
      environment: import.meta.env.VITE_ENV || "production",
      release: import.meta.env.VITE_BUILD_ID || "unknown",

      // Performance monitoring
      integrations: [
        Sentry.browserTracingIntegration({
          // Set tracing origins to include your domain
          tracePropagationTargets: [
            "localhost",
            /^https:\/\/.*\.pages\.dev$/,
            /^https:\/\/disaai\.de$/,
          ],
        }),
        Sentry.reactRouterV6BrowserTracingIntegration({
          useEffect: React.useEffect,
          useLocation,
          useNavigationType,
          createRoutesFromChildren,
          matchRoutes,
        }),
      ],

      // Performance monitoring configuration
      tracesSampleRate: import.meta.env.PROD ? 0.1 : 0, // 10% sampling in production

      // Privacy-first configuration
      beforeSend(event, hint) {
        // Filter out non-critical errors in production
        if (event.exception) {
          const error = hint.originalException;

          // Skip network errors that users can't control
          if (error instanceof TypeError && error.message.includes("fetch")) {
            return null;
          }

          // Skip quota exceeded errors (common in localStorage)
          if (error instanceof Error && error.message.includes("QuotaExceededError")) {
            return null;
          }
        }

        // Sanitize sensitive data
        if (event.request?.url) {
          // Remove query parameters that might contain sensitive data
          event.request.url = event.request.url.split("?")[0];
        }

        return event;
      },

      // Session replay configuration (privacy-conscious)
      replaysSessionSampleRate: 0.01, // 1% of sessions
      replaysOnErrorSampleRate: 0.1, // 10% of error sessions

      // Don't capture personal data
      sendDefaultPii: false,

      // Release health monitoring
      autoSessionTracking: true,

      // Capture unhandled promise rejections
      captureUnhandledRejections: true,

      // Debug mode (only in staging)
      debug: import.meta.env.VITE_ENV === "staging",

      // Maximum breadcrumbs
      maxBreadcrumbs: 50,

      // Custom tags
      initialScope: {
        tags: {
          component: "disa-ai",
          platform: "web",
          version: import.meta.env.VITE_VERSION || "unknown",
        },
      },
    });

    console.info("[Sentry] ✅ Error tracking initialized");
  } catch (error) {
    console.error("[Sentry] ❌ Initialization failed:", error);
  }
}

/**
 * Enhanced error boundary for React components
 */
export const SentryErrorBoundary = Sentry.withErrorBoundary;

/**
 * Capture custom errors with context
 */
export function captureError(error: Error, context?: Record<string, any>) {
  if (import.meta.env.DEV) {
    console.error("[Error]", error, context);
    return;
  }

  Sentry.captureException(error, {
    extra: context,
    tags: {
      source: "manual",
    },
  });
}

/**
 * Add breadcrumb for debugging
 */
export function addBreadcrumb(
  message: string,
  category: string = "info",
  data?: Record<string, any>,
) {
  if (import.meta.env.DEV) {
    console.debug(`[Breadcrumb] ${category}: ${message}`, data);
    return;
  }

  Sentry.addBreadcrumb({
    message,
    category,
    data,
    level: "info",
  });
}

/**
 * Set user context (privacy-safe)
 */
export function setUserContext(user: { id?: string; segment?: string }) {
  Sentry.setUser({
    id: user.id ? `user_${user.id.slice(0, 8)}` : undefined, // Anonymized ID
    segment: user.segment,
  });
}

/**
 * Performance profiling for critical functions
 */
export function profileFunction<T extends (...args: any[]) => any>(fn: T, name: string): T {
  if (import.meta.env.DEV) {
    return fn; // Skip profiling in development
  }

  return ((...args: Parameters<T>) => {
    return Sentry.withActiveSpan(null, () => {
      return Sentry.startSpan(
        {
          name,
          op: "function",
        },
        () => {
          try {
            const result = fn(...args);

            if (result instanceof Promise) {
              return result.catch((error) => {
                Sentry.captureException(error);
                throw error;
              });
            }

            return result;
          } catch (error) {
            Sentry.captureException(error);
            throw error;
          }
        },
      );
    });
  }) as T;
}
