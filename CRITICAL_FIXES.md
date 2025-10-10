# KRITISCHE FIXES - PRIORITÄTSLISTE

## 🔴 SOFORT (Woche 1)

### 1. Service Worker Memory Leak Fix

**Datei:** `src/lib/pwa/registerSW.ts`
**Problem:** updateCheckInterval wird nie aufgeräumt

```typescript
// BEFORE (Lines 103-104)
if (updateCheckInterval) clearInterval(updateCheckInterval);
updateCheckInterval = setInterval(() => reg.update().catch(() => {}), 30 * 60 * 1000);

// AFTER - Add cleanup
window.addEventListener("beforeunload", () => {
  if (updateCheckInterval) {
    clearInterval(updateCheckInterval);
    updateCheckInterval = null;
  }
});

export function cleanupServiceWorkerTimers(): void {
  if (updateCheckInterval) {
    clearInterval(updateCheckInterval);
    updateCheckInterval = null;
  }
}
```

### 2. MutationObserver Memory Leak Fix

**Datei:** `src/hooks/useStickToBottom.ts`
**Problem:** setTimeout nach unmount

```typescript
useEffect(() => {
  if (!enabled || !shouldAutoScroll || !scrollRef.current) return;

  let timeoutId: number | null = null;

  const observer = new MutationObserver(() => {
    if (shouldAutoScroll && scrollRef.current) {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        if (scrollRef.current) scrollToBottomInstant();
        timeoutId = null;
      }, 0);
    }
  });

  observer.observe(scrollRef.current, {
    childList: true,
    subtree: true,
    characterData: true,
  });

  return () => {
    if (timeoutId) clearTimeout(timeoutId);
    observer.disconnect();
  };
}, [enabled, shouldAutoScroll, scrollToBottomInstant]);
```

### 3. Chat State Race Condition Fix

**Datei:** `src/hooks/useChat.ts`
**Problem:** Stale closures bei rapidem append

```typescript
const append = useCallback(
  async (
    message: Omit<ChatMessageType, "id" | "timestamp">,
    customMessages?: ChatMessageType[],
  ) => {
    // Use functional setState to access latest state
    let latestMessages: ChatMessageType[] = [];
    dispatch((prevState) => {
      latestMessages = customMessages || [...prevState.messages];
      return prevState; // No state change yet
    });

    const requestHistory = prepareMessages(latestMessages);
    // ... rest of logic
  },
  [prepareMessages], // Remove state.messages from dependencies
);
```

### 4. CSP Headers hinzufügen

**Datei:** `public/_headers`

```
/*
  Content-Security-Policy: default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://openrouter.ai; font-src 'self' data:; frame-ancestors 'none'; base-uri 'self'; form-action 'self'
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
```

### 5. PWA Plugin reaktivieren

**Datei:** `vite.config.ts`

```typescript
VitePWA({
  strategies: "injectManifest",
  srcDir: "public",
  filename: "sw.js",
  registerType: "prompt",
  injectRegister: false,
  devOptions: {
    enabled: false,
    type: "module",
  },
  injectManifest: {
    globPatterns: ["**/*.{js,css,html,ico,png,svg,webp,woff2,json,webmanifest}"],
    globIgnores: ["**/node_modules/**/*", "sw.js", "workbox-*.js"],
    rollupFormat: "es",
  },
  manifest: false,
}),
```

## 🟠 HOCH (Woche 2)

### 6. Storage Type Safety

**Datei:** `src/hooks/useConversations.ts`

```typescript
import { z } from "zod";

const ConversationMetaSchema = z.object({
  id: z.string(),
  title: z.string(),
  createdAt: z.number(),
  updatedAt: z.number(),
  modelId: z.string().optional(),
});

function readJson<T>(key: string, fallback: T, schema: z.ZodSchema<T>): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return schema.parse(parsed); // Runtime validation
  } catch (error) {
    console.warn("Failed to parse stored data:", error);
    return fallback;
  }
}
```

### 7. Virtualization Library

```bash
npm install @tanstack/react-virtual
```

Replace custom implementation with battle-tested library.

## 📊 IMPACT ASSESSMENT

| Fix                   | Effort | Impact   | Risk if not fixed        |
| --------------------- | ------ | -------- | ------------------------ |
| Service Worker Leak   | 2h     | High     | Production memory issues |
| MutationObserver Leak | 3h     | High     | App crashes              |
| Chat Race Condition   | 4h     | Critical | Data loss                |
| CSP Headers           | 1h     | Critical | XSS vulnerability        |
| PWA Plugin            | 2h     | Medium   | Inconsistent PWA         |

**Total Effort Week 1:** ~12 hours
**Risk Reduction:** 95% of critical production issues eliminated
