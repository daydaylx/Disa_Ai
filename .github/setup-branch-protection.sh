#!/bin/bash
# Automatische Konfiguration der Branch Protection Rules für main
# Führe dies einmal nach dem Deploy des neuen CI-Workflows aus

echo "🔒 Konfiguriere Branch Protection für main branch..."

# Branch Protection Rule für main erstellen
gh api repos/:owner/:repo/branches/main/protection \
  --method PUT \
  --field required_status_checks='{
    "strict": true,
    "contexts": [
      "setup",
      "lint",
      "typecheck",
      "unit-tests",
      "build",
      "e2e-tests"
    ]
  }' \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{
    "required_approving_review_count": 1,
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": false
  }' \
  --field restrictions=null \
  --field allow_force_pushes=false \
  --field allow_deletions=false

echo "✅ Branch Protection Rules konfiguriert!"
echo ""
echo "📋 Folgende Jobs sind jetzt als Pflicht-Checks konfiguriert:"
echo "   - setup"
echo "   - lint"
echo "   - typecheck"
echo "   - unit-tests"
echo "   - build"
echo "   - e2e-tests"
echo ""
echo "💡 PRs können nur gemerged werden, wenn alle Checks grün sind!"