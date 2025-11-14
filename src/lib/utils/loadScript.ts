type LoadScriptOptions = {
  src: string;
  id?: string;
  crossOrigin?: "anonymous" | "use-credentials";
  integrity?: string;
  referrerPolicy?: ReferrerPolicy;
  async?: boolean;
  importance?: "auto" | "high" | "low";
};

const inflightScripts = new Map<string, Promise<void>>();

/**
 * Dynamically loads an external script with basic caching to avoid duplicate requests.
 */
export function loadScript(options: LoadScriptOptions): Promise<void> {
  if (typeof document === "undefined") {
    return Promise.resolve();
  }

  const cacheKey = options.id ?? options.src;
  if (cacheKey && inflightScripts.has(cacheKey)) {
    return inflightScripts.get(cacheKey)!;
  }

  if (options.id) {
    const existing = document.getElementById(options.id) as HTMLScriptElement | null;
    if (existing?.tagName === "SCRIPT") {
      if ((existing as any).dataset.loaded === "true") {
        return Promise.resolve();
      }

      return new Promise<void>((resolve, reject) => {
        existing.addEventListener(
          "load",
          () => {
            (existing as any).dataset.loaded = "true";
            resolve();
          },
          { once: true },
        );
        existing.addEventListener("error", reject, { once: true });
      });
    }
  }

  const head = document.head ?? document.getElementsByTagName("head")[0];
  if (!head) {
    return Promise.resolve();
  }

  const script = document.createElement("script");
  script.src = options.src;
  script.defer = true;
  script.async = options.async ?? true;
  if (options.id) script.id = options.id;
  if (options.crossOrigin) script.crossOrigin = options.crossOrigin;
  if (options.integrity) script.integrity = options.integrity;
  if (options.referrerPolicy) script.referrerPolicy = options.referrerPolicy;
  if (options.importance) (script as any).importance = options.importance;

  const loadPromise = new Promise<void>((resolve, reject) => {
    script.addEventListener(
      "load",
      () => {
        (script as any).dataset.loaded = "true";
        resolve();
      },
      { once: true },
    );
    script.addEventListener(
      "error",
      (event) => {
        script.remove();
        if (cacheKey) inflightScripts.delete(cacheKey);
        reject(event instanceof ErrorEvent ? event.error : new Error("Script failed to load"));
      },
      { once: true },
    );
  });

  if (cacheKey) {
    inflightScripts.set(cacheKey, loadPromise);
  }

  head.appendChild(script);
  return loadPromise;
}
