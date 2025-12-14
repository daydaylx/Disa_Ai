# Codex MCP Setup (Disa AI)

Dieses Projekt bringt eine MCP-Empfehlung für Claude Desktop mit (`.claude/mcp_config_recommendation.json`).  
Für **Codex CLI** richtet dieses Dokument (und das Setup-Skript) die passenden MCP Server ein.

## Quick Start

```bash
npm run mcp:setup:codex
```

oder direkt:

```bash
bash scripts/setup-codex-mcp.sh
```

## Was wird eingerichtet?

Die Einträge werden **global** in `~/.codex/config.toml` gespeichert (Codex CLI verwaltet sie via `codex mcp …`).

Standard-Setup (empfohlen) legt u. a. an:

- `disa-filesystem` → `@modelcontextprotocol/server-filesystem` (Projekt-Root)
- `disa-git` → `@modelcontextprotocol/server-git` (Repository)
- `disa-playwright` → `@modelcontextprotocol/server-playwright`
- `disa-sqlite` → `@modelcontextprotocol/server-sqlite` (DB: `sqlite_mcp_server.db`)
- `disa-z-ai-vision` → Wrapper `tools/zai-vision-mcp.ts` (liest `.env.local`)

Optional (Vollständig):

- `disa-memory` → `@modelcontextprotocol/server-memory`
- `disa-fetch` → `@modelcontextprotocol/server-fetch`
- `disa-github` → `@modelcontextprotocol/server-github` (Token nötig)
- `disa-brave-search` → `@modelcontextprotocol/server-brave-search` (API Key nötig)

## Verifizieren / Entfernen

```bash
codex mcp list
codex mcp get disa-git
codex mcp remove disa-git
```

## Sicherheit

- Tokens/Keys werden (falls genutzt) in `~/.codex/config.toml` gespeichert.
- Für `disa-z-ai-vision` bleiben Secrets in `.env.local` (wird **nicht** committed).

