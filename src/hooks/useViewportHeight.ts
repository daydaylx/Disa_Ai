import { useEffect } from "react";

function applyViewportHeight() {
  if (typeof window === "undefined") {
    return;
  }

  const viewport = window.visualViewport;
  const height = viewport?.height ?? window.innerHeight;
  document.documentElement.style.setProperty("--vh", `${height}px`);
}

/**
 * Keeps the CSS `--vh` custom property in sync with the usable viewport height.
 */
export function useViewportHeight() {
  useEffect(() => {
    applyViewportHeight();

    if (typeof window === "undefined") {
      return;
    }

    const viewport = window.visualViewport;
    const handleResize = () => {
      // Use rAF to let the viewport settle before reading the dimensions.
      window.requestAnimationFrame(applyViewportHeight);
    };

    viewport?.addEventListener("resize", handleResize);
    viewport?.addEventListener("scroll", handleResize);
    window.addEventListener("resize", handleResize);

    return () => {
      viewport?.removeEventListener("resize", handleResize);
      viewport?.removeEventListener("scroll", handleResize);
      window.removeEventListener("resize", handleResize);
    };
  }, []);
}
