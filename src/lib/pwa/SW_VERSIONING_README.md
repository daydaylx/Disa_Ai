# Service Worker Versioning System

## Overview

This system ensures that old cached assets are automatically invalidated when a new version of the app is deployed. It uses build IDs to version caches and provides a safe mechanism for cache cleanup.

## Architecture

### Cache Versioning

Each cache is prefixed with a version identifier:

```
disa-ai-v{BUILD_ID}-{cache-name}
```

Example:

- `disa-ai-vae3c450-assets` (current version)
- `disa-ai-v142da1e-assets` (old version - will be deleted)

### Components

1. **sw-versioning.ts**: Core versioning utilities
   - `getVersionedCacheName()`: Creates versioned cache names
   - `deleteOldCaches()`: Removes caches from previous builds
   - `broadcastSWUpdate()`: Notifies clients about updates
   - `getCacheStats()`: Debug information about caches

2. **registerSW.ts**: Integration point
   - `BUILD_ID`: Unique identifier from git commit SHA
   - `BUILD_TOKEN`: Build ID + timestamp for cache busting

## Integration with VitePWA

The `vite-plugin-pwa` automatically generates a service worker. To integrate versioning:

### Option 1: Custom Service Worker (Recommended)

Create `public/sw.js` with custom logic:

```javascript
import { deleteOldCaches, broadcastSWUpdate } from "./src/lib/pwa/sw-versioning";

// On activation, clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    deleteOldCaches().then(() => {
      broadcastSWUpdate("SW_ACTIVATED");
      return self.clients.claim();
    }),
  );
});
```

### Option 2: Workbox Configuration (Current Setup)

The current `vite.config.ts` uses Workbox with:

- `skipWaiting: true` - New SW activates immediately
- `clientsClaim: true` - Takes control of all clients
- Dynamic cache names via `cacheName` in runtime caching rules

**Note**: Workbox automatically handles cache versioning through its `workbox-precaching` plugin, which generates unique cache names based on build hashes.

## Usage in Application Code

### Listen for SW Updates

```typescript
import { listenForSWUpdates } from "@/lib/pwa/sw-versioning";

const cleanup = listenForSWUpdates((message) => {
  if (message.type === "SW_ACTIVATED") {
    console.log(`New version activated: ${message.buildId}`);
    // Optional: Show update notification to user
  }
});

// Don't forget to cleanup
cleanup();
```

### Get Cache Statistics (Debug)

```typescript
import { getCacheStats } from "@/lib/pwa/sw-versioning";

const stats = await getCacheStats();
console.log(`Total caches: ${stats.count}`);
console.log(`Old version caches: ${stats.oldVersionCount}`);
```

## How It Works

### 1. Build Process

```bash
# CI/CD sets build environment
export VITE_BUILD_ID=$(git rev-parse --short HEAD)
export VITE_BUILD_TIMESTAMP=$(date +%s)

npm run build
```

### 2. Service Worker Generation

VitePWA generates:

- `dist/sw.js` - Service worker with precache manifest
- Cache names include Workbox version hash
- Automatic cache cleanup on activation

### 3. Runtime Behavior

```
User visits site (first time)
  ↓
SW registers and caches assets
  ↓
New version deployed
  ↓
SW detects update (polling)
  ↓
New SW installed and activated
  ↓
Old caches deleted automatically
  ↓
BroadcastChannel notifies app
  ↓
User prompted to reload (optional)
```

## Cache Cleanup Safety

The system includes multiple safeguards:

1. **Version Prefix Matching**: Only deletes caches with the `disa-ai-v` prefix
2. **Current Version Check**: Never deletes caches from the active version
3. **Workbox Integration**: Works alongside Workbox's built-in cleanup
4. **Graceful Degradation**: Falls back safely if APIs are unavailable

## Testing

### Local Testing

```bash
# Build with PWA enabled
npm run build
npm run preview

# Build without PWA (for testing)
VITE_PWA_DISABLED=true npm run build
```

### Check Cache Status

Open DevTools → Application → Cache Storage

You should see:

- `workbox-precache-v2-...` (Workbox managed)
- `disa-ai-v{BUILD_ID}-*` (Custom versioned caches, if using custom SW)

### Force Cache Cleanup

```javascript
// In browser console
import { deleteOldCaches, getCacheStats } from "./src/lib/pwa/sw-versioning";

// Check current state
await getCacheStats();

// Force cleanup
await deleteOldCaches();
```

## Cloudflare Pages Integration

### Cache Purging

After deployment, purge Cloudflare's edge cache:

```bash
# Using cf-purge.js script
CF_API_TOKEN=xxx CF_ZONE_ID=yyy node tools/cf-purge.js

# Or in CI/CD
npm run cf:purge
```

This ensures:

1. Service Worker cache is updated (via SW versioning)
2. Cloudflare edge cache is cleared (via API)
3. Users always get the latest version

## Troubleshooting

### Old assets still served

1. Check SW registration: `navigator.serviceWorker.getRegistrations()`
2. Verify cache names: DevTools → Application → Cache Storage
3. Force update: `registration.update()`
4. Clear all: `caches.keys().then(names => names.forEach(name => caches.delete(name)))`

### SW not updating

1. Ensure `skipWaiting: true` in `vite.config.ts`
2. Check network tab for `sw.js` requests
3. Verify `BUILD_ID` is different between versions

### BroadcastChannel not working

1. Check browser compatibility (95%+ modern browsers)
2. Verify channel name matches: `disa-sw-updates`
3. Ensure both SW and app are using same origin

## Best Practices

1. **Always set BUILD_ID in production**: Use git SHA or CI build number
2. **Test cache invalidation**: Deploy multiple versions and verify old caches are cleaned
3. **Monitor cache size**: Use `getCacheStats()` to track cache growth
4. **Graceful degradation**: App should work even if SW fails
5. **User communication**: Notify users when updates are available

## Related Files

- `vite.config.ts` - VitePWA configuration
- `src/lib/pwa/registerSW.ts` - SW registration logic
- `src/hooks/useServiceWorker.ts` - React integration
- `tools/cf-purge.js` - Cloudflare cache purging

## References

- [VitePWA Documentation](https://vite-pwa-org.netlify.app/)
- [Workbox Versioning](https://developers.google.com/web/tools/workbox/guides/migrations/migrate-from-v5)
- [Service Worker Lifecycle](https://web.dev/service-worker-lifecycle/)
