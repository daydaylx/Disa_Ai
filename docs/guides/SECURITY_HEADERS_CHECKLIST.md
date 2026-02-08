# Security Headers Quick Reference & Debugging Checklist

**Quick reference for diagnosing CSP issues in production.**

---

## 🚨 Emergency Triage

### Is the entire app broken?

1. **Check browser console for CSP violations:**
   ```
   Chrome: DevTools → Console → Filter "CSP"
   Firefox: Console → Filter "Content Security Policy"
   ```

2. **Quick fix - Deploy with report-only mode:**
   ```bash
   # In public/_headers, temporarily change:
   Content-Security-Policy: ...
   # To:
   Content-Security-Policy-Report-Only: ...

   git add public/_headers
   git commit -m "security: CSP report-only mode for debugging"
   git push
   ```
   This logs violations without blocking - gives you time to diagnose.

3. **Rollback if critical:**
   ```bash
   git revert HEAD
   git push
   ```

---

## 🔍 Common Issues & Quick Fixes

### Issue: Chat not working

**Console error:**
```
Refused to connect to '...' because it violates CSP connect-src
```

**Fix:**
```nginx
# In public/_headers, line ~40:
connect-src 'self' https://*.ingest.sentry.io https://*.sentry.io

# If using direct OpenRouter (NOT RECOMMENDED):
connect-src 'self' https://openrouter.ai https://*.ingest.sentry.io
```

**Verify:** Restart chat conversation, check console.

---

### Issue: Styles look broken

**Console error:**
```
Refused to apply inline style because it violates CSP style-src
```

**Fix:**
```nginx
# Ensure 'unsafe-inline' is present:
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net
```

**Note:** `'unsafe-inline'` is required for Tailwind. Cannot be removed without major refactor.

---

### Issue: External images not loading

**Console error:**
```
Refused to load image '...' because it violates CSP img-src
```

**Fix:**
```nginx
# Add https: wildcard:
img-src 'self' data: https: blob:
```

**Security note:** `https:` wildcard is safe for images - they can't execute code.

---

### Issue: Markdown not rendering

**Console error:**
```
Refused to load script from 'https://esm.sh/...'
```

**Fix:**
```nginx
# Add esm.sh to script-src:
script-src 'self' https://esm.sh https://cdn.jsdelivr.net
```

**Alternative:** Bundle react-markdown (increases bundle size by ~150KB).

---

### Issue: Math formulas (KaTeX) not rendering

**Console error:**
```
Refused to load stylesheet from 'https://cdn.jsdelivr.net/npm/katex@...'
```

**Fix:**
```nginx
# Ensure jsdelivr in both script-src AND style-src:
script-src 'self' https://cdn.jsdelivr.net
style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net
```

---

### Issue: Service Worker not registering

**Console error:**
```
Refused to create worker from 'blob:...' because it violates CSP worker-src
```

**Fix:**
```nginx
# Ensure blob: in worker-src:
worker-src 'self' blob:
```

**Verify:**
```javascript
// Browser console:
navigator.serviceWorker.getRegistration().then(r => console.log(r))
```

---

### Issue: Google Fonts not loading

**Console error:**
```
Refused to load font from 'https://fonts.gstatic.com/...'
```

**Fix:**
```nginx
# Need BOTH style-src and font-src:
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com
font-src 'self' data: https://fonts.gstatic.com
```

---

### Issue: Sentry errors not sending

**Console error:**
```
Refused to connect to '*.ingest.sentry.io'
```

**Fix:**
```nginx
connect-src 'self' https://*.ingest.sentry.io https://*.sentry.io wss://ws.sentry.io
```

**Verify:** Trigger test error:
```javascript
throw new Error("CSP test error")
```
Check Sentry dashboard in 1-2 minutes.

---

## 📋 Pre-Deployment Checklist

```bash
# 1. Build
npm run build

# 2. Check for inline scripts (should be ZERO)
grep -E '<script[^>]*>[^<]+</script>' dist/index.html
# Expected: No matches

# 3. Preview locally
npm run preview

# 4. Test in browser:
#    □ Chat works
#    □ Markdown renders
#    □ Math formulas work (KaTeX)
#    □ Code syntax highlighting works (Prism)
#    □ External images load
#    □ Service Worker registers
#    □ Zero CSP violations in console

# 5. Deploy
git push
```

---

## 🧪 Post-Deployment Verification

```bash
# Check headers applied
curl -I https://disaai.de | grep -i "content-security-policy"

# Scan security
curl "https://securityheaders.com/?q=https://disaai.de&followRedirects=on"

# Real-world test:
# 1. Open https://disaai.de
# 2. Start chat conversation
# 3. Send message with:
#    - Markdown formatting
#    - Math formula: $E = mc^2$
#    - Code block: ```python\nprint("test")\n```
#    - External image: ![test](https://placekitten.com/200/300)
# 4. Check console for CSP violations
# 5. Test PWA offline mode
```

---

## 🔧 Tools

| Tool | Purpose | URL |
|------|---------|-----|
| CSP Evaluator | Analyze CSP policy | https://csp-evaluator.withgoogle.com/ |
| Security Headers | Grade security headers | https://securityheaders.com/ |
| Mozilla Observatory | Security audit | https://observatory.mozilla.org/ |
| CSP Playground | Test CSP policies | https://www.cspisawesome.com/ |

---

## 📖 Reference

**Full docs:** [`docs/guides/SECURITY_HEADERS.md`](./SECURITY_HEADERS.md)

**CSP Directives Quick Ref:**
```nginx
default-src 'self'                                    # Fallback
script-src 'self' [CDNs]                             # NO 'unsafe-inline'!
style-src 'self' 'unsafe-inline' [CDNs]              # 'unsafe-inline' for Tailwind
img-src 'self' data: https: blob:                    # Permissive for images
connect-src 'self' [APIs]                            # Only proxy + Sentry
font-src 'self' data: [font CDNs]                    # Web fonts
worker-src 'self' blob:                              # Service Worker
manifest-src 'self'                                  # PWA manifest
frame-ancestors 'none'                               # No embedding
base-uri 'self'                                      # <base> restriction
form-action 'self'                                   # Form submission
upgrade-insecure-requests                            # HTTP → HTTPS
```

---

## 🆘 Getting Help

**CSP violation not listed here?**

1. Copy full console error
2. Extract violated directive: `violated directive: 'script-src ...'`
3. Check [SECURITY_HEADERS.md § CSP Exceptions](./SECURITY_HEADERS.md#csp-exceptions--justifications)
4. If not documented, open GitHub issue with:
   - Full console error
   - Steps to reproduce
   - Browser version

**Security concern?**
Open a **security issue** (not public) in GitHub repo.
