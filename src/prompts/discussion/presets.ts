export type DiscussionPresetKey = "locker_neugierig" | "edgy_provokant" | "nuechtern_pragmatisch" | "akademisch_formell" | "freundlich_offen" | "analytisch_detailliert" | "sarkastisch_witzig" | "fachlich_tiefgehend";

export const discussionPresets: Record<DiscussionPresetKey, string> = {
  locker_neugierig:
    "entspannt, humorvoll, neugierig, mit kurzen Analogien oder Alltagsvergleichen, aber ohne Albernheit",
  edgy_provokant:
    "knackig, pointiert, leicht provokant, leichte Reibung erlaubt, respektvoll bleiben, klare Kante",
  nuechtern_pragmatisch:
    "wenig Witz, klare Kurzthese, sachlich abwägend, lösungsorientiert, Fokus auf pragmatische Argumente",
  akademisch_formell:
    "formelle Sprache, wissenschaftlicher Stil, zitiere Quellen wenn möglich, fachliche Präzision",
  freundlich_offen:
    "freundlich, einladend, offene Fragen, empathisch, verständnisvoll, unterstützend",
  analytisch_detailliert:
    "schrittweise Analyse, logische Argumentationskette, Beispiele und Gegenbeispiele, Fokus auf Details",
  sarkastisch_witzig:
    "hintergründig, mit sarkastischem Humor, leicht ironisch, pointiert aber nicht verletzend",
  fachlich_tiefgehend:
    "fachkundig, tiefgehend, technische Präzision, Expertenwissen, detaillierte Erklärungen"
};

export const discussionPresetOptions: Array<{ key: DiscussionPresetKey; label: string }> = [
  { key: "locker_neugierig", label: "Locker & neugierig" },
  { key: "edgy_provokant", label: "Edgy & provokant" },
  { key: "nuechtern_pragmatisch", label: "Nüchtern & pragmatisch" },
  { key: "akademisch_formell", label: "Akademisch & formell" },
  { key: "freundlich_offen", label: "Freundlich & offen" },
  { key: "analytisch_detailliert", label: "Analytisch & detailliert" },
  { key: "sarkastisch_witzig", label: "Sarkastisch & witzig" },
  { key: "fachlich_tiefgehend", label: "Fachlich & tiefgehend" },
];
