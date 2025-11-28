export interface SwipeStack {
  stack: string[]; // List of chat IDs, max 5
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  // messages are loaded separately or part of this depending on architecture
  // checking existing types is good practice first.
  pinned?: boolean;
}

export interface BookNavigationState {
  allChats: ChatSession[];
  activeChatId: string | null;
  swipeStack: string[]; // IDs of chats in the "book" history (max 5)
}
