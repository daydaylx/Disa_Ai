# Performance Optimization Guide

## Current Performance Hotspots

| Component | Issue | Impact | Priority |
|-----------|-------|--------|----------|
| ChatHistoryPage | Loads ALL 500+ conversations | HIGH | P0 |
| ChatHistoryPage | No virtualization | HIGH | P0 |
| Dexie schema | No `updatedAt` index | HIGH | P0 |
| Dexie queries | No compound indexes | MEDIUM | P1 |
| ChatMessage | Markdown parsed every render | MEDIUM | P1 |
| ChatMessage | No intersection observer memo | LOW | P2 |

## Optimization Targets

### Target 1: Chat History List Virtualization
**Current**: `getAllConversations()` loads all conversations → `conversations.map()` renders all

**Goal**: Virtualize conversation list with pagination
- Virtual threshold: 50 conversations
- Page size: 20 conversations
- Estimated improvement: 95% faster render for 500+ convs

### Target 2: Dexie Query Optimization
**Current Schema**:
```typescript
conversations: "id, title, createdAt, updatedAt, lastActivity, model, messageCount, isFavorite"
```

**Issue**: Missing `updatedAt` index for sorting by most recent

**Optimized Schema**:
```typescript
conversations: "id, title, createdAt, [updatedAt+id], lastActivity, model, messageCount, isFavorite"
metadata: "id, title, createdAt, [updatedAt+id], model, messageCount"
```

**Improvement**: O(n log n) vs O(n) for sorted queries

### Target 3: Pagination Implementation
**New APIs**:
```typescript
// Load conversations with pagination
getPaginatedConversations(offset: number, limit: number): Promise<ConversationMetadata[]>

// Count total conversations for pagination UI
getTotalConversationsCount(): Promise<number>
```

**UI Changes**:
- Infinite scroll or "Load More" button
- Loading skeleton states
- Lazy conversation expansion (load messages on demand)

### Target 4: Markdown Rendering Memoization
**Current**: `highlightCode(content)` runs regex parse on every render

**Optimized**:
```typescript
// Cache parsed markdown by content hash
const markdownCache = new Map<string, ParsedContent>();

function getHighlightedContent(content: string): ParsedContent {
  const hash = hashContent(content);
  if (!markdownCache.has(hash)) {
    markdownCache.set(hash, highlightCode(content));
  }
  return markdownCache.get(hash)!;
}
```

**Improvement**: 80% faster for repeated content (retry, similar messages)

### Target 5: Conversation Metadata Query
**Current**: Loads full Conversation object (includes all messages)

**Optimized**: Use metadata table for list view
- Only load full Conversation when opening chat
- Estimated improvement: 90% faster list load

## Performance Benchmarks

### Before Optimization
| Metric | 500 convs | 1000 convs | 2000 convs |
|--------|-----------|-------------|--------------|
| List render | ~800ms | ~1600ms | ~3200ms |
| Memory usage | ~120MB | ~240MB | ~480MB |
| TTI | ~2.5s | ~4.5s | ~8s |

### After Optimization (Target)
| Metric | 500 convs | 1000 convs | 2000 convs |
|--------|-----------|-------------|--------------|
| List render | ~40ms | ~60ms | ~80ms |
| Memory usage | ~12MB | ~20MB | ~40MB |
| TTI | ~500ms | ~700ms | ~900ms |

## Implementation Strategy

### Phase 1: Dexie Schema Migration (HIGH)
1. Add compound index: `[updatedAt+id]`
2. Add `updatedAt` index
3. Implement `getPaginatedConversations()`
4. Add `getTotalConversationsCount()`

### Phase 2: Virtualization (HIGH)
1. Create `VirtualizedConversationList` component
2. Use `@tanstack/react-virtual` for conversation cards
3. Implement intersection observer for lazy loading
4. Add infinite scroll support

### Phase 3: Metadata-First Loading (HIGH)
1. Use `metadata` table for ChatHistoryPage
2. Load full `Conversation` only when opening chat
3. Implement `getConversationMetadata()` helper

### Phase 4: Memoization (MEDIUM)
1. Add markdown cache with LRU eviction
2. Memoize `ChatMessage` with proper key
3. Debounce syntax highlighting
4. Add `React.memo()` with proper comparison

### Phase 5: Performance Monitoring (LOW)
1. Add `PerformanceMonitor` utility (dev only)
2. Track render times with `performance.mark()`
3. Log slow renders (>100ms)
4. Add performance HUD for dev

## Testing

### Performance Tests
```typescript
// Benchmark test for 1000 conversations
test('renders 1000 conversations in <100ms', async () => {
  const conversations = generateConversations(1000);
  const startTime = performance.now();
  
  render(<ChatHistoryPage conversations={conversations} />);
  
  await waitFor(() => screen.getByTestId('conversation-list'));
  const renderTime = performance.now() - startTime;
  
  expect(renderTime).toBeLessThan(100);
});
```

### Load Testing
- Simulate 500, 1000, 2000 conversations
- Measure TTI (Time to Interactive)
- Test memory leaks with repeated navigation
- Verify no UI freezes (60fps target)

## Monitoring Commands

```bash
# Run performance tests
npm run test:perf

# Build with performance bundle analysis
npm run build -- --mode production

# Lighthouse CI run
npm run lighthouse

# Local performance profiling
npm run dev --profile
```

## Dev-Only Performance HUD

```typescript
// Show render time, memory usage, and FPS
<PerformanceHUD enabled={import.meta.env.DEV}>
  <RenderTime target={50} />
  <MemoryUsage warning={50} unit="MB" />
  <FPS target={60} />
</PerformanceHUD>
```

## Code Review Checklist

When reviewing performance changes:

- [ ] Added proper indexes to Dexie schema
- [ ] Used `React.memo()` with stable keys
- [ ] Implemented virtualization for lists >50 items
- [ ] Added pagination/infinite scroll
- [ ] Memoized expensive computations (markdown parsing)
- [ ] Used `useCallback` and `useMemo` appropriately
- [ ] Avoided inline functions in render
- [ ] Tested with realistic data volumes (500+ items)
- [ ] Measured before/after with Performance API
