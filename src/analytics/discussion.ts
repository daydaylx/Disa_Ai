export interface DiscussionAnalyticsRecord {
  timestamp: number;
  topic: string;
  preset: string;
  sentenceCount: number;
  wordCount: number;
  trimmed: boolean;
  fallbackUsed: boolean;
  questionTrimmed: boolean;
  strictMode: boolean;
}

const STORAGE_KEY = "disa:analytics:discussion";
const MAX_RECORDS = 100;

export function logDiscussionAnalytics(record: DiscussionAnalyticsRecord): void {
  try {
    const existing = getDiscussionAnalytics();
    existing.push(record);
    const trimmed = existing.slice(-MAX_RECORDS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    /* ignore analytics storage errors */
  }
}

export function getDiscussionAnalytics(): DiscussionAnalyticsRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as DiscussionAnalyticsRecord[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => typeof item === "object" && item !== null);
  } catch {
    return [];
  }
}

export function exportDiscussionAnalytics(): string {
  const records = getDiscussionAnalytics();
  return JSON.stringify(records, null, 2);
}
