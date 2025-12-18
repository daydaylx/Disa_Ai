#!/usr/bin/env bash
set -euo pipefail

# Renders a concrete MCP config by replacing __PROJECT_ROOT__ in the template.
# Usage:
#   bash tools/mcp/render-mcp-config.sh > /tmp/mcp.json
#   bash tools/mcp/render-mcp-config.sh /abs/path/to/project > /tmp/mcp.json

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="${1:-"$(cd "$SCRIPT_DIR/../.." && pwd)"}"
TEMPLATE_FILE="$SCRIPT_DIR/mcp.config.template.json"

if [[ ! -f "$TEMPLATE_FILE" ]]; then
  echo "Template not found: $TEMPLATE_FILE" >&2
  exit 1
fi

if [[ ! -d "$REPO_ROOT" ]]; then
  echo "Repo root not found: $REPO_ROOT" >&2
  exit 1
fi

# JSON escaping for common path chars (keeps it simple for POSIX paths)
ESCAPED_ROOT="${REPO_ROOT//\\/\\\\}"
ESCAPED_ROOT="${ESCAPED_ROOT//\"/\\\"}"

sed "s|__PROJECT_ROOT__|$ESCAPED_ROOT|g" "$TEMPLATE_FILE"
