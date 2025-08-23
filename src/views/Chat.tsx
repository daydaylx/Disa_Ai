import * as React from "react";
import { chatOnce, chatStream, getModelFallback, type Msg } from "../api/openrouter";
import { addExplicitMemory, updateMemorySummary } from "../api/memory";
import { useChatSession } from "../hooks/useChatSession";
import { MessageBubble } from "../components/MessageBubble";

type StyleItem = { id: string; name: string; system?: string; description?: string };
type PersonaFile = Record<string, unknown>;

function slug(s: string) { return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""); }

function normalizeStyles(data: PersonaFile): StyleItem[] {
  const candidates: unknown[] = [
    (data as any).styles,
    (data as any)?.persona?.styles,
    (data as any).stile,
    (data as any).templates,
    (data as any).personas,
  ].filter(Boolean);

  let arr: any[] = [];
  for (const c of candidates) {
    if (Array.isArray(c) && c.length) { arr = c as any[]; break; }
  }
  if (!Array.isArray(arr)) return [];

  const out = arr.map<StyleItem>((raw, i) => {
    const r: any = raw || {};
    const name: string = r.name ?? r.title ?? r.label ?? `Style ${i + 1}`;
    const id: string = (r.id ?? r.key ?? slug(name)) || `style-${i + 1}`;
    const sys = r.system ?? r.prompt ?? r.systemPrompt ?? r.sys;
    const desc = r.description ?? r.desc ?? r.about;
    const obj: StyleItem = { id: String(id), name: String(name) } as StyleItem;
    if (typeof sys === "string") (obj as any).system = sys;
    if (typeof desc === "string") (obj as any).description = desc;
    return obj;
  }).filter(s => s.name);

  const seen = new Set<string>();
  return out.filter(s => (seen.has(s.id) ? false : (seen.add(s.id), true)));
}

function usePersonaStyles() {
  const [styles, setStyles] = React.useState<StyleItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      const bust = String(((import.meta as any)?.env?.VITE_BUILD_ID) ?? Date.now());
      // Wichtig: relative Pfade, damit keine Cross-Origin/SW-Scope-Späße passieren
      const urls = [
        `/persona.json?v=${bust}`,
        `persona.json?v=${bust}`,
      ];

      let lastErr: any = null;

      for (const url of urls) {
        try {
          const res = await fetch(url, {
            cache: "no-store",
            headers: {
              "accept": "application/json",
              "cache-control": "no-cache",
              "pragma": "no-cache",
            },
          });

          const ct = res.headers.get("content-type") || "";
          const body = await res.text();

          if (!res.ok) throw new Error(`HTTP ${res.status} (${url})`);

          // Häufiger Fehler: Vercel SPA-Rewrite liefert index.html -> Content-Type text/html oder HTML-Text
          if (!ct.includes("application/json") && /^\s*</.test(body)) {
            throw new Error(`Got HTML instead of JSON (${url})`);
          }

          let data: PersonaFile;
          try {
            data = ct.includes("application/json") ? JSON.parse(body) : JSON.parse(body);
          } catch (e) {
            throw new Error(`Invalid JSON in ${url}`);
          }

          const list = normalizeStyles(data);
          if (!list.length) throw new Error(`Keine gültigen Stile in ${url}`);

          if (!alive) return;
          setStyles(list);
          console.warn("[persona] loaded from", url, "styles:", list.length);
          lastErr = null;
          break; // success
        } catch (e) {
          lastErr = e;
          console.warn("[persona] failed", url, e);
          continue; // try next
        }
      }

      if (lastErr) {
        if (!alive) return;
        setError(lastErr instanceof Error ? lastErr.message : String(lastErr));
      }
      setLoading(false);
    })();
    return () => { alive = false; };
  }, []);

  return { styles, loading, error };
}

function QuickChip({ active, children, onClick }: { active?: boolean; children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={[
        "rounded-xl px-3 py-1.5 text-sm transition border",
        active ? "bg-violet-600 text-white border-violet-500" : "bg-white/5 text-zinc-200 border-white/10 hover:bg-white/10"
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export default function Chat() {
  const { session, append, appendAssistantPlaceholder, appendAssistantDelta, setMemory, lastWindow } = useChatSession();
  const [draft, setDraft] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const [ab, setAb] = React.useState<AbortController | null>(null);
  const [noteOpen, setNoteOpen] = React.useState(false);
  const [noteText, setNoteText] = React.useState("");

  const { styles, loading: stylesLoading, error: stylesError } = usePersonaStyles();
  const [styleId, setStyleId] = React.useState<string | null>(() => {
    try { return localStorage.getItem("disa_style_id"); } catch { return null; }
  });

  React.useEffect(() => {
    try {
      if (styleId) localStorage.setItem("disa_style_id", styleId);
      else localStorage.removeItem("disa_style_id");
    } catch { /* noop */ void 0; }
  }, [styleId]);

  const currentStyle = React.useMemo<StyleItem | null>(() => styles.find(s => s.id === styleId) ?? null, [styles, styleId]);

  const listRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => { listRef.current?.scrollTo({ top: listRef.current.scrollHeight }); }, [session.messages.length]);

  async function runSend() {
    if (!draft.trim() || sending) return;
    const model = getModelFallback();
    const controller = new AbortController();
    setAb(controller);
    setSending(true);

    const msgs: Msg[] = [];
    if (currentStyle?.system?.trim()) msgs.push({ role: "system", content: currentStyle.system.trim() });
    for (const m of session.messages) msgs.push({ role: m.role, content: m.text });
    msgs.push({ role: "user", content: draft });

    append("user", draft);
    setDraft("");
    appendAssistantPlaceholder();

    try {
      await chatStream(msgs, (delta) => appendAssistantDelta(delta), {
        model,
        signal: controller.signal,
        onDone: async () => {
          try {
            const updated = await updateMemorySummary({
              previousMemory: session.memory,
              recentWindow: lastWindow(24).map(m => ({ role: m.role, content: m.text })),
            });
            setMemory(updated);
          } catch { /* noop */ void 0; }
        }
      });
    } catch {
      try {
        const { text } = await chatOnce(msgs, { model, signal: controller.signal });
        appendAssistantDelta(text);
      } catch (err) {
        appendAssistantDelta(`⚠️ Fehler: ${(err as Error)?.message ?? String(err)}`);
      }
    } finally {
      setSending(false);
      setAb(null);
    }
  }

  function stop() {
    try { ab?.abort(); } catch { /* noop */ void 0; }
    setSending(false);
  }

  async function saveNote() {
    const note = noteText.trim();
    if (!note) return setNoteOpen(false);
    try {
      const updated = await addExplicitMemory({ previousMemory: session.memory, note });
      setMemory(updated);
    } catch { /* noop */ void 0; }
    setNoteText("");
    setNoteOpen(false);
  }

  const model = React.useMemo(() => {
    try { return localStorage.getItem("disa_model") ?? getModelFallback(); } catch { return getModelFallback(); }
  }, []);

  return (
    <section className="grid gap-4 lg:grid-cols-[1fr_300px]">
      {/* Left: Chat */}
      <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-zinc-300">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            <span>Modell:</span>
            <code className="text-zinc-100">{model}</code>
            {currentStyle && <span className="ml-3 text-zinc-400">Stil: <b className="text-zinc-100">{currentStyle.name}</b></span>}
          </div>
          <div className="flex items-center gap-2">
            {!sending ? (
              <button onClick={() => setNoteOpen(true)} className="rounded-lg border border-white/10 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15" title="Merke dir das">💾 Merken</button>
            ) : (
              <button onClick={stop} className="rounded-lg bg-rose-600 px-3 py-1.5 text-sm text-white hover:bg-rose-500">Stop</button>
            )}
          </div>
        </div>

        <div ref={listRef} className="h-[60vh] overflow-y-auto px-4 py-4 space-y-3">
          {session.messages.length === 0 && (
            <div className="text-sm text-zinc-400">
              Starte mit einer Frage. Du kannst oben rechts jederzeit Notizen per „Merken“ in die Memory übernehmen.
            </div>
          )}
          {session.messages.map((m, i) => (
            <div key={m.ts ?? i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
              <MessageBubble role={m.role}>{m.text}</MessageBubble>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 p-3">
          <div className="flex items-end gap-2">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); runSend(); } }}
              rows={2}
              placeholder="Schreibe etwas… (Enter sendet, Shift+Enter = neue Zeile)"
              className="min-h-[44px] w-full resize-y rounded-xl bg-black/40 px-3 py-2 text-zinc-100 placeholder:text-zinc-500 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            <button onClick={runSend} disabled={sending || !draft.trim()} className="h-[44px] shrink-0 rounded-xl bg-violet-600 px-4 font-medium text-white shadow hover:bg-violet-500 disabled:opacity-50">Senden</button>
          </div>
        </div>
      </div>

      {/* Right: Styles & Memory */}
      <aside className="space-y-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <h3 className="mb-2 font-medium">Schnellzugriff: Stile</h3>
          {stylesLoading ? (
            <div className="text-sm text-zinc-400">Lade…</div>
          ) : stylesError ? (
            <div className="text-sm text-rose-400">Fehler beim Laden: {stylesError}</div>
          ) : styles.length === 0 ? (
            <div className="text-sm text-zinc-400">Keine Stile in <code>/persona.json</code> gefunden.</div>
          ) : (
            <div className="flex flex-wrap gap-2">
              <QuickChip active={!styleId} onClick={() => setStyleId(null)}>Neutral</QuickChip>
              {styles.map(s => (
                <QuickChip key={s.id} active={styleId === s.id} onClick={() => setStyleId(s.id)}>
                  {s.name}
                </QuickChip>
              ))}
            </div>
          )}
          <p className="mt-3 text-xs text-zinc-500">Systemprompt aus dem gewählten Stil wird automatisch vorangestellt.</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <h3 className="mb-2 font-medium">Memory</h3>
          <pre className="max-h-[240px] overflow-auto whitespace-pre-wrap rounded-lg bg-black/30 p-3 text-xs text-zinc-300">
{session.memory || "— leer —"}
          </pre>
          <p className="mt-2 text-xs text-zinc-500">Wird nach Antworten automatisch verdichtet. „Merken“ fügt manuell etwas hinzu.</p>
        </div>
      </aside>

      {/* Note modal */}
      {noteOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-zinc-900 p-4">
            <h4 className="font-medium">Notiz in die Memory übernehmen</h4>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              rows={4}
              placeholder="Kurze, dauerhafte Info (Präferenzen, Regeln, Ziele …)"
              className="mt-3 w-full rounded-xl bg-black/30 px-3 py-2 text-zinc-100 placeholder:text-zinc-500 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            <div className="mt-3 flex justify-end gap-2">
              <button className="rounded-lg px-3 py-1.5 text-sm bg-white/10 hover:bg-white/15" onClick={()=>setNoteOpen(false)}>Abbrechen</button>
              <button className="rounded-lg px-3 py-1.5 text-sm bg-violet-600 text-white hover:bg-violet-500" onClick={async ()=>{ await saveNote(); }}>Speichern</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
