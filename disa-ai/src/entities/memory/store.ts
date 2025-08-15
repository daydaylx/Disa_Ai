import { create } from "zustand";

type MemoryState = {
  pinned: Record<string, string[]>;   // chatId -> facts
  summaries: Record<string, string>;  // chatId -> summary

  addPinned: (chatId: string, fact: string) => void;
  removePinned: (chatId: string, idx: number) => void;
  setSummary: (chatId: string, text: string) => void;
  getPinned: (chatId: string | null) => string[];
  getSummary: (chatId: string | null) => string | "";
};

export const useMemoryStore = create<MemoryState>((set, get) => ({
  pinned: {},
  summaries: {},

  addPinned: (chatId, fact) => set((s) => ({
    pinned: { ...s.pinned, [chatId]: [...(s.pinned[chatId] ?? []), fact] }
  })),

  removePinned: (chatId, idx) => set((s) => {
    const arr = [...(s.pinned[chatId] ?? [])];
    if (idx >= 0 && idx < arr.length) arr.splice(idx, 1);
    return { pinned: { ...s.pinned, [chatId]: arr } };
  }),

  setSummary: (chatId, text) => set((s) => ({
    summaries: { ...s.summaries, [chatId]: text }
  })),

  getPinned: (chatId) => (chatId ? (get().pinned[chatId] ?? []) : []),
  getSummary: (chatId) => (chatId ? (get().summaries[chatId] ?? "") : ""),
}));
