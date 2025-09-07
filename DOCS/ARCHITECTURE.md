# Architecture Overview

- App shell: `src/App.tsx` with hash-based navigation between Chat, Chats, Quickstart, Settings.
- Entry: `src/main.tsx` loads global CSS layers, registers SW, mounts `<ToastsProvider><App/>`.
- State:
  - Conversations: `src/hooks/useConversations.ts` (persisted, used by Chat/Chats).
  - Settings: `src/config/settings` (API key, style, model, role, etc.).
  - Toasts: `src/components/ui/toast` context provider.
- Chat flow:
  - UI: `src/views/ChatView.tsx` renders messages, composer, streaming updates.
  - Pipeline: `src/services/chatPipeline.ts` builds messages.
  - Transport: `src/services/chatService.ts` streams chunks; abort supported.
  - Memory: `src/services/memory.ts` local per-conversation summaries.
- Models: `src/components/ModelPicker.tsx` lists/filters from `config/models`.
- PWA: `vite-plugin-pwa` injects `public/sw.js`; manifest in `public/`.
- Styling: Tailwind tokens in `src/styles/theme.css`; utilities/components across `styles/*`.
