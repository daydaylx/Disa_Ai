# GEMINI.md

## Project Overview

This project is a modern, professional, mobile-first AI chat Progressive Web App (PWA) named "Disa AI". It is optimized for Android with a focus on a native-like user experience, robust builds, and reproducible deployments. The application is built with React, TypeScript, and Vite, and styled with Tailwind CSS. It features a clean, dark-themed, glassmorphism-inspired UI.

The project is well-structured, with a clear separation of concerns. It includes a comprehensive set of npm scripts for development, testing, and quality assurance. The codebase is written in TypeScript and follows strict coding standards, enforced by ESLint and Prettier.

## Building and Running

### Prerequisites

- Node.js (version specified in `.nvmrc`)
- npm

### Setup

1.  Install dependencies:
    ```bash
    npm ci
    ```
2.  Create a `.env` file from the example:
    ```bash
    cp .env.example .env
    ```
3.  Fill in the required environment variables in the `.env` file.

### Development

- Start the development server:
  ```bash
  npm run dev
  ```

### Production

- Build the application for production:
  ```bash
  npm run build
  ```
- Preview the production build locally:
  ```bash
  npm run preview
  ```

### Testing

- Run unit tests:
  ```bash
  npm run test:unit
  ```
- Run end-to-end tests:
  ```bash
  npm run test:e2e
  ```
- Run all verification checks (type checking, linting, and unit tests):
  ```bash
  npm run verify
  ```

## Development Conventions

### Coding Style

- **TypeScript:** The project uses TypeScript with strict mode enabled.
- **ESLint & Prettier:** Code formatting and quality are enforced by ESLint and Prettier. Linting and formatting are automatically run on pre-commit hooks.
- **Conventional Commits:** The project follows the Conventional Commits specification for commit messages.

### Testing

- **Unit Tests:** Unit tests are written with Vitest and located in `src` alongside the code they test (e.g., `*.test.ts`).
- **End-to-End Tests:** End-to-end tests are written with Playwright and located in the `tests/e2e` directory.
- **Offline-First Testing:** All tests are designed to run without actual network requests, using mocking and request interception.

### Architecture

- **Component-Based:** The application is built with React and follows a component-based architecture.
- **Mobile-First:** The application is designed with a mobile-first approach, with a focus on Android-specific optimizations.
- **Trunk-Based Development:** The project follows a trunk-based development model, with a single `main` branch and short-lived feature branches.
- **ADRs:** Architectural Decision Records (ADRs) are used to document important architectural decisions and are stored in the `docs/adr` directory.
