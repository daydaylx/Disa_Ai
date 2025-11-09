import { useEffect, useState } from "react";

/**
 * Custom hook for tracking the state of a media query.
 * @param query The media query string to watch.
 * @returns `true` if the media query matches, otherwise `false`.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Ensure window.matchMedia is available
    if (typeof window.matchMedia !== "function") {
      return;
    }

    const mediaQueryList = window.matchMedia(query);

    // Function to update state based on media query match status
    const updateMatches = (event: MediaQueryListEvent | MediaQueryList) => {
      setMatches(event.matches);
    };

    // Set the initial state
    updateMatches(mediaQueryList);

    // Add listener for changes
    // Using addEventListener for modern browsers
    try {
      mediaQueryList.addEventListener("change", updateMatches);
    } catch {
      // Fallback for older browsers
      mediaQueryList.addListener(updateMatches);
    }

    // Cleanup listener on component unmount
    return () => {
      try {
        mediaQueryList.removeEventListener("change", updateMatches);
      } catch {
        // Fallback for older browsers
        mediaQueryList.removeListener(updateMatches);
      }
    };
  }, [query]);

  return matches;
}

/**
 * A convenience hook for checking if the viewport is mobile-sized.
 * Uses a default max-width of 640px (matches Tailwind `sm` breakpoint).
 * This ensures tablets (768px+) are treated as desktop, not mobile.
 */
export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 640px)");
}
