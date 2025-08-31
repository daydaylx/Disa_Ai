const KEY_PREF_ROLE_POLICY = "disa:prefRolePolicy"

export function getPreferRolePolicy(): boolean {
  try {
    const v = localStorage.getItem(KEY_PREF_ROLE_POLICY)
    if (v === null) return true
    return v === "true"
  } catch { return true }
}

export function setPreferRolePolicy(v: boolean) {
  try { localStorage.setItem(KEY_PREF_ROLE_POLICY, v ? "true" : "false") } catch {}
}
