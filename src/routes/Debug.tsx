import React from "react";

export default function Debug() {
  const [state, setState] = React.useState<{
    csp: string | null;
    openrouterOk: boolean | null;
    ua: string;
  }>({ csp: null, openrouterOk: null, ua: navigator.userAgent });

  React.useEffect(() => {
    const csp = document
      .querySelector('meta[http-equiv="Content-Security-Policy"]')
      ?.getAttribute("content");

    // Leichter HEAD-Check gegen OpenRouter Modelle (CORS-sicher? Wir prüfen nur Netzfehler)
    // Falls CORS klemmt, werten wir "ok=false" – Entscheidender Teil ist: Wird durch CSP geblockt?
    fetch("https://openrouter.ai/api/v1/models", { method: "GET", mode: "no-cors" })
      .then(() => setState((s) => ({ ...s, csp: csp ?? null, openrouterOk: true })))
      .catch(() => setState((s) => ({ ...s, csp: csp ?? null, openrouterOk: false })));
  }, []);

  return (
    <div style={{ padding: 16, fontFamily: "ui-sans-serif, system-ui" }}>
      <h1 className="mb-4 text-2xl font-semibold">Debug</h1>
      <ul>
        <li>
          UserAgent: <code>{state.ua}</code>
        </li>
        <li>
          CSP meta im Dokument: <code>{state.csp ?? "(keins/aus Header)"}</code>
        </li>
        <li>
          OpenRouter Reachability:{" "}
          <strong>
            {state.openrouterOk === null ? "..." : state.openrouterOk ? "ok" : "blocked/fail"}
          </strong>
        </li>
      </ul>
      <p>Wenn hier "blocked/fail" steht: Network-Tab checken, ob CSP die Anfrage killt.</p>
    </div>
  );
}
