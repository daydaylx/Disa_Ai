#!/bin/bash
# ============================================================================
# Cloudflare Cache Purge Script
# ============================================================================
# Purges Cloudflare Edge Cache selectively by cache tags or everything.
#
# Requirements:
#   - CF_ZONE_ID environment variable (Cloudflare Zone ID)
#   - CF_API_TOKEN environment variable (API Token with Cache Purge permission)
#
# Usage:
#   ./scripts/purge-cloudflare-cache.sh [TAG]
#
# Examples:
#   ./scripts/purge-cloudflare-cache.sh              # Purge everything
#   ./scripts/purge-cloudflare-cache.sh html         # Purge only HTML
#   ./scripts/purge-cloudflare-cache.sh app-shell    # Purge app shell
#   ./scripts/purge-cloudflare-cache.sh assets       # Purge assets
# ============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check required environment variables
if [ -z "$CF_ZONE_ID" ]; then
  echo -e "${RED}Error: CF_ZONE_ID environment variable not set${NC}"
  echo "Get your Zone ID from: Cloudflare Dashboard → Overview → Zone ID"
  exit 1
fi

if [ -z "$CF_API_TOKEN" ]; then
  echo -e "${RED}Error: CF_API_TOKEN environment variable not set${NC}"
  echo "Create a token at: Cloudflare Dashboard → My Profile → API Tokens"
  echo "Required permissions: Zone → Cache Purge → Purge"
  exit 1
fi

TAG="$1"

if [ -z "$TAG" ]; then
  echo -e "${YELLOW}⚠️  Purging EVERYTHING from Cloudflare Cache...${NC}"
  read -p "Are you sure? This will purge all cached content. (y/N): " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 0
  fi

  # Purge everything
  curl -X POST "https://api.cloudflare.com/client/v4/zones/$CF_ZONE_ID/purge_cache" \
    -H "Authorization: Bearer $CF_API_TOKEN" \
    -H "Content-Type: application/json" \
    --data '{"purge_everything":true}' \
    | jq -r 'if .success then "✅ Successfully purged all cache" else "❌ Error: \(.errors)" end'
else
  echo -e "${GREEN}🗑️  Purging cache by tag: $TAG${NC}"

  # Purge by cache tag
  curl -X POST "https://api.cloudflare.com/client/v4/zones/$CF_ZONE_ID/purge_cache" \
    -H "Authorization: Bearer $CF_API_TOKEN" \
    -H "Content-Type: application/json" \
    --data "{\"tags\":[\"$TAG\"]}" \
    | jq -r 'if .success then "✅ Successfully purged cache tag: '"$TAG"'" else "❌ Error: \(.errors)" end'
fi

echo ""
echo -e "${GREEN}Available cache tags:${NC}"
echo "  - html        → Purge all HTML files (app shell)"
echo "  - app-shell   → Purge root index.html"
echo "  - assets      → Purge all JS/CSS assets"
echo "  - static      → Purge all static files"
echo "  - pwa         → Purge manifest + service worker"
echo "  - sw          → Purge service worker only"
echo "  - manifest    → Purge manifest only"
