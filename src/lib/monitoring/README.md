# Error Tracking & Monitoring Setup

This directory contains the error tracking and monitoring setup using Sentry.

## Configuration

The following environment variables are required for Sentry integration:

### Production Environment Variables

```bash
# Sentry Configuration
VITE_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
SENTRY_ORG=your-sentry-org
SENTRY_PROJECT=your-sentry-project
SENTRY_AUTH_TOKEN=your-sentry-auth-token

# Optional: Environment specification
VITE_ENV=production  # or "staging"
```

### Development

In development mode, Sentry is automatically disabled and errors are logged to console instead.

## Features

### 🔒 Privacy-First Configuration

- No personal identifiable information (PII) is sent
- User IDs are anonymized if provided
- Sensitive URLs and data are filtered out
- Minimal session replay sampling (1%)

### 📊 Performance Monitoring

- 10% transaction sampling in production
- Route navigation tracking
- Custom function profiling
- Performance metrics collection

### 🛡️ Error Filtering

- Network errors are filtered out (user can't control them)
- Storage quota errors are ignored
- Only actionable errors are reported

### 🔧 Development Experience

- Comprehensive error details in development
- Breadcrumb logging for debugging
- Console fallbacks when Sentry is disabled

## Usage Examples

### Manual Error Reporting

```typescript
import { captureError, addBreadcrumb } from "@/lib/monitoring/sentry";

try {
  // risky operation
} catch (error) {
  captureError(error, { context: "user-action", component: "ChatInput" });
}
```

### Adding Debug Breadcrumbs

```typescript
import { addBreadcrumb } from "@/lib/monitoring/sentry";

addBreadcrumb("User started typing message", "user-interaction", {
  inputLength: message.length,
});
```

### Function Profiling

```typescript
import { profileFunction } from "@/lib/monitoring/sentry";

const optimizedFunction = profileFunction(expensiveOperation, "chat-processing");
```

### Setting User Context

```typescript
import { setUserContext } from "@/lib/monitoring/sentry";

setUserContext({
  id: userId, // Will be anonymized automatically
  segment: "premium", // Safe categorical data
});
```

## Error Boundary

The app is wrapped with a Sentry error boundary that provides:

- Automatic error reporting
- User-friendly error UI
- Recovery options (retry/reload)
- Development error details

## Build Integration

Source maps are automatically uploaded to Sentry during production builds when configured with:

- `SENTRY_AUTH_TOKEN`: For uploading source maps
- `SENTRY_ORG` and `SENTRY_PROJECT`: For organization

## Security

- All data is sanitized before sending
- Source maps are only available to authenticated Sentry users
- No sensitive environment variables are exposed to client
- Minimal data collection with maximum privacy protection

## Monitoring Dashboard

Once configured, monitor your application at:
`https://sentry.io/organizations/[ORG]/projects/[PROJECT]/`

Track:

- Error frequency and trends
- Performance metrics
- User sessions (anonymized)
- Release health
