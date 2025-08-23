export function publicAsset(path: string): string {
  const base = (import.meta as any)?.env?.BASE_URL ?? "/";
  const normalized = String(path).replace(/^\/+/, "");
<<<<<<< HEAD
  return new URL(base + normalized, window.location.origin).toString();
}
=======
  const joined = `${String(base).replace(/\/+$/, "")}/${normalized}`;
  const origin = typeof window !== "undefined" && window.location ? window.location.origin : "";
  return `${origin}${joined}`;
}
>>>>>>> 1b03054 (fix(build): parenthesize nullish-coalescing before logical OR in Chat.tsx)
