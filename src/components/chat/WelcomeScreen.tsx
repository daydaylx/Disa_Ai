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
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-text-tertiary">
            Chat-Start
          </p>
          <h1 className="text-token-h1 text-text-strong text-balance font-semibold">
            Disa&nbsp;AI Chat
          </h1>
          <p className="text-sm leading-6 text-text-secondary">
            Starte eine Unterhaltung oder nutze die Schnellstarts für wiederkehrende Aufgaben.
          </p>
        </div>
        <div
          className="flex flex-wrap items-center justify-center gap-2"
          role="toolbar"
          aria-label="Chat-Aktionen"
        >
          <Button onClick={newConversation} variant="brand" size="lg" dramatic>
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span>Neuer Chat</span>
          </Button>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={openHistory}
                variant="outline"
                size="icon"
                aria-label="Chat-Verlauf öffnen"
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
        <div className="mb-5 flex flex-col gap-4 rounded-[var(--radius-xl)] border border-[var(--border-neumorphic-subtle)] bg-[var(--surface-neumorphic-floating)] p-[clamp(16px,5vw,24px)] shadow-neo-sm">
          <div className="flex-1 space-y-1">
            <h2
              id="discussion-heading"
              className="text-text-tertiary text-[11px] font-semibold uppercase tracking-[0.24em]"
            >
              Diskussionen
            </h2>
            <p className="text-xs leading-6 text-text-secondary">
              Ein Absatz, 5–10 Sätze, Abschlussfrage inklusive.
            </p>
          </div>
          <div className="w-full" role="group" aria-labelledby="discussion-style-label">
            <Label
              id="discussion-style-label"
              htmlFor="discussion-style"
              className="mb-1 block text-xs font-semibold uppercase tracking-[0.24em] text-text-tertiary"
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
                      className="group flex flex-col gap-1 rounded-[var(--radius-lg)] border border-[var(--border-neumorphic-subtle)] bg-[var(--surface-neumorphic-floating)] px-3 py-2 text-left shadow-none transition-[background,box-shadow,transform] duration-150 focus-visible:outline-none focus-visible:shadow-focus-neo hover:-translate-y-[2px] hover:shadow-neo-sm"
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
