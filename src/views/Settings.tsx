import { Suspense, lazy, useCallback } from "react";
import { useModel } from "@/hooks/useModel";
import { useStyle } from "@/config/style";

const ModelPicker = lazy(() => import("@/components/ModelPicker"));

export default function Settings() {
  const { models, modelId, setModelId, refreshCatalog } = useModel({ preferFree: false });
  const { style, role, setRole, policyFromRole, refreshStyle } = useStyle();

  const handleChange = useCallback(
    (next: string) => { setModelId(next); },
    [setModelId]
  );

  const roles = Object.keys(style.roles);

  const modelPickerProps =
    policyFromRole !== undefined
      ? { value: modelId, onChange: handleChange, models, policyFromRole }
      : { value: modelId, onChange: handleChange, models };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-xl font-semibold">Einstellungen</h1>

      <section className="space-y-3">
        <h2 className="text-base font-medium">Rolle</h2>
        <div className="flex gap-3 items-end">
          <div className="w-80">
            <label className="text-sm block mb-1">Aktive Rolle (aus style.json)</label>
            <select
              className="border rounded px-2 py-1 bg-white dark:bg-zinc-900 w-full"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              {roles.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <button
            className="px-3 py-2 rounded bg-zinc-800 text-white hover:bg-zinc-700"
            onClick={() => void refreshStyle()}
            type="button"
            title="style.json neu laden"
          >
            Style aktualisieren
          </button>
        </div>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Policy aus Rolle: <code>{policyFromRole ?? "—"}</code>
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-medium">Modell</h2>
        <div className="flex gap-3 items-end">
          <div className="w-96">
            <Suspense fallback={<div className="text-sm text-zinc-500">Modelle laden…</div>}>
              <ModelPicker {...modelPickerProps} />
            </Suspense>
          </div>
          <button
            className="px-3 py-2 rounded bg-zinc-800 text-white hover:bg-zinc-700"
            onClick={() => void refreshCatalog()}
            type="button"
            title="Modellkatalog neu laden"
          >
            Katalog aktualisieren
          </button>
        </div>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Der Modellkatalog nutzt OpenRouter (falls API-Key vorhanden) und fällt sonst auf eine Offline-Liste zurück.
        </p>
      </section>
    </div>
  );
}
