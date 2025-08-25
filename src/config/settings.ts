const MODEL_KEY = "disa:settings:modelId"
const NSFW_KEY = "disa:settings:nsfw"
const STYLE_KEY = "disa:settings:style"
const TEMPLATE_KEY = "disa:settings:templateId"

export function getSelectedModelId(): string | null { try { return localStorage.getItem(MODEL_KEY) } catch { return null } }
export function setSelectedModelId(id: string) { try { localStorage.setItem(MODEL_KEY, id) } catch {} }

export function getNSFW(): boolean { try { const raw = localStorage.getItem(NSFW_KEY); return raw === "1" || raw === "true" } catch { return false } }
export function setNSFW(on: boolean) { try { localStorage.setItem(NSFW_KEY, on ? "1" : "0") } catch {} }

export type StyleKey = "neutral" | "blunt_de" | "concise" | "friendly" | "creative_light" | "minimal"
export function getStyle(): StyleKey { try { const raw = localStorage.getItem(STYLE_KEY) as StyleKey | null; return raw ?? "blunt_de" } catch { return "blunt_de" } }
export function setStyle(k: StyleKey) { try { localStorage.setItem(STYLE_KEY, k) } catch {} }

export function getTemplateId(): string | null { try { return localStorage.getItem(TEMPLATE_KEY) } catch { return null } }
export function setTemplateId(id: string | null) { try { if (id) localStorage.setItem(TEMPLATE_KEY, id); else localStorage.removeItem(TEMPLATE_KEY) } catch {} }
