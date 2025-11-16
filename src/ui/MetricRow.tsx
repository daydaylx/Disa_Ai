import { cn } from "@/lib/utils";
import { Typography } from "@/ui/Typography";

// MetricRow Component für die horizontalen Bars
interface MetricRowProps {
  label: string;
  value: number; // 0-100
  maxValue?: number;
  color?: "green" | "yellow" | "primary";
  score?: number;
  showScore?: boolean;
}

export function MetricRow({
  label,
  value,
  maxValue = 100,
  color = "green",
  score,
  showScore = true,
}: MetricRowProps) {
  const percentage = Math.min(100, Math.max(0, (value / maxValue) * 100));

  // Aurora Color Palette Integration
  const colorClasses = {
    green: "bg-[var(--aurora-green-500)]",
    yellow: "bg-[var(--aurora-orange-500)]",
    primary: "bg-[var(--aurora-primary-500)]",
  };

  return (
    <div className="space-y-1">
      {/* Label und Score */}
      <div className="flex items-center justify-between">
        <Typography variant="body-sm" className="text-[var(--text-secondary)]">
          {label}
        </Typography>
        {showScore && score !== undefined && (
          <Typography variant="body-xs" className="text-[var(--text-muted)]">
            {score}
          </Typography>
        )}
      </div>

      {/* Aurora Glass Progress Bar */}
      <div className="relative h-1.5 bg-[var(--glass-surface-subtle)] rounded-full overflow-hidden border border-[var(--glass-border-subtle)]">
        <div
          className={cn(
            "absolute inset-y-0 left-0 rounded-full transition-all duration-[var(--motion-medium)] ease-[var(--ease-aurora)]",
            "shadow-[var(--shadow-glow-soft)]",
            colorClasses[color],
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
