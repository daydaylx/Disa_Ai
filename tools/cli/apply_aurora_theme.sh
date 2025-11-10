#!/usr/bin/env bash
set -euo pipefail

# ==========================
# Disa AI – Aurora Style Pack (idempotent)
# ==========================
ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$ROOT"

TS="$(date +%Y%m%d-%H%M%S)"
BRANCH="${BRANCH_NAME:-feat/aurora-style}"
DRY="${DRY_RUN:-0}"
SKIP_COMMIT="${SKIP_COMMIT:-0}"

log() { printf '\033[1;36m[aurora]\033[0m %s\n' "$*"; }
run() { if [ "$DRY" = "1" ]; then echo "+ $*"; else eval "$*"; fi; }
backup() { [ -f "$1" ] && run "cp '$1' '$1.bak.$TS'"; }

ensure_branch() {
  if [ "$SKIP_COMMIT" = "1" ]; then log "skip branch creation"; return; fi
  if git rev-parse --verify "$BRANCH" >/dev/null 2>&1; then
    run "git checkout '$BRANCH'"
  else
    run "git checkout -b '$BRANCH'"
  fi
}

ensure_dirs() {
  run "mkdir -p src/styles src/components/layout src/components/ui tools/cli"
}

write_file() {
  local path="$1"; shift
  backup "$path"
  if [ "$DRY" = "1" ]; then
    echo "+ write $path <<EOF"; cat; echo "EOF"
  else
    cat > "$path"
  fi
}

insert_import_once() {
  local file="$1"; local line="$2"
  [ ! -f "$file" ] && return 0
  grep -Fq "$line" "$file" && return 0
  backup "$file"
  awk -v ins="$line" '
    BEGIN{last=0}
    /^import /{last=NR}
    {lines[NR]=$0}
    END{
      if(last){
        for(i=1;i<=last;i++) print lines[i]
        print ins
        for(i=last+1;i in lines;i++) print lines[i]
      }else{
        print ins
        for(i=1;i in lines;i++) print lines[i]
      }
    }' "$file" > "$file.tmp" && mv "$file.tmp" "$file"
}

ensure_main_imports() {
  local MAIN=""
  if   [ -f src/main.tsx ]; then MAIN=src/main.tsx
  elif [ -f src/main.ts  ]; then MAIN=src/main.ts
  elif [ -f app/main.tsx ]; then MAIN=app/main.tsx
  else log "keine main.tsx/ts gefunden; skip auto-import"; return; fi
  insert_import_once "$MAIN" "import './styles/tokens.css'"
  insert_import_once "$MAIN" "import './styles/base.css'"
  insert_import_once "$MAIN" "import './styles/components.css'"
}

add_dependencies() {
  if [ -f package.json ]; then
    run "npm i -S clsx >/dev/null 2>&1 || npm i -S clsx"
  else
    log "kein package.json; skip npm"
  fi
}

fmt() {
  if npx --yes --package prettier prettier -v >/dev/null 2>&1; then
    run "npx prettier -w 'src/**/*.{ts,tsx,css}' >/dev/null 2>&1 || true"
  else
    log "prettier nicht gefunden; skip format"
  fi
}

commit_changes() {
  [ "$SKIP_COMMIT" = "1" ] && { log "skip commit"; return; }
  run "git add -A"
  run "git commit -m 'feat(ui): Aurora Gradient Brand — tokens, base, utilities, Header/Button/Card, imports' || true"
}

# ------------------------------
# Dateien schreiben
# ------------------------------
ensure_branch
ensure_dirs

# 1) tokens.css
write_file src/styles/tokens.css <<'CSS'
@layer base {
  :root {
    /* Base Palette (Dark-first) */
    --bg0: 230 15% 10%;
    --bg1: 230 15% 12%;
    --bg2: 230 15% 14%;
    --fg0: 220 20% 96%;
    --fg1: 220 12% 80%;

    /* Brand hues */
    --brand-1: 262 88% 66%;
    --brand-2: 215 86% 60%;
    --brand-3: 168 84% 48%;
    --brand-4: 196 86% 58%;

    /* Surfaces */
    --surface-base: hsl(var(--bg0) / 1);
    --surface-1:    hsl(var(--bg1) / 1);
    --surface-card: hsl(var(--bg2) / 1);

    /* Text */
    --text-primary:   hsl(var(--fg0) / 1);
    --text-secondary: hsl(var(--fg1) / 1);

    /* Accent/State */
    --accent:    hsl(var(--brand-2) / 1);
    --success:   142 72% 45%;
    --warning:   24 94% 50%;
    --danger:    350 84% 56%;

    /* Radius */
    --radius-sm: .375rem;
    --radius-md: .625rem;
    --radius-lg: .875rem;
    --radius-xl: 1.125rem;

    /* Shadows */
    --shadow-sm: 0 1px 2px rgba(0,0,0,.16);
    --shadow-md: 0 6px 16px rgba(0,0,0,.22);
    --shadow-lg: 0 16px 32px rgba(0,0,0,.28);

    /* Focus ring */
    --ring-outline: 0 0 0 3px hsl(var(--brand-4) / .35);

    /* Z-index */
    --z-header: 200;
    --z-drawer: 300;
    --z-modal-backdrop: 400;
    --z-modal: 500;
    --z-popover: 600;
    --z-toast: 1000;

    /* Safe Area */
    --safe-top: env(safe-area-inset-top, 0px);
    --safe-right: env(safe-area-inset-right, 0px);
    --safe-bottom: env(safe-area-inset-bottom, 0px);
    --safe-left: env(safe-area-inset-left, 0px);

    /* Touch sizes */
    --touch-compact: 44px;
    --touch-comfort: 48px;
    --touch-relaxed: 56px;

    /* Aurora Signature Gradient (overlay layer) */
    --grad-aurora:
      radial-gradient(1200px 600px at 8% -10%, hsl(var(--brand-1) / .90) 0%, transparent 35%),
      radial-gradient(900px 500px at 100% 0%,  hsl(var(--brand-2) / .85) 0%, transparent 42%),
      radial-gradient(900px 600px at 70% 100%, hsl(var(--brand-3) / .75) 0%, transparent 50%),
      radial-gradient(700px 400px at 10% 100%, hsl(var(--brand-4) / .70) 0%, transparent 55%);
  }

  /* Optional Light Theme */
  [data-theme="light"] {
    --bg0: 230 15% 98%;
    --bg1: 230 15% 96%;
    --bg2: 230 15% 94%;
    --fg0: 230 15% 10%;
    --fg1: 230 10% 35%;
    --surface-base: hsl(var(--bg0) / 1);
    --surface-1:    hsl(var(--bg1) / 1);
    --surface-card: hsl(var(--bg2) / 1);
  }
}
CSS

# 2) base.css
write_file src/styles/base.css <<'CSS'
@layer base {
  *,*::before,*::after { box-sizing: border-box; }
  html { -webkit-text-size-adjust: 100%; text-size-adjust: 100%; }
  body {
    margin: 0;
    background: var(--surface-base);
    color: var(--text-primary);
    font-family: ui-sans-serif, system-ui, Inter, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans";
    min-height: 100dvh;
    padding: var(--safe-top) var(--safe-right) calc(var(--safe-bottom) + 12px) var(--safe-left);
  }
  img,svg,video,canvas { display:block; max-width:100%; }
  *:focus-visible { outline: 2px solid hsl(var(--brand-4) / .9); outline-offset: 2px; }
}
CSS

# 3) components.css (Aurora utilities)
write_file src/styles/components.css <<'CSS'
@layer components {
  /* Aurora background layer for header/hero/overlays */
  .brand-aurora { position: relative; isolation: isolate; overflow: hidden; }
  .brand-aurora::before {
    content: ""; position: absolute; inset: 0;
    background: var(--grad-aurora); opacity: .6; z-index: -1; pointer-events: none;
  }

  .header-shell {
    height: 3.5rem; /* 56px */
    background: linear-gradient(to bottom, hsl(var(--bg0) / .55), hsl(var(--bg0) / .25));
    -webkit-backdrop-filter: saturate(140%) blur(0px);
    backdrop-filter: saturate(140%) blur(0px);
  }

  .card-surface {
    background: var(--surface-card);
    color: var(--text-primary);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-md);
  }
}
CSS

# 4) Header.tsx
write_file src/components/layout/Header.tsx <<'TSX'
import React from "react";

export function Header() {
  return (
    <header className="sticky top-0 z-[var(--z-header)] brand-aurora">
      <div className="header-shell">
        <div className="mx-auto max-w-screen-lg h-full px-4 flex items-center justify-between">
          <span className="text-[color:var(--text-secondary)] text-sm">Disa AI</span>
          <nav className="flex items-center gap-2">
            <button
              className="h-10 px-4 rounded-lg bg-[color:var(--accent)] text-black hover:opacity-90 focus-visible:[box-shadow:var(--ring-outline)]"
              aria-label="Neue Session"
            >
              Neu
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
TSX

# 5) Button.tsx
write_file src/components/ui/Button.tsx <<'TSX'
import React from "react";
import { clsx } from "clsx";

type Variant = "solid" | "ghost" | "subtle" | "danger";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:[box-shadow:var(--ring-outline)] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg";

const variants: Record<Variant, string> = {
  solid: "bg-[color:var(--accent)] text-black hover:opacity-90",
  ghost: "bg-transparent text-[color:var(--text-primary)] hover:bg-[color-mix(in_hsl,var(--surface-card)_40%,transparent)]",
  subtle: "bg-[color:var(--surface-card)] text-[color:var(--text-primary)] hover:opacity-95",
  danger: "bg-[hsl(350_84%_56%_/_1)] text-white hover:opacity-90",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4",
  lg: "h-12 px-5 text-lg",
};

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

export function Button({ className, variant = "solid", size = "md", ...props }: ButtonProps) {
  return <button className={clsx(base, variants[variant], sizes[size], className)} {...props} />;
}
TSX

# 6) Card.tsx
write_file src/components/ui/Card.tsx <<'TSX'
import React from "react";
import { clsx } from "clsx";

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  padding?: "none" | "sm" | "md" | "lg";
};

export function Card({ className, padding = "md", ...props }: CardProps) {
  const pad =
    padding === "none" ? "p-0" :
    padding === "sm"   ? "p-3" :
    padding === "lg"   ? "p-6" : "p-4";
  return <div className={clsx("card-surface", pad, className)} {...props} />;
}
TSX

# 7) Imports in main.tsx/ts sicherstellen
ensure_main_imports

# 8) Dependencies
add_dependencies

# 9) Format
fmt

# 10) Commit
commit_changes

log "DONE. Aurora Theme eingesetzt."