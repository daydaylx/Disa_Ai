import React from "react";

import report from "../diagnostics/corruptionReport.json";

export default function Diagnostics() {
  const r = report as { generatedAt: string; count: number; files: string[] };
  return (
    <div className="min-h-[100svh] bg-black text-white p-6">
      <h1 className="text-2xl font-bold mb-2">Projekt-Diagnose</h1>
      <p className="opacity-80">Report erstellt: {new Date(r.generatedAt).toLocaleString()}</p>
      {r.count > 0 ? (
        <>
          <p className="mt-4">
            Es wurden <b>{r.count}</b> beschädigte Dateien gefunden (enthalten wörtlich „...“).
            Ersetze diese Dateien durch saubere Originale. Ohne das ist ein Build sinnlos.
          </p>
          <ul className="mt-4 space-y-1 text-sm">
            {r.files.map(f => (
              <li key={f} className="font-mono">{f}</li>
            ))}
          </ul>
        </>
      ) : (
        <p className="mt-4">Keine offensichtliche Korruption erkannt. Dann liegt der Fehler woanders.</p>
      )}
    </div>
  );
}
