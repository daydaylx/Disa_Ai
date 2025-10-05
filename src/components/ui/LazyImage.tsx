/**
 * LazyImage Component
 * Implements Issue #106 - Lazy loading for images and avatars
 */

import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "../../lib/cn";

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** Fallback content while loading */
  fallback?: React.ReactNode;
  /** Error fallback content */
  errorFallback?: React.ReactNode;
  /** Low quality placeholder image URL */
  placeholder?: string;
  /** Root margin for intersection observer */
  rootMargin?: string;
  /** Threshold for intersection observer */
  threshold?: number;
  /** Enable blur-to-sharp transition */
  enableBlurTransition?: boolean;
  /** Aspect ratio for container (e.g., "1/1", "16/9") */
  aspectRatio?: string;
}

/**
 * LazyImage component with intersection observer for performance
 * Features:
 * - Intersection Observer API for viewport-based loading
 * - Placeholder support with blur transition
 * - Error handling with fallback content
 * - Aspect ratio containers to prevent layout shifts
 * - Automatic retries on network errors
 */
export function LazyImage({
  src,
  alt,
  className,
  fallback,
  errorFallback,
  placeholder,
  rootMargin = "50px",
  threshold = 0.1,
  enableBlurTransition = true,
  aspectRatio,
  onLoad,
  onError,
  ...props
}: LazyImageProps) {
  const [loadState, setLoadState] = useState<"idle" | "loading" | "loaded" | "error">("idle");
  const [currentSrc, setCurrentSrc] = useState<string | undefined>(placeholder);
  const [retryCount, setRetryCount] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Maximum retry attempts for failed loads
  const MAX_RETRIES = 2;

  // Initialize intersection observer
  useEffect(() => {
    if (!src || loadState === "loaded") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry && entry.isIntersecting && loadState === "idle") {
          setLoadState("loading");
          setCurrentSrc(src);
        }
      },
      {
        rootMargin,
        threshold,
      },
    );

    observerRef.current = observer;

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [src, loadState, rootMargin, threshold]);

  const handleLoad = useCallback(
    (event: React.SyntheticEvent<HTMLImageElement>) => {
      setLoadState("loaded");
      onLoad?.(event);
    },
    [onLoad],
  );

  const handleError = useCallback(
    (event: React.SyntheticEvent<HTMLImageElement>) => {
      // Retry logic for transient network errors
      if (retryCount < MAX_RETRIES) {
        setRetryCount((prev) => prev + 1);
        setTimeout(
          () => {
            setLoadState("loading");
            setCurrentSrc(src);
          },
          1000 * (retryCount + 1),
        ); // Exponential backoff
      } else {
        setLoadState("error");
      }
      onError?.(event);
    },
    [onError, retryCount, src],
  );

  // Default fallback content
  const defaultFallback = (
    <div className="flex h-full w-full items-center justify-center bg-white/10 text-white/50">
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    </div>
  );

  const defaultErrorFallback = (
    <div className="flex h-full w-full items-center justify-center bg-red-500/10 text-red-400">
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
  );

  // Container styles with aspect ratio
  const containerStyle = aspectRatio ? { aspectRatio } : undefined;

  return (
    <div
      className={cn("relative overflow-hidden", aspectRatio && "block w-full", className)}
      style={containerStyle}
    >
      {/* Loading state */}
      {loadState === "idle" && (fallback || defaultFallback)}

      {/* Error state */}
      {loadState === "error" && (errorFallback || defaultErrorFallback)}

      {/* Image */}
      {(loadState === "loading" || loadState === "loaded") && (
        <img
          ref={imgRef}
          src={currentSrc}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            "h-full w-full object-cover transition-opacity duration-300",
            loadState === "loading" && "opacity-50",
            loadState === "loaded" && "opacity-100",
            enableBlurTransition && loadState === "loading" && placeholder && "blur-sm",
            enableBlurTransition && loadState === "loaded" && "blur-0",
          )}
          loading="lazy"
          decoding="async"
          {...props}
        />
      )}

      {/* Loading indicator overlay */}
      {loadState === "loading" && !placeholder && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/5">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white/60" />
        </div>
      )}
    </div>
  );
}

/**
 * LazyAvatar - Specialized lazy image for avatars
 */
interface LazyAvatarProps extends Omit<LazyImageProps, "aspectRatio"> {
  /** Avatar size (affects both width/height and fallback icon size) */
  size?: "sm" | "md" | "lg" | "xl";
  /** Fallback initials when image fails to load */
  fallbackInitials?: string;
}

export function LazyAvatar({
  size = "md",
  fallbackInitials,
  className,
  ...props
}: LazyAvatarProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
    xl: "h-8 w-8",
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
    xl: "text-lg",
  };

  const customFallback = fallbackInitials ? (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 font-medium text-white",
        sizeClasses[size],
        textSizes[size],
      )}
    >
      {fallbackInitials}
    </div>
  ) : (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-white/10 text-white/60",
        sizeClasses[size],
      )}
    >
      <svg className={iconSizes[size]} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    </div>
  );

  return (
    <LazyImage
      className={cn("rounded-full", sizeClasses[size], className)}
      aspectRatio="1/1"
      fallback={customFallback}
      errorFallback={customFallback}
      enableBlurTransition={true}
      {...props}
    />
  );
}
