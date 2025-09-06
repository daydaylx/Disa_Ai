const KEY_PREF_ROLE_POLICY = "disa:prefRolePolicy";
const KEY_VIRTUAL_LIST = "disa:feature:virtualList";

export function getPreferRolePolicy(): boolean {
  try {
    const v = localStorage.getItem(KEY_PREF_ROLE_POLICY);
    if (v === null) return true;
    return v === "true";
  } catch {
    return true;
  }
}
export function setPreferRolePolicy(v: boolean) {
  try {
    localStorage.setItem(KEY_PREF_ROLE_POLICY, v ? "true" : "false");
  } catch {
    /* ignore persistence errors (private mode, quota, etc.) */
  }
}

export function getVirtualListEnabled(): boolean {
  try {
    const v = localStorage.getItem(KEY_VIRTUAL_LIST);
    return v === "true"; // default: aus
  } catch {
    return false;
  }
}
export function setVirtualListEnabled(v: boolean) {
  try {
    localStorage.setItem(KEY_VIRTUAL_LIST, v ? "true" : "false");
  } catch {
    /* ignore persistence errors */
  }
}
