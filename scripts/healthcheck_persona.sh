#!/usr/bin/env bash
set -euo pipefail

# Port freimachen
PID=$(lsof -tiTCP:4173 -sTCP:LISTEN || true)
if [ -n "${PID:-}" ]; then
  kill "$PID" 2>/dev/null || true
  sleep 0.3
  kill -9 "$PID" 2>/dev/null || true
fi

echo "[1/3] Build"
npm run build

echo "[2/3] Preview starten"
nohup npx vite preview --host 127.0.0.1 --port 4173 --strictPort </dev/null >/tmp/vite_preview.log 2>&1 &

for i in $(seq 1 40); do
  curl -sfI http://127.0.0.1:4173/ >/dev/null && break || sleep 0.25
done

echo "[3/3] Prüfe persona.json"
curl -sI http://127.0.0.1:4173/persona.json | sed -n '1,20p'
curl -sfI http://127.0.0.1:4173/persona.json | grep -Eiq '^HTTP/.* 200 ' || { echo "Persona nicht 200"; exit 1; }
curl -sI http://127.0.0.1:4173/persona.json | grep -iq 'content-type: .*application/json' || { echo "Persona Content-Type falsch"; exit 1; }
curl -s http://127.0.0.1:4173/persona.json | jq -e . >/dev/null || { echo "Persona JSON ungültig"; exit 1; }

echo "OK: persona.json wird korrekt ausgeliefert."
