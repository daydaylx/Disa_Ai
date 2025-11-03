#!/usr/bin/env zsh
# qwen-switch.sh — Qwen Code zwischen OpenRouter und Qwen OAuth umschalten
# Usage:
#   ./qwen-switch.sh openrouter [MODEL]
#   ./qwen-switch.sh auth
# Beispiel:
#   ./qwen-switch.sh openrouter qwen/qwen3-coder-30b-a3b-instruct

set -euo pipefail

MODE="${1:-}"
MODEL_DEFAULT="qwen/qwen3-coder-30b-a3b-instruct"
QWEN_DIR="${HOME}/.qwen"
ENV_FILE="${QWEN_DIR}/.env"
OR_BASE="https://openrouter.ai/api/v1"

case "${MODE}" in
  openrouter)
    MODEL="${2:-$MODEL_DEFAULT}"

    # API-Key: bevorzugt aus $OPENROUTER_API_KEY, sonst $OPENAI_API_KEY, sonst prompt
    KEY="${OPENROUTER_API_KEY:-${OPENAI_API_KEY:-}}"
    if [[ -z "${KEY}" ]]; then
      print -n "OpenRouter API-Key (sk-or-v1…): "
      read -r KEY
    fi

    mkdir -p "${QWEN_DIR}"

    # Persistente Konfig in ~/.qwen/.env (Qwen-Code lädt .env automatisch)
    cat > "${ENV_FILE}" <<EOF
OPENAI_API_KEY=${KEY}
OPENAI_BASE_URL=${OR_BASE}
OPENAI_MODEL=${MODEL}
# Optional: Provider-Priorität für OpenRouter
# OPENROUTER_PROVIDER_ORDER=DeepInfra,Fireworks,OpenRouter
EOF
    chmod 600 "${ENV_FILE}"

    echo ">> Qwen-Code auf OpenRouter gestellt:"
    echo "   MODEL=${MODEL}"
    echo "   BASE =${OR_BASE}"
    echo "   ENV  =${ENV_FILE}"

    # Redundante Flags, falls bestimmte Versionen ENV ignorieren
    exec qwen \
      --openai-base-url "${OR_BASE}" \
      --openai-api-key  "${KEY}" \
      --model           "${MODEL}"
    ;;

  auth|oauth|qwen-oauth|"")
    # Zurück zu Qwen OAuth (Browser-Login). Lokale ENV-Konfig entfernen.
    [[ -f "${ENV_FILE}" ]] && rm -f "${ENV_FILE}"
    echo ">> Qwen-Code auf Qwen OAuth zurückgestellt. Browser-Login folgt."
    exec qwen
    ;;

  *)
    echo "Usage: $0 [openrouter [MODEL]] | [auth]" >&2
    exit 1
    ;;
esac
