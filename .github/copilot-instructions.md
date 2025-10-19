# Copilot Instructions for Disa AI

## Project Overview

**Disa AI** is a professional, mobile-first AI-Chat Progressive Web App (PWA) built with React, Vite, TypeScript, and Tailwind CSS. The application is specifically designed for optimal mobile display and features a modern minimal design, robust codebase, and architecture focused on security and performance.

### Key Technologies

- **Frontend**: React 19, TypeScript (strict mode), Vite 7.x
- **Styling**: Tailwind CSS with Design Tokens, Radix UI for headless components
- **State Management**: React Hooks and Context API
- **Testing**: Vitest (unit tests), Playwright (E2E tests)
- **Build & Deploy**: Vite, Cloudflare Pages, Netlify
- **Node Version**: >= 20.19.0 < 24

## Project Structure

The application code is located in `src` and organized functionally:

```
src/
├── api/          # External API calls (e.g., OpenRouter)
├── app/          # App setup: Router, Layouts, global contexts
├── components/   # Reusable UI components (atomic & composed)
│   └── ui/       # Component library based on Radix UI
├── config/       # Static configuration: Models, prompts, feature flags
├── hooks/        # Central business logic (e.g., useChat, useMemory)
├── lib/          # General framework-independent utility functions
├── pages/        # Views for individual routes (e.g., Chat, Settings)
├── services/     # Background services and browser API encapsulation
├── state/        # Global state management (beyond hooks)
├── styles/       # Global styles and design tokens
│   └── design-tokens.css  # Centralized design system tokens
└── types/        # Global TypeScript type definitions
```

### Important Directories

- **`public/`**: Static assets and PWA manifest
- **`functions/`**: Serverless functions for deployment
- **`scripts/`**: Build and deployment utilities
- **`tools/`**: Custom tooling (e.g., CSS validation)
- **`tests/`**: Playwright E2E test suites and fixtures
- **`src/__tests__/`**: Integration tests covering multiple modules
- **`src/test/`**: Test utilities and MSW mock handlers

### Configuration Files

- **Hosting**: `netlify.toml`, `cloudflare-pages.json`, `wrangler.toml`
- **TypeScript**: `tsconfig.json`, `tsconfig.build.json`, `tsconfig.test.json`
- **Bundler**: `vite.config.ts`, `postcss.config.cjs`, `tailwind.config.ts`
- **Testing**: `vitest.config.ts`, `playwright.config.ts`
- **Linting**: `eslint.config.mjs`, `.prettierrc.json`

## Development Commands

### Essential Commands

```bash
# Start local development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Type checking (run before commits)
npm run typecheck

# Lint code
npm run lint
npm run lint:css

# Format code
npm run format        # Check formatting
npm run format:fix    # Fix formatting

# Run tests
npm run test:unit     # Run unit tests once
npm run test          # Run tests in watch mode
npm run e2e           # Run Playwright E2E tests

# Full verification (CI equivalent)
npm run verify        # Runs typecheck, lint, test:unit, and e2e
```

### Additional Commands

```bash
npm run lint:fix      # Auto-fix ESLint issues
npm run test:watch    # Run tests in watch mode
npm run build:debug   # Build with development sourcemaps
npm run analyze       # Analyze bundle size
npm run clean         # Remove build artifacts
```

## Code Style & Conventions

### Language & Formatting

- **Node**: >= 20.19.0
- **TypeScript**: Strict mode enabled
- **File Extensions**: `.tsx` for components, `.ts` for shared code
- **Indentation**: 2 spaces (enforced by Prettier)
- **Quotes**: Single quotes (enforced by Prettier)
- **Formatting**: Automated via Prettier - do not format manually

### Naming Conventions

- **React Components**: PascalCase (e.g., `ChatMessage`, `SettingsPanel`)
- **Hooks**: camelCase with `use` prefix (e.g., `useChat`, `useMemory`)
- **Feature Folders**: kebab-case (e.g., `chat-history`, `model-selector`)
- **Files**: Match component names for components, kebab-case for utilities

### Import Order

ESLint enforces a specific import order:

1. React and React-related imports
2. External dependencies
3. Internal absolute imports (e.g., from `@/`)
4. Relative imports (parent directories)
5. Relative imports (same directory)
6. Style imports

### Styling Guidelines

- **Design System**: Use Tailwind utilities with design tokens from `src/styles/design-tokens.css`
- **No Raw Colors**: Never use RGB or hex values directly - use design tokens (e.g., `bg-primary` instead of `bg-[#3b82f6]`)
- **Component Variants**: Use `class-variance-authority` (cva) for component variants
- **Class Merging**: Use the `cn` utility from `src/lib/cn.ts` for conditional classes
- **Mobile-First**: Design for mobile first, then scale up
- **Safe Areas**: Account for iOS notch and Android navigation using `env(safe-area-inset-*)`

### TypeScript Guidelines

- Always provide explicit types for function parameters and return values
- Use interfaces for object shapes, types for unions/intersections
- Leverage TypeScript's strict mode features
- Define types in `src/types/` for shared types across modules
- Use generics for reusable components and utilities

## Testing Guidelines

### Unit Tests (Vitest)

- **Location**: Co-locate tests with source files using `*.test.ts` or `*.test.tsx` suffix
- **Environment**: `happy-dom` for React component tests
- **Mocking**: Use MSW handlers in `tests/` or `src/test/` for external dependencies
- **Snapshots**: Keep snapshots minimal and update intentionally with `npm run test -- --update`

### Integration Tests

- **Location**: `src/__tests__/` for tests covering multiple modules
- **Scope**: Test feature workflows that span multiple components/hooks

### E2E Tests (Playwright)

- **Location**: `tests/e2e/` for browser-based scenarios
- **Accessibility**: Include `@axe-core/playwright` checks in tests
- **Fixtures**: Use fixtures from `tests/` for test setup

### Test Best Practices

- Write tests that focus on user behavior, not implementation details
- Use Testing Library queries (`getByRole`, `getByLabelText`) over test IDs
- Mock external APIs consistently using MSW
- Keep tests fast and isolated
- Run `npm run verify` before committing to ensure all tests pass

## Architecture Patterns

### Component Architecture

- **Atomic Design**: Build from small, reusable components up to complex features
- **Headless Components**: Use Radix UI for complex interactions (dialogs, dropdowns, etc.)
- **Composition**: Prefer composition over inheritance
- **Props**: Keep component APIs simple and focused

### State Management

- **Local State**: Use `useState` and `useReducer` for component-level state
- **Shared State**: Use Context API with custom hooks (e.g., `StudioProvider`)
- **Server State**: Handle API responses with appropriate loading/error states
- **Persistence**: Use `localStorage` through service layer for data persistence

### Routing

- **Library**: React Router 7.x
- **Code Splitting**: All routes use `React.lazy()` for dynamic imports
- **Suspense**: Wrap lazy-loaded routes with `Suspense` and provide fallbacks

### API Integration

- **Location**: `src/api/` for external API calls
- **Error Handling**: Always handle errors gracefully with user feedback
- **Type Safety**: Define request/response types for all API calls

## Design System

### Design Tokens

All design decisions are centralized in `src/styles/design-tokens.css` as CSS custom properties:

- **Colors**: `--color-primary`, `--color-surface-0`, etc.
- **Spacing**: `--spacing-4`, `--spacing-8`, etc.
- **Typography**: `--font-size-base`, `--font-weight-medium`, etc.
- **Radii**: `--radius-sm`, `--radius-md`, `--radius-lg`
- **Shadows**: `--shadow-sm`, `--shadow-md`, etc.

### Tailwind Configuration

The `tailwind.config.ts` consumes design tokens:

```typescript
theme: {
  extend: {
    colors: {
      primary: 'hsl(var(--primary))',
    },
    spacing: {
      4: 'var(--spacing-4)',
    }
  }
}
```

This approach combines Tailwind's flexibility with a maintainable token system.

## PWA Features

- **Service Worker**: Workbox for precaching and offline support
- **Manifest**: `public/manifest.webmanifest` with app metadata
- **Icons**: Multiple sizes in `public/` for all platforms
- **Offline**: Critical features work without network connectivity

## Commit & Pull Request Guidelines

### Commit Messages

Follow conventional commits format:

```
type(optional-scope): short description

Examples:
- feat(chat): add message editing
- fix(cloudflare): trim wrangler config
- docs(readme): update installation steps
- test(chat): add message delete tests
- refactor(hooks): simplify useChat logic
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style/formatting (not visual style)
- `refactor`: Code restructuring without behavior change
- `test`: Adding or updating tests
- `chore`: Maintenance tasks, dependency updates
- `perf`: Performance improvements

### Pull Request Requirements

1. **Summary**: Provide a concise description of changes
2. **Linked Issues**: Reference issue numbers or ticket IDs
3. **UI Changes**: Include screenshots or screencasts
4. **Breaking Changes**: Clearly document any breaking changes
5. **Verification**: Ensure `npm run verify` passes locally
6. **Configuration Impact**: Note any changes affecting deployment or configuration
7. **Review**: Request feedback from maintainers for shared utilities or hosting files

### Pre-Commit Checklist

- [ ] Run `npm run verify` successfully
- [ ] Update tests if behavior changed
- [ ] Update documentation if API changed
- [ ] Follow commit message conventions
- [ ] Keep commits focused and atomic

## Performance Considerations

- **Code Splitting**: Use dynamic imports for routes and heavy features
- **Lazy Loading**: Defer loading of non-critical components
- **Bundle Size**: Monitor with `npm run analyze`
- **Images**: Optimize images before committing
- **CSS**: Avoid inline styles; use Tailwind utilities

## Security Guidelines

- Never commit secrets or API keys to source code
- Sanitize user input before rendering
- Use Content Security Policy headers (configured in `public/_headers`)
- Keep dependencies updated with Dependabot
- Validate all environment variables at runtime

## Mobile-First Development

### Viewport Handling

- `App.tsx` contains logic to set `--vh` CSS variable based on `window.visualViewport.height`
- This solves the classic mobile browser address bar issue with `100vh`

### Touch Interactions

- Ensure interactive elements are large enough for touch (minimum 44x44px)
- Add appropriate touch feedback with hover/active states
- Test on actual mobile devices, not just browser DevTools

### Performance

- Target Lighthouse mobile score > 90
- Optimize for 3G network conditions
- Minimize main thread work
- Use `will-change` sparingly

## Deployment

### Build Process

1. `npm run prebuild` - Generates build metadata
2. `npm run build` - Vite production build
3. `npm run postbuild` - Copies `_redirects`, `_headers`, generates routes

### Hosting Platforms

- **Cloudflare Pages**: Primary deployment target
- **Netlify**: Alternative deployment option
- **Configuration**: See `cloudflare-pages.json`, `netlify.toml`, `wrangler.toml`

### Environment Variables

Define all environment variables in:

- `.env.local` for local development (gitignored)
- Platform-specific settings for production

## Troubleshooting

### Common Issues

1. **TypeScript errors**: Run `npm run typecheck` to see full errors
2. **Lint errors**: Run `npm run lint` and `npm run lint:fix`
3. **Test failures**: Check `npm run test:unit` output for details
4. **Build failures**: Try `npm run clean` then `npm run build`
5. **Dependency issues**: Delete `node_modules` and `package-lock.json`, then `npm install`

### Getting Help

- Review existing issues in the GitHub repository
- Check documentation in `README.md` and `/docs`
- Run `npm run verify` to check all quality gates

## Additional Resources

- **Main Documentation**: `README.md`
- **Agent Instructions**: `AGENTS.md` (German version of guidelines)
- **Required Checks**: `.github/REQUIRED_CHECKS.md`
- **PR Template**: `.github/pull_request_template.md`
