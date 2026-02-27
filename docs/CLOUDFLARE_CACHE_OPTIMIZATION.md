# Cloudflare Cache Optimization Guide

## 🎯 Overview

This document explains the Cloudflare CDN cache optimizations implemented for fast HTML invalidation and efficient asset caching.

---

## 📋 Cache Strategy

### 3-Tier Cache System

| Resource Type | Browser Cache | Edge Cache | Strategy |
|--------------|---------------|------------|----------|
| **HTML** (`/`, `/*.html`) | `max-age=0` | `no-cache` | Always fresh |
| **Hashed Assets** (`/assets/*`) | `max-age=31536000` | `max-age=31536000` | Cache forever |
| **Service Worker** (`/sw.js`) | `max-age=0` | `no-cache` | Always fresh |
| **Manifest** (`/manifest.webmanifest`) | `max-age=3600` | `max-age=86400` | 1h browser / 24h edge |
| **API** (`/api/*`) | `no-store` | `no-cache` | Never cache |

---

## 🔑 Key Headers Explained

### `Cache-Control`
Standard HTTP cache directive for **browsers**.
```http
Cache-Control: public, max-age=0, must-revalidate
```

### `CDN-Cache-Control`
Cloudflare-specific directive for **Edge cache** (overrides `Cache-Control` for CDN).
```http
CDN-Cache-Control: no-cache
```

### `Cloudflare-CDN-Cache-Control`
Explicit Cloudflare-only directive (redundant but explicit).
```http
Cloudflare-CDN-Cache-Control: no-cache
```

### `Cache-Tag`
Allows **selective cache purging** via Cloudflare API.
```http
Cache-Tag: html,app-shell
```

**Available Tags:**
- `html` - All HTML files
- `app-shell` - Root index.html
- `assets` - All JS/CSS assets
- `static` - All static files
- `pwa` - Manifest + Service Worker
- `sw` - Service Worker only
- `manifest` - Manifest only

---

## 🚀 Quick Start: Purge Cache After Deploy

### Option 1: npm Scripts (Recommended)

```bash
# Purge all HTML (app shell) - Fast invalidation
npm run cache:purge:html

# Purge all assets (JS/CSS) - Use after breaking changes
npm run cache:purge:assets

# Purge everything - Nuclear option
npm run cache:purge:all
```

### Option 2: Manual Script

```bash
# Setup environment variables (get from Cloudflare Dashboard)
export CF_ZONE_ID="your-zone-id"
export CF_API_TOKEN="your-api-token"

# Purge by tag
./scripts/purge-cloudflare-cache.sh html

# Purge everything
./scripts/purge-cloudflare-cache.sh
```

### Option 3: Cloudflare Dashboard

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select your domain → **Caching** → **Configuration**
3. Click **Purge Cache** → **Custom Purge**
4. Enter tag (e.g., `html`) or select **Purge Everything**

### Option 4: Cloudflare API (cURL)

```bash
# Purge by tag
curl -X POST "https://api.cloudflare.com/client/v4/zones/$CF_ZONE_ID/purge_cache" \
  -H "Authorization: Bearer $CF_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"tags":["html"]}'

# Purge everything
curl -X POST "https://api.cloudflare.com/client/v4/zones/$CF_ZONE_ID/purge_cache" \
  -H "Authorization: Bearer $CF_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}'
```

---

## 🔧 Setup: Get Cloudflare Credentials

### 1. Get Zone ID

1. Open [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select your domain (e.g., `disaai.de`)
3. On the **Overview** page, scroll down to **API** section
4. Copy **Zone ID** (e.g., `a1b2c3d4e5f6...`)

### 2. Create API Token

1. Go to **My Profile** → [API Tokens](https://dash.cloudflare.com/profile/api-tokens)
2. Click **Create Token** → **Custom Token**
3. Configure:
   - **Token name**: `Cache Purge - Disa AI`
   - **Permissions**:
     - `Zone` → `Cache Purge` → `Purge`
   - **Zone Resources**:
     - `Include` → `Specific zone` → `disaai.de`
4. Click **Continue to summary** → **Create Token**
5. Copy the token (you won't see it again!)

### 3. Set Environment Variables

```bash
# Add to ~/.bashrc or ~/.zshrc
export CF_ZONE_ID="your-zone-id-here"
export CF_API_TOKEN="your-api-token-here"

# Or create .env file (DO NOT COMMIT!)
echo "CF_ZONE_ID=your-zone-id" >> .env.local
echo "CF_API_TOKEN=your-token" >> .env.local
```

---

## 📊 Why This Matters

### Problem: CDN Caches HTML Despite `max-age=0`

**Before:**
```http
Cache-Control: public, max-age=0, must-revalidate
```
- ❌ Cloudflare Edge still caches for ~5-15 minutes
- ❌ Custom domain shows old version after deploy
- ❌ No way to selectively purge

**After:**
```http
Cache-Control: public, max-age=0, must-revalidate
CDN-Cache-Control: no-cache
Cache-Tag: html,app-shell
```
- ✅ Edge cache bypassed (`no-cache`)
- ✅ Selective purge via tags (`html`)
- ✅ Instant invalidation possible

---

## 🎓 Best Practices

### When to Purge Cache

| Scenario | Command | Reason |
|----------|---------|--------|
| **After deploy** | `npm run cache:purge:html` | HTML changed (new JS/CSS references) |
| **Breaking change** | `npm run cache:purge:all` | HTML + Assets changed |
| **CSS bug fix** | `npm run cache:purge:assets` | Only assets changed |
| **Content update** | Not needed | Content-hashed assets auto-invalidate |

### Performance Impact

- ✅ **HTML**: Purge is **instant** (< 1 second globally)
- ✅ **Assets**: No purge needed (content-hashed filenames)
- ✅ **Zero downtime**: Old cache served until new fetch completes

### Testing Cache Headers

```bash
# Check response headers
curl -I https://disaai.de

# Check specific asset
curl -I https://disaai.de/assets/main-hJzJLWLU.js

# Force bypass cache (browser)
Ctrl + Shift + R (Chrome/Edge/Firefox)

# Force bypass cache (URL)
https://disaai.de/?nocache=123456789
```

---

## 🔍 Troubleshooting

### Issue: Site shows old version after deploy

**Diagnosis:**
```bash
# Check deployed commit
gh api repos/daydaylx/Disa_Ai/pages/builds/latest | jq -r .commit

# Check local commit
git log --oneline -1
```

**Solution:**
```bash
npm run cache:purge:html
```

### Issue: "CF_ZONE_ID not set" error

**Solution:**
```bash
export CF_ZONE_ID="your-zone-id"
export CF_API_TOKEN="your-token"
```

### Issue: "Permission denied" API error

**Solution:**
- Check API token has **Cache Purge** permission
- Check token is for correct zone (`disaai.de`)
- Regenerate token if expired

---

## 📖 References

- [Cloudflare Cache API](https://developers.cloudflare.com/api/operations/zone-purge)
- [Cache-Tag Documentation](https://developers.cloudflare.com/cache/how-to/purge-cache/purge-by-tags/)
- [CDN-Cache-Control Header](https://developers.cloudflare.com/cache/about/cdn-cache-control/)
- [Cloudflare Pages Caching](https://developers.cloudflare.com/pages/configuration/headers/)

---

## 🚀 Automated Purge (GitHub Actions)

**Future Enhancement:** Add automatic cache purge after Pages deployment.

```yaml
# .github/workflows/purge-cache.yml
name: Purge Cloudflare Cache
on:
  workflow_run:
    workflows: ["pages-build-deployment"]
    types: [completed]

jobs:
  purge:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Purge HTML cache
        run: |
          curl -X POST "https://api.cloudflare.com/client/v4/zones/${{ secrets.CF_ZONE_ID }}/purge_cache" \
            -H "Authorization: Bearer ${{ secrets.CF_API_TOKEN }}" \
            -H "Content-Type: application/json" \
            --data '{"tags":["html"]}'
```

**Required Secrets:**
- `CF_ZONE_ID`
- `CF_API_TOKEN`

---

**Last Updated:** 2026-02-27
**Maintainer:** Disa AI Team
