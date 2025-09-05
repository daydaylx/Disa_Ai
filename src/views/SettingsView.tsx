import React, { useState } from "react";

import { type AppSettings, type ChatStyle,loadSettings, saveSettings } from "../lib/settings/storage";

const DEFAULT_MODEL = "qwen/qwen-2.5-coder-14b-instruct";
const MODELS: string[] = [
  DEFAULT_MODEL,
  "google/gemini-1.5-pro",
  "openai/gpt-4o-mini",
  "mistralai/mixtral-8x7b-instruct"
];

export const SettingsView: React.FC = () => {
  const init: AppSettings = loadSettings();

  const [apiKey, setApiKey] = useState<string>(init.openrouterKey ?? "");
  const [model, setModel] = useState<string>(init.defaultModelId ?? DEFAULT_MODEL);
  const [style, setStyle] = useState<ChatStyle>(init.chatStyle ?? "Neutral");
  const [role, setRole] = useState<string>(init.chatRole ?? "");

  const onSave = () => {
    const trimmed = model.trim();
    const chosenModel: string = trimmed !== "" ? trimmed : DEFAULT_MODEL; // immer string
    saveSettings({
      openrouterKey: apiKey.trim(),
      defaultModelId: chosenModel,
      chatStyle: style,
      chatRole: role.trim()
    });
    alert("Gespeichert.");
  };

  return (
    <main id="main" className="safe-pad safe-bottom py-4 text-white">
      <h1 className="text-xl font-semibold mb-4">Einstellungen</h1>

      <section className="glass card-round p-4 mb-4">
        <h2 className="font-semibold mb-2">OpenRouter API-Key</h2>
        <input
          className="input w-full"
          placeholder="sk-…"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          autoComplete="off"
        />
        <p className="text-xs opacity-70 mt-2">
          Key wird lokal gespeichert (localStorage). Wir senden ihn nur an openrouter.ai.
        </p>
      </section>

      <section className="glass card-round p-4 mb-4">
        <h2 className="font-semibold mb-2">Standard-Modell</h2>
        <div className="flex flex-col gap-2">
          <select
            className="input w-full"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          >
            {MODELS.map((m) => (<option key={m} value={m}>{m}</option>))}
          </select>
          <input
            className="input w-full"
            placeholder="oder eigenes Modell (voller Bezeichner)…"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          />
        </div>
      </section>

      <section className="glass card-round p-4 mb-4">
        <h2 className="font-semibold mb-2">Stil & Rolle</h2>
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-sm opacity-80">Stil</span>
            <select
              className="input w-full mt-1"
              value={style}
              onChange={(e) => setStyle(e.target.value as ChatStyle)}
            >
              <option value="Neutral">Neutral</option>
              <option value="Anschaulich">Anschaulich</option>
              <option value="Technisch">Technisch</option>
              <option value="Locker">Locker</option>
            </select>
          </label>
          <label className="block col-span-2">
            <span className="text-sm opacity-80">Rolle (System-Hinweis)</span>
            <input
              className="input w-full mt-1"
              placeholder="z. B. 'Du bist ein kritischer Senior-Assistent…'"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </label>
        </div>
      </section>

      <div className="flex justify-end">
        <button onClick={onSave} className="tap pill btn-glow px-4 py-2 font-semibold">Speichern</button>
      </div>
    </main>
  );
};

export default SettingsView;
