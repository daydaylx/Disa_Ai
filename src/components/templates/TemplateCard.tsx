import type { ConversationTemplate } from "../../data/conversationTemplates";
import { ChevronRight, Clock, Tag } from "../../lib/icons";
import { cn } from "../../lib/utils";
import { Badge } from "../ui/badge";
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
        return "bg-[var(--succ)]/12 text-[var(--succ)] border-[var(--succ)]/30";
      case "intermediate":
        return "bg-[var(--warn)]/12 text-[var(--warn)] border-[var(--warn)]/30";
      case "advanced":
        return "bg-[var(--err)]/12 text-[var(--err)] border-[var(--err)]/30";
      default:
        return "bg-[var(--surface-neumorphic-raised)] text-[var(--color-text-secondary)] border-[var(--border-neumorphic-subtle)]";
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
      tone="neo-floating"
      elevation="medium"
      interactive="gentle"
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
        "group relative cursor-pointer overflow-hidden border border-[var(--border-neumorphic-subtle)] bg-[var(--surface-neumorphic-floating)] shadow-neo-sm transition-[transform,box-shadow] duration-200",
        "hover:-translate-y-[2px] hover:shadow-neo-md",
        "focus-visible:outline-none focus-visible:shadow-focus-neo",
        className,
      )}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {/* Template Icon */}
            {template.icon && (
              <div
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-[var(--radius-lg)] border border-[var(--border-neumorphic-subtle)] bg-[var(--surface-neumorphic-floating)] text-2xl text-[var(--acc1)] shadow-neo-sm transition-[background,box-shadow,transform] duration-200",
                  "group-hover:-translate-y-[1px] group-hover:shadow-neo-md",
                )}
              >
                {template.icon}
              </div>
            )}
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold text-[var(--color-text-primary)]">
                {template.name}
              </CardTitle>
              <CardDescription className="mt-1 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                {template.description}
              </CardDescription>
            </div>
          </div>

          <ChevronRight
            className={cn(
              "h-5 w-5 text-[var(--color-text-tertiary)] transition-transform duration-200",
              "group-hover:translate-x-[2px] group-hover:text-[var(--acc1)]",
            )}
          />
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        {/* Enhanced Metadata Section */}
        <div className="flex items-center gap-3 text-sm">
          {template.estimatedTime && (
            <div
              className={cn(
                "flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--border-neumorphic-subtle)] bg-[var(--surface-neumorphic-raised)] px-3 py-1.5 text-[var(--color-text-secondary)] shadow-none transition-[background,box-shadow] duration-150",
                "hover:bg-[var(--surface-neumorphic-floating)] hover:shadow-neo-sm",
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
                "text-xs font-semibold transition-[box-shadow,transform] duration-150",
                "hover:-translate-y-[1px] hover:shadow-neo-sm",
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
              "text-xs font-semibold transition-[background,box-shadow,transform] duration-150",
              "border border-[var(--border-neumorphic-subtle)]",
              "bg-[var(--surface-neumorphic-raised)]",
              "hover:bg-[var(--surface-neumorphic-floating)]",
              "hover:-translate-y-[1px] hover:shadow-neo-sm",
            )}
          >
            {template.category}
          </Badge>
          {template.tags.slice(0, 3).map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className={cn(
                "text-xs transition-[background,box-shadow,transform] duration-150",
                "border border-[var(--border-neumorphic-subtle)]",
                "bg-[var(--surface-neumorphic-floating)]",
                "hover:bg-[var(--surface-neumorphic-raised)]",
                "hover:-translate-y-[1px] hover:shadow-neo-sm",
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
          <Card
            interactive="gentle"
            elevation="medium"
            className="flex-1 cursor-pointer"
            onClick={(event) => {
              event.stopPropagation();
              handleUse();
            }}
          >
            <div className="flex h-10 w-full items-center justify-center rounded-[var(--radius-lg)] px-4 py-2 text-sm font-medium text-[var(--color-text-primary)]">
              Use Template
            </div>
          </Card>
          {onPreview && (
            <Card
              interactive="gentle"
              elevation="subtle"
              className="cursor-pointer"
              onClick={(event) => {
                event.stopPropagation();
                handlePreview();
              }}
            >
              <div className="flex h-10 w-full items-center justify-center rounded-[var(--radius-lg)] px-4 py-2 text-sm font-medium text-[var(--color-text-primary)]">
                Preview
              </div>
            </Card>
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
