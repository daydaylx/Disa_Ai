#!/usr/bin/env bash
set -euo pipefail

echo "== Install deps (ci) =="
npm ci --prefer-offline --no-audit --fund=false

echo "== Typecheck =="
npm run typecheck

echo "== Build =="
npm run build

echo "== Probe dist =="
cd dist
python3 -m http.server 4173 --bind 127.0.0.1 >/tmp/http.log 2>&1 &
srv_pid=$!
for i in $(seq 1 40); do curl -sfI http://127.0.0.1:4173/ >/dev/null && break || sleep 0.25; done
curl -sfI http://127.0.0.1:4173/persona.json >/dev/null
kill $srv_pid
wait $srv_pid || true
echo "OK"

