export interface BackoffOptions {
  baseMs?: number; // Basis-Wartezeit
  factor?: number; // Exponent
  jitter?: number; // 0..1
  maxMs?: number; // Obergrenze pro Schritt
}

export function backoffDelay(attempt: number, opts: BackoffOptions = {}): number {
  const base = opts.baseMs ?? 400;
  const factor = opts.factor ?? 2;
  const maxMs = opts.maxMs ?? 10_000;
  const jitter = Math.max(0, Math.min(1, opts.jitter ?? 0.2));
  const raw = Math.min(maxMs, base * Math.pow(factor, Math.max(0, attempt)));
  const delta = raw * jitter * Math.random();
  // +- jitter
  return Math.max(0, raw - delta / 2 + delta * Math.random());
}

export function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
