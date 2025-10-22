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
        return "bg-success/15 text-success border-success/40";
      case "intermediate":
        return "bg-warning-bg text-warning border-warning/50";
      case "advanced":
        return "bg-danger-bg text-danger border-danger/40";
      default:
        return "bg-surface-2 text-text-1 border-border";
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
      interactive
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
        "focus-visible:ring-brand group relative cursor-pointer motion-safe:hover:-translate-y-[1px]",
        className,
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {template.icon && <div className="text-2xl">{template.icon}</div>}
            <div>
              <CardTitle className="group-hover:text-brand text-lg font-semibold transition-colors">
                {template.name}
              </CardTitle>
              <CardDescription className="text-text-1 mt-1 text-sm">
                {template.description}
              </CardDescription>
            </div>
          </div>
          <ChevronRight className="text-text-1 group-hover:text-brand h-5 w-5 transition-colors" />
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="text-text-1 mb-4 flex items-center gap-4 text-sm">
          {template.estimatedTime && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{template.estimatedTime}</span>
            </div>
          )}
          {template.difficulty && (
            <Badge
              variant="outline"
              className={cn("text-xs", getDifficultyColor(template.difficulty))}
            >
              {template.difficulty}
            </Badge>
          )}
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          <Badge variant="secondary" className="text-xs">
            {template.category}
          </Badge>
          {template.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              <Tag className="mr-1 h-3 w-3" />
              {tag}
            </Badge>
          ))}
          {template.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{template.tags.length - 3} more
            </Badge>
          )}
        </div>

        <div className="mb-4">
          <div className="text-text-0 mb-2 text-sm font-medium">Sample prompts:</div>
          <div className="space-y-1">
            {template.starterPrompts.slice(0, 2).map((prompt, index) => (
              <div
                key={index}
                className="bg-surface-2 text-text-1 line-clamp-1 rounded px-2 py-1 text-xs"
              >
                "{prompt}"
              </div>
            ))}
            {template.starterPrompts.length > 2 && (
              <div className="text-text-1 text-xs italic">
                +{template.starterPrompts.length - 2} more prompts
              </div>
            )}
          </div>
        </div>

        {template.suggestedModel && (
          <div className="bg-brand/10 mb-4 rounded-lg p-2">
            <div className="text-brand text-xs">
              <strong>Suggested model:</strong> {template.suggestedModel}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={(event) => {
              event.stopPropagation();
              handleUse();
            }}
            className="flex-1"
            size="sm"
          >
            Use Template
          </Button>
          {onPreview && (
            <Button
              onClick={(event) => {
                event.stopPropagation();
                handlePreview();
              }}
              variant="outline"
              size="sm"
            >
              Preview
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
