import { type ChangeEvent, useEffect, useState } from "react";

import {
  getDiscussionMaxSentences,
  getDiscussionPreset,
  getDiscussionStrictMode,
  setDiscussionMaxSentences,
  setDiscussionPreset,
  setDiscussionStrictMode,
} from "@/config/settings";
import { type DiscussionPresetKey, discussionPresetOptions } from "@/prompts/discussion/presets";

export default function SettingsPage() {
  const [preset, setPreset] = useState<DiscussionPresetKey>(() => getDiscussionPreset());
  const [strictMode, setStrictMode] = useState<boolean>(() => getDiscussionStrictMode());
  const [maxSentences, setMaxSentences] = useState<number>(() => getDiscussionMaxSentences());

  useEffect(() => {
    // ensure HTML slider stays in sync when storage changes elsewhere
    setPreset(getDiscussionPreset());
    setStrictMode(getDiscussionStrictMode());
    setMaxSentences(getDiscussionMaxSentences());
  }, []);

  const handlePresetChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as DiscussionPresetKey;
    setPreset(value);
    setDiscussionPreset(value);
  };

  const handleStrictModeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setStrictMode(checked);
    setDiscussionStrictMode(checked);
  };

  const handleMaxSentencesChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    setMaxSentences(value);
    setDiscussionMaxSentences(value);
  };

  return (
    <div className="flex h-full flex-col gap-6 px-5 pb-8 pt-5">
      <header>
        <h1 className="text-xl font-semibold text-white">Einstellungen</h1>
        <p className="mt-1 text-sm text-white/70">
          Feinjustiere den Diskussionsmodus für kurze, meinungsstarke Runden.
        </p>
      </header>

      <section className="bg-corporate-bg-card/80 space-y-4 rounded-2xl border border-white/10 p-5 shadow-[0_18px_48px_-28px_rgba(6,10,26,0.75)]">
        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
          Diskussionen
        </h2>

        <div className="space-y-1">
          <label htmlFor="discussion-preset" className="text-sm font-medium text-white">
            Standard-Stil
          </label>
          <select
            id="discussion-preset"
            value={preset}
            onChange={handlePresetChange}
            className="focus:border-corporate-accent-primary/60 focus:ring-corporate-accent-primary/30 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2"
          >
            {discussionPresetOptions.map((option) => (
              <option key={option.key} value={option.key} className="text-slate-900">
                {option.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-white/60">
            Entscheidet über Vibe und Grundhaltung der Antworten.
          </p>
        </div>

        <div className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
          <div>
            <p className="text-sm font-medium text-white">Strikter Modus</p>
            <p className="text-xs text-white/60">
              Bei zu langen Antworten wird automatisch „kürzer“ nachgelegt.
            </p>
          </div>
          <label className="inline-flex items-center gap-2 text-sm text-white">
            <input
              type="checkbox"
              checked={strictMode}
              onChange={handleStrictModeChange}
              className="focus:ring-corporate-accent-primary/40 h-4 w-4 rounded border-white/20 bg-white/10 text-corporate-accent-primary"
            />
            Aktiv
          </label>
        </div>

        <div className="space-y-2">
          <label htmlFor="discussion-max-sentences" className="text-sm font-medium text-white">
            Maximale Satzanzahl: {maxSentences}
          </label>
          <input
            id="discussion-max-sentences"
            type="range"
            min={5}
            max={10}
            step={1}
            value={maxSentences}
            onChange={handleMaxSentencesChange}
            className="w-full"
          />
          <p className="text-xs text-white/60">Gilt für neue Sessions. Minimum sind 5 Sätze.</p>
        </div>
      </section>
    </div>
  );
}
