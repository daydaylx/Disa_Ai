# Cloudflare Pages Deployment Notes

## CSP & Web Analytics

### ⚠️ Important: Disable Cloudflare Web Analytics

This app uses **local-only analytics** (localStorage-based tracking). Cloudflare's auto-injected Web Analytics script (`beacon.min.js`) will be **blocked by CSP** and cause console errors.

**To fix:**

1. Go to your Cloudflare Pages Dashboard
2. Navigate to: **Analytics & Logs** → **Web Analytics**
3. **Disable** Web Analytics for this project

### Why?

- The CSP is configured to block third-party scripts for security
- Cloudflare auto-injects `https://static.cloudflareinsights.com/beacon.min.js` if Web Analytics is enabled
- This causes `Refused to load the script` errors in the browser console
- The app doesn't need external analytics - it uses privacy-friendly local tracking

## Content Security Policy (CSP)

The app uses a strict CSP configured in `public/_headers`:

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob:;
  font-src 'self' data:;
  connect-src 'self' https://api.openrouter.ai https://openrouter.ai;
  manifest-src 'self';
  worker-src 'self' blob:;
```

### Key Points:

- **No `unsafe-eval`**: Removed for production security
- **No external analytics domains**: Cloudflare Insights domains removed
- **PWA support**: `manifest-src` and `worker-src` for Service Workers
- **API whitelist**: Only OpenRouter API endpoints allowed

## Build Configuration

The app detects Cloudflare Pages environment:

```typescript
// vite.config.ts
if (env.CF_PAGES && env.CF_PAGES_URL) {
  base = "/";
  console.log(`[Vite] Cloudflare Pages detected, using base: ${base}`);
}
```

## Deployment Checklist

- [ ] Disable Cloudflare Web Analytics in dashboard
- [ ] Verify `_headers` file is deployed (check Network tab)
- [ ] Check browser console for CSP errors (should be none)
- [ ] Test PWA installation (manifest should load correctly)
- [ ] Verify API calls to OpenRouter work (CSP `connect-src`)

## Troubleshooting

### CSP Errors in Console

**Error:** `Refused to load the script 'https://static.cloudflareinsights.com/beacon.min.js'`

**Solution:** Disable Cloudflare Web Analytics (see above)

### Service Worker Not Registering

**Error:** `Failed to register service worker: A bad HTTP response code (404) was received`

**Solution:** Ensure `_headers` includes:

```
/sw.js
  Service-Worker-Allowed: /
```

### API Calls Blocked

**Error:** `Refused to connect to 'https://api.openrouter.ai'`

**Solution:** Verify `connect-src` includes OpenRouter domains in `_headers`
