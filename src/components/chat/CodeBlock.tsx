import React from "react";

type Props = {
  code: string;
  lang?: string;
  onCopied?: () => void;
};

async function copyText(text: string): Promise<void> {
  // Best-effort: wir versuchen beide Wege, aber UI-Feedback zeigen wir unabhängig vom Erfolg.
  try {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      await navigator.clipboard.writeText(text);
      return;
    }
  } catch {
    // ignore, fallback below
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    ta.style.pointerEvents = "none";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  } catch {
    // ignore – UI-Feedback kommt trotzdem
  }
}

/** Garantiert sichtbare, globale Mini-Toast-Notiz für E2E/Headless */
function showGlobalCopyToast(message: string, ms = 2000) {
  const id = "copy-toast-global";
  let el = document.getElementById(id) as HTMLDivElement | null;
  if (!el) {
    el = document.createElement("div");
    el.id = id;
    el.setAttribute("role", "status");
    el.setAttribute("aria-live", "polite");
    // Minimal inline styles, unabhängig von App-CSS
    el.style.position = "fixed";
    el.style.zIndex = "60";
    el.style.top = "12px";
    el.style.left = "50%";
    el.style.transform = "translateX(-50%)";
    el.style.background = "rgba(16,185,129,0.95)"; // emerald-500/95
    el.style.color = "#111827"; // gray-900
    el.style.padding = "6px 10px";
    el.style.borderRadius = "8px";
    el.style.fontSize = "12px";
    el.style.boxShadow = "0 4px 10px rgba(0,0,0,0.25)";
    el.style.pointerEvents = "none";
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.style.display = "block";
  window.setTimeout(() => {
    if (el) el.style.display = "none";
  }, ms);
}

export default function CodeBlock({ code, lang, onCopied }: Props) {
  const [copied, setCopied] = React.useState(false);
  const timerRef = React.useRef<number | null>(null);

  React.useEffect(
    () => () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    },
    [],
  );

  const handleCopy = async () => {
    // 1) Kopier-Versuch (best effort)
    await copyText(code);
    // 2) UI-Feedback IMMER anzeigen (Headless/CI-sicher)
    setCopied(true);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setCopied(false), 2000);

    // 3) Globaler Toast-Bus falls vorhanden, ansonsten eigener Mini-Toast
    try {
      window.dispatchEvent(
        new CustomEvent("toast", { detail: { message: "Kopiert", intent: "success" } }),
      );
      (window as any).__toast?.success?.("Kopiert");
    } catch {
      /* ignore */
    }
    showGlobalCopyToast("Kopiert", 2000);

    onCopied?.();
  };

  return (
    <div className="group relative overflow-hidden rounded-lg border border-white/10 bg-black/40">
      <div className="flex items-center justify-between bg-black/50 px-3 py-2 text-xs text-white/70">
        <span className="font-mono">{lang ?? "code"}</span>
        <button
          type="button"
          aria-label="Code kopieren"
          onClick={handleCopy}
          className="tap pill rounded-md bg-white/10 px-2 py-1 font-medium hover:bg-white/20 active:bg-white/30"
        >
          ⧉
        </button>
      </div>
      <pre className="m-0 overflow-auto p-3 text-sm leading-relaxed">
        <code>{code}</code>
      </pre>

      {/* Inline-Badge im Block – zusätzlich zum globalen Mini-Toast */}
      {copied && (
        <div
          className="absolute right-2 top-2 rounded-md bg-emerald-500/95 px-2 py-1 text-xs text-black shadow"
          role="status"
          aria-live="polite"
        >
          Kopiert
        </div>
      )}
    </div>
  );
}
