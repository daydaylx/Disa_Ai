# Mobile-First Responsive Design Guide

This guide outlines the principles and implementation details of the mobile-first responsive design system used in Disa AI.

## 1. Mobile-First Philosophy

Mobile-first design starts with designing for the smallest screen and progressively enhances the experience for larger screens. This approach ensures:

- Performance is optimized for mobile devices
- Content hierarchy is clear and focused
- Touch interactions are prioritized
- Progressive enhancement for larger screens

## 2. CSS Architecture

### 2.1 Design Tokens
The system uses CSS custom properties (variables) for consistent design:

```css
:root {
  /* Mobile layout variables */
  --layout-sidebar-width: 0px; /* Hidden on mobile */
  --layout-header-height: 4rem;
  --layout-content-padding-x: 1rem;
  --layout-content-padding-y: 1rem;
  
  /* Touch targets */
  --touch-target-minimum: 48px;
  --touch-target-comfortable: 56px;
  --touch-target-relaxed: 64px;
  --touch-target-spacious: 72px;
  
  /* Mobile spacing */
  --space-mobile-sm: 0.5rem;
  --space-mobile-md: 0.75rem;
  --space-mobile-lg: 1rem;
  --space-mobile-xl: 1.5rem;
}
```

### 2.2 Base Styles
All base styles are written for mobile devices first:

```css
.button {
  min-height: var(--touch-target-comfortable);
  padding: var(--space-mobile-sm) var(--space-mobile-lg);
  border-radius: var(--radius-button);
}
```

### 2.3 Media Queries
Progressive enhancement for larger screens:

```css
/* Tablet breakpoint */
@media (min-width: 768px) {
  :root {
    --layout-sidebar-width: 4rem;
    --layout-content-padding-x: 1.5rem;
  }
  
  .button {
    padding: var(--space-sm) var(--space-lg);
  }
}

/* Desktop breakpoint */
@media (min-width: 1024px) {
  :root {
    --layout-content-padding-x: 2rem;
  }
  
  .button {
    padding: var(--space-md) var(--space-xl);
  }
}
```

## 3. Responsive Layout Components

### 3.1 Flexbox Grid System
Mobile-first grid using flexbox:

```css
.mobile-card-grid {
  display: flex;
  flex-direction: column;
  gap: var(--space-mobile-md);
}

@media (min-width: 768px) {
  .tablet-card-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-lg);
  }
}

@media (min-width: 1024px) {
  .desktop-card-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-xl);
  }
}
```

### 3.2 Responsive Navigation
Adaptive navigation that transforms based on screen size:

```tsx
// Mobile - Bottom navigation
<MobileNavigation />

// Tablet/Desktop - Sidebar navigation
<DesktopNavigation />
```

### 3.3 Responsive Cards
Cards that adapt to different screen sizes:

```css
.mobile-card {
  width: 100%;
  border-radius: var(--radius-xl);
  padding: var(--space-mobile-md);
}

@media (min-width: 768px) {
  .tablet-card {
    padding: var(--space-md);
  }
}

@media (min-width: 1024px) {
  .desktop-card {
    padding: var(--space-lg);
  }
}
```

## 4. Touch Optimization Principles

### 4.1 Minimum Touch Target Sizes
All interactive elements must meet minimum touch target requirements:

```css
.touch-target {
  min-height: var(--touch-target-minimum); /* 48px */
  min-width: var(--touch-target-minimum);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.touch-target-preferred {
  min-height: var(--touch-target-comfortable); /* 56px */
  min-width: var(--touch-target-comfortable);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
```

### 4.2 Touch Feedback
Visual and haptic feedback for touch interactions:

```css
.touch-interactive {
  transition: none; /* Disable transitions for better touch performance */
}

.touch-interactive:active {
  transform: scale(0.95); /* Visual feedback */
  background-color: var(--active-bg); /* Color feedback */
  transition: transform var(--motion-duration-fast) var(--motion-easing-standard);
}
```

### 4.3 Gestures
Support for common mobile gestures:

```css
.swipeable {
  touch-action: pan-y; /* Allow vertical scrolling */
}

.pinchable {
  touch-action: manipulation; /* Allow zooming */
}
```

## 5. Safe Area Handling

Proper handling of device notches and safe areas:

```css
.safe-area-top {
  padding-top: env(safe-area-inset-top, 0px);
}

.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom, 0px);
}

.safe-area-left {
  padding-left: env(safe-area-inset-left, 0px);
}

.safe-area-right {
  padding-right: env(safe-area-inset-right, 0px);
}
```

## 6. Responsive Typography

Typography that scales appropriately for different screen sizes:

```css
.text-body {
  font-size: 1rem;
  line-height: 1.55;
}

@media (min-width: 768px) {
  .text-body {
    font-size: 1.125rem;
    line-height: 1.625;
  }
}

@media (min-width: 1024px) {
  .text-body {
    font-size: 1.25rem;
    line-height: 1.75;
  }
}
```

## 7. Performance Considerations

### 7.1 CSS Containment
Using CSS containment to improve rendering performance:

```css
.contained {
  contain: layout style paint;
}
```

### 7.2 Will-Change
Optimizing animations with will-change:

```css
.will-change-transform {
  will-change: transform;
}
```

### 7.3 Hardware Acceleration
Ensuring smooth animations with hardware acceleration:

```css
.gpu-accelerated {
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
}
```

## 8. Accessibility

### 8.1 Focus Management
Proper focus handling for keyboard navigation:

```css
*:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 2px;
  border-radius: var(--radius-focus);
}
```

### 8.2 Reduced Motion
Support for users who prefer reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 8.3 High Contrast
Support for users who prefer high contrast:

```css
@media (prefers-contrast: high) {
  .high-contrast-border {
    border-width: 2px;
  }
}
```

## 9. Responsive Utilities

### 9.1 Visibility Classes
Classes that control visibility based on screen size:

```css
.hide-on-mobile {
  display: none !important;
}

@media (min-width: 768px) {
  .hide-on-mobile {
    display: block !important;
  }
  
  .show-on-mobile {
    display: none !important;
  }
}
```

### 9.2 Spacing Classes
Responsive spacing utilities:

```css
.m-mobile-sm {
  margin: var(--space-mobile-sm);
}

.p-mobile-md {
  padding: var(--space-mobile-md);
}

@media (min-width: 768px) {
  .m-tablet-sm {
    margin: var(--space-sm);
  }
  
  .p-tablet-md {
    padding: var(--space-md);
  }
}
```

## 10. Implementation Checklist

### 10.1 Mobile-First Development
- [ ] Start with mobile styles first
- [ ] Use progressive enhancement for larger screens
- [ ] Test on actual mobile devices
- [ ] Ensure touch targets meet minimum requirements
- [ ] Handle safe areas properly
- [ ] Optimize for performance on mobile

### 10.2 Responsive Design
- [ ] Use flexible units (rem, em, %, vw, vh)
- [ ] Implement proper media queries
- [ ] Design for different orientations
- [ ] Consider different input methods (touch, keyboard)
- [ ] Test on various screen sizes

### 10.3 Accessibility
- [ ] Ensure proper color contrast
- [ ] Implement keyboard navigation
- [ ] Add ARIA attributes where needed
- [ ] Support screen readers
- [ ] Respect user preferences (reduced motion, high contrast)

### 10.4 Performance
- [ ] Minimize CSS and JavaScript
- [ ] Use efficient animations
- [ ] Implement lazy loading
- [ ] Optimize images for different screen sizes
- [ ] Test on slower networks

This guide ensures consistent implementation of mobile-first responsive design principles across the Disa AI application.