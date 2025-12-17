import type { LucideProps } from "lucide-react";
import { forwardRef } from "react";

/**
 * NotchSquare - Custom DISA icon with the signature top-right notch motif.
 * Designed to blend with lucide-react sizing/styling (stroke=currentColor).
 */
export const NotchSquare = forwardRef<SVGSVGElement, LucideProps>(
  ({ color = "currentColor", size = 24, strokeWidth = 2, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
        {...props}
      >
        {/* Frame with top-right notch cutout */}
        <path d="M5 7a2 2 0 0 1 2-2h8v5h5v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7z" />
      </svg>
    );
  },
);

NotchSquare.displayName = "NotchSquare";
