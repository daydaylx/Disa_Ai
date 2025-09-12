# Required Status Checks for Branch Protection

Configure these named checks in GitHub repository settings → Branches → Branch protection rules for `main`:

## Required Status Checks

Add the following job names as required status checks:

1. **Setup & Install** (`setup`)
2. **Lint** (`lint`) 
3. **Typecheck** (`typecheck`)
4. **Unit Tests** (`unit-tests`)
5. **E2E Tests** (`e2e-tests`)
6. **Build** (`build`)

## Optional Status Checks

These checks can be set as optional or informational:

- **Deploy Gate** (`deploy-gate`) - Only runs on main branch pushes

## Configuration Steps

1. Go to repository Settings → Branches
2. Click "Add rule" or edit existing rule for `main` branch
3. Enable "Require status checks to pass before merging"
4. Search and select the required checks listed above
5. Enable "Require branches to be up to date before merging"
6. Save the protection rule

## CI Pipeline Flow

```
Install → Lint ↘
              ↓
           Typecheck ↘
                     ↓
               Unit Tests → E2E Tests → Build → Deploy Gate
```

All gates must pass before deployment to Cloudflare Pages can proceed.