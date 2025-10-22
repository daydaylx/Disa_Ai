# Enhanced Card System Documentation

## Overview

The enhanced Card system provides a comprehensive component library built on the Card primitive with 6 variant categories and specialized components for different use cases.

## Card Primitive

### Variant Categories

#### 1. **Tone** - Visual styling approach

- `default` - Standard card appearance
- `muted` - Subtle, less prominent styling
- `contrast` - High contrast for emphasis
- `glass` - Glass morphism effect with backdrop blur
- `solid` - Solid background color
- `outlined` - Transparent background with strong border

#### 2. **Elevation** - Shadow depth

- `none` - No shadow
- `surface` - Subtle surface shadow
- `raised` - Moderate elevation
- `overlay` - High elevation for modal-like cards
- `popover` - Maximum elevation for popover content

#### 3. **Interactive** - Motion and interaction patterns

- `false` - No interactive effects
- `gentle` - Subtle lift (1px) with shadow change
- `dramatic` - Strong lift (3px) with scale and shadow
- `subtle` - Background color change only
- `press` - Scale down on press with shadow removal
- `lift` - Medium lift (2px) with focus states
- `glow` - Glowing shadow effect on hover

#### 4. **Padding** - Internal spacing

- `none` - No padding
- `xs` - Extra small (var(--space-sm))
- `sm` - Small (var(--space-md))
- `md` - Medium (var(--space-lg))
- `lg` - Large (var(--space-xl))
- `xl` - Extra large (var(--space-2xl))

#### 5. **Size** - Maximum width constraints

- `auto` - No width constraints
- `sm` - max-w-sm
- `md` - max-w-md
- `lg` - max-w-lg
- `xl` - max-w-xl
- `full` - w-full

#### 6. **Intent** - Semantic meaning with color coding

- `default` - Neutral appearance
- `primary` - Brand colored for primary actions
- `secondary` - Secondary action styling
- `warning` - Warning state (yellow/amber)
- `error` - Error state (red)
- `success` - Success state (green)
- `info` - Information state (blue)

#### 7. **State** - Component state indication

- `default` - Normal state
- `loading` - Loading with pulse animation
- `disabled` - Disabled with reduced opacity
- `selected` - Selected with brand styling and ring
- `focus` - Focus state with ring

### Advanced Features

#### Motion Safety

All animations use `motion-safe:` prefix to respect user preferences for reduced motion.

#### Touch Targets

Interactive cards automatically get minimum 44px height for accessibility compliance.

#### Keyboard Navigation

- Enter and Space keys trigger click events
- Proper ARIA attributes (aria-disabled, aria-pressed)
- Managed tabIndex based on state

#### Compound Variants

Sophisticated combinations automatically apply:

- Intent + Interactive: Themed glow effects
- State + Interactive: Custom hover states for selected items
- Tone + Interactive: Enhanced effects for glass morphism

## Specialized Components

### StatusCard

Purpose-built for status messages with automatic icon and styling.

```tsx
<StatusCard
  status="success"
  title="Operation completed"
  description="Your changes have been saved"
  actions={<Button>Continue</Button>}
/>
```

### InteractiveCard

Advanced card with selection, menus, and specialized variants.

```tsx
<InteractiveCard
  title="Card Title"
  subtitle="Card subtitle"
  leading={<Icon />}
  trailing={<Badge />}
  selectable
  showMenu
  menuItems={[...]}
  onCardClick={() => {}}
/>
```

### DiscussionTopicCard

Specialized for discussion topics with category styling.

```tsx
<DiscussionTopicCard
  title="Discuss AI ethics"
  hint="Share your thoughts..."
  category="society"
  onTopicClick={(title) => {}}
/>
```

### ModelCard & ConversationCard

Convenience components built on InteractiveCard for specific use cases.

## Usage Examples

### Basic Usage

```tsx
import { Card, CardHeader, CardTitle, CardContent } from "./card";

<Card intent="primary" interactive="gentle" padding="md">
  <CardHeader>
    <CardTitle>Welcome</CardTitle>
  </CardHeader>
  <CardContent>Content goes here</CardContent>
</Card>;
```

### Advanced Interactions

```tsx
<Card
  intent="primary"
  interactive="glow"
  state="selected"
  clickable
  onCardClick={() => console.log("Clicked!")}
  aria-label="Select this option"
>
  Content with glowing hover effect
</Card>
```

### Loading States

```tsx
<Card state="loading" padding="md">
  <div className="animate-pulse">Loading content...</div>
</Card>
```

## Accessibility Features

- **WCAG 2.1 AA compliant** touch targets (44px minimum)
- **Keyboard navigation** with Enter/Space support
- **Screen reader support** with proper ARIA attributes
- **Motion sensitivity** with motion-safe prefixes
- **Focus management** with visible focus indicators
- **State announcements** through aria-disabled and aria-pressed

## Performance Considerations

- **Lazy loading** compatible with React.lazy()
- **Minimal bundle impact** through tree-shaking
- **Optimized animations** using CSS transforms
- **Class variance authority** for efficient class generation
- **Compound variants** reduce style duplication

## Migration Guide

### From Basic Cards

Replace basic card usage:

```tsx
// Before
<div className="bg-white p-4 rounded shadow">Content</div>

// After
<Card padding="md" elevation="surface">Content</Card>
```

### Adding Interactions

```tsx
// Before
<div onClick={handler} className="cursor-pointer hover:shadow-lg">
  Content
</div>

// After
<Card clickable onCardClick={handler} interactive="gentle">
  Content
</Card>
```

## Best Practices

1. **Use semantic intents** - Choose intent based on meaning, not just appearance
2. **Match interaction to context** - gentle for lists, dramatic for hero cards
3. **Consider motion preferences** - All animations respect motion-safe
4. **Maintain consistency** - Use the same interactive style across similar components
5. **Test accessibility** - Verify keyboard navigation and screen reader support
