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
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200";
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
        "group relative cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg",
        className,
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {template.icon && <div className="text-2xl">{template.icon}</div>}
            <div>
              <CardTitle className="group-hover:text-accent-600 text-lg font-semibold transition-colors">
                {template.name}
              </CardTitle>
              <CardDescription className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                {template.description}
              </CardDescription>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-neutral-400 transition-colors group-hover:text-accent-500" />
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Template Stats */}
        <div className="mb-4 flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
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

        {/* Category and Tags */}
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

        {/* Starter Prompts Preview */}
        <div className="mb-4">
          <div className="mb-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Sample prompts:
          </div>
          <div className="space-y-1">
            {template.starterPrompts.slice(0, 2).map((prompt, index) => (
              <div
                key={index}
                className="line-clamp-1 rounded bg-neutral-50 px-2 py-1 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
              >
                "{prompt}"
              </div>
            ))}
            {template.starterPrompts.length > 2 && (
              <div className="text-xs italic text-neutral-500">
                +{template.starterPrompts.length - 2} more prompts
              </div>
            )}
          </div>
        </div>

        {/* Suggested Model */}
        {template.suggestedModel && (
          <div className="mb-4 rounded-lg bg-blue-50 p-2 dark:bg-blue-950">
            <div className="text-xs text-blue-700 dark:text-blue-300">
              <strong>Suggested model:</strong> {template.suggestedModel}
            </div>
          </div>
        )}

        {/* Action Buttons */}
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
