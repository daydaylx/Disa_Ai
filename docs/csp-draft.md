# Content Security Policy (CSP) - Draft

**Status**: DRAFT - Not yet activated

## Proposed CSP Headers

This document contains CSP header proposals for enhanced security. **Do NOT activate yet** - needs testing and adjustment.

### Core CSP Directive (strict)

```
Content-Security-Policy:
  default-src 'none';
  script-src 'self' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob:;
  font-src 'self';
  connect-src 'self' https://openrouter.ai https://*.openrouter.ai;
  manifest-src 'self';
  worker-src 'self' blob:;
  base-uri 'self';
  form-action 'none';
  frame-ancestors 'none';
  object-src 'none';
  upgrade-insecure-requests;
```

### Alternative CSP (gradual)

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob:;
  connect-src 'self' https://openrouter.ai https://*.openrouter.ai;
  frame-ancestors 'none';
  object-src 'none';
```

## Implementation Notes

### Why 'unsafe-eval'?

- React development mode and HMR require eval()
- Vite build process uses dynamic imports
- Can be removed in production builds with different headers per environment

### Why 'unsafe-inline' for styles?

- Tailwind CSS and CSS-in-JS solutions inject inline styles
- Vite injects style blocks during development
- Alternative: Use nonce-based CSP (more complex)

### Connect-src domains

- `openrouter.ai` - API endpoints
- `*.openrouter.ai` - CDN and additional API endpoints
- Remove other domains that aren't needed

## Testing Strategy

1. Add CSP in report-only mode first:

   ```
   Content-Security-Policy-Report-Only: [policy]
   Report-To: {"group":"csp","endpoints":[{"url":"/api/csp-report"}]}
   ```

2. Monitor reports and adjust policy

3. Switch to enforcing mode after validation

## Files to update when activating

- `/public/_headers` - Add CSP directives
- OR `/public/_redirects` - Alternative for some CDN providers
- OR `index.html` - Meta tag fallback (less secure)

## Risk Assessment

- **High**: Breaking the app if policy too restrictive
- **Medium**: 'unsafe-eval' reduces security benefit
- **Low**: API connections might need adjustment if OpenRouter changes domains

## Activation Checklist (for later phases)

- [ ] Test policy in report-only mode
- [ ] Verify all API calls work
- [ ] Check service worker functionality
- [ ] Test production build
- [ ] Monitor error logs after activation
- [ ] Have rollback plan ready
