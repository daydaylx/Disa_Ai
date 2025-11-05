import type { DiscussionPresetKey } from "../../prompts/discussion/presets";
import { discussionPresetOptions } from "../../prompts/discussion/presets";
import Accordion from "../ui/Accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/Dialog";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

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

interface DiscussionStarterProps {
  discussionPreset: DiscussionPresetKey;
  handleDiscussionPresetChange: (preset: DiscussionPresetKey) => void;
  startDiscussion: (prompt: string) => void;
  discussionSections: DiscussionSectionViewModel[];
  children: React.ReactNode;
}

export function DiscussionStarter({
  discussionPreset,
  handleDiscussionPresetChange,
  startDiscussion,
  discussionSections,
  children,
}: DiscussionStarterProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Start a Discussion</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
