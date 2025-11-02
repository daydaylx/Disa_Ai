import { ChevronRight, Clock, Tag } from "lucide-react";

import type { ConversationTemplate } from "../../data/conversationTemplates";
import { cn } from "../../lib/utils";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

interface TemplateCardProps {
  template: ConversationTemplate;
  onUse: (template: ConversationTemplate) => void;
  onPreview?: (template: ConversationTemplate) => void;
  className?: string;
}

export function TemplateCard({ template, onUse, onPreview, className }: TemplateCardProps) {
  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case "beginner":
        return [
          "bg-gradient-to-r from-[var(--succ)]/15 to-[var(--succ)]/10",
          "text-[var(--succ)]",
          "border-[var(--succ)]/30",
          "shadow-[0_0_8px_rgba(34,197,94,0.2)]",
        ].join(" ");
      case "intermediate":
        return [
          "bg-gradient-to-r from-[var(--warn)]/15 to-[var(--warn)]/10",
          "text-[var(--warn)]",
          "border-[var(--warn)]/30",
          "shadow-[0_0_8px_rgba(234,179,8,0.2)]",
        ].join(" ");
      case "advanced":
        return [
          "bg-gradient-to-r from-[var(--err)]/15 to-[var(--err)]/10",
          "text-[var(--err)]",
          "border-[var(--err)]/30",
          "shadow-[0_0_8px_rgba(239,68,68,0.2)]",
        ].join(" ");
      default:
        return [
          "bg-[var(--surface-neumorphic-raised)]",
          "text-[var(--color-text-secondary)]",
          "border-[var(--border-neumorphic-light)]",
        ].join(" ");
    }
  };

  const handleUse = () => {
    onUse(template);
  };

  const handlePreview = () => {
    onPreview?.(template);
  };

  return (
    <Card
      tone="neo-raised"
      depth="depth-4"
      interactive="neo-gentle"
      role="button"
      tabIndex={0}
      aria-label={`${template.name} auswählen`}
      onClick={handleUse}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleUse();
        }
      }}
      className={cn(
        "group relative cursor-pointer transition-all duration-500 ease-out overflow-hidden",
        "hover:shadow-[var(--shadow-neumorphic-lg)]",
        "hover:-translate-y-2",
        "hover:scale-[1.02]",
        "focus-visible:ring-2 focus-visible:ring-[var(--acc1)]/50",
        className,
      )}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {/* Dramatic Template Icon */}
            {template.icon && (
              <div
                className={cn(
                  "flex items-center justify-center rounded-[var(--radius-lg)] transition-all duration-300",
                  "bg-gradient-to-br from-[var(--acc1)] to-[var(--acc2)]",
                  "shadow-[var(--shadow-neumorphic-md)]",
                  "border border-white/20",
                  "text-2xl",
                  "h-12 w-12",
                  "group-hover:shadow-[var(--shadow-neumorphic-lg)]",
                  "group-hover:scale-110",
                  "group-hover:rotate-3",
                )}
              >
                <span className="inline-flex items-center justify-center text-white shadow-glow-brand">
                  {template.icon}
                </span>
              </div>
            )}
            <div className="flex-1">
              <CardTitle
                className={cn(
                  "text-lg font-bold transition-colors duration-300",
                  "text-[var(--color-text-primary)]",
                  "group-hover:text-[var(--acc1)]",
                )}
              >
                {template.name}
              </CardTitle>
              <CardDescription
                className={cn(
                  "mt-1 text-sm leading-relaxed transition-colors duration-200",
                  "text-[var(--color-text-secondary)]",
                  "group-hover:text-[var(--color-text-primary)]",
                )}
              >
                {template.description}
              </CardDescription>
            </div>
          </div>

          {/* Dramatic Chevron */}
          <ChevronRight
            className={cn(
              "h-6 w-6 transition-all duration-300",
              "text-[var(--color-text-secondary)]",
              "group-hover:text-[var(--acc1)]",
              "group-hover:translate-x-1",
              "group-hover:scale-110",
            )}
          />
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        {/* Enhanced Metadata Section */}
        <div className="flex items-center gap-4 text-sm">
          {template.estimatedTime && (
            <div
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-[var(--radius-md)] transition-all duration-200",
                "bg-[var(--surface-neumorphic-raised)]",
                "shadow-[var(--shadow-neumorphic-sm)]",
                "border border-[var(--border-neumorphic-light)]",
                "text-[var(--color-text-secondary)]",
                "hover:shadow-[var(--shadow-neumorphic-md)]",
                "hover:text-[var(--color-text-primary)]",
              )}
            >
              <Clock className="h-4 w-4" />
              <span className="font-medium">{template.estimatedTime}</span>
            </div>
          )}
          {template.difficulty && (
            <Badge
              variant="outline"
              className={cn(
                "text-xs font-semibold transition-all duration-200",
                "shadow-[var(--shadow-neumorphic-sm)]",
                "hover:shadow-[var(--shadow-neumorphic-md)]",
                "hover:-translate-y-0.5",
                getDifficultyColor(template.difficulty),
              )}
            >
              {template.difficulty}
            </Badge>
          )}
        </div>

        {/* Enhanced Tags Section */}
        <div className="flex flex-wrap gap-2">
          <Badge
            variant="secondary"
            className={cn(
              "text-xs font-semibold transition-all duration-200",
              "bg-gradient-to-r from-[var(--surface-neumorphic-floating)] to-[var(--surface-neumorphic-raised)]",
              "shadow-[var(--shadow-neumorphic-sm)]",
              "border border-[var(--border-neumorphic-light)]",
              "hover:shadow-[var(--shadow-neumorphic-md)]",
              "hover:-translate-y-0.5",
            )}
          >
            {template.category}
          </Badge>
          {template.tags.slice(0, 3).map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className={cn(
                "text-xs transition-all duration-200",
                "bg-[var(--surface-neumorphic-base)]",
                "shadow-[var(--shadow-inset-subtle)]",
                "border border-[var(--border-neumorphic-subtle)]",
                "hover:bg-[var(--surface-neumorphic-raised)]",
                "hover:shadow-[var(--shadow-neumorphic-sm)]",
                "hover:-translate-y-0.5",
              )}
            >
              <Tag className="mr-1 h-3 w-3" />
              {tag}
            </Badge>
          ))}
          {template.tags.length > 3 && (
            <Badge
              variant="outline"
              className={cn(
                "text-xs transition-all duration-200",
                "bg-[var(--surface-neumorphic-base)]",
                "shadow-[var(--shadow-inset-subtle)]",
                "border border-[var(--border-neumorphic-subtle)]",
                "hover:bg-[var(--surface-neumorphic-raised)]",
                "hover:shadow-[var(--shadow-neumorphic-sm)]",
              )}
            >
              +{template.tags.length - 3} more
            </Badge>
          )}
        </div>

        {/* Enhanced Sample Prompts */}
        <div>
          <div className="text-[var(--color-text-primary)] mb-3 text-sm font-semibold">
            Sample prompts:
          </div>
          <div className="space-y-2">
            {template.starterPrompts.slice(0, 2).map((prompt, index) => (
              <div
                key={index}
                className={cn(
                  "rounded-[var(--radius-md)] px-3 py-2 text-xs leading-relaxed transition-all duration-200",
                  "bg-[var(--surface-neumorphic-base)]",
                  "shadow-[var(--shadow-inset-subtle)]",
                  "border border-[var(--border-neumorphic-subtle)]",
                  "text-[var(--color-text-secondary)]",
                  "hover:bg-[var(--surface-neumorphic-raised)]",
                  "hover:shadow-[var(--shadow-neumorphic-sm)]",
                  "hover:text-[var(--color-text-primary)]",
                  "line-clamp-2",
                )}
              >
                "{prompt}"
              </div>
            ))}
            {template.starterPrompts.length > 2 && (
              <div className="text-[var(--color-text-secondary)] text-xs italic font-medium">
                +{template.starterPrompts.length - 2} more prompts
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Suggested Model */}
        {template.suggestedModel && (
          <div
            className={cn(
              "rounded-[var(--radius-lg)] p-3 transition-all duration-200",
              "bg-gradient-to-r from-[var(--acc1)]/10 to-[var(--acc1)]/5",
              "border border-[var(--acc1)]/20",
              "shadow-[var(--shadow-neumorphic-sm)]",
              "hover:shadow-[var(--shadow-neumorphic-md)]",
              "hover:border-[var(--acc1)]/30",
            )}
          >
            <div className="text-[var(--acc1)] text-xs font-semibold">
              <strong>Suggested model:</strong> {template.suggestedModel}
            </div>
          </div>
        )}

        {/* Enhanced Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            onClick={(event) => {
              event.stopPropagation();
              handleUse();
            }}
            variant="neo-medium"
            className="flex-1"
            size="md"
          >
            Use Template
          </Button>
          {onPreview && (
            <Button
              onClick={(event) => {
                event.stopPropagation();
                handlePreview();
              }}
              variant="neo-subtle"
              size="md"
            >
              Preview
            </Button>
          )}
        </div>
      </CardContent>

      {/* Dramatic Hover Glow Effect */}
      <div
        className="absolute inset-0 rounded-[var(--radius-lg)] pointer-events-none opacity-0 group-hover:opacity-20 transition-opacity duration-500"
        style={{
          background: "radial-gradient(circle at center, rgba(75,99,255,0.3) 0%, transparent 70%)",
          filter: "blur(30px)",
        }}
      />
    </Card>
  );
}
