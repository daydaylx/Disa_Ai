# Cloudflare Pages Git Integration Setup

This repository is configured for Cloudflare Pages Git Integration deployment.

## Cloudflare UI Configuration

Configure these settings in the Cloudflare Pages dashboard:

### Production Settings

- **Production branch:** `main`
- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Root directory:** (leave empty / use repository root)

### Environment Variables

- **Node.js version:** 22 (or latest LTS)
- **Package manager:** Auto-detect (will use pnpm from lockfile)

### Build Settings

- **Framework preset:** None (Manual)
- **Compatibility date:** Latest
- **Compatibility flags:** None required

## Deployment Process

1. Navigate to Cloudflare Pages dashboard
2. Select your project or create new from Git repository
3. Configure the settings above
4. Click "Save and Deploy"
5. Future pushes to `main` branch will auto-deploy

## Verification

After deployment:

- Check build logs for any errors
- Verify site loads at your `.pages.dev` URL
- Test key functionality (chat interface, navigation)
- Confirm no Service Worker caching issues

## Notes

- Service Worker registration is disabled in this build
- PWA manifest is included for installability
- All assets are properly versioned and cached
- SPA routing configured via `public/_redirects`
