import { useMemo } from "react";
import { Badge } from "../ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { cn } from "../../lib/utils";
import { Zap, AlertTriangle, Clock } from "lucide-react";

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
  className
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
      <div className="font-medium">Token Usage</div>
      <div>Current: {current.toLocaleString()} tokens</div>
      {max && (
        <>
          <div>Limit: {max.toLocaleString()} tokens</div>
          <div>Usage: {percentage.toFixed(1)}%</div>
        </>
      )}
      {cost !== undefined && (
        <div>Cost: {formatCost(cost, currency)}</div>
      )}
      {model && (
        <div>Model: {model}</div>
      )}
      {isLive && (
        <div className="text-accent-500">● Live updating</div>
      )}
    </div>
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant={variant}
            className={cn(
              "flex items-center gap-1 text-xs font-mono transition-all",
              isLive && "animate-pulse",
              className
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
            {isLive && <Clock className="h-3 w-3 text-accent-500" />}
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
  className
}: LiveTokenCounterProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <TokenBadge
        current={tokens}
        max={maxTokens}
        cost={cost}
        model={model}
        isLive={isStreaming}
      />
      {isStreaming && (
        <div className="flex items-center gap-1 text-xs text-neutral-500">
          <div className="h-1.5 w-1.5 rounded-full bg-accent-500 animate-ping" />
          <span>Streaming...</span>
        </div>
      )}
    </div>
  );
}