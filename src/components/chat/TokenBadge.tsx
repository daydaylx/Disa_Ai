import { AlertTriangle, Clock, Zap } from "lucide-react";
import { useMemo } from "react";

import { cn } from "../../lib/utils";
import { Badge } from "../ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

interface TokenBadgeProps {
  current: number;
  max?: number;
  cost?: number;
  currency?: string;
  isLive?: boolean;
  model?: string;
  className?: string;
}

export function TokenBadge({
  current,
  max,
  cost,
  currency = "USD",
  isLive = false,
  model,
  className,
}: TokenBadgeProps) {
  const percentage = max ? (current / max) * 100 : 0;

  const { variant, icon: Icon } = useMemo(() => {
    if (!max) {
      return { variant: "secondary" as const, icon: Zap };
    }

    if (percentage >= 90) {
      return { variant: "destructive" as const, icon: AlertTriangle };
    } else if (percentage >= 70) {
      return { variant: "outline" as const, icon: AlertTriangle };
    } else {
      return { variant: "secondary" as const, icon: Zap };
    }
  }, [percentage, max]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const formatCost = (cost: number, currency: string) => {
    if (currency === "USD") {
      return `$${cost.toFixed(4)}`;
    }
    return `${cost.toFixed(4)} ${currency}`;
  };

  const tooltipContent = (
    <div className="space-y-1 text-sm">
      <div className="font-medium">Token-Nutzung</div>
      <div>Aktuell: {current.toLocaleString()} Token</div>
      {max && (
        <>
          <div>Limit: {max.toLocaleString()} Token</div>
          <div>Auslastung: {percentage.toFixed(1)}%</div>
        </>
      )}
      {cost !== undefined && <div>Kosten: {formatCost(cost, currency)}</div>}
      {model && <div>Modell: {model}</div>}
      {isLive && <div className="text-accent">● Live-Aktualisierung</div>}
    </div>
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant={variant}
            className={cn(
              "flex items-center gap-1 font-mono text-xs transition-all",
              isLive && "animate-pulse",
              className,
            )}
          >
            <Icon className="h-3 w-3" />
            <span>{formatNumber(current)}</span>
            {max && (
              <>
                <span className="opacity-60">/</span>
                <span className="opacity-60">{formatNumber(max)}</span>
              </>
            )}
            {isLive && <Clock className="h-3 w-3 text-accent" />}
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          {tooltipContent}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

interface LiveTokenCounterProps {
  tokens: number;
  maxTokens?: number;
  cost?: number;
  model?: string;
  isStreaming?: boolean;
  className?: string;
}

export function LiveTokenCounter({
  tokens,
  maxTokens,
  cost,
  model,
  isStreaming = false,
  className,
}: LiveTokenCounterProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <TokenBadge current={tokens} max={maxTokens} cost={cost} model={model} isLive={isStreaming} />
      {isStreaming && (
        <div className="flex items-center gap-1 text-xs text-text-1">
          <div className="h-1.5 w-1.5 animate-ping rounded-full bg-accent/60" />
          <span>Stream läuft …</span>
        </div>
      )}
    </div>
  );
}
