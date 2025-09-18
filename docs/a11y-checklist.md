# Accessibility Checklist

This checklist ensures Disa AI meets WCAG 2.1 AA standards and provides an inclusive experience for all users.

## 🔍 Automated Testing

Run automated accessibility checks:
```bash
npm run preview
node scripts/a11y-check.mjs
```

## ⌨️ Keyboard Navigation

### Focus Management
- [ ] All interactive elements are keyboard accessible (`Tab`, `Shift+Tab`)
- [ ] Focus order follows logical reading sequence (left-to-right, top-to-bottom)
- [ ] Custom components handle `Enter` and `Space` key activation
- [ ] Focus is trapped within modals/dialogs when open
- [ ] Focus returns to trigger element after modal closes

### Visible Focus Indicators
- [ ] Focus indicators are clearly visible with sufficient contrast (3:1 minimum)
- [ ] Focus indicators are not hidden by `outline: none` without replacement
- [ ] Custom focus styles maintain browser defaults or provide better alternatives

### Skip Navigation
- [ ] Skip-to-content link for screen readers (can be visually hidden until focused)
- [ ] Skip links for major page sections in complex layouts

**Implementation Example:**
```tsx
// Skip link (first focusable element)
<a href="#main-content" className="skip-link">Skip to main content</a>

// Main content area
<main id="main-content" tabIndex={-1}>
  {/* Chat interface */}
</main>
```

## 🏷️ Semantic HTML & ARIA

### Proper Roles and Labels
- [ ] Form inputs have associated labels (`<label>` or `aria-label`)
- [ ] Buttons have descriptive text or `aria-label` for icon-only buttons
- [ ] Images have meaningful `alt` attributes (or `alt=""` for decorative)
- [ ] Headings follow hierarchical structure (`h1` → `h2` → `h3`)

### Chat-Specific ARIA
- [ ] Chat messages use `role="log"` or `aria-live="polite"` for announcements
- [ ] Message history uses `role="feed"` or appropriate landmark
- [ ] Send button has `aria-label="Send message"` if only icon
- [ ] Loading states announced with `aria-live="polite"`
- [ ] Error messages associated with inputs via `aria-describedby`

**Implementation Examples:**
```tsx
// Chat message area
<div role="log" aria-live="polite" aria-label="Chat conversation">
  {messages.map(message => (
    <div key={message.id} role="article">
      <span className="sr-only">{message.sender}:</span>
      {message.content}
    </div>
  ))}
</div>

// Message input with proper labeling
<label htmlFor="message-input" className="sr-only">
  Type your message
</label>
<input
  id="message-input"
  type="text"
  placeholder="Type a message..."
  aria-describedby="message-help"
/>
<div id="message-help" className="sr-only">
  Press Enter to send, Shift+Enter for new line
</div>
```

## 🎨 Visual Design & Contrast

### Color and Contrast
- [ ] Text has minimum 4.5:1 contrast ratio against background (AA standard)
- [ ] Large text (18pt+) has minimum 3:1 contrast ratio
- [ ] UI elements have minimum 3:1 contrast ratio for boundaries
- [ ] Information is not conveyed by color alone
- [ ] Links are distinguishable from surrounding text

### Text and Typography  
- [ ] Text can be resized up to 200% without horizontal scrolling
- [ ] Line height is at least 1.5x font size
- [ ] Paragraph spacing is at least 2x font size
- [ ] Font choices prioritize readability over decoration

**Contrast Testing:**
- Use browser dev tools or WebAIM Contrast Checker
- Test in high contrast mode and dark themes
- Verify focus indicators meet contrast requirements

## 📱 Responsive & Mobile Accessibility

### Touch Targets
- [ ] Interactive elements are at least 44×44px touch targets
- [ ] Sufficient spacing between touch targets (8px minimum)
- [ ] Hover states have equivalent focus states for touch devices

### Viewport and Zoom
- [ ] Content reflows properly when zoomed to 400%
- [ ] No horizontal scrolling required at standard zoom levels
- [ ] Viewport meta tag allows user scaling: `user-scalable=yes`

## 🔊 Screen Reader Experience

### Live Regions for Dynamic Content
- [ ] Status messages use `aria-live="polite"`
- [ ] Urgent alerts use `aria-live="assertive"`
- [ ] Loading states are announced to screen readers
- [ ] Chat message arrivals are announced

### Content Structure
- [ ] Page has meaningful `<title>` that updates with context
- [ ] Main landmarks: `<header>`, `<main>`, `<nav>`, `<aside>`, `<footer>`
- [ ] Lists use proper `<ul>`, `<ol>`, `<li>` markup
- [ ] Data tables have `<caption>`, `<th>` with `scope` attributes

**Implementation Examples:**
```tsx
// Loading state announcement
<div aria-live="polite" className="sr-only">
  {isLoading && "Loading response..."}
</div>

// Status announcements
<div role="status" aria-live="polite" className="sr-only">
  {statusMessage}
</div>
```

## 🧪 Testing Procedures

### Manual Testing
1. **Keyboard-only navigation**: Unplug mouse, navigate entire app with keyboard
2. **Screen reader testing**: Test with NVDA (Windows), VoiceOver (Mac), or Orca (Linux)
3. **High contrast mode**: Enable OS high contrast and verify readability
4. **Zoom testing**: Test at 200% and 400% zoom levels

### Automated Testing
1. **axe-core**: Run `node scripts/a11y-check.mjs` for automated issues
2. **Lighthouse**: Check accessibility score in Chrome DevTools
3. **Browser extensions**: axe DevTools, WAVE, or Accessibility Insights

### User Testing
- [ ] Test with actual screen reader users when possible
- [ ] Collect feedback from users with disabilities
- [ ] Regular accessibility reviews in development cycle

## 🚨 Critical Issues (Blockers)

These issues should block deployment:

- **Images without alt text** (except decorative with `alt=""`)
- **Form inputs without labels**
- **Keyboard focus trapped or unreachable elements**
- **Insufficient color contrast** (below WCAG AA thresholds)
- **Missing page titles or heading structure**

## ⚡ Performance Impact on Accessibility

- [ ] Fast loading ensures assistive tech compatibility
- [ ] Avoid layout shifts that confuse screen readers
- [ ] Preload critical fonts to prevent text flash
- [ ] Optimize animations to respect `prefers-reduced-motion`

**CSS for Motion Sensitivity:**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 📚 Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Screen Reader Testing](https://webaim.org/articles/screenreader_testing/)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)

## 🔄 Regular Maintenance

- [ ] Include accessibility in code review process  
- [ ] Run automated tests in CI pipeline
- [ ] Quarterly manual accessibility audits
- [ ] Stay updated with WCAG guidelines and best practices
- [ ] Monitor user feedback for accessibility issues