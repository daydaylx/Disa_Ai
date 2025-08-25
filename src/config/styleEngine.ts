import type { StyleKey } from "./promptStyles"

type StyleProfile = {
  concision: "minimal" | "concise" | "balanced" | "detailed"
  formality: "low" | "medium" | "high"
  humor: "none" | "light" | "sarcastic"
  emojis: boolean
  bulletPreference: "avoid" | "allow" | "prefer"
  maxBullets: number
  structure: string[]
  priority: string[]
  disclaimers: string[]
  bans: string[]
  persona: string[]
}

function baseProfile(style: StyleKey): StyleProfile {
  if (style === "blunt_de") return {
    concision: "balanced",
    formality: "medium",
    humor: "sarcastic",
    emojis: false,
    bulletPreference: "allow",
    maxBullets: 6,
    structure: ["Risiken zuerst", "dann Alternativen", "zum Schluss klare Schritte"],
    priority: ["Ehrlichkeit", "Klarheit", "Kürze"],
    disclaimers: [],
    bans: ["Floskeln", "Motivationssprech"],
    persona: ["direkt", "kritisch"]
  }
  if (style === "concise") return {
    concision: "concise",
    formality: "medium",
    humor: "none",
    emojis: false,
    bulletPreference: "prefer",
    maxBullets: 5,
    structure: ["Kernaussage", "Stichpunkte"],
    priority: ["Kürze"],
    disclaimers: [],
    bans: ["Ausschweifen"],
    persona: ["knapp"]
  }
  if (style === "friendly") return {
    concision: "balanced",
    formality: "low",
    humor: "light",
    emojis: false,
    bulletPreference: "allow",
    maxBullets: 6,
    structure: ["Kurz erklären", "Schritte"],
    priority: ["Verständlichkeit"],
    disclaimers: [],
    bans: [],
    persona: ["freundlich"]
  }
  if (style === "creative_light") return {
    concision: "balanced",
    formality: "medium",
    humor: "light",
    emojis: false,
    bulletPreference: "allow",
    maxBullets: 6,
    structure: ["Beispiel", "Erklärung", "Schritte"],
    priority: ["Anschaulichkeit"],
    disclaimers: [],
    bans: ["übertriebenes Storytelling"],
    persona: ["bildhaft"]
  }
  if (style === "minimal") return {
    concision: "minimal",
    formality: "medium",
    humor: "none",
    emojis: false,
    bulletPreference: "avoid",
    maxBullets: 0,
    structure: ["Antwort"],
    priority: ["Signal-to-Noise"],
    disclaimers: [],
    bans: ["Meta-Sätze"],
    persona: ["direkt"]
  }
  return {
    concision: "balanced",
    formality: "medium",
    humor: "none",
    emojis: false,
    bulletPreference: "allow",
    maxBullets: 6,
    structure: ["Antwort", "Schritte"],
    priority: ["Klarheit"],
    disclaimers: [],
    bans: [],
    persona: ["sachlich"]
  }
}

type Overlay = Partial<StyleProfile>

function roleOverlay(roleId: string | null): Overlay {
  if (!roleId) return {}
  if (roleId === "legal_generalist") return {
    formality: "high",
    humor: "none",
    bulletPreference: "prefer",
    maxBullets: 8,
    structure: ["Sachverhalt klären", "Rechtslage", "Risiken", "Optionen", "Nächste Schritte"],
    disclaimers: ["Keine individuelle Rechtsberatung"],
    bans: ["Spekulation", "Umgangssprache"],
    persona: ["präzise", "juristisch"]
  }
  if (roleId === "therapist_expert") return {
    formality: "medium",
    humor: "none",
    bulletPreference: "allow",
    maxBullets: 6,
    structure: ["Spiegeln", "Validieren", "Optionen", "Übungen"],
    disclaimers: ["Ersetzt keine medizinische/therapeutische Diagnose"],
    bans: ["Sarkasmus"],
    persona: ["empathisch"]
  }
  if (roleId === "email_professional") return {
    formality: "high",
    humor: "none",
    bulletPreference: "prefer",
    maxBullets: 6,
    structure: ["Betreff", "Anrede", "Kern", "Punkte", "Schlussformel"],
    persona: ["geschäftlich"]
  }
  if (roleId === "sarcastic_direct") return {
    formality: "low",
    humor: "sarcastic",
    bulletPreference: "allow",
    persona: ["trocken", "bissig"],
    bans: ["Beleidigungen"]
  }
  if (roleId === "productivity_helper") return {
    formality: "medium",
    humor: "none",
    bulletPreference: "prefer",
    structure: ["Ziel", "Schritte", "Checkliste"],
    priority: ["Umsetzbarkeit"]
  }
  if (roleId === "language_teacher") return {
    formality: "medium",
    humor: "light",
    bulletPreference: "prefer",
    structure: ["Erklärung", "Beispiele", "Übung"],
    priority: ["Didaktik"]
  }
  if (roleId === "fitness_nutrition_coach") return {
    formality: "medium",
    humor: "none",
    bulletPreference: "prefer",
    structure: ["Ziel", "Plan", "Monitoring"],
    disclaimers: ["Kein Ersatz für ärztlichen Rat"]
  }
  if (roleId === "ebay_coach") return {
    formality: "low",
    humor: "light",
    bulletPreference: "prefer",
    maxBullets: 7,
    structure: ["Titel", "USP", "Details", "Zustand", "Lieferung"],
    priority: ["Verkaufstauglichkeit"]
  }
  if (roleId === "uncensored_expert") return {
    formality: "medium",
    humor: "none",
    bulletPreference: "allow",
    bans: ["Verschlüsselungen", "Rot13", "Base64"],
    persona: ["direkt"]
  }
  if (roleId === "erotic_creative_author") return {
    formality: "medium",
    humor: "none",
    bulletPreference: "allow",
    concision: "detailed",
    structure: ["Charaktere", "Szene", "Dynamik"],
    bans: ["Codes", "Verschlüsselungen"],
    persona: ["erzählerisch"]
  }
  if (roleId === "nsfw_roleplay") return {
    formality: "low",
    humor: "none",
    bulletPreference: "avoid",
    concision: "detailed",
    structure: ["Dialog", "Innenperspektive", "Handlung"],
    bans: ["Meta-Kommentare", "Verschlüsselungen"],
    persona: ["immersiv"]
  }
  return {}
}

function merge(base: StyleProfile, overlay: Overlay): StyleProfile {
  const out: StyleProfile = { ...base }
  if (overlay.concision) out.concision = overlay.concision
  if (overlay.formality) out.formality = overlay.formality
  if (overlay.humor) out.humor = overlay.humor
  if (typeof overlay.emojis === "boolean") out.emojis = overlay.emojis
  if (overlay.bulletPreference) out.bulletPreference = overlay.bulletPreference
  if (typeof overlay.maxBullets === "number") out.maxBullets = overlay.maxBullets
  if (overlay.structure) out.structure = overlay.structure
  if (overlay.priority) out.priority = overlay.priority
  if (overlay.disclaimers) out.disclaimers = overlay.disclaimers
  if (overlay.bans) out.bans = overlay.bans
  if (overlay.persona) out.persona = overlay.persona
  return out
}

function profileToText(p: StyleProfile): string {
  const lines: string[] = []
  lines.push(`Feintuning: Ton=${p.formality}, Kürze=${p.concision}, Humor=${p.humor}, Emojis=${p.emojis ? "ja" : "nein"}.`)
  if (p.priority.length) lines.push(`Priorität: ${p.priority.join(" → ")}.`)
  if (p.structure.length) lines.push(`Struktur: ${p.structure.join(" → ")}.`)
  lines.push(`Listen: ${p.bulletPreference}${p.maxBullets > 0 ? ` (max. ${p.maxBullets} Punkte)` : ""}.`)
  if (p.disclaimers.length) lines.push(`Hinweise: ${p.disclaimers.join(" | ")}.`)
  if (p.bans.length) lines.push(`Vermeiden: ${p.bans.join(", ")}.`)
  if (p.persona.length) lines.push(`Rolle: ${p.persona.join(", ")}.`)
  return lines.join("\n")
}

export function generateRoleStyleText(roleId: string | null, style: StyleKey, useRoleStyle: boolean): string {
  const base = baseProfile(style)
  if (!useRoleStyle) return profileToText(base)
  const overlay = roleOverlay(roleId)
  const merged = merge(base, overlay)
  return profileToText(merged)
}
