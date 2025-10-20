# Mobile Navigation & Swipe-Open Feature

## Overview

The Disa AI application features a mobile-optimized navigation sidepanel that can be opened through multiple interaction methods, including a right-edge swipe gesture specifically designed for mobile devices.

## User Interactions

### Opening the Panel

1. **Edge Swipe (Mobile)**: Swipe from the right edge of the screen towards the left
   - Start your touch within 20px from the right edge
   - Swipe at least 40px horizontally to trigger the opening
   - The gesture is cancelled if you move more than 30px vertically (to preserve scroll behavior)

2. **Menu Button**: Click/tap the menu icon in the top-right corner
   - Works on all devices (desktop and mobile)
   - Labeled "Navigation öffnen" for screen readers

3. **Keyboard (Accessibility)**: When focused, activate the menu button with Enter or Space

### Closing the Panel

1. **Swipe Left**: When the panel is open, swipe left to close it
2. **Close Button**: Click the X button in the panel header
3. **Backdrop Click**: Click/tap the darkened area outside the panel
4. **Escape Key**: Press Escape to close (keyboard accessibility)

## Technical Implementation

### Edge Swipe Detection

The edge swipe functionality uses a 20px invisible touch area fixed to the right edge of the viewport:

- **Edge Area**: 20px wide (meeting the 16-24px requirement)
- **Horizontal Threshold**: 40px minimum movement required
- **Vertical Tolerance**: 30px maximum vertical deviation
- **Velocity Support**: Fast swipes are recognized even with less movement

### Scroll Safety

The implementation prevents conflicts with vertical scrolling:

- Gestures with >30px vertical movement are cancelled
- Horizontal browser gestures (back/forward) don't interfere
- Main content scrolling remains smooth and unaffected

### Browser Compatibility

- **Mobile**: Tested on iOS Safari and Android Chrome
- **Desktop**: Falls back to button/keyboard interaction
- **Touch Devices**: Full gesture support
- **Non-touch Devices**: Button and keyboard navigation

## Accessibility Features

### Keyboard Navigation

- **Tab**: Navigate through focusable elements within the panel
- **Escape**: Close the panel
- **Focus Trap**: Focus is contained within the open panel
- **Focus Management**: Close button receives focus when panel opens

### Screen Reader Support

- Panel has `role="navigation"` and proper `aria-label`
- Menu button has `aria-expanded` state
- `aria-controls` links button to panel
- All buttons have descriptive labels

### Motion Preferences

The implementation respects `prefers-reduced-motion`:

- Animations are disabled when user prefers reduced motion
- GPU acceleration is removed for reduced motion users
- Panel still functions fully, just without transitions

## Testing

### Unit Tests

Location: `src/components/navigation/__tests__/NavigationSidepanel.swipe.test.tsx`

Tests cover:
- Edge swipe area rendering
- Opening from right edge with sufficient movement
- Blocking opening when starting outside edge area
- Canceling gesture with excessive vertical movement
- Desktop fallback (menu button)
- Escape key functionality
- ARIA attributes

Run with: `npm run test:unit -- NavigationSidepanel.swipe.test.tsx`

### E2E Tests

Location: `tests/e2e/sidepanel-swipe.spec.ts`

Tests cover:
- Opening via menu button
- Closing via close button, Escape, and backdrop
- Simulated edge swipe gesture
- Accessibility compliance (WCAG 2.1 AA)
- Focus management

Run with: `npm run e2e -- sidepanel-swipe.spec.ts`

## Maintenance Notes

### Adjusting Thresholds

If you need to adjust the swipe sensitivity:

1. **Edge Area Width**: Modify `.sidepanel-touch-area` min-width in `src/styles/sidepanel.css`
2. **Swipe Threshold**: Adjust `SWIPE_THRESHOLD` constant in `NavigationSidepanel.tsx`
3. **Vertical Tolerance**: Adjust `VERTICAL_TOLERANCE` constant in `NavigationSidepanel.tsx`

### Adding New Navigation Items

Add items to the `NAV_ITEMS` array in `src/app/layouts/AppShell.tsx`:

```typescript
const NAV_ITEMS = [
  { to: "/path", label: "Label", icon: IconComponent },
  // ...
];
```

### Customizing Panel Appearance

Panel styles are in:
- `src/styles/sidepanel.css` - Core panel styles and optimizations
- `src/components/navigation/NavigationSidepanel.tsx` - Component-specific styling

## Known Limitations

1. **Touch Simulation in Tests**: E2E tests use synthetic touch events which may not perfectly replicate real device behavior
2. **Browser Gesture Conflicts**: Some mobile browsers may have conflicting edge gestures (e.g., iOS Safari's back swipe)
3. **Performance**: On very low-end devices, the panel animation may not be perfectly smooth

## Future Enhancements

Potential improvements for future versions:

- [ ] Configurable swipe thresholds via settings
- [ ] Haptic feedback on successful swipe (requires Web Haptics API)
- [ ] Swipe progress indicator (visual feedback during gesture)
- [ ] Support for left-handed mode (swipe from left edge)
- [ ] Panel resize on tablet devices
- [ ] Gesture training/tutorial for first-time users

## Support

For issues or questions:

1. Check that your browser supports touch events
2. Verify the edge area is not being blocked by other UI elements
3. Test on a real device, not just in browser dev tools
4. Review the browser console for any JavaScript errors

## References

- Touch Events API: https://developer.mozilla.org/en-US/docs/Web/API/Touch_events
- WCAG 2.1 Guidelines: https://www.w3.org/WAI/WCAG21/quickref/
- prefers-reduced-motion: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
