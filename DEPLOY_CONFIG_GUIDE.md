# 🚀 Disa AI - Cloudflare Deployment Konfiguration

## 🚨 Status (24.11.2025)

- KV-Namespaces sind in `wrangler.toml` bereits mit echten IDs hinterlegt (Prod/Preview).
- **Offen/Kritisch:** Secrets `OPENROUTER_API_KEY` und `VITE_OPENROUTER_API_KEY` fehlen weiterhin in den Cloudflare Pages-Umgebungen. Ohne diese ist die Chat-API nicht funktionsfähig.

Dieses Dokument beschreibt die korrekte Konfiguration der Disa AI Anwendung für Cloudflare Pages/Workers.

## Required Steps Before Deployment

### 1. KV Namespace Setup

You need to create KV namespaces for the rate limiting functionality:

1. Create a KV namespace for production:

   ```bash
   wrangler kv:namespace create "RATE_LIMIT_KV" --env production
   ```

2. Create a KV namespace for preview:

   ```bash
   wrangler kv:namespace create "RATE_LIMIT_KV" --env preview
   ```

3. Update the `wrangler.toml` file (konsolidierte Version) with the actual namespace IDs:
   - Replace `YOUR_PRODUCTION_RATE_LIMIT_KV_NAMESPACE_ID` with the production namespace ID
   - Replace `YOUR_PREVIEW_RATE_LIMIT_KV_NAMESPACE_ID` with the preview namespace ID

**AKTUELLER STATUS:** ✅ IDs gesetzt → Rate Limiting kann funktionieren, sobald Secrets vorhanden sind.

### 2. Environment Variables

Ensure the following environment variables are set in your Cloudflare Pages deployment:

**KRITISCH FEHLEND:**

For Production:

- `OPENROUTER_API_KEY` - **❌ FEHLT** - API key for OpenRouter (functions/api/chat.ts)
- `VITE_OPENROUTER_API_KEY` - **❌ FEHLT** - Same key for frontend API calls

For Preview/Development:

- `OPENROUTER_API_KEY` - **❌ FEHLT** - Test API key for OpenRouter
- `VITE_OPENROUTER_API_KEY` - **❌ FEHLT** - Same test key for frontend
- `VITE_OPENROUTER_BASE_URL` - ✅ Konfiguriert - Points to OpenRouter API

**AKTUELLER STATUS:** ❌ API-Keys fehlen → Chat-API ist aktuell nicht funktionsfähig. Nachtragen in Pages/Workers Secrets zwingend.

### 3. Verification Steps

Before deploying, run the validation script:

```bash
npm run validate:deploy
```

This script will check:

- KV namespace configuration
- Function access to KV namespace
- Security headers
- Route configuration

## Deployment Process

1. Update the wrangler.toml files with proper KV namespace IDs
2. Run validation: `npm run validate:deploy`
3. Commit all changes
4. Push to the appropriate branch (main for production, others for preview)

## Troubleshooting

### Common Issues

1. **Rate Limiting Not Working**: Check that KV namespace IDs are properly set in the wrangler.toml files
2. **API Key Issues**: Ensure `OPENROUTER_API_KEY` is set as a secret in Cloudflare Pages
3. **Build Errors**: Verify that all environment variables are correctly configured
4. **CSP Errors**: The Content Security Policy in `public/_headers` might be too restrictive for certain operations

### Verification Commands

```bash
# Validate deployment configuration
npm run validate:deploy

# Run build to check for issues
npm run build

# Verify the distribution
npm run verify:dist
```
