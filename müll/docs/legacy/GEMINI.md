# GEMINI.md

## Project Overview

Disa AI is a professional, mobile-first AI chat Progressive Web App (PWA). It is built with **React 19**, **Vite**, **TypeScript**, and **Tailwind CSS**, emphasizing a clean codebase, robust build processes, and production-ready performance. The application features a glassmorphism design and is optimized for mobile devices, particularly Android.

### Key Features
- **Mobile-First & PWA**: Optimized touch interactions, offline support, and installability.
- **Modern Stack**: React 19, Vite 7, TypeScript 5.
- **Security**: Ephemeral API key management (sessionStorage), comprehensive Content Security Policy (CSP).
- **Architecture**: Modular, feature-based architecture.
- **Cloud-Ready**: Configured for Cloudflare Pages/Workers.

## Getting Started

### Prerequisites
- Node.js (v20.19.0 - v24)
- npm

### Development Server
Start the local development environment:
```bash
npm run dev
```

### Production Build
Create a production-ready build:
```bash
npm run build
```

Preview the production build locally:
```bash
npm run preview
```

## Quality Assurance & Verification

The project enforces strict code quality standards. It is recommended to run the verification script before pushing changes.

### Verify All (Recommended)
Runs type checking, linting, and unit tests in one command:
```bash
npm run verify
```

### Individual Checks
- **Type Check**: `npm run typecheck`
- **Linting**: `npm run lint` (or `npm run lint:fix` to autofix)
- **Formatting**: `npm run format` (Prettier)

## Testing

The project employs a multi-layered testing strategy:

### Unit Tests
Powered by **Vitest**. Located in `src/__tests__` and co-located test files.
```bash
npm run test:unit
```

### Smoke Tests
Fast verification of core paths.
```bash
npm run test:smoke
```

### End-to-End (E2E) Tests
Powered by **Playwright**. Located in `tests/e2e`.
```bash
npm run e2e
```

## Project Architecture

The source code (`src/`) is organized by feature and responsibility:

- **`features/`**: Self-contained feature modules containing logic, state, and specific UI components.
- **`ui/`**: Reusable, atomic design system components (Buttons, Cards, Inputs, etc.).
- **`components/`**: Shared application-level components.
- **`pages/`**: Route definitions and page-level views.
- **`hooks/`**: Shared custom React hooks.
- **`contexts/`**: Global state management (React Context).
- **`services/`**: API clients and external service integrations.
- **`lib/`**: Utility functions, helpers, and library configurations.
- **`types/`**: Shared TypeScript definitions.
- **`styles/`**: Global styles and Tailwind configuration.
- **`api/`**: Backend logic (Cloudflare Workers/Pages Functions).

## Deployment

The application is configured for deployment on **Cloudflare Pages**.
Configuration is managed via `wrangler.toml`.

## Contribution Guidelines

### Commits
This project follows the **Conventional Commits** specification.
Changesets are used for versioning and changelog generation.

To add a changeset for a PR:
```bash
npm run changeset
```

### Directory Structure Highlights
- `.github/workflows`: CI/CD pipelines (GitHub Actions).
- `docs/`: Project documentation.
- `tests/`: E2E and integration test configurations.
- `scripts/`: Build and maintenance scripts.