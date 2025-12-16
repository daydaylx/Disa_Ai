import { cn } from "@/lib/utils";

interface AnimatedHaloProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function AnimatedHalo({ className, size = "md" }: AnimatedHaloProps) {
  const sizeClasses = {
    sm: "w-32 h-8",
    md: "w-48 h-12",
    lg: "w-64 h-16",
  };

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      {/* Animated Halo Ring */}
      <div className="relative">
        {/* Main glowing ring */}
        <div
          className={cn(
            "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
            sizeClasses[size],
            "rounded-full",
            "bg-transparent",
            "border-2 border-brand-primary/60",
            "shadow-[0_0_20px_rgba(59,130,246,0.5),0_0_40px_rgba(59,130,246,0.3),0_0_60px_rgba(59,130,246,0.1)]",
            "animate-pulse-glow",
          )}
          style={{
            animation: "pulse-glow 3s ease-in-out infinite",
          }}
        />

        {/* Secondary pulse ring */}
        <div
          className={cn(
            "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
            sizeClasses[size],
            "rounded-full",
            "bg-transparent",
            "border border-brand-primary/30",
            "opacity-50",
          )}
          style={{
            animation: "pulse-glow 3s ease-in-out infinite 0.5s",
            width: "calc(100% + 16px)",
            height: "calc(100% + 8px)",
          }}
        />

        {/* Inner glow */}
        <div
          className={cn(
            "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
            sizeClasses[size],
            "rounded-full",
            "bg-gradient-to-r from-brand-primary/20 via-brand-secondary/10 to-brand-primary/20",
            "blur-xl",
            "animate-pulse-slow",
          )}
        />
      </div>
    </div>
  );
}
