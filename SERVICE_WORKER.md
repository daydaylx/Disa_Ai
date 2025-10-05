# Service Worker Caching & Update Strategy

## Overview

This app uses a **custom Service Worker** with intelligent caching strategies to prevent "white screen after deploy" issues while maintaining offline functionality.

## Architecture

### Strategy: `injectManifest`

We use Vite PWA's `injectManifest` strategy (not `generateSW`) to maintain full control over caching logic while leveraging Workbox's precaching.

```typescript
// vite.config.ts
VitePWA({
  strategies: "injectManifest",
  srcDir: "public",
  filename: "sw.js",
  registerType: "autoUpdate",
});
```

### Cache Versioning

Caches are **automatically versioned** with every build:

```javascript
const SW_VERSION = `v2.3.0-${BUILD_ID}`;
const HTML_CACHE = `html-${SW_VERSION}`;
const ASSET_CACHE = `assets-${SW_VERSION}`;
```

**Build ID** comes from:

- Git SHA (last 8 chars) in production
- Timestamp in development

## Caching Strategies

### 1. HTML Navigation Requests → **Network-First**

```javascript
// public/sw.js:234
if (request.mode === "navigate") {
  event.respondWith(networkFirst(request));
}
```

**Why Network-First for HTML?**

- ✅ Ensures users always get the latest app shell after deployment
- ✅ Falls back to cache only when offline
- ✅ Prevents "stale HTML loads broken JS" issue
- ✅ Cache-busting with `sw-bust` parameter

### 2. Static Assets → **Stale-While-Revalidate**

```javascript
// public/sw.js:239
if (shouldHandleAsAsset(request, url)) {
  event.respondWith(staleWhileRevalidate(request));
}
```

**Covered assets:**

- JavaScript bundles (`.js`)
- CSS files (`.css`)
- Fonts (`.woff`, `.woff2`)
- Images (`.png`, `.jpg`, `.svg`, `.webp`)
- JSON data files
- Manifest

**Why Stale-While-Revalidate?**

- ⚡ Instant response from cache
- 🔄 Background update for next request
- 📦 Optimal for versioned/hashed assets

### 3. API Calls → **Network-Only**

API requests to OpenRouter bypass cache entirely for real-time data.

## Update Flow

### Deploy → Activation Lifecycle

1. **New SW Installs**

   ```javascript
   // sw.js:76
   self.skipWaiting();
   ```

   - Bypasses "waiting" state
   - Activates immediately

2. **Activate Event**

   ```javascript
   // sw.js:186
   await self.clients.claim();
   ```

   - Takes control of all clients
   - Deletes old versioned caches
   - Preserves backward-compatible caches

3. **Smart Cache Cleanup**
   ```javascript
   // sw.js:84-140
   function shouldPreserveCache(cacheName) {
     // Keeps same major.minor version caches
     // Deletes old patch/build versions
   }
   ```

### Intelligent Version Cleanup

Caches are preserved based on **semantic versioning**:

- ✅ `html-v2.3.0-abc123` (current) → Keep
- ✅ `assets-v2.3.0-abc123` (current) → Keep
- ⚠️ `html-v2.2.5-old123` (same minor) → Keep temporarily
- ❌ `html-v2.1.0-ancient` (old minor) → Delete
- ❌ `html-v1.0.0-legacy` (old major) → Delete

## User Experience

### Automatic Updates

```javascript
// src/lib/pwa/registerSW.ts:58
registerType: "autoUpdate";
```

- User gets new version **automatically** on next page load
- No manual "Update Available" prompt
- Silent background update

### First-Time Install

```javascript
// sw.js:65-77
event.waitUntil(caches.open(HTML_CACHE).then((cache) => cache.addAll([OFFLINE_URL])));
```

- Pre-caches offline fallback page
- Enables offline-first capabilities immediately

## Testing Updates

### Local Testing

```bash
# 1. Build current version
npm run build
npm run preview

# 2. Make a change to code
# (e.g., update component text)

# 3. Rebuild
npm run build

# 4. Hard-reload browser (Ctrl+Shift+R)
# → New version should load immediately
```

### Verify Cache Cleanup

**Chrome DevTools:**

1. Application → Cache Storage
2. Check cache names before update: `html-v2.3.0-abc123`
3. After update: Old caches deleted, new cache: `html-v2.3.0-def456`

### Debugging

```javascript
// Check SW version in console
navigator.serviceWorker.controller.postMessage({
  type: "CHECK_FOR_UPDATE"
});

// Expected response:
{
  version: "v2.3.0-91f6b6e5",
  caches: ["html-v2.3.0-91f6b6e5", "assets-v2.3.0-91f6b6e5"]
}
```

## Known Issues & Solutions

### Issue: White Screen After Deploy

**Cause:** Old HTML cached, loads broken JS references

**Solution:** ✅ Fixed

- Network-first for HTML ensures latest index.html
- Versioned cache names prevent cross-version pollution
- `skipWaiting()` + `clientsClaim()` activate new SW immediately

### Issue: Slow Initial Load

**Cause:** Network-first always hits network

**Trade-off:** Acceptable

- First paint may be slightly slower
- Guarantees correctness (no broken states)
- Stale-while-revalidate handles assets quickly

### Issue: Development Cache Pollution

**Solution:**

```javascript
// Disable SW in development if needed
if (import.meta.env.DEV) {
  // Skip SW registration
}
```

Or use DevTools: Application → Clear storage

## Configuration Reference

### Cache Name Format

```
{type}-v{major}.{minor}.{patch}-{buildId}
```

Examples:

- `html-v2.3.0-91f6b6e5`
- `assets-v2.3.0-91f6b6e5`

### Build ID Sources

1. **Production (CI/CD):**

   ```bash
   VITE_BUILD_ID=$(git rev-parse --short HEAD)
   ```

2. **Development:**
   ```javascript
   const BUILD_ID = Date.now().toString(36);
   ```

### Precache Injection

VitePWA automatically injects:

```javascript
// Replaces: self.__WB_MANIFEST
precacheAndRoute([
  { url: "/index.html", revision: "abc123" },
  { url: "/assets/index-4z3MABGE.js", revision: null },
  // ... all built assets
]);
```

## Best Practices

1. **Always version SW:**
   - Increment `SW_VERSION` in `public/sw.js` for breaking changes
   - Build ID handles automatic versioning for deploys

2. **Test update flow:**
   - Simulate deploy with two consecutive builds
   - Verify old caches are cleaned up

3. **Monitor cache sizes:**
   - Check DevTools → Application → Storage
   - Cleanup should prevent unbounded growth

4. **Handle offline gracefully:**
   - `/offline.html` is always pre-cached
   - Network errors fall back to cache

## Migration Guide

### From generateSW to injectManifest

**Before (auto-generated):**

```typescript
VitePWA({
  workbox: {
    globPatterns: ["**/*.{js,css,html}"],
  },
});
```

**After (custom SW):**

```typescript
VitePWA({
  strategies: "injectManifest",
  srcDir: "public",
  filename: "sw.js",
  injectManifest: {
    globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
  },
});
```

**Benefits:**

- Full control over cache strategies
- Custom update logic
- Intelligent version management
- Better debugging

## Further Reading

- [Workbox Strategies](https://developer.chrome.com/docs/workbox/modules/workbox-strategies/)
- [Service Worker Lifecycle](https://web.dev/articles/service-worker-lifecycle)
- [Vite PWA injectManifest](https://vite-pwa-org.netlify.app/guide/inject-manifest.html)
