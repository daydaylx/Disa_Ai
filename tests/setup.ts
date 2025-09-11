import '@testing-library/jest-dom/vitest';

process.on('unhandledRejection', (reason) => {
  if (reason && typeof reason === 'object' && (reason as any).name === 'NetworkError') return;
  throw reason;
});
