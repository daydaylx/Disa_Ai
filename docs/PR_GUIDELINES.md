# Pull Request Hygiene Guidelines

## PR Purpose & Classification

### Feature PRs ✨
**Purpose:** Add new functionality
```markdown
## What
Brief description of the new feature

## Why
Business/user value and justification

## How
High-level implementation approach

## Testing
- [ ] Unit tests added/updated
- [ ] Manual testing completed
- [ ] No regression issues
```

### Bug Fix PRs 🐛
**Purpose:** Fix broken functionality
```markdown
## Bug Description
What was broken and how it manifested

## Root Cause
Technical explanation of the issue

## Solution
How the fix addresses the root cause

## Verification
- [ ] Bug reproduction confirmed
- [ ] Fix verified locally
- [ ] Edge cases tested
```

### Refactor PRs 🔧
**Purpose:** Improve code quality without changing behavior
```markdown
## Refactoring Goal
What aspect of code quality is being improved

## Changes Made
- List of specific refactoring actions
- Files/components affected

## Safety Measures
- [ ] Behavior unchanged (tests still pass)
- [ ] Performance impact assessed
- [ ] No breaking API changes
```

### Documentation PRs 📚
**Purpose:** Update docs, README, or code comments
```markdown
## Documentation Updates
Clear list of what docs were changed and why

## Target Audience
Who benefits from these documentation changes
```

## Anti-Patterns to Avoid

### ❌ Empty "Organizational" PRs
**Problem:** PRs with vague titles like "Update project structure" or "Cleanup"
**Solution:** Be specific about what's being organized and why

**Bad:**
```
Title: Cleanup and organization
Description: General cleanup
```

**Good:**
```
Title: refactor: consolidate error handling utilities
Description:
## What
- Move error classes from scattered files to src/lib/errors/
- Create unified error mapper
- Remove duplicate error handling code

## Why
- Reduce code duplication (found 4 copies of similar error handling)
- Improve maintainability
- Prepare for centralized error reporting
```

### ❌ Multi-Purpose PRs
**Problem:** PRs that mix unrelated changes
**Solution:** Split into focused, single-purpose PRs

**Bad:**
```
- Add new login feature
- Fix CSS bug in header
- Update README
- Refactor API client
```

**Good:** 4 separate PRs, each with clear purpose

### ❌ Vague Descriptions
**Problem:** "Fix stuff" or "Various improvements"
**Solution:** Specific, actionable descriptions

## PR Size Guidelines

### Small PRs (< 200 lines) 🟢
- Single focused change
- Quick to review
- Low risk of conflicts
- **Target:** Most PRs should be this size

### Medium PRs (200-400 lines) 🟡
- Acceptable for features
- Requires more careful review
- Include extra context in description

### Large PRs (> 400 lines) 🔴
- Should be exceptional
- Must include detailed breakdown
- Consider splitting if possible

## Required PR Elements

### 1. Clear Title Format
```
<type>(<scope>): <description>

Examples:
feat(auth): add OAuth2 login support
fix(ui): resolve mobile keyboard overlap issue
docs(api): update OpenRouter integration guide
refactor(chat): extract MessageList component
```

### 2. Comprehensive Description
Use the provided PR template sections:
- **What** changed
- **Why** it was needed
- **How** it was implemented
- **Testing** approach
- **Breaking Changes** (if any)

### 3. Self-Review Checklist
Before requesting review:
- [ ] Code follows style guidelines
- [ ] No console.log/debugging code left
- [ ] Tests pass locally
- [ ] No merge conflicts
- [ ] Screenshots for UI changes
- [ ] Breaking changes documented

## Review Process

### For PR Authors
1. **Self-review first** - catch obvious issues
2. **Request specific feedback** - "Please focus on the error handling logic"
3. **Respond promptly** to review comments
4. **Address all feedback** before re-requesting review

### For Reviewers
1. **Review within 24 hours** for small PRs
2. **Focus on correctness first**, style second
3. **Ask questions** instead of demanding changes
4. **Approve when ready**, don't nitpick minor style issues

## Special Cases

### Hotfix PRs 🚨
**Purpose:** Critical production fixes
```markdown
## Critical Issue
Description of production problem

## Minimal Fix
Explanation of targeted fix (no scope creep)

## Risk Assessment
Why this fix is safe for immediate deployment

## Follow-up Required
Link to issue for proper long-term solution
```

### Experimental PRs 🧪
**Purpose:** Proof of concept or exploration
```markdown
## Experiment Goal
What are we trying to learn/validate

## Not for Merge
Mark as Draft PR with clear "DO NOT MERGE" label

## Results
Document findings, even if negative
```

### Dependencies PRs 📦
**Purpose:** Update packages or dependencies
```markdown
## Package Updates
- List of packages updated
- Version changes (old → new)

## Breaking Changes
Any API changes that affect our code

## Testing
- [ ] Build succeeds
- [ ] Core functionality tested
- [ ] No new TypeScript errors
```

## Tools & Automation

### Required Checks ✅
All PRs must pass:
- Lint (`npm run lint`)
- Type checking (`npm run typecheck`)
- Unit tests (`npm run test:unit`)
- Build (`npm run build`)

### Optional but Recommended
- E2E tests for user-facing changes
- Performance testing for optimization PRs
- Security scan for dependency updates

## GitHub Integration

### Issues & PRs
- Link related issues: "Closes #123"
- Reference discussions: "Related to #456"
- Cross-reference: "Builds on #789"

### Labels
Use appropriate labels:
- `feature` - New functionality
- `bugfix` - Fixes broken behavior
- `refactor` - Code quality improvements
- `docs` - Documentation updates
- `dependencies` - Package updates
- `hotfix` - Critical production fixes

### Milestones
Associate PRs with milestones when working toward releases

## Examples of Good PR Descriptions

### Feature PR Example
```markdown
## What
Add voice-to-text input support for mobile chat interface

## Why
- Improves accessibility for users with mobility limitations
- Faster input method on mobile devices
- Competitive feature parity with other chat apps

## How
- Integrate Web Speech API for voice recognition
- Add microphone permission handling
- Implement visual feedback during recording
- Graceful degradation for unsupported browsers

## Testing
- [ ] Voice input works on iOS Safari
- [ ] Voice input works on Android Chrome
- [ ] Proper error handling for denied permissions
- [ ] Fallback to text input when speech API unavailable
- [ ] No regression in existing chat functionality

## Breaking Changes
None - purely additive feature

## Screenshots
[Attach screenshots of new voice input UI]
```

### Bug Fix PR Example
```markdown
## Bug Description
Mobile keyboard pushes chat input off-screen on iOS devices, making it impossible to send messages.

## Root Cause
CSS viewport units (100vh) don't account for dynamic iOS keyboard height. The chat input is positioned at bottom: 0 which gets pushed below visible area.

## Solution
- Replace 100vh with 100dvh for dynamic viewport height
- Add safe-area-inset-bottom for notched devices
- Implement keyboard detection to adjust input position

## Verification
- [ ] Tested on iPhone 14 (iOS 16.x) - Safari
- [ ] Tested on iPhone SE (iOS 15.x) - Safari
- [ ] Tested on Android devices (no regression)
- [ ] Chat input remains accessible when keyboard appears
- [ ] Input auto-scrolls into view when focused

## Files Changed
- src/styles/globals.css (viewport height fix)
- src/components/chat/Composer.tsx (safe area handling)
```

Remember: **Good PRs tell a story** - what problem existed, how you solved it, and why your solution is correct.