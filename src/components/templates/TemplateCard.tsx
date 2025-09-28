import React from "react";
import { Clock, Tag, Star, ChevronRight } from "lucide-react";

import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { cn } from "../../lib/utils";
import type { ConversationTemplate } from "../../data/conversationTemplates";

interface TemplateCardProps {
  template: ConversationTemplate;
  onUse: (template: ConversationTemplate) => void;
  onPreview?: (template: ConversationTemplate) => void;
  className?: string;
}

export function TemplateCard({
  template,
  onUse,
  onPreview,
  className
}: TemplateCardProps) {
  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "intermediate": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "advanced": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default: return "bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200";
    }
  };

  const handleUse = () => {
    onUse(template);
  };

  const handlePreview = () => {
    onPreview?.(template);
  };

  return (
    <Card className={cn(
      "group relative transition-all duration-200 hover:shadow-lg hover:scale-[1.02] cursor-pointer",
      className
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {template.icon && (
              <div className="text-2xl">{template.icon}</div>
            )}
            <div>
              <CardTitle className="text-lg font-semibold group-hover:text-accent-600 transition-colors">
                {template.name}
              </CardTitle>
              <CardDescription className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                {template.description}
              </CardDescription>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-neutral-400 group-hover:text-accent-500 transition-colors" />
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Template Stats */}
        <div className="flex items-center gap-4 mb-4 text-sm text-neutral-600 dark:text-neutral-400">
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
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="secondary" className="text-xs">
            {template.category}
          </Badge>
          {template.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              <Tag className="h-3 w-3 mr-1" />
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
          <div className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Sample prompts:
          </div>
          <div className="space-y-1">
            {template.starterPrompts.slice(0, 2).map((prompt, index) => (
              <div
                key={index}
                className="text-xs text-neutral-600 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-800 rounded px-2 py-1 line-clamp-1"
              >
                "{prompt}"
              </div>
            ))}
            {template.starterPrompts.length > 2 && (
              <div className="text-xs text-neutral-500 italic">
                +{template.starterPrompts.length - 2} more prompts
              </div>
            )}
          </div>
        </div>

        {/* Suggested Model */}
        {template.suggestedModel && (
          <div className="mb-4 p-2 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <div className="text-xs text-blue-700 dark:text-blue-300">
              <strong>Suggested model:</strong> {template.suggestedModel}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={handleUse}
            className="flex-1"
            size="sm"
          >
            Use Template
          </Button>
          {onPreview && (
            <Button
              onClick={handlePreview}
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