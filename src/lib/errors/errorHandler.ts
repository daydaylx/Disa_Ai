import { humanErrorToToast } from "./humanError";
import { mapError } from "./mapper";

/**
 * Standardized error handler utility.
 * Ensures all errors are properly mapped and converted to user-friendly toast messages.
 *
 * Usage:
 * ```ts
 * import { handleError } from '@/lib/errors/errorHandler';
 *
 * // In a component:
 * try {
 *   await someAsyncOperation();
 * } catch (error) {
 *   handleError(error, toasts);
 * }
 *
 * // Or with custom title:
 * catch (error) {
 *   handleError(error, toasts, { title: 'Custom Error Title' });
 * }
 * ```
 */

interface ToastPushFunction {
  push: (toast: {
    kind: "error" | "warning" | "info" | "success";
    title: string;
    message: string;
  }) => void;
}

interface ErrorHandlerOptions {
  /** Custom title for the error toast. If not provided, uses default from humanErrorToToast */
  title?: string;
  /** Whether to log the error to console. Default: true */
  logToConsole?: boolean;
  /** Context information to include in console log */
  context?: string;
}

/**
 * Handle an error by mapping it, logging it, and showing a toast.
 * This is the standard way to handle errors throughout the application.
 *
 * @param error - The error to handle (can be Error, unknown, or string)
 * @param toasts - Toast notification system
 * @param options - Optional configuration
 */
export function handleError(
  error: unknown,
  toasts: ToastPushFunction,
  options: ErrorHandlerOptions = {},
): void {
  const { title, logToConsole = true, context } = options;

  // Map error to typed error
  const mappedError = mapError(error);

  // Log to console if enabled
  if (logToConsole) {
    const logMessage = context ? `[${context}]` : "[Error]";
    console.error(logMessage, mappedError);
  }

  // Convert to toast
  const toast = humanErrorToToast(mappedError);

  // Override title if provided
  if (title) {
    toast.title = title;
  }

  toasts.push(toast);
}

/**
 * Async wrapper that automatically handles errors.
 * Useful for event handlers and callbacks.
 *
 * Usage:
 * ```ts
 * const handleClick = withErrorHandling(
 *   async () => {
 *     await someOperation();
 *   },
 *   toasts,
 *   { context: 'handleClick' }
 * );
 * ```
 */
export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  toasts: ToastPushFunction,
  options: ErrorHandlerOptions = {},
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(error, toasts, options);
      return undefined;
    }
  }) as T;
}
