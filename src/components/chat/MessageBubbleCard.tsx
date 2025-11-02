import type { ComponentPropsWithoutRef, CSSProperties } from "react";

import { cn } from "@/lib/utils";

import { Card, CardContent, CardHeader } from "../../components/ui/card";

type MessageBubbleVariant = "assistant" | "user";

interface MessageBubbleCardProps extends ComponentPropsWithoutRef<"article"> {
  author: string;
  body: string;
  timestamp?: number;
  variant: MessageBubbleVariant;
}

function formatTimestamp(timestamp?: number) {
  if (typeof timestamp !== "number") return { iso: undefined, label: undefined };
  const date = new Date(timestamp);
  return {
    iso: date.toISOString(),
    label: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };
}

export function MessageBubbleCard({
  author,
  body,
  timestamp,
  variant,
  className,
  ...props
}: MessageBubbleCardProps) {
  const { iso, label } = formatTimestamp(timestamp);

  // Dramatic Neomorphic Configuration
  const cardConfig: Record<
    MessageBubbleVariant,
    {
      alignment: "justify-start" | "justify-end";
      // Card Properties
      tone: "neo-raised" | "neo-inset" | "neo-floating";
      elevation: "medium" | "subtle" | "strong";
      interactive: "neo-gentle" | false;
      // Visual Properties
      accentColor: string;
      glowColor: string;
      badgeIcon: string;
      badgeVariant: "neo-raised" | "neo-floating";
    }
  > = {
    assistant: {
      alignment: "justify-start",
      // Received Message - Subtle Inset
      tone: "neo-inset",
      elevation: "subtle",
      interactive: "neo-gentle",
      // AI Brand Colors
      accentColor: "var(--acc1)",
      glowColor: "rgba(75, 99, 255, 0.3)",
      badgeIcon: "🤖",
      badgeVariant: "neo-floating",
    },
    user: {
      alignment: "justify-end",
      // Sent Message - Dramatically Raised
      tone: "neo-floating",
      elevation: "strong",
      interactive: "neo-gentle",
      // User Brand Colors
      accentColor: "var(--acc2)",
      glowColor: "rgba(245, 93, 105, 0.3)",
      badgeIcon: "👤",
      badgeVariant: "neo-raised",
    },
  };

  const config = cardConfig[variant];

  // Enhanced Styling with CSS Variables
  const bubbleStyles: CSSProperties = {
    "--message-accent": config.accentColor,
    "--message-glow": config.glowColor,
  } as CSSProperties;

  // Accent Bar Styling
  const accentStyles: CSSProperties = {
    backgroundColor: config.accentColor,
    boxShadow: `0 0 12px ${config.glowColor}`,
  };

  // Badge Styling
  const badgeStyles: CSSProperties = {
    backgroundColor: config.accentColor,
    color: "white",
    boxShadow: `0 0 8px ${config.glowColor}, inset 0 0 0 1px ${config.accentColor}`,
    border: "var(--border-neumorphic-light)",
  };

  return (
    <div className={cn("flex w-full", config.alignment)}>
      <Card
        role="article"
        tone={config.tone}
        depth={config.elevation}
        interactive={config.interactive}
        padding="none"
        className={cn(
          "relative w-full max-w-[min(100%,640px)] overflow-visible transition-all duration-300 ease-out",
          // Dramatic Message Bubble Enhancements
          variant === "user" && [
            "hover:shadow-[var(--shadow-neumorphic-xl)]",
            "hover:-translate-y-1",
            "hover:scale-[1.02]",
          ],
          variant === "assistant" && ["hover:shadow-[inset_0_8px_16px_rgba(9,12,20,0.12)]"],
          className,
        )}
        style={bubbleStyles}
        {...props}
      >
        {/* Dramatic Accent Bar */}
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute top-4 bottom-4 w-1.5 rounded-full transition-all duration-300",
            variant === "assistant" ? "left-3" : "right-3",
            // Enhanced accent bar for user messages
            variant === "user" && "group-hover:w-2 group-hover:shadow-lg",
          )}
          style={accentStyles}
        />

        {/* Dramatic Role Badge Header */}
        <CardHeader className="pb-3">
          <div
            className={cn(
              "inline-flex max-w-fit items-center gap-2.5 rounded-[var(--radius-lg)] px-4 py-2 text-sm font-semibold transition-all duration-300",
              // Neomorphic Badge Base
              "bg-gradient-to-br from-white/20 via-white/10 to-transparent",
              "backdrop-blur-sm border",
              // Variant-specific styling
              variant === "assistant" && [
                "shadow-[var(--shadow-neumorphic-sm)]",
                "border-[var(--border-neumorphic-light)]",
                "hover:shadow-[var(--shadow-neumorphic-md)]",
              ],
              variant === "user" && [
                "shadow-[var(--shadow-neumorphic-md)]",
                "border-[var(--border-neumorphic-light)]",
                "hover:shadow-[var(--shadow-neumorphic-lg)]",
                "hover:-translate-y-0.5",
              ],
            )}
            style={badgeStyles}
          >
            <span className="text-base">{config.badgeIcon}</span>
            <span className="inline-flex items-center font-bold text-white shadow-glow-brand">
              {author}
            </span>
            {label && (
              <>
                <span className="text-white/70 font-normal">•</span>
                <time className="text-xs text-white/80 font-medium" dateTime={iso} title={iso}>
                  {label}
                </time>
              </>
            )}
          </div>
        </CardHeader>

        {/* Enhanced Message Content */}
        <CardContent className="pt-0 pb-6">
          <div
            className={cn(
              "whitespace-pre-wrap text-sm leading-relaxed transition-colors duration-200",
              "text-[var(--color-text-primary)]",
              // Enhanced readability
              "selection:bg-[var(--acc1)]/20 selection:text-[var(--color-text-primary)]",
            )}
          >
            {body}
          </div>
        </CardContent>

        {/* Dramatic Inner Glow Effect */}
        <div
          className="absolute inset-0 rounded-[var(--radius-lg)] pointer-events-none opacity-30"
          style={{
            background: `radial-gradient(circle at ${variant === "user" ? "right" : "left"} center, ${config.glowColor} 0%, transparent 70%)`,
            filter: "blur(20px)",
          }}
        />
      </Card>
    </div>
  );
}
