import { History, Plus } from "lucide-react";

import type { DiscussionPresetKey } from "../../prompts/discussion/presets";
import { discussionPresetOptions } from "../../prompts/discussion/presets";
import Accordion from "../ui/Accordion";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface DiscussionTopic {
  title: string;
  prompt: string;
  hint: string;
}

interface DiscussionSectionViewModel {
  id: string;
  title: string;
  description: string;
  topics: DiscussionTopic[];
}

interface WelcomeScreenProps {
  discussionPreset: DiscussionPresetKey;
  handleDiscussionPresetChange: (preset: DiscussionPresetKey) => void;
  startDiscussion: (prompt: string) => void;
  discussionSections: DiscussionSectionViewModel[];
  newConversation: () => void;
  openHistory: () => void;
}

export function WelcomeScreen({
  discussionPreset,
  handleDiscussionPresetChange,
  startDiscussion,
  discussionSections,
  newConversation,
  openHistory,
}: WelcomeScreenProps) {
  return (
    <>
      <header className="mobile-chat-header space-y-stack-gap">
        {/* Welcome Header */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-text-muted">
            Chat-Start
          </p>
          <h1 className="text-token-h1 text-text-strong text-balance font-semibold">
            Disa&nbsp;AI Chat
          </h1>
          <p className="text-sm leading-6 text-text-muted">
            Starte eine Unterhaltung oder nutze die Schnellstarts für wiederkehrende Aufgaben.
          </p>
        </div>
        <div
          className="flex flex-wrap items-center gap-2 justify-center"
          role="toolbar"
          aria-label="Chat-Aktionen"
        >
          <Button
            onClick={newConversation}
            variant="brand"
            size="lg"
            className="shadow-neon mobile-btn mobile-btn-primary touch-target"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span>Neuer Chat</span>
          </Button>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={openHistory}
                variant="secondary"
                size="icon"
                aria-label="Chat-Verlauf öffnen"
                className="mobile-btn mobile-btn-secondary touch-target"
              >
                <History className="h-5 w-5" aria-hidden="true" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Verlauf öffnen</TooltipContent>
          </Tooltip>
        </div>
      </header>

      <section aria-labelledby="discussion-heading" className="pb-8">
        {/* Discussion Section */}
        <div className="bg-surface-base/70 border-border-subtle/45 mb-5 flex flex-col gap-4 rounded-lg border p-4">
          <div className="flex-1 space-y-1">
            <h2
              id="discussion-heading"
              className="text-text-subtle text-[11px] font-semibold uppercase tracking-[0.24em]"
            >
              Diskussionen
            </h2>
            <p className="text-xs leading-6 text-text-muted">
              Ein Absatz, 5–10 Sätze, Abschlussfrage inklusive.
            </p>
          </div>
          <div className="w-full" role="group" aria-labelledby="discussion-style-label">
            <Label
              id="discussion-style-label"
              htmlFor="discussion-style"
              className="mb-1 block text-xs font-semibold uppercase tracking-[0.24em] text-text-muted"
            >
              Stil auswählen
            </Label>
            <Select value={discussionPreset} onValueChange={handleDiscussionPresetChange}>
              <SelectTrigger id="discussion-style" className="mobile-form-select touch-target">
                <SelectValue placeholder="Stil wählen" />
              </SelectTrigger>
              <SelectContent>
                {discussionPresetOptions.map((option) => (
                  <SelectItem key={option.key} value={option.key}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Accordion
          single
          items={discussionSections.map((section, index) => ({
            id: section.id,
            title: section.title,
            meta: `${section.topics.length} Themen`,
            defaultOpen: index === 0,
            content: (
              <div className="space-y-3">
                <p className="text-text-subtle text-xs leading-5">{section.description}</p>
                <div className="grid gap-2 grid-cols-1">
                  {section.topics.map((topic) => (
                    <button
                      key={topic.title}
                      type="button"
                      onClick={() => startDiscussion(topic.prompt)}
                      title={topic.hint}
                      className="mobile-card touch-target group flex flex-col gap-1 rounded-md border px-3 py-2 text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                    >
                      <span className="text-text-strong text-sm font-medium [hyphens:auto]">
                        {topic.title}
                      </span>
                      <span className="text-text-subtle text-xs">{topic.hint}</span>
                    </button>
                  ))}
                </div>
              </div>
            ),
          }))}
        />
      </section>
    </>
  );
}
