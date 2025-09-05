import * as React from "react";

type Check = {
  id: string;
  label: string;
  ok: boolean | null;
  detail?: string;
};

function toRGB(str: string | null): [number, number, number] | null {
  if (!str) return null;
  // rgb(a) or color keywords — rely on computedStyle -> rgb()
  const m = str.match(/rgba?\(\s*([0-9.]+)\s*,\s*([0-9.]+)\s*,\s*([0-9.]+)/i);
  if (!m) return null;
  return [Number(m[1]), Number(m[2]), Number(m[3])];
}

function relLum([r, g, b]: [number, number, number]): number {
  // sRGB -> linear
  const tn = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const R = tn(r),
    G = tn(g),
    B = tn(b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function contrastRatio(fg: [number, number, number], bg: [number, number, number]): number {
  const L1 = relLum(fg);
  const L2 = relLum(bg);
  const [Lmax, Lmin] = L1 >= L2 ? [L1, L2] : [L2, L1];
  return (Lmax + 0.05) / (Lmin + 0.05);
}

function getBgColor(el: Element): string | null {
  // climb up to find non-transparent background
  let node: Element | null = el;
  while (node) {
    const c = window.getComputedStyle(node).backgroundColor;
    if (c && c !== "rgba(0, 0, 0, 0)" && c !== "transparent") return c;
    node = node.parentElement;
  }
  // fallback to body
  return window.getComputedStyle(document.body).backgroundColor;
}

export default function StyleProbe(): JSX.Element {
  const [checks, setChecks] = React.useState<Check[]>([]);
  const [dark, setDark] = React.useState<boolean>(() =>
    document.documentElement.classList.contains("dark"),
  );

  React.useEffect(() => {
    const results: Check[] = [];

    // 1) Tailwind basic utility present?
    const probe = document.createElement("div");
    probe.className = "test-tw hidden bg-indigo-600 text-white";
    document.body.appendChild(probe);
    const cs = window.getComputedStyle(probe);
    const bgOk = cs.backgroundColor !== "" && cs.backgroundColor !== "rgba(0, 0, 0, 0)";
    results.push({
      id: "tw-basic",
      label: "Tailwind Utilities geladen",
      ok: bgOk,
      detail: bgOk ? cs.backgroundColor : "Kein Hintergrund vom Utility",
    });
    document.body.removeChild(probe);

    // 2) Arbitrary values parsed?
    const arb = document.createElement("div");
    arb.style.width = "100vw";
    arb.className = "max-w-[calc(100vw-1rem)]";
    document.body.appendChild(arb);
    const arbOk = arb.getBoundingClientRect().width <= window.innerWidth - 1; // grobe Plausibilität
    results.push({
      id: "tw-arbitrary",
      label: "Arbitrary Values (calc, []-Syntax)",
      ok: arbOk,
      detail: `clientWidth=${arb.getBoundingClientRect().width.toFixed(2)} vs vw=${window.innerWidth}`,
    });
    document.body.removeChild(arb);

    // 3) supports-Variant (backdrop-filter) vorhanden?
    const sup = CSS && "supports" in CSS ? CSS.supports("backdrop-filter: blur(2px)") : false;
    results.push({
      id: "tw-supports-variant",
      label: "supports:[backdrop-filter] Variant verwendbar",
      ok: Boolean(sup),
      detail: sup
        ? "Browser unterstützt backdrop-filter"
        : "Kein Support (ok, Klasse greift dann nicht)",
    });

    // 4) Kontraste echter UI-Elemente messen (optional falls gefunden)
    const header = document.querySelector("header");
    const sendBtn = document.querySelector('button[title="Senden"]') as HTMLElement | null;
    const ta = document.querySelector("textarea") as HTMLElement | null;

    const measureContrast = (el: HTMLElement | null, label: string) => {
      if (!el) {
        results.push({
          id: `contrast-${label}`,
          label: `Kontrast: ${label}`,
          ok: null,
          detail: "Element nicht gefunden",
        });
        return;
      }
      const st = window.getComputedStyle(el);
      const fg = toRGB(st.color);
      const bg = toRGB(getBgColor(el));
      if (!fg || !bg) {
        results.push({
          id: `contrast-${label}`,
          label: `Kontrast: ${label}`,
          ok: null,
          detail: "Farben nicht ermittelbar",
        });
        return;
      }
      const ratio = contrastRatio(fg, bg);
      const ok = ratio >= 4.5;
      results.push({
        id: `contrast-${label}`,
        label: `Kontrast: ${label}`,
        ok,
        detail: `${ratio.toFixed(2)} : 1 (Ziel ≥ 4.5:1)`,
      });
    };

    measureContrast(header as HTMLElement | null, "Header");
    measureContrast(sendBtn, "Senden-Button");
    measureContrast(ta, "Textarea");

    // 5) z-index: Dropdown über Header?
    const sessionMenuPanel = document.querySelector('[role="menu"]') as HTMLElement | null;
    if (sessionMenuPanel) {
      const zi = window.getComputedStyle(sessionMenuPanel).zIndex;
      results.push({
        id: "z-index-menu",
        label: "Session-Dropdown liegt über dem Header",
        ok: Number(zi) >= 50, // wir geben z-50 in der Klasse vor
        detail: `z-index=${zi}`,
      });
    } else {
      results.push({
        id: "z-index-menu",
        label: "Session-Dropdown liegt über dem Header",
        ok: null,
        detail: "Menü aktuell nicht geöffnet",
      });
    }

    setChecks(results);
  }, [dark]);

  function toggleDark(): void {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    setDark(next);
  }

  return (
    <div className="pointer-events-none fixed inset-2 z-[9999] sm:inset-4">
      <div className="pointer-events-auto mx-auto max-w-3xl rounded-xl border border-neutral-300 bg-white/90 p-4 shadow-2xl backdrop-blur dark:border-neutral-700 dark:bg-neutral-900/90">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            Style Probe
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleDark}
              className="rounded-md border border-neutral-300 bg-white px-2 py-1 text-xs dark:border-neutral-700 dark:bg-neutral-800"
              title="Dark-Mode umschalten"
            >
              Dark
            </button>
          </div>
        </div>

        <ul className="space-y-1">
          {checks.map((c) => (
            <li key={c.id} className="flex items-start gap-2 text-sm">
              <span
                className={
                  c.ok === true
                    ? "text-green-600"
                    : c.ok === false
                      ? "text-red-600"
                      : "text-neutral-500"
                }
              >
                {c.ok === true ? "✔" : c.ok === false ? "✖" : "•"}
              </span>
              <div>
                <div className="text-neutral-900 dark:text-neutral-100">{c.label}</div>
                {c.detail ? (
                  <div className="text-xs text-neutral-500 dark:text-neutral-400">{c.detail}</div>
                ) : null}
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-3 text-[11px] text-neutral-500 dark:text-neutral-400">
          Hinweis: Das Overlay wird nur angezeigt, wenn die URL <code>?probe=1</code> enthält.
        </div>
      </div>
    </div>
  );
}
