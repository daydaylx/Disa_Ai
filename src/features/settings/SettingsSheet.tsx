import { useEffect, useState } from "react";
import { useClient } from "@/lib/client";

export default function SettingsSheet() {
  const { apiKey, setApiKey } = useClient();
  const [val, setVal] = useState<string>("");

  useEffect(() => {
    setVal(apiKey ?? "");
  }, [apiKey]);

  return (
    <div className="p-4 space-y-3">
      <h2 className="text-lg font-semibold">OpenRouter</h2>
      <label className="block text-sm">API Key</label>
      <input
        className="border rounded px-2 py-1 w-full"
        placeholder="sk-or-v1-…"
        value={val}
        onChange={(e) => {
          const v = (e.target as HTMLInputElement).value;
          setVal(v);
          setApiKey(v); // immer string, niemals null
        }}
        aria-label="OpenRouter API Key"
        spellCheck={false}
      />
      <p className="text-xs text-zinc-500">
        Der Key wird lokal im Browser gespeichert (localStorage).
      </p>
    </div>
  );
}
