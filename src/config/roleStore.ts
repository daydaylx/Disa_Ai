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

const SS_KEY = "disa:roles:v2" // v2 => bricht alten Session-Cache bewusst
let _roles: RoleTemplate[] = []
let _loaded = false
let _loading: Promise<RoleTemplate[]> | null = null
let _state: RoleState = "idle"
let _error: string | null = null

function asArray(x: any): any[] { return Array.isArray(x) ? x : [] }

function pickId(r: any): string {
  const raw = r?.id ?? r?.key ?? r?.slug ?? r?.name ?? r?.title ?? ""
  return String(raw).trim()
}
function pickName(r: any, id: string): string {
  const raw = r?.name ?? r?.title ?? id
  return String(raw).trim()
}
function pickSystem(r: any): string | undefined {
  const raw = r?.system ?? r?.prompt ?? r?.template ?? r?.content
  return typeof raw === "string" && raw.trim() ? raw : undefined
}
function pickAllow(r: any): string[] | undefined {
  const src = r?.allow
  if (Array.isArray(src)) return src.filter((s: any) => typeof s === "string")
  if (typeof src === "string") return src.split(",").map(s => s.trim()).filter(Boolean)
  return undefined
}
function pickPolicy(r: any): Safety | undefined {
  const raw = (r?.policy ?? r?.safety ?? r?.moderation)
  if (raw === "strict" || raw === "moderate" || raw === "loose") return raw
  if (typeof raw === "string") {
    const s = raw.toLowerCase()
    if (/(strict|hard|tight|safe)/.test(s)) return "strict"
    if (/(loose|uncensored|nsfw)/.test(s)) return "loose"
    if (/(moderate|default|normal)/.test(s)) return "moderate"
  }
  return undefined
}
function pickTags(r: any): string[] | undefined {
  const src = r?.tags
  if (Array.isArray(src)) return src.filter((t: any) => typeof t === "string")
  if (typeof src === "string") return src.split(",").map((t) => t.trim()).filter(Boolean)
  return undefined
}

function normalizeRoot(input: any): any[] {
  if (Array.isArray(input)) return input
  if (Array.isArray(input?.templates)) return input.templates
  if (Array.isArray(input?.roles)) return input.roles
  if (Array.isArray(input?.styles)) return input.styles
  if (Array.isArray(input?.data)) return input.data
  return []
}

function normalize(input: any): RoleTemplate[] {
  const arr = normalizeRoot(input)
  const out: RoleTemplate[] = []
  for (const r of arr) {
    const idRaw = pickId(r)
    const id = idRaw || ""
    const name = pickName(r, id)
    if (!id || !name) continue
    const item: RoleTemplate = { id, name }
    const sys = pickSystem(r); if (sys) item.system = sys
    const allow = pickAllow(r); if (allow) item.allow = allow
    const pol = pickPolicy(r); if (pol) item.policy = pol
    const tags = pickTags(r); if (tags) item.tags = tags
    if (typeof r?.styleOverlay === "string") item.styleOverlay = r.styleOverlay
    out.push(item)
  }
  return out
}

function saveCache(list: RoleTemplate[]) {
  try { sessionStorage.setItem(SS_KEY, JSON.stringify({ ts: Date.now(), items: list })) } catch {}
}
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
      if (res.status === 404) { _roles = []; _loaded = true; _state = "missing"; _error = "styles.json nicht gefunden (public/styles.json)"; return _roles }
      if (!res.ok)          { _roles = []; _loaded = true; _state = "error";   _error = `styles.json HTTP ${res.status}`; return _roles }
      const json = await res.json()
      const list = normalize(json)
      _roles = list; _loaded = true; _state = "ok"; _error = null
      saveCache(list)
      _loading = null
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
