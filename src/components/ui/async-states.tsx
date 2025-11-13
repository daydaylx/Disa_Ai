/**
 * Comprehensive Loading and Error State Management
 *
 * Provides consistent loading indicators and error states across the application
 */

import type { ReactNode } from "react";

// Loading States
export interface LoadingStateProps {
  isLoading: boolean;
  children: ReactNode;
  skeleton?: ReactNode; // Custom skeleton to show during loading
  size?: "sm" | "md" | "lg" | "xl";
  type?: "spinner" | "skeleton" | "pulse" | "wave";
  message?: string;
}

/**
 * Universal Loading State Component
 * Can show spinner, skeleton, or custom loading state
 */
export function LoadingState({
  isLoading,
  children,
  skeleton,
  size = "md",
  type = "spinner",
  message = "Lädt...",
}: LoadingStateProps) {
  if (isLoading) {
    if (skeleton) {
      return skeleton;
    }

    return (
      <div className="flex flex-col items-center justify-center p-8">
        <LoadingIndicator type={type as "spinner" | "pulse" | "wave"} size={size} />
        {message && <p className="mt-4 text-text-secondary text-sm">{message}</p>}
      </div>
    );
  }

  return <>{children}</>;
}

/**
 * Standalone Loading Indicator Component
 */
export function LoadingIndicator({
  type = "spinner",
  size = "md",
  className = "",
}: {
  type?: "spinner" | "pulse" | "wave" | "skeleton";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12",
  };

  switch (type) {
    case "spinner":
      return (
        <div
          className={`${sizeClasses[size]} ${className} inline-block animate-spin rounded-full border-2 border-current border-t-transparent`}
          role="status"
        >
          <span className="sr-only">Loading...</span>
        </div>
      );

    case "pulse":
      return (
        <div
          className={`${sizeClasses[size]} ${className} rounded-full bg-accent animate-pulse`}
        ></div>
      );

    case "wave":
      return (
        <div className={`flex space-x-1 ${className}`}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`${size === "sm" ? "h-2 w-2" : "h-3 w-3"} bg-accent rounded-full animate-bounce`}
              style={{ animationDelay: `${i * 0.1}s` }}
            ></div>
          ))}
        </div>
      );

    case "skeleton":
    default:
      return <div className={`${sizeClasses[size]} ${className} bg-muted rounded animate-pulse`} />;
  }
}

// Error States
export interface ErrorStateProps {
  error: Error | null;
  children: ReactNode;
  onRetry?: () => void;
  showDetails?: boolean;
  customError?: ReactNode; // Custom error display
}

/**
 * Universal Error State Component
 * Handles showing errors with retry capability
 */
export function ErrorState({
  error,
  children,
  onRetry,
  showDetails = false,
  customError,
}: ErrorStateProps) {
  if (error) {
    if (customError) {
      return customError;
    }

    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="bg-danger/10 rounded-full p-3">
          <svg
            className="h-12 w-12 text-danger"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 14.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>

        <h3 className="mt-4 text-lg font-semibold text-text-primary">Etwas ist schiefgelaufen</h3>
        <p className="mt-2 text-text-secondary max-w-md">
          {error.message || "Ein unbekannter Fehler ist aufgetreten."}
        </p>

        {showDetails && error.stack && (
          <details className="mt-4 w-full max-w-md text-left">
            <summary className="cursor-pointer text-text-secondary text-sm">
              Technische Details anzeigen
            </summary>
            <pre className="mt-2 bg-surface-card p-3 rounded-md text-xs text-text-subtle overflow-auto">
              {error.stack}
            </pre>
          </details>
        )}

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90 transition-colors"
            >
              Erneut versuchen
            </button>
          )}
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-surface-card text-text-primary rounded-md hover:bg-surface-muted transition-colors"
          >
            Seite neu laden
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// Combined Loading and Error State
export interface AsyncStateProps {
  isLoading: boolean;
  error: Error | null;
  loadingSkeleton?: ReactNode;
  errorComponent?: ReactNode;
  onRetry?: () => void;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  type?: "spinner" | "skeleton" | "pulse" | "wave";
  loadingMessage?: string;
  showDetails?: boolean;
}

/**
 * Combined Loading and Error State Component
 * Handles both loading and error states in one component
 */
export function AsyncState({
  isLoading,
  error,
  loadingSkeleton,
  errorComponent,
  onRetry,
  children,
  size = "md",
  type = "spinner",
  loadingMessage = "Lädt...",
  showDetails = false,
}: AsyncStateProps) {
  if (error) {
    return (
      <ErrorState
        error={error}
        onRetry={onRetry}
        showDetails={showDetails}
        customError={errorComponent}
      >
        {children}
      </ErrorState>
    );
  }

  return (
    <LoadingState
      isLoading={isLoading}
      skeleton={loadingSkeleton}
      size={size}
      type={type}
      message={loadingMessage}
    >
      {children}
    </LoadingState>
  );
}

// Loading Overlay
export interface LoadingOverlayProps {
  isLoading: boolean;
  children: ReactNode;
  message?: string;
  zIndex?: number;
  backgroundColor?: string;
}

export function LoadingOverlay({
  isLoading,
  children,
  message = "Lädt...",
  zIndex = 50,
  backgroundColor = "rgba(0, 0, 0, 0.5)",
}: LoadingOverlayProps) {
  if (isLoading) {
    return (
      <div className="relative">
        {children}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            zIndex,
            backgroundColor,
          }}
        >
          <div className="flex flex-col items-center">
            <LoadingIndicator type="spinner" />
            {message && <p className="mt-2 text-white text-sm">{message}</p>}
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// Skeleton Presets for Common UI Elements
export function SkeletonCardList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-surface-card rounded-lg p-4 animate-pulse">
          <div className="h-4 bg-surface-base rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-surface-base rounded w-full mb-2"></div>
          <div className="h-3 bg-surface-base rounded w-2/3"></div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonListItem({ count = 3 }: { count?: number }) {
  return (
    <div className="divide-y divide-surface-separator">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="py-3 px-4 flex items-center space-x-3 animate-pulse">
          <div className="h-10 w-10 bg-surface-base rounded-full"></div>
          <div className="flex-1">
            <div className="h-4 bg-surface-base rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-surface-base rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonChatBubble() {
  return (
    <div className="flex gap-3 px-4 py-6 animate-pulse">
      <div className="h-8 w-8 bg-surface-base rounded-full"></div>
      <div className="flex-1">
        <div className="h-3 bg-surface-base rounded w-1/4 mb-2"></div>
        <div className="space-y-2">
          <div className="h-3 bg-surface-base rounded w-full"></div>
          <div className="h-3 bg-surface-base rounded w-5/6"></div>
          <div className="h-3 bg-surface-base rounded w-4/6"></div>
        </div>
      </div>
    </div>
  );
}
