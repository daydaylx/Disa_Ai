export type DiscussionPresetKey = "locker_neugierig" | "edgy_provokant" | "nuechtern_pragmatisch";

export const discussionPresets: Record<DiscussionPresetKey, string> = {
  locker_neugierig:
    "entspannt, humorvoll, neugierig, mit kurzen Analogien oder Alltagsvergleichen, aber ohne Albernheit",
  edgy_provokant:
    "knackig, pointiert, leicht provokant, leichte Reibung erlaubt, respektvoll bleiben, klare Kante",
  nuechtern_pragmatisch:
    "wenig Witz, klare Kurzthese, sachlich abwägend, lösungsorientiert, Fokus auf pragmatische Argumente",
};

export const discussionPresetOptions: Array<{ key: DiscussionPresetKey; label: string }> = [
  { key: "locker_neugierig", label: "Locker & neugierig" },
  { key: "edgy_provokant", label: "Edgy & provokant" },
  { key: "nuechtern_pragmatisch", label: "Nüchtern & pragmatisch" },
];
