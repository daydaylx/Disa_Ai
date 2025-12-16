import { cn } from "@/lib/utils";

interface BrandIconProps {
  className?: string;
  animated?: boolean;
}

/**
 * BrandIcon - Dezentes Disa AI Logo mit optionalen Animationen
 *
 * Ein minimalistisches "D" Logo mit Gradient-Effekt für Wiedererkennungswert
 */
export function BrandIcon({ className, animated = true }: BrandIconProps) {
  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      {/* Äußerer Glow Ring - dezent */}
      <div
        className={cn(
          "absolute inset-0 rounded-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 blur-xl",
          animated && "animate-pulse-slow",
        )}
      />

      {/* Haupt-Icon Container */}
      <div
        className={cn(
          "relative w-16 h-16 rounded-2xl flex items-center justify-center",
          "bg-gradient-to-br from-violet-500 to-fuchsia-600",
          "shadow-lg shadow-violet-500/25",
          animated && "animate-gradient-shift",
        )}
      >
        {/* "D" Buchstabe - minimalistisch */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-10 h-10 text-white drop-shadow-sm"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7 4h5c4.97 0 9 4.03 9 9s-4.03 9-9 9H7V4z"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <circle
            cx="13"
            cy="13"
            r="2"
            fill="currentColor"
            className={cn(animated && "animate-pulse-subtle")}
          />
        </svg>
      </div>

      {/* Akzent-Punkte für Extra-Detail */}
      <div
        className={cn(
          "absolute -top-1 -right-1 w-3 h-3 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500",
          "shadow-lg shadow-cyan-400/50",
          animated && "animate-bounce-subtle",
        )}
      />
    </div>
  );
}
