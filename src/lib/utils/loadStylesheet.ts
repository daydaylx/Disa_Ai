type StylesheetOptions = {
  href: string;
  id?: string;
  crossOrigin?: "anonymous" | "use-credentials";
  integrity?: string;
  referrerPolicy?: ReferrerPolicy;
  importance?: "auto" | "high" | "low";
};

const inFlightLoads = new Map<string, Promise<void>>();

/**
 * Dynamically append a stylesheet link tag to the document head.
 * Keeps track of inflight loads to prevent duplicate requests and
 * resolves immediately when the stylesheet has already been added.
 */
export function loadStylesheet(options: StylesheetOptions): Promise<void> {
  if (typeof document === "undefined") {
    return Promise.resolve();
  }

  const cacheKey = options.id ?? options.href;

  if (cacheKey && inFlightLoads.has(cacheKey)) {
    return inFlightLoads.get(cacheKey)!;
  }

  if (options.id) {
    const existing = document.getElementById(options.id) as HTMLLinkElement | null;
    if (existing?.tagName === "LINK") {
      if (existing.sheet || existing.dataset.loaded === "true") {
        return Promise.resolve();
      }

      return new Promise<void>((resolve, reject) => {
        existing.addEventListener(
          "load",
          () => {
            existing.dataset.loaded = "true";
            resolve();
          },
          { once: true },
        );
        existing.addEventListener(
          "error",
          (event) => {
            reject(event instanceof ErrorEvent ? event.error : new Error("Stylesheet failed"));
          },
          { once: true },
        );
      });
    }
  }

  const head = document.head ?? document.getElementsByTagName("head")[0];
  if (!head) {
    return Promise.resolve();
  }

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = options.href;
  if (options.id) link.id = options.id;
  if (options.crossOrigin) link.crossOrigin = options.crossOrigin;
  if (options.integrity) link.integrity = options.integrity;
  if (options.referrerPolicy) link.referrerPolicy = options.referrerPolicy;
  if (options.importance) (link as any).importance = options.importance;

  const loadPromise = new Promise<void>((resolve, reject) => {
    link.addEventListener(
      "load",
      () => {
        link.dataset.loaded = "true";
        resolve();
      },
      { once: true },
    );

    link.addEventListener(
      "error",
      (event) => {
        link.remove();
        if (cacheKey) {
          inFlightLoads.delete(cacheKey);
        }
        reject(event instanceof ErrorEvent ? event.error : new Error("Stylesheet failed"));
      },
      { once: true },
    );
  });

  if (cacheKey) {
    inFlightLoads.set(cacheKey, loadPromise);
  }

  head.appendChild(link);

  return loadPromise;
}
