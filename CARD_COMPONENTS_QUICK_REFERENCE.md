# Card Components Quick Reference Guide

## Component Overview

```
┌─────────────────────────────────────────┐
│ CARD PRIMITIVE SYSTEM                   │
├─────────────────────────────────────────┤
│ Location: /src/components/ui/card.tsx   │
│ Exports: Card + 5 sub-components        │
│ Pattern: Compound components with CVA   │
└─────────────────────────────────────────┘
```

### Variants Available

```
TONE:
  • default  → Standard card background
  • muted    → Subtle background, secondary text
  • contrast → Dark popover background, inverted text

ELEVATION:
  • none     → No shadow
  • surface  → Subtle shadow (default)
  • raised   → Medium elevation (hover state)
  • overlay  → Heavy shadow (modal/dialog)

INTERACTIVE:
  • false    → Static card
  • true     → Hover effects: -translate-y-[2px] + shadow-raised

PADDING:
  • none     → No padding
  • sm       → space-md (16px)
  • md       → space-lg (20px)
  • lg       → space-xl (24px)
```

---

## Specialized Cards

### Chat Messages

**Component:** `MessageBubbleCard`  
**Location:** `/src/components/chat/MessageBubbleCard.tsx`  
**Props:**

- `author: string` - Message sender name
- `body: string` - Message content
- `timestamp?: number` - Message timestamp
- `variant: "user" | "assistant"` - Message type
- `className?: string` - Additional CSS classes

**Styling:**

- Assistant: Brand-colored left rail + distinct padding
- User: Gradient right rail + different padding
- Hover: Soft lift effect (-1px translation)

---

### Model Selection

**Component:** `ModelCard`  
**Location:** `/src/components/ui/ModelCard.tsx`  
**Props:**

- `id: string` - Model identifier
- `name: string` - Display name
- `provider: string` - Provider name
- `priceIn/priceOut: number` - Pricing
- `contextTokens?: number` - Context window
- `description: string` - Model description
- `isSelected: boolean` - Selection state
- `isOpen: boolean` - Expansion state
- `onSelect: () => void` - Selection handler
- `onToggleDetails: () => void` - Details toggle

**States:**

- Unselected → border-border
- Selected → ring-brand ring-2 + shadow-raised
- Expanded → Shows details in aria-live region

---

### Role Selection

**Component:** `RoleCard`  
**Location:** `/src/components/studio/RoleCard.tsx`  
**Props:**

- `title: string` - Role name
- `description: string` - Role description
- `badge?: string` - Optional role badge
- `isActive?: boolean` - Active state
- `defaultExpanded?: boolean` - Initial expansion
- `disabled?: boolean` - Disabled state
- `onClick?: () => void` - Click handler

**Features:**

- Circle avatar with role initial
- Expandable description detail
- Active/disabled state handling
- Proper ARIA attributes

---

### Quick Actions (Tiles)

**Component:** `QuickstartTile`  
**Location:** `/src/components/chat/QuickstartTile.tsx`  
**Props:**

- `action: QuickstartAction` - Tile configuration
- `onTap: (action) => void` - Tap handler
- `onLongPress?: (action) => void` - Long-press handler
- `onTogglePin?: (id: string) => void` - Pin toggle
- `isPinned?: boolean` - Pinned state
- `isActive?: boolean` - Active state
- `isLoading?: boolean` - Loading state

**Interactions:**

- Tap (500ms): Trigger action
- Long-press (500ms): Show pin/unpin menu
- Haptic feedback on long-press
- Loading overlay while active

---

### Template Cards

**Component:** `TemplateCard`  
**Location:** `/src/components/templates/TemplateCard.tsx`  
**Props:**

- `template: ConversationTemplate` - Template data
- `onUse: (template) => void` - Use handler
- `onPreview?: (template) => void` - Preview handler
- `className?: string` - Additional classes

**Content:**

- Icon + name + description
- Estimated time + difficulty badge
- Category + tags
- Sample prompts (2 shown)
- Suggested model callout
- Action buttons

---

### Start Tiles

**Component:** `StartTiles`  
**Location:** `/src/components/chat/StartTiles.tsx`  
**Props:**

- `onTileClick: (action) => void` - Click handler

**Default Actions:**

1. New Chat
2. Developer Role
3. Creative Writer Role

**Styling:** SoftDepthSurface wrapper (subtle variant)

---

### Discussion Topics (Inline)

**Location:** `/src/pages/ChatV2.tsx` (lines 643-660)  
**Status:** Currently inline button styling (not using Card primitive)  
**Issue:** Opportunity for consolidation

```tsx
<button className="bg-surface-1/70 hover:bg-surface-2/60 border-border/40 ...">
  <span className="text-text-strong text-sm font-medium">{topic.title}</span>
  <span className="text-text-subtle text-xs">{topic.hint}</span>
</button>
```

**Recommendation:** Extract to DynamicCard or Card wrapper component

---

## Design System Tokens

### Surfaces (CSS Variables)

```
--color-surface-canvas    → Base background
--color-surface-base      → Default surface
--color-surface-subtle    → Muted cards
--color-surface-card      → Primary card background
--color-surface-raised    → Elevated elements
--color-surface-popover   → Popover elements
--color-surface-overlay   → Overlay elements
```

### Shadows

```
surface  → 0 1px 2px rgba(...), 0 0 0 1px rgba(...)
raised   → 0 4px 12px rgba(...), 0 1px 0 rgba(...)
overlay  → 0 18px 36px rgba(...), 0 0 0 1px rgba(...)
popover  → 0 22px 44px rgba(...), 0 0 0 1px rgba(...)
focus    → 0 0 0 3px rgba(58, 160, 255, 0.48) [dark mode]
```

### Border Radius

```
radius-xs   → Small corners
radius-sm   → Slightly rounded
radius-md   → Medium radius
radius-lg   → Large radius (nested elements)
radius-xl   → Extra-large (card default)
radius-pill → Circular (badges)
radius-full → Complete circle (avatars)
```

### Spacing (in Cards)

```
CardHeader:
  - gap-[var(--space-stack-sm)]
  - px-[var(--space-lg)]
  - pt-[var(--space-lg)]
  - pb-[var(--space-md)]

CardContent:
  - gap-[var(--space-stack-md)]
  - px-[var(--space-lg)]
  - pb-[var(--space-lg)]

CardFooter:
  - gap-[var(--space-inline-lg)]
  - px-[var(--space-lg)]
  - border-t border-border-divider
```

---

## Grid Layouts

### QuickstartGrid

```
grid grid-cols-2 gap-4 p-4
├─ QuickstartTile (96px min-height)
├─ QuickstartTile
└─ QuickstartTile ...
```

### ModelCard Grid

```
grid gap-4 sm:grid-cols-2 lg:grid-cols-3
├─ ModelCard
├─ ModelCard
├─ ModelCard
└─ ModelCard ...
```

### RoleCard Organization

```
By Category
├─ Alltag
│  ├─ RoleCard
│  └─ RoleCard
├─ Business & Karriere
│  ├─ RoleCard
│  └─ RoleCard
└─ ...
```

---

## Accessibility Features

### Semantic HTML

- Uses `<article>` for message and model cards
- Uses `<button>` for interactive cards
- Uses `<header>` and `<footer>` sub-components

### ARIA Attributes

```
aria-pressed={isSelected}     → Selection state
aria-expanded={expanded}      → Expansion state
aria-controls={detailId}      → Detail association
aria-label={description}      → Screen reader label
aria-live="polite"            → Dynamic updates
```

### Focus Management

```
focus-visible:outline-2
focus-visible:outline-offset-2
focus-visible:outline-[color:var(--color-border-focus)]
```

### Keyboard Support

- Enter/Space for card activation
- Tab for navigation
- Proper focus order maintained

---

## Common Issues & Solutions

### Issue 1: Inconsistent Card Styling

**Problem:** Discussion topics use inline buttons instead of Card primitive  
**Solution:** Consolidate to DynamicCard component  
**Effort:** 1-2 hours

### Issue 2: No Loading States

**Problem:** Cards don't show loading feedback  
**Solution:** Add `isLoading` prop to Card primitive  
**Effort:** 1-2 hours

### Issue 3: No Error States

**Problem:** Error handling at page level only  
**Solution:** Add `tone: "error"` variant  
**Effort:** 1-2 hours

### Issue 4: Touch Targets Not Standardized

**Problem:** Interactive elements may be < 44x44px  
**Solution:** Define `min-h-touch-comfortable` default  
**Effort:** 1 hour

### Issue 5: Large Lists Performance

**Problem:** All cards render simultaneously  
**Solution:** Implement virtualization (react-window)  
**Effort:** 4-6 hours

---

## Usage Examples

### Basic Card

```tsx
<Card padding="md">
  <CardHeader>
    <CardTitle>My Card</CardTitle>
    <CardDescription>Description text</CardDescription>
  </CardHeader>
  <CardContent>Content goes here</CardContent>
</Card>
```

### Interactive Card

```tsx
<Card interactive padding="md" onClick={handleClick}>
  <CardHeader>
    <CardTitle>Clickable Card</CardTitle>
  </CardHeader>
  <CardContent>Click me!</CardContent>
</Card>
```

### Muted Card

```tsx
<Card tone="muted" elevation="surface" padding="sm">
  <CardContent>Subtle background card</CardContent>
</Card>
```

### With Footer Actions

```tsx
<Card padding="lg">
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
  <CardFooter>
    <Button variant="outline">Cancel</Button>
    <Button>Save</Button>
  </CardFooter>
</Card>
```

---

## Performance Tips

1. **Memoize Cards:** Wrap in React.memo if re-rendered frequently
2. **Virtualize Large Lists:** Use react-window for 50+ cards
3. **Lazy Load Details:** Expand/collapse expensive content
4. **CSS Containment:** Use `contain: layout` on cards
5. **Avatar Optimization:** Lazy load avatar images

---

## Migration Checklist

If consolidating inline cards to Card primitive:

- [ ] Create new component (e.g., DynamicCard)
- [ ] Use Card primitive as base
- [ ] Apply consistent padding (md variant)
- [ ] Ensure interactive hover effects
- [ ] Test focus states
- [ ] Verify ARIA attributes
- [ ] Check color contrast
- [ ] Test on mobile (touch targets)
- [ ] Update related tests
- [ ] Document in Storybook

---

## Files Summary

**Total Lines:** ~1200 lines of card-related code

### Core (2 files)

- card.tsx: 135 lines
- primitives/Card.tsx: 2 lines

### Specialized (6 files)

- MessageBubbleCard.tsx: 84 lines
- ModelCard.tsx: 145 lines
- RoleCard.tsx: 101 lines
- QuickstartTile.tsx: 140 lines
- TemplateCard.tsx: 163 lines
- StartTiles.tsx: 100 lines

### Supporting (4 files)

- Glass.tsx: 46 lines
- QuickstartGrid.tsx: 115 lines
- MemoryPanel.tsx: 110+ lines
- ModelPicker.tsx: 100+ lines

---

## Next Steps

**Immediate (1 week):**

1. Consolidate discussion topic cards
2. Add loading state to Card
3. Create CardSkeleton component

**Short-term (2-3 weeks):** 4. Add error state variant 5. Standardize touch targets 6. Improve overflow handling

**Medium-term (1 month):** 7. Implement virtualization 8. Create Storybook stories 9. Audit accessibility

---

**Document Generated:** October 22, 2025  
**Analysis Scope:** Complete codebase  
**Total Components Reviewed:** 8 main + 4 supporting  
**Recommendations:** 9 improvements identified  
**Priority Distribution:** 3 high, 3 medium, 3 low
