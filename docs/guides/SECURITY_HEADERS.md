# Security Headers & Content Security Policy (CSP)

**Status:** ✅ Production-Ready
**Last Updated:** 2026-02-08
**Owner:** Web Security Team

## Overview

This document describes the comprehensive security headers and Content Security Policy (CSP) implemented for Disa AI to minimize XSS (Cross-Site Scripting) and other web security risks.

All security headers are configured in [`public/_headers`](/public/_headers), which Cloudflare Pages automatically applies to matching routes.

---

## Table of Contents

1. [Content Security Policy (CSP)](#content-security-policy-csp)
2. [Core Security Headers](#core-security-headers)
3. [Modern Privacy Headers](#modern-privacy-headers)
4. [CSP Exceptions & Justifications](#csp-exceptions--justifications)
5. [Debugging Guide](#debugging-guide)
6. [Testing & Verification](#testing--verification)
7. [Maintenance](#maintenance)

---

## Content Security Policy (CSP)

### Overview

Our CSP is designed with **defense-in-depth** principles while maintaining compatibility with our tech stack (Vite, React, Tailwind, PWA).

### Full CSP Directive

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' https://esm.sh https://cdn.jsdelivr.net https://static.cloudflareinsights.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net;
  img-src 'self' data: https: blob:;
  connect-src 'self' https://*.ingest.sentry.io https://*.sentry.io wss://ws.sentry.io;
  font-src 'self' data: https://fonts.gstatic.com https://cdn.jsdelivr.net;
  manifest-src 'self';
  worker-src 'self' blob:;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
  upgrade-insecure-requests
```

### Directive Breakdown

| Directive | Value | Purpose |
|-----------|-------|---------|
| `default-src` | `'self'` | Fallback for all fetch directives - only allow same-origin by default |
| `script-src` | `'self'` + CDNs | **NO `'unsafe-inline'`** - Prevents inline script XSS attacks |
| `style-src` | `'self' 'unsafe-inline'` + CDNs | ⚠️ Required for Tailwind dynamic classes |
| `img-src` | `'self' data: https: blob:` | Allows base64 images and external HTTPS images |
| `connect-src` | `'self'` + Sentry | API calls restricted to proxy (`/api/chat`) and error tracking |
| `font-src` | `'self' data:` + Google Fonts | Web fonts from Google and CDN |
| `manifest-src` | `'self'` | PWA manifest must be same-origin |
| `worker-src` | `'self' blob:` | Service Worker and Web Worker support |
| `frame-ancestors` | `'none'` | **No embedding** - Prevents clickjacking |
| `base-uri` | `'self'` | Restricts `<base>` element to same-origin |
| `form-action` | `'self'` | Forms can only submit to same-origin |
| `upgrade-insecure-requests` | - | Automatically upgrades HTTP to HTTPS |

---

## Core Security Headers

### X-Frame-Options: DENY

**Purpose:** Prevents clickjacking attacks by disallowing the page to be embedded in `<iframe>`, `<frame>`, or `<object>`.

**Why:** The app should never be embedded in another site. This works alongside CSP's `frame-ancestors 'none'`.

---

### X-Content-Type-Options: nosniff

**Purpose:** Prevents browsers from MIME-type sniffing responses away from declared content type.

**Why:** Stops attackers from disguising malicious files as harmless types (e.g., image containing JS).

---

### Strict-Transport-Security (HSTS)

**Value:** `max-age=63072000; includeSubDomains; preload`

**Purpose:** Forces browsers to only connect via HTTPS for 2 years, including all subdomains.

**Why:** Prevents downgrade attacks and ensures all traffic is encrypted.

**Note:** `preload` flag allows inclusion in browser HSTS preload lists.

---

### Referrer-Policy: strict-origin-when-cross-origin

**Purpose:** Controls how much referrer information is sent with requests.

**Behavior:**
- Same-origin requests: Send full URL as referrer
- Cross-origin HTTPS→HTTPS: Send only origin (e.g., `https://disaai.de`)
- Cross-origin HTTPS→HTTP: Send no referrer (privacy protection)

**Why:** Balances functionality (analytics, debugging) with user privacy.

---

## Modern Privacy Headers

### Permissions-Policy

**Value:** `geolocation=(), microphone=(), camera=(), payment=(), usb=(), interest-cohort=(), browsing-topics=()`

**Purpose:** Restricts browser features that the app doesn't use.

**Disabled Features:**
- 🚫 Geolocation
- 🚫 Microphone
- 🚫 Camera
- 🚫 Payment API
- 🚫 USB devices
- 🚫 FLoC (Federated Learning of Cohorts)
- 🚫 Topics API (Google's FLoC replacement)

**Why:** Reduces attack surface and enhances user privacy by blocking unnecessary APIs.

---

### Cross-Origin-Opener-Policy (COOP): same-origin

**Purpose:** Isolates the browsing context to prevent cross-origin attacks via `window.opener`.

**Trade-offs:**
- ✅ Strongest security isolation
- ⚠️ May break popup-based OAuth flows (if implemented in future)

**Fallback:** If popup auth breaks, change to `same-origin-allow-popups`.

---

### Cross-Origin-Embedder-Policy (COEP): credentialless

**Purpose:** Prevents loading untrusted cross-origin resources without explicit CORS headers.

**Mode:** `credentialless` - Loads cross-origin resources without credentials (cookies, auth).

**Why:** More permissive than `require-corp` but still provides good security.

**⚠️ Debugging:** If CDN resources (esm.sh, jsdelivr) fail to load, check this header.

---

### Cross-Origin-Resource-Policy (CORP): same-origin

**Purpose:** Prevents other origins from reading this origin's resources via `fetch`, `XMLHttpRequest`, etc.

**Why:** Protects against Spectre-like attacks by preventing cross-origin resource reads.

---

### X-Permitted-Cross-Domain-Policies: none

**Purpose:** Prevents Adobe Flash and PDF plugins from loading cross-domain policies.

**Why:** Legacy header that's still recommended for defense-in-depth.

---

## CSP Exceptions & Justifications

### 1. `'unsafe-inline'` in `style-src`

**Why Required:**
- Tailwind CSS generates dynamic inline styles based on className combinations
- React components use inline styles for dynamic theming (CSS custom properties)
- Many Radix UI components inject inline styles for positioning/animations

**XSS Risk:** Low - styles can't execute JavaScript (except in ancient IE)

**Mitigation:** All user-generated content is sanitized before rendering

**Alternative Approaches (Rejected):**
- ❌ **CSS-in-JS with nonces:** Requires server-side rendering or complex build setup
- ❌ **Pre-generate all Tailwind classes:** Impractical with ~10k+ possible combinations
- ❌ **SHA256 hashes:** Not maintainable - changes every build

---

### 2. `https://esm.sh` in `script-src`

**Why Required:**
- Dynamic ESM imports for `react-markdown` (reduces initial bundle size)
- Other optional features loaded on-demand

**XSS Risk:** Medium - CDN compromise could inject malicious code

**Mitigation:**
- SRI (Subresource Integrity) hashes on critical imports
- Version pinning in import URLs
- Service Worker caching (reduces CDN dependency after first load)

**Alternative:** Bundle react-markdown - increases initial load time by ~150KB

---

### 3. `https://cdn.jsdelivr.net` in `script-src` & `style-src`

**Why Required:**
- KaTeX (math rendering) CSS and fonts
- Prism.js (code syntax highlighting)

**XSS Risk:** Medium - CDN compromise

**Mitigation:**
- Version pinning
- Service Worker caching
- Only loads when needed (code blocks, math formulas)

---

### 4. `https://static.cloudflareinsights.com` in `script-src`

**Why Required:**
- Cloudflare Web Analytics (optional, privacy-friendly)
- Minimal performance impact (~2KB script)

**XSS Risk:** Low - Cloudflare is a trusted infrastructure provider

**Mitigation:**
- Can be disabled via build flag
- No cookies, no cross-site tracking

---

### 5. `https:` (wildcard) in `img-src`

**Why Required:**
- User-generated content in chat may include external images
- Profile avatars from external sources
- Markdown images in chat responses

**XSS Risk:** Very Low - images can't execute JavaScript (except SVG, which is sanitized)

**Mitigation:**
- SVG content is sanitized via DOMPurify
- No `<script>` tags allowed in SVG

**Alternative:** Proxy all external images through backend - adds latency and complexity

---

### 6. `data:` URIs in `img-src` & `font-src`

**Why Required:**
- Base64-encoded images (inline assets < 4KB)
- Inline fonts in CSS

**XSS Risk:** Very Low - data URIs are evaluated in context of document origin

**Mitigation:** No user input is ever encoded as data URIs

---

### 7. `blob:` in `img-src` & `worker-src`

**Why Required:**
- PWA Service Worker creates blob URLs for cached assets
- Canvas-generated images (e.g., avatars, charts)

**XSS Risk:** Very Low - blobs inherit page origin

---

### 8. Sentry Domains in `connect-src`

**Why Required:**
- Error tracking and performance monitoring
- Sends anonymized error reports to `*.ingest.sentry.io`

**Privacy:**
- No PII (personally identifiable information) sent
- Chat messages are redacted in error reports
- Can be disabled via environment variable (`VITE_SENTRY_DSN`)

**XSS Risk:** None - read-only error reporting

---

## Debugging Guide

### What Typically Breaks & How to Fix

#### 1. **Chat Stops Working After Deploy**

**Symptoms:**
- No response from AI
- Console errors: "CSP violation: connect-src"

**Likely Cause:** API endpoint not in `connect-src`

**Fix:**
```bash
# Check if using new API endpoint
grep -r "fetch(" src/api/

# If OpenRouter API called directly (should use proxy!), add to CSP:
connect-src 'self' https://openrouter.ai
```

**Correct Architecture:** Always use `/api/chat` proxy, not direct OpenRouter calls.

---

#### 2. **Styles Missing or Broken**

**Symptoms:**
- App looks unstyled
- Console errors: "CSP violation: style-src"

**Likely Causes:**
1. New inline style without `'unsafe-inline'`
2. New CDN stylesheet not in CSP

**Fix:**
```bash
# Check for new CDN stylesheets
grep -r "<link" src/ public/

# Add to CSP if needed:
style-src 'self' 'unsafe-inline' https://new-cdn.com
```

---

#### 3. **External Images Not Loading**

**Symptoms:**
- Broken image icons in chat
- Console errors: "CSP violation: img-src"

**Likely Cause:** `https:` wildcard removed from `img-src`

**Fix:**
```
img-src 'self' data: https: blob:
```

**Security Note:** Wildcard `https:` is acceptable for images - they can't execute code.

---

#### 4. **Service Worker Fails to Register**

**Symptoms:**
- PWA features broken
- Console errors: "CSP violation: worker-src"

**Likely Cause:** `worker-src` directive missing or too restrictive

**Fix:**
```
worker-src 'self' blob:
```

**Verify:**
```javascript
// Check in browser console:
navigator.serviceWorker.getRegistration().then(reg => console.log(reg))
```

---

#### 5. **Sentry Errors Not Being Sent**

**Symptoms:**
- No errors appear in Sentry dashboard
- Console errors: "CSP violation: connect-src"

**Likely Cause:** Sentry domains not in `connect-src`

**Fix:**
```
connect-src 'self' https://*.ingest.sentry.io https://*.sentry.io wss://ws.sentry.io
```

**Verify:**
```javascript
// Trigger test error:
throw new Error("CSP test error")
```

---

#### 6. **Fonts Not Loading**

**Symptoms:**
- System fallback fonts used instead of Google Fonts
- Console errors: "CSP violation: font-src"

**Likely Cause:** Google Fonts domains not in CSP

**Fix:**
```
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com
font-src 'self' data: https://fonts.gstatic.com
```

---

#### 7. **ESM Imports Failing (react-markdown)**

**Symptoms:**
- Markdown not rendering
- Console errors: "CSP violation: script-src"

**Likely Cause:** `esm.sh` not in `script-src`

**Fix:**
```
script-src 'self' https://esm.sh
```

**Alternative:** Bundle react-markdown statically (increases bundle size).

---

#### 8. **COEP Blocks CDN Resources**

**Symptoms:**
- KaTeX, Prism, or other CDN resources fail to load
- Console errors: "Cross-Origin-Embedder-Policy: require-corp"

**Likely Cause:** COEP set to `require-corp` instead of `credentialless`

**Fix:**
```
Cross-Origin-Embedder-Policy: credentialless
```

**Why:** CDNs may not send CORP headers. `credentialless` mode bypasses this by loading without credentials.

---

### Debugging Tools

#### 1. **Browser DevTools**

**Chrome/Edge:**
```
DevTools → Console → Filter by "CSP"
```

**Firefox:**
```
DevTools → Console → Filter by "Content Security Policy"
```

**Safari:**
```
Web Inspector → Console → Search "violated directive"
```

#### 2. **CSP Violation Reporting**

Enable CSP reporting in development:

```nginx
# Add to _headers (development only):
Content-Security-Policy-Report-Only: ... ; report-uri /api/csp-report
```

Create endpoint to log violations:

```typescript
// functions/api/csp-report.ts
export async function onRequest(context) {
  const report = await context.request.json()
  console.log('CSP Violation:', report)
  return new Response('OK', { status: 200 })
}
```

#### 3. **Online CSP Evaluator**

Use [CSP Evaluator](https://csp-evaluator.withgoogle.com/) to analyze your policy:

```bash
# Extract CSP from _headers:
grep "Content-Security-Policy:" public/_headers
```

Paste into evaluator to check for common mistakes.

#### 4. **Security Headers Scanner**

Test deployed site with:
- [securityheaders.com](https://securityheaders.com/?q=disaai.de)
- [Mozilla Observatory](https://observatory.mozilla.org/)

**Target Grade:** A+ on both scanners

---

## Testing & Verification

### Pre-Deployment Checklist

```bash
# 1. Build production bundle
npm run build

# 2. Verify no inline scripts in dist/index.html
grep -E '<script[^>]*>[^<]+</script>' dist/index.html
# Expected: No matches (all scripts should be external files)

# 3. Preview build locally
npm run preview

# 4. Test critical paths:
#    - [ ] Homepage loads
#    - [ ] Chat conversation works
#    - [ ] Markdown rendering works
#    - [ ] Math formulas render (KaTeX)
#    - [ ] Code blocks highlight (Prism)
#    - [ ] Service Worker registers
#    - [ ] External images load in chat

# 5. Check browser console for CSP violations
# Expected: Zero CSP violations

# 6. Verify Sentry errors are sent (if enabled)
# Trigger test error and check Sentry dashboard
```

### Post-Deployment Verification

```bash
# 1. Check headers are applied
curl -I https://disaai.de | grep -i "content-security-policy"

# 2. Scan security headers
curl https://securityheaders.com/?q=https://disaai.de&followRedirects=on

# 3. Test real-world usage
#    - Chat with AI
#    - Load external images
#    - Check PWA offline mode
#    - Verify error tracking works
```

### Automated Testing

Add to CI pipeline:

```yaml
# .github/workflows/security-headers.yml
name: Security Headers Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run build
      - name: Check for inline scripts
        run: |
          if grep -E '<script[^>]*>[^<]+</script>' dist/index.html; then
            echo "ERROR: Inline scripts found in production build"
            exit 1
          fi
      - name: Validate _headers file
        run: |
          if ! grep -q "Content-Security-Policy:" public/_headers; then
            echo "ERROR: CSP not found in _headers"
            exit 1
          fi
```

---

## Maintenance

### When to Update CSP

Update the CSP when:

1. **Adding new CDN resources**
   - Add domain to appropriate directive (`script-src`, `style-src`, etc.)
   - Document reason in this file

2. **Integrating new external APIs**
   - Add to `connect-src`
   - Prefer proxying through `/api/*` if possible

3. **Adding new analytics/monitoring tools**
   - Add domains to `script-src` and `connect-src`
   - Document privacy implications

4. **Changing build tools**
   - Vite → Webpack: May need different `script-src` rules
   - Tailwind → Vanilla CSS: Can remove `'unsafe-inline'` from `style-src`

### Version Control

Track all CSP changes in git:

```bash
# Good commit message format:
git commit -m "security(csp): add new-cdn.com to script-src for [feature]

Reason: [why this CDN is needed]
Risk: [security implications]
Mitigation: [how we're handling the risk]"
```

### Security Reviews

**Schedule:** Quarterly security header review

**Checklist:**
- [ ] Review all `'unsafe-*'` directives - can any be removed?
- [ ] Audit all third-party domains - are they still needed?
- [ ] Check for new CSP features in browsers
- [ ] Review Mozilla Observatory and SecurityHeaders.com scores
- [ ] Update this documentation with any changes

### Emergency Rollback

If CSP breaks production:

**Option 1: Revert Headers (Cloudflare Pages)**
```bash
# Revert _headers file
git revert <commit-sha>
git push origin main
# Cloudflare Pages auto-deploys in ~2 min
```

**Option 2: Temporary Bypass (Cloudflare Dashboard)**
```
1. Go to Cloudflare Dashboard → Pages → disa-ai
2. Settings → Transform Rules
3. Add rule: "Modify Response Header"
4. Remove: Content-Security-Policy
5. (Remember to re-enable after fixing!)
```

**Option 3: Report-Only Mode**
```nginx
# In _headers, change:
Content-Security-Policy: ...
# To:
Content-Security-Policy-Report-Only: ...
```

This logs violations without blocking - gives time to debug.

---

## References

- [MDN: Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [CSP Level 3 Specification](https://w3c.github.io/webappsec-csp/)
- [OWASP: Content Security Policy Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html)
- [Google CSP Evaluator](https://csp-evaluator.withgoogle.com/)
- [Can I Use: CSP](https://caniuse.com/contentsecuritypolicy)

---

## Questions or Issues?

- **Security concerns:** Open a security issue in GitHub
- **CSP violations in production:** Check [Debugging Guide](#debugging-guide) first
- **Feature requests:** Discuss trade-offs between security and functionality

**Last Reviewed:** 2026-02-08
