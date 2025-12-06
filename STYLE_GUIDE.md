# Disa AI - Quick Style Guide

> **Modern Slate Glass Design System**
> Mobile-first | Calm & productive | Minimal noise | Clear hierarchy

---

## 🎨 Color Usage

### Primary Colors (Use These Most)

| Color | Usage | Class |
|-------|-------|-------|
| **Indigo** `#6366f1` | Primary CTAs, focus states, Send button | `bg-accent-primary` / `text-accent-primary` |
| **Purple** `#8b5cf6` | Brand identity, active roles, premium features | `bg-accent-secondary` / `text-accent-secondary` |
| **Cyan** `#06b6d4` | Links, info messages, tertiary actions | `bg-accent-tertiary` / `text-accent-tertiary` |

### Backgrounds & Surfaces

| Level | Color | Usage | Class |
|-------|-------|-------|-------|
| **App** | `#131314` | Page background | `bg-bg-app` |
| **Surface 1** | `#1E1E20` | Cards, panels | `bg-surface-1` |
| **Surface 2** | `#27272A` | Inputs, hover states | `bg-surface-2` |
| **Surface 3** | `#3F3F46` | Active states | `bg-surface-3` |
| **Inset** | `#09090B` | Code blocks, deep zones | `bg-surface-inset` |

### Text Colors

| Level | Color | Usage | Class |
|-------|-------|-------|-------|
| **Primary** | `#F4F4F5` | Main text, headings | `text-ink-primary` |
| **Secondary** | `#A1A1AA` | Supporting text | `text-ink-secondary` |
| **Tertiary** | `#71717A` | Meta info, timestamps | `text-ink-tertiary` |
| **Muted** | `#52525B` | Disabled states | `text-ink-muted` |

### Borders

| Level | Opacity | Usage | Class |
|-------|---------|-------|-------|
| **Default** | `10%` | Standard borders (most common) | `border` |
| **Subtle** | `5%` | Very subtle separation | `border-subtle` |
| **Medium** | `15%` | Interactive elements | `border-medium` |
| **Strong** | `20%` | Active/focus borders | `border-strong` |

---

## 📐 Spacing (8px Grid)

| Size | Value | Usage | Class |
|------|-------|-------|-------|
| **1** | 4px | Tight spacing | `gap-1` / `p-1` |
| **2** | 8px | Small gaps | `gap-2` / `p-2` |
| **3** | 12px | Default gaps | `gap-3` / `p-3` |
| **4** | 16px | Standard padding (mobile) | `gap-4` / `p-4` / `px-4` |
| **6** | 24px | Desktop padding | `p-6` / `px-6` |
| **8** | 40px | Section spacing | `py-8` |

**Standard Pattern:**
```tsx
<div className="p-4 sm:p-6">  {/* 16px mobile, 24px desktop */}
  <div className="space-y-4">  {/* 16px vertical gaps */}
    ...
  </div>
</div>
```

---

## 🔲 Border Radius

| Size | Value | Usage | Example |
|------|-------|-------|---------|
| **rounded-xl** | 12px | **Buttons** | Send button, CTAs |
| **rounded-2xl** | 16px | **Cards** | Most cards, panels |
| **rounded-3xl** | 24px | **Input bars** | Chat input container |
| **rounded-full** | 9999px | **Pills** | Role/context pills, badges |

---

## 💫 Shadows (Use Sparingly!)

| Level | Usage | Class |
|-------|-------|-------|
| **shadow-sm** | Default cards | `shadow-sm` |
| **shadow-md** | Interactive cards, input focus | `shadow-md` |
| **shadow-lg** | Modals, dropdowns | `shadow-lg` |

**Rules:**
- ✅ Max ONE shadow per element
- ❌ No custom shadow values (use Tailwind only)
- ❌ Don't layer multiple shadows

---

## 🪟 Glass Effects (Use Rarely!)

| Class | Usage | When to Use |
|-------|-------|-------------|
| `.glass-header` | Sticky headers | Headers that overlay content |
| `.glass-overlay` | Drawers, modals | Full-screen overlays |
| `.glass-subtle` | Subtle transparency | Disabled states, subtle backgrounds |

**Rules:**
- ✅ Only for functional purposes (headers, overlays)
- ❌ Not for static cards, message bubbles, inputs

---

## 📝 Typography

### Hierarchy

```tsx
<h1 className="text-2xl font-semibold">  {/* 24px */}
<h2 className="text-xl font-semibold">   {/* 20px */}
<h3 className="text-lg font-semibold">   {/* 18px */}
<h4 className="text-base font-semibold"> {/* 16px */}

<p className="text-base">        {/* Body: 16px */}
<p className="text-sm">         {/* Small: 14px */}
<span className="text-xs">      {/* Caption: 12px */}
<span className="text-[11px]">  {/* Tiny: 11px - use sparingly! */}
```

### Font Families

- **Sans-serif:** Inter (primary)
- **Monospace:** JetBrains Mono

---

## 🎴 Component Patterns

### Button Variants

```tsx
<Button variant="primary">    {/* Indigo, white text */}
<Button variant="secondary">  {/* Surface-2, high contrast */}
<Button variant="ghost">      {/* Transparent, subtle hover */}
<Button variant="outline">    {/* Border only */}
<Button variant="destructive"> {/* Red text, danger */}
```

### Card Variants

```tsx
<Card variant="default">    {/* Standard with border + shadow-sm */}
<Card variant="flat">       {/* No border, no shadow */}
<Card variant="interactive"> {/* Clickable with hover state */}
<Card variant="elevated">   {/* Surface-2 with shadow-md */}
<Card variant="premium" withAccent accentColor="secondary">
  {/* Brand card with purple accent strip */}
</Card>
```

### Context Pills (Visual Hierarchy)

```tsx
{/* PRIMARY: Role - Larger, purple accent when active */}
<button className="h-10 flex-[1.3] rounded-full border
  border-accent-secondary/30 bg-accent-secondary/12
  text-accent-secondary shadow-sm">

{/* SECONDARY: Settings - Smaller, subtle */}
<SelectTrigger className="h-9 flex-1 rounded-full border
  glass-subtle text-ink-tertiary">
```

---

## 📱 Mobile-First Patterns

### Responsive Padding

```tsx
className="px-4 sm:px-6"  // 16px mobile, 24px desktop
className="p-4 sm:p-6"    // Consistent all-around padding
```

### Touch Targets

- **Minimum:** 44x44px (Apple HIG)
- **Buttons:** `h-10` (40px) to `h-12` (48px)
- **Pills:** `h-9` (36px) to `h-10` (40px)

### Viewport Height

```tsx
// ✅ Use this (accounts for mobile browser chrome)
className="h-[calc(var(--vh,1vh)*100)]"
// OR
className="h-dvh"

// ❌ Don't use this
className="h-screen" // or h-[100vh]
```

---

## ✅ Best Practices

### DO

- Use design tokens exclusively (no raw hex)
- Test on real mobile devices (iOS Safari!)
- Keep shadows minimal (max 1 per element)
- Use semantic HTML (`<header>`, `<nav>`, `<main>`)
- Provide focus indicators for keyboard navigation
- Respect `prefers-reduced-motion`

### DON'T

- Add multiple shadows/effects to one element
- Use glass blur on static content
- Use font sizes < 12px for body text
- Use raw `100vh` (use `100dvh` or `--vh`)
- Skip accessibility testing
- Combine too many visual effects

---

## 🎯 Visual Hierarchy Tips

### Make It Clear

1. **Primary actions** → `bg-accent-primary` + `shadow-sm`
2. **Secondary actions** → `bg-surface-2` + no shadow
3. **Tertiary actions** → `variant="ghost"` + subtle hover

### Size Differentiation

```tsx
{/* Primary CTA */}
<Button size="lg" variant="primary">

{/* Secondary action */}
<Button size="default" variant="secondary">

{/* Tertiary/destructive */}
<Button size="sm" variant="ghost">
```

### Color for Meaning

- **Indigo (Primary):** Main actions (Send, Submit, Save)
- **Purple (Secondary):** Brand elements (Active role, Premium features)
- **Cyan (Tertiary):** Links, info (Learn more, View details)
- **Red (Error):** Destructive actions (Delete, Remove, Cancel)
- **Green (Success):** Confirmations (Saved, Published, Sent)

---

## 🚀 Common Recipes

### Standard Page Layout

```tsx
<div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
  <div className="space-y-6">
    <h1 className="text-2xl font-semibold">Page Title</h1>
    <Card variant="default" padding="default">
      {/* Content */}
    </Card>
  </div>
</div>
```

### Chat Input Pattern

```tsx
<div className="rounded-3xl border bg-surface-1 p-2.5 shadow-md
     focus-within:border-accent-primary focus-within:shadow-lg">
  <textarea className="bg-transparent text-ink-primary
    placeholder:text-ink-tertiary" />
  <Button variant="primary" size="icon" />
</div>
```

### Interactive Card

```tsx
<Card
  variant="interactive"
  padding="default"
  onClick={handleClick}
  className="hover:shadow-md"
>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>...</CardContent>
</Card>
```

---

## 📚 Further Reading

- **Full Design System:** See `/src/styles/DESIGN_SYSTEM.md`
- **Tailwind Config:** See `/tailwind.config.ts`
- **Component Library:** See `/src/ui/*`

---

**Version:** 1.0 (Modern Slate Glass)
**Last Updated:** 2025-12-06
