# GEMINI.md

## Project Overview

This is a professional, mobile-first AI chat Progressive Web App (PWA) built with React, Vite, TypeScript, and Tailwind CSS. The project emphasizes a clean codebase, robust build processes, and production-ready performance. It features a glassmorphism design and is optimized for mobile, particularly Android devices.

The application is designed with a strong focus on security, with API keys managed via `sessionStorage` and a comprehensive Content Security Policy (CSP). It also includes a full suite of testing tools, including Vitest for unit tests and Playwright for end-to-end tests.

## Building and Running

### Development

To run the development server:

```bash
npm run dev
```

### Building

To create a production build:

```bash
npm run build
```

### Testing

To run unit tests:

```bash
npm run test:unit
```

To run end-to-end tests:

```bash
npm run e2e
```

## Development Conventions

### Coding Style

The project enforces a strict coding style using ESLint and Prettier. Configuration for these tools can be found in `eslint.config.mjs` and `.prettierrc.json` respectively. The project also uses `lint-staged` to automatically format and lint files before they are committed.

### Testing

- **Unit Tests:** Vitest is used for unit testing. Test files are located in the `src/__tests__` directory.
- **End-to-End Tests:** Playwright is used for E2E testing. E2E tests are located in the `tests/e2e` directory. The tests are designed to run offline, with network requests intercepted and mocked.

### Commits and Contributions

The project follows the **Conventional Commits** specification. This is enforced through commit hooks. The development model is **Trunk-Based Development**, with short-lived feature branches that are merged into the `main` branch.

### Architecture

The project follows a clean architecture, with a clear separation of concerns. The main application entry point is `src/App.tsx`, which sets up the routing and providers. The application's features are organized into components, hooks, services, and views.
