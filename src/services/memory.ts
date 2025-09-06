import type { ChatMessage } from "../types/chat";

export interface MemoryFact {
  key: string;
  value: string;
}

export interface MemorySnapshot {
  scopeId: string;
  topics: string[];
  entities: string[];
  facts: MemoryFact[];
  summary: string;
  turns: number;
  lastUpdated: number;
}

const LS_PREFIX = "disa:mem:";
const MAX_TOPICS = 6;
const MAX_ENTITIES = 8;
const MAX_FACTS = 6;
const MAX_SUMMARY_CHARS = 600;

const STOPWORDS = new Set([
  "der",
  "die",
  "das",
  "und",
  "oder",
  "aber",
  "auch",
  "wenn",
  "dann",
  "weil",
  "mit",
  "ohne",
  "für",
  "von",
  "zum",
  "zur",
  "im",
  "in",
  "am",
  "an",
  "the",
  "a",
  "an",
  "and",
  "or",
  "but",
  "of",
  "to",
  "for",
  "on",
  "in",
  "at",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "ich",
  "du",
  "er",
  "sie",
  "es",
  "wir",
  "ihr",
  "sie",
  "ein",
  "eine",
  "einer",
  "eines",
  "einem",
  "einen",
  "nicht",
  "kein",
  "keine",
  "keiner",
  "keines",
  "keinem",
  "keinen",
  "so",
  "nur",
  "auch",
  "sehr",
  "mehr",
  "weniger",
  "viel",
  "viele",
  "vielen",
  "vieles",
  "you",
  "we",
  "they",
  "he",
  "she",
  "it",
  "this",
  "that",
  "these",
  "those",
]);

function safeNow(): number {
  return Date.now ? Date.now() : new Date().getTime();
}

function lsKey(scopeId: string): string {
  return `${LS_PREFIX}${scopeId}`;
}

export function loadMemory(scopeId: string): MemorySnapshot {
  const key = lsKey(scopeId);
  if (typeof window === "undefined") {
    return emptySnapshot(scopeId);
  }
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return emptySnapshot(scopeId);
    const obj = JSON.parse(raw) as Partial<MemorySnapshot>;
    if (!obj || obj.scopeId !== scopeId) return emptySnapshot(scopeId);
    const topics = Array.isArray(obj.topics) ? obj.topics : [];
    const entities = Array.isArray(obj.entities) ? obj.entities : [];
    const facts = Array.isArray(obj.facts) ? obj.facts : [];
    return {
      scopeId,
      topics: uniqueClamp(topics, MAX_TOPICS),
      entities: uniqueClamp(entities, MAX_ENTITIES),
      facts: uniqueFactsClamp(facts, MAX_FACTS),
      summary: (obj.summary ?? "").slice(0, MAX_SUMMARY_CHARS),
      turns: Math.max(0, obj.turns ?? 0),
      lastUpdated: obj.lastUpdated ?? safeNow(),
    };
  } catch {
    return emptySnapshot(scopeId);
  }
}

export function saveMemory(mem: MemorySnapshot): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(lsKey(mem.scopeId), JSON.stringify(mem));
  } catch {
    /* ignore quota errors */
  }
}

export function emptySnapshot(scopeId: string): MemorySnapshot {
  return {
    scopeId,
    topics: [],
    entities: [],
    facts: [],
    summary: "",
    turns: 0,
    lastUpdated: safeNow(),
  };
}

function uniqueClamp(arr: string[], max: number): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const x of arr) {
    const v = (x ?? "").trim();
    if (!v) continue;
    const key = v.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(v);
    if (out.length >= max) break;
  }
  return out;
}

function uniqueFactsClamp(arr: MemoryFact[], max: number): MemoryFact[] {
  const seen = new Set<string>();
  const out: MemoryFact[] = [];
  for (const f of arr) {
    const k = (f?.key ?? "").trim();
    const v = (f?.value ?? "").trim();
    if (k && v) {
      const key = `${k.toLowerCase()}=${v.toLowerCase()}`;
      if (!seen.has(key)) {
        seen.add(key);
        out.push({ key: k, value: v });
      }
    }
    if (out.length >= max) break;
  }
  return out;
}

function tokenize(text: string): string[] {
  return (text.toLowerCase().match(/[a-zäöüß0-9][a-zäöüß0-9-_.]{2,}/gi) ?? []).filter(
    (w) => w.length >= 4 && !STOPWORDS.has(w),
  );
}

function topNByFrequency(words: string[], n: number): string[] {
  const freq = new Map<string, number>();
  for (const w of words) freq.set(w, (freq.get(w) ?? 0) + 1);
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, n)
    .map(([w]) => w);
}

function extractEntities(text: string): string[] {
  const entities = new Set<string>();
  const email = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) ?? [];
  email.forEach((e) => entities.add(e));
  const handles = text.match(/[@#][\w-]{3,}/g) ?? [];
  handles.forEach((h) => entities.add(h));
  const caps = text.match(/\b([A-ZÄÖÜ][a-zäöüß]+(?:\s+[A-ZÄÖÜ0-9][\w-]+){0,2})\b/g) ?? [];
  caps.forEach((c) => {
    if (c.length >= 3) entities.add(c.trim());
  });
  const paths = text.match(/(?:\w+\/)+\w+(\.\w+)?/g) ?? [];
  paths.forEach((p) => entities.add(p));
  return uniqueClamp([...entities], MAX_ENTITIES);
}

export interface MemoryFactCandidate {
  key: string;
  value: string;
}
function extractFacts(text: string): MemoryFact[] {
  const results: MemoryFact[] = [];
  const re = /(?:^|\n|\r|\t)[-*•]?\s*([A-Za-zÄÖÜäöüß0-9 _./#@-]{2,40})\s*[:=]\s*([^\n\r;]{2,120})/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const key = (m[1] ?? "").toString().trim().replace(/\s+/g, " ");
    const val = (m[2] ?? "").toString().trim().replace(/\s+/g, " ");
    if (key && val) results.push({ key, value: val });
    if (results.length >= MAX_FACTS) break;
  }
  return uniqueFactsClamp(results, MAX_FACTS);
}

function buildSummaryFromTurns(turns: ChatMessage[], maxChars: number): string {
  const last = turns.slice(-8);
  const lines = last.map((m) => {
    const role = m.role === "assistant" ? "A" : m.role === "user" ? "U" : "S";
    let content = (m.content ?? "").replace(/\s+/g, " ").trim();
    if (content.length > 160) content = content.slice(0, 160) + " …";
    return `${role}: ${content}`;
  });
  let out = lines.join(" | ");
  if (out.length > maxChars) out = out.slice(0, maxChars - 1) + "…";
  return out;
}

export function formatMemoryForSystem(mem: MemorySnapshot): string {
  const topics = mem.topics.length ? `Topics: ${mem.topics.join(", ")}` : "";
  const entities = mem.entities.length ? `Entities: ${mem.entities.join(", ")}` : "";
  const facts = mem.facts.length
    ? "Facts: " + mem.facts.map((f) => `${f.key}=${f.value}`).join("; ")
    : "";
  const summary = mem.summary ? `Summary: ${mem.summary}` : "";
  return [topics, entities, facts, summary].filter(Boolean).join("\n");
}

export function updateMemory(scopeId: string, recentTurns: ChatMessage[]): MemorySnapshot {
  const mem = loadMemory(scopeId);
  const joined = recentTurns.map((t) => t.content ?? "").join("\n");

  const top = topNByFrequency(tokenize(joined), MAX_TOPICS);
  const mergedTopics = uniqueClamp([...top, ...mem.topics], MAX_TOPICS);

  const ents = extractEntities(joined);
  const mergedEnts = uniqueClamp([...ents, ...mem.entities], MAX_ENTITIES);

  const facts = extractFacts(joined);
  const mergedFacts = mergeFacts(mem.facts, facts, MAX_FACTS);

  const summary = buildSummaryFromTurns(recentTurns, MAX_SUMMARY_CHARS);

  const next: MemorySnapshot = {
    scopeId,
    topics: mergedTopics,
    entities: mergedEnts,
    facts: mergedFacts,
    summary,
    turns: (mem.turns ?? 0) + 1,
    lastUpdated: safeNow(),
  };
  saveMemory(next);
  return next;
}

function mergeFacts(oldFacts: MemoryFact[], newFacts: MemoryFact[], cap: number): MemoryFact[] {
  const byKey = new Map<string, MemoryFact>();
  for (const f of oldFacts) byKey.set(f.key.toLowerCase(), { key: f.key, value: f.value });
  for (const f of newFacts) {
    const k = f.key.toLowerCase();
    const prev = byKey.get(k);
    if (!prev || prev.value !== f.value) byKey.set(k, { key: f.key, value: f.value });
  }
  return uniqueFactsClamp([...byKey.values()], cap);
}
