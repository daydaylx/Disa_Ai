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
        return "bg-success/10 text-success border-success/30";
      case "intermediate":
        return "bg-warn/10 text-warn border-warn/30";
      case "advanced":
        return "bg-danger/10 text-danger border-danger/30";
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
      className={cn(
        "group relative cursor-pointer transition-all duration-200 hover:scale-[1.02]",
        className,
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {template.icon && <div className="text-2xl">{template.icon}</div>}
            <div>
              <CardTitle className="text-lg font-semibold transition-colors group-hover:text-brand">
                {template.name}
              </CardTitle>
              <CardDescription className="mt-1 text-sm text-text-1">
                {template.description}
              </CardDescription>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-text-1 transition-colors group-hover:text-brand" />
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="mb-4 flex items-center gap-4 text-sm text-text-1">
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
          <div className="mb-2 text-sm font-medium text-text-0">Sample prompts:</div>
          <div className="space-y-1">
            {template.starterPrompts.slice(0, 2).map((prompt, index) => (
              <div
                key={index}
                className="line-clamp-1 rounded bg-surface-2 px-2 py-1 text-xs text-text-1"
              >
                "{prompt}"
              </div>
            ))}
            {template.starterPrompts.length > 2 && (
              <div className="text-xs italic text-text-1">
                +{template.starterPrompts.length - 2} more prompts
              </div>
            )}
          </div>
        </div>

        {template.suggestedModel && (
          <div className="mb-4 rounded-lg bg-brand/10 p-2">
            <div className="text-xs text-brand">
              <strong>Suggested model:</strong> {template.suggestedModel}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button onClick={handleUse} className="flex-1" size="sm">
            Use Template
          </Button>
          {onPreview && (
            <Button onClick={handlePreview} variant="outline" size="sm">
              Preview
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
