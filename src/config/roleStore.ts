import type { Safety } from "./models"

export type RoleTemplate = {
  id: string
  name: string
  system?: string
  allow?: string[]
  policy?: Safety
  styleOverlay?: string
  tags?: string[]
}

type RoleState = "idle" | "loading" | "ok" | "missing" | "error"

const SS_KEY = "disa:roles:v1"
let _roles: RoleTemplate[] = []
let _loaded = false
let _loading: Promise<RoleTemplate[]> | null = null
let _state: RoleState = "idle"
let _error: string | null = null

function normalize(input: any): RoleTemplate[] {
  const arr: any[] = Array.isArray(input) ? input
    : Array.isArray(input?.templates) ? input.templates
    : Array.isArray(input?.roles) ? input.roles
    : Array.isArray(input?.styles) ? input.styles
    : []
  const out: RoleTemplate[] = []
  for (const r of arr) {
    const id = String(r?.id ?? "").trim()
    const name = String(r?.name ?? id).trim()
    if (!id || !name) continue
    const item: RoleTemplate = { id, name }
    if (typeof r?.system === "string") item.system = r.system
    if (Array.isArray(r?.allow)) item.allow = r.allow.filter((x: any) => typeof x === "string")
    const pol = r?.policy
    if (pol === "strict" || pol === "moderate" || pol === "loose") item.policy = pol
    if (typeof r?.styleOverlay === "string") item.styleOverlay = r.styleOverlay
    if (Array.isArray(r?.tags)) item.tags = r.tags.filter((x: any) => typeof x === "string")
    out.push(item)
  }
  return out
}

function saveCache(list: RoleTemplate[]) { try { sessionStorage.setItem(SS_KEY, JSON.stringify({ ts: Date.now(), items: list })) } catch {} }
function loadCache(): RoleTemplate[] | null {
  try {
    const raw = sessionStorage.getItem(SS_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed?.items)) return null
    return parsed.items
  } catch { return null }
}

export async function fetchRoleTemplates(force = false): Promise<RoleTemplate[]> {
  if (_loaded && !force) return _roles
  if (_loading && !force) return _loading
  const cached = loadCache()
  if (cached && !force) { _roles = cached; _loaded = true; _state = "ok"; return _roles }

  _state = "loading"; _error = null
  _loading = (async () => {
    try {
      const res = await fetch("/styles.json", { cache: "no-store" })
      if (res.status === 404) { _roles = []; _loaded = true; _state = "missing"; _error = "styles.json nicht gefunden."; return _roles }
      if (!res.ok)          { _roles = []; _loaded = true; _state = "error";   _error = `styles.json HTTP ${res.status}`; return _roles }
      const json = await res.json()
      const list = normalize(json)
      _roles = list; _loaded = true; _state = "ok"; _loading = null
      saveCache(list)
      return _roles
    } catch (e: any) {
      _roles = []; _loaded = true; _state = "error"; _error = e?.message ?? String(e); _loading = null
      return _roles
    }
  })()
  return _loading
}

export function listRoleTemplates(): RoleTemplate[] { return _roles }
export function getRoleById(id: string | null | undefined): RoleTemplate | null {
  if (!id) return null
  return _roles.find(r => r.id === id) ?? null
}
export function getRoleLoadStatus(): { state: RoleState; error: string | null } { return { state: _state, error: _error } }
