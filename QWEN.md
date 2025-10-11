# Disa AI - Project Context

## Project Overview

Disa AI is a professional, mobile-first AI Chat Progressive Web App (PWA) built with React, Vite, TypeScript, and Tailwind CSS. The application is specifically designed for optimal display on mobile devices (especially Android) and features a modern Glassmorphism design, a robust codebase, and a security and performance-focused architecture.

## Sprachrichtlinien

- **Sprache**: Die primäre Sprache für alle Benutzeroberflächen, Dokumentationen und Benutzerinteraktionen ist Deutsch.
- **Benutzerkommunikation**: Alle Antworten und Mitteilungen an den Endbenutzer erfolgen auf Deutsch.
- **Entwicklerdokumentation**: Technische Dokumentation kann in Englisch verfasst sein, aber Benutzeroberflächenkommentare sollten auf Deutsch erfolgen.

## Key Features

- **Flexible AI Integration**: Integration with OpenRouter.ai supporting NDJSON streaming for a wide range of language models
- **Dynamic Model Catalog**: Filterable view for quick selection of models based on criteria like price, context window, or provider
- **Advanced Role System**: Predefined and externally loaded persona templates (e.g. "Email Expert", "Creative Writer") that adapt AI behavior
- **Context Memory (Optional)**: App can remember user preferences and send them as system context with each request
- **Progressive Web App**: Fully installable with offline capabilities using a Service Worker
- **Mobile-First UX**: Optimized for smartphones with viewport handling and accessibility features
- **Glassmorphism Design**: Modern design with transparent layers and consistent CSS utilities

## Tech Stack

- **Framework**: React 19, TypeScript 5.9, Vite 7
- **Styling**: Tailwind CSS, Radix UI Primitives, Lucide Icons, `clsx`, `tailwind-merge`
- **State & Routing**: React Router v6, Zod (for schema validation)
- **PWA / Offline**: Vite PWA Plugin (Workbox)
- **Unit-Testing**: Vitest, Happy DOM, MSW (Mock Service Worker)
- **E2E-Testing**: Playwright, @axe-core/playwright (for Accessibility-Tests)
- **Code-Qualität**: ESLint, Prettier, Husky, lint-staged
- **Deployment**: Cloudflare Pages

## Project Architecture

The project follows a clear folder structure based on separation of responsibilities:

```
src/
├── api/          # API calls (e.g. OpenRouter)
├── app/          # App setup: Router, Layouts, global states
├── components/   # Reusable UI components
├── config/       # Configuration: Models, Prompts, Feature-Flags, Settings
├── data/         # Data adapters and transformations
├── hooks/        # Central business logic (e.g. useChat, useMemory)
├── lib/          # General utilities
├── pages/        # Views for individual routes (e.g. Chat, Settings)
├── services/     # Background services
├── state/        # State management
├── styles/       # Global styles and Tailwind layers
└── types/        # Global type definitions
```

## Building and Running

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be accessible at `http://localhost:5173`.

### Production Build

```bash
# Create optimized production build
npm run build
```

### Testing & Quality Assurance

```bash
# Run unit tests
npm run test:unit

# Run end-to-end tests
npm run test:e2e

# Run type checking
npm run typecheck

# Run linting
npm run lint

# Run code formatting check
npm run format

# Run comprehensive verification (typecheck + lint + unit tests)
npm run verify
```

### Preview Production Build

```bash
# Preview the production build locally
npm run preview
```

## Security Features

- **Client-side Key Management**: API keys stored only in `sessionStorage`, automatically deleted when session ends
- **Strict Content Security Policy (CSP)**: Comprehensive CSP configured in `public/_headers` to minimize XSS risks
- **Separated System Context**: Role and memory prompts injected at runtime and not visible in chat logs
- **Input Validation**: All user inputs are validated using Zod schemas

## Development Conventions

- **Code Style**: Follows ESLint and Prettier configurations for consistent code style
- **Commit Convention**: Uses Conventional Commits specification enforced by pre-commit hooks
- **Testing**: Unit tests with Vitest, E2E tests with Playwright, accessibility testing integrated
- **Type Safety**: Strict TypeScript configuration with additional safety rules like `noUncheckedIndexedAccess`
- **Accessibility**: All interactive elements meet WCAG 2.1 guidelines (minimum 48x48px touch targets)

## Deployment

- **Hosting**: Application deployed on Cloudflare Pages
- **Continuous Deployment**: Pushes to main branch trigger automatic build and deployment
- **Caching Strategy**: Assets with hash names are aggressively cached, Service Worker uses Network-First for HTML and Stale-While-Revalidate for other assets
- **Security Headers**: Strict CSP delivered via `_headers` file

## Important Files and Directories

- `package.json`: Contains all dependencies and available scripts
- `tsconfig.json`: TypeScript configuration with strict settings
- `vite.config.ts`: Vite build configuration
- `public/`: Static assets including headers, redirects, and PWA manifest
- `SECURITY.md`: Detailed security architecture and policy

## Special Considerations

- The project is mobile-first with specific viewport handling for virtual keyboards and mobile browsers
- Uses a design token system for consistent styling across the application
- Implements advanced viewport height handling with JavaScript to address mobile browser inconsistencies
- Includes pre-commit hooks that run linting and formatting automatically
- Uses lazy loading for route components to improve initial load performance
- Has a comprehensive error boundary system for better user experience
- Features accessibility testing as part of the E2E test suite
