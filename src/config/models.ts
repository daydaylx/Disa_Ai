FILE="src/config/models.ts"
if [[ -f "$FILE" ]]; then
  if ! grep -q 'qwen/qwen-2.5-7b-instruct' "$FILE"; then
    TMP="$(mktemp)"
    awk '
      BEGIN{added=0}
      /\]\s*;?\s*$/ && !added {
        print "  ,{ id: \"qwen/qwen-2.5-7b-instruct:free\", label: \"Qwen 2.5 7B (free)\", vendor: \"Alibaba\", price: \"sehr günstig\", open: true, free: true }";
        print "  ,{ id: \"google/gemma-2-9b-it:free\", label: \"Gemma 2 9B IT (free)\", vendor: \"Google\", price: \"sehr günstig\", open: true, free: true }";
        print "  ,{ id: \"openchat/openchat-3.5-1210\", label: \"OpenChat 3.5 1210\", vendor: \"OpenChat\", price: \"sehr günstig\", open: true, free: false }";
        added=1
      }
      { print }
    ' "$FILE" > "$TMP" && mv "$TMP" "$FILE"
    git add "$FILE"
    git commit -m "chore(models): add Qwen-7B, Gemma-2 9B, OpenChat 3.5 to catalog" || true
    git push origin main || true
  fi
fi

