# Disa AI Component Library

This document describes the unified component library for the Disa AI application.

## Design Principles

All components follow these principles:

- Accessibility-first with proper ARIA attributes and keyboard navigation
- Responsive design using Tailwind CSS utilities
- Consistent theming using CSS variables from the design system
- Touch-friendly with minimum 44px touch targets
- Consistent visual design using CVA (Class Variance Authority)

## Core Components

### Button

- Variants: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`, `accent`, `brand`, `brand-soft`, `neo-medium`, `neo-subtle`, `neumorphic`
- Sizes: `sm` (44px), `default` (44px), `lg` (56px), `icon` (44px square)
- Features: Dramatic animation option, disabled states, loading states

### Card

- Variants: `default`, `outline`, `flat`
- Tones: `neo-raised`, `neo-subtle`, `neo-inset`, `neo-floating`, `neo-glass`
- Interactivity: `none`, `basic`, `gentle`, `glow`, `glow-accent`
- Features: Selectable, clickable, with headers, footers, and content sections

### Input

- Variants: `default`, `neo-subtle`, `neo-inset`, `ghost`
- Sizes: `sm` (44px), `md` (44px), `lg` (56px)
- Features: Placeholder support, disabled states, focus states

### Textarea

- Sizes: `default` (min-height 80px), `sm` (min-height 60px), `lg` (min-height 120px)
- Features: Resizable option, disabled states, focus states

### Badge

- Variants: `default`, `secondary`, `destructive`, `outline`, `success`, `warning`, `info`, `accent`
- Sizes: `sm`, `md`, `lg`

### Avatar

- Variants: `default`, `with-border`, `rounded`, `square`
- Features: Support for initials, fallback icons

### Dialog

- Features: Accessible modal dialogs with proper focus management
- Components: `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogFooter`, etc.

### Tooltip

- Features: Accessible tooltips with proper positioning
- Variants: Different positioning options

### Dropdown Menu

- Features: Accessible dropdown menus with keyboard navigation
- Components: `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, etc.

### Tabs

- Features: Accessible tab interfaces
- Components: `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`

### Switch

- Features: Accessible toggle switches with proper ARIA attributes

### Table

- Components: `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`, `TableFooter`

## Usage Guidelines

### Theming

All components use CSS variables defined in `src/styles/theme.css` for consistent styling.

- Use semantic color tokens: `--accent`, `--success`, `--warning`, etc.
- Use spacing tokens: `--space-sm`, `--space-md`, etc.
- Use typography tokens: `--font-size-body`, `--line-height-body`, etc.

### Accessibility

- All interactive elements must meet WCAG minimum touch target size (44px)
- Proper ARIA attributes for screen readers
- Keyboard navigation support
- Focus indicators for keyboard users

### Responsive Design

- Components adapt to different screen sizes
- Touch-friendly on mobile devices
- Desktop-optimized interactions

## Component Variants Standards

### Button Variants

- `default`: Primary action, neutral styling
- `secondary`: Secondary action, subtle styling
- `destructive`: Destructive actions (delete, remove)
- `ghost`: Minimal styling for non-primary actions
- `outline`: Bordered styling for important but non-primary actions
- `accent`: For key actions with accent color
- `brand`: For brand-primary actions
- `neumorphic`: For neumorphic design language

### Size Standards

- `sm`: 44px minimum touch target
- `md/default`: 44px minimum touch target
- `lg`: 56px for important actions
- `icon`: 44px square for icon-only buttons

## Development Guidelines

### Creating New Components

1. Use CVA (Class Variance Authority) for consistent variant management
2. Follow the same import and export patterns as existing components
3. Use design system tokens for consistent styling
4. Ensure accessibility with proper ARIA attributes
5. Include proper TypeScript interfaces for props
6. Test with keyboard navigation and screen readers

### Component Structure

```
ComponentName.tsx - Main component file
ComponentName.stories.tsx - Storybook stories (future)
ComponentName.test.tsx - Component tests
```

### Naming Conventions

- Use PascalCase for component names
- Use camelCase for utility functions
- Use kebab-case for CSS class names (when needed)
- Use consistent prop naming across components
