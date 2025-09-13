import '@testing-library/jest-dom/vitest';

import { ApiError } from '../src/lib/errors';

process.on('unhandledRejection', (reason) => {
  if (reason && typeof reason === 'object' && (reason instanceof ApiError)) return;
  throw reason;
});