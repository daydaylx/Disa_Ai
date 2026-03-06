export type RandomPromptCategory = "alltag" | "wissen" | "kurios" | "spicy18";

export interface RandomPromptItem {
  id: string;
  category: RandomPromptCategory;
  text: string;
}

const ALLTAG_PROMPTS = [
  "Welche alltäglichen Dinge machen Menschen unnötig kompliziert?",
  "Welche kleine Gewohnheit spart im Alltag am meisten Stress?",
  "Wie plant man eine Woche realistisch, ohne sich zu überladen?",
  "Was ist eine gute 10-Minuten-Routine für einen klaren Kopf?",
  "Welche Fehler machen die meisten beim Zeitmanagement?",
  "Wie schafft man Ordnung, ohne perfektionistisch zu werden?",
  "Welche Einkaufsregeln helfen gegen Impulskäufe?",
  "Wie baut man eine Morgenroutine auf, die man wirklich durchzieht?",
  "Welche einfachen Methoden helfen gegen Prokrastination?",
  "Wie kann man Smartphone-Zeit reduzieren, ohne radikal zu sein?",
  "Welche günstigen Meal-Prep-Ideen funktionieren im Alltag?",
  "Wie priorisiert man Aufgaben, wenn alles dringend wirkt?",
  "Welche kleinen Änderungen verbessern Schlafqualität sofort?",
  "Wie führt man schwierige Gespräche im Job respektvoll und klar?",
  "Welche Mikro-Pausen erhöhen die Konzentration im Homeoffice?",
  "Wie kann man einen schlechten Tag schnell resetten?",
  "Welche Haushaltsaufgaben lassen sich am besten bündeln?",
  "Wie organisiert man digitale Dateien ohne Chaos?",
  "Welche Routine hilft, Rechnungen und Finanzen im Blick zu behalten?",
  "Wie sagt man höflich Nein, ohne schlechtes Gewissen?",
  "Welche Missverständnisse entstehen häufig per Chat und wie vermeidet man sie?",
  "Wie schafft man mehr Bewegung, wenn man viel sitzt?",
  "Welche Alltagsentscheidungen lassen sich gut automatisieren?",
  "Was hilft, wenn man abends ständig zu spät ins Bett geht?",
  "Welche Gewohnheit hat das beste Verhältnis aus Aufwand und Nutzen?",
] as const;

const WISSEN_PROMPTS = [
  "Warum ist der Himmel blau?",
  "Wie funktioniert eine mRNA-Impfung in einfachen Worten?",
  "Was ist der Unterschied zwischen Wetter und Klima?",
  "Warum gibt es Schaltjahre?",
  "Wie misst man Inflation eigentlich?",
  "Wieso rosten manche Metalle und andere kaum?",
  "Wie entstehen Polarlichter?",
  "Was bedeutet Bruttoinlandsprodukt wirklich?",
  "Wie funktioniert GPS ohne Internet?",
  "Was passiert im Körper bei Stress?",
  "Warum sehen wir den Mond manchmal tagsüber?",
  "Wie groß ist der Unterschied zwischen KI-Modell und Suchmaschine?",
  "Was ist der Treibhauseffekt in einem Satz?",
  "Wie entstehen Tsunamis?",
  "Warum schmeckt Koriander für manche nach Seife?",
  "Was ist dunkle Materie, und was weiß man sicher darüber?",
  "Wie zuverlässig sind IQ-Tests für den Alltag?",
  "Warum altern Hunde schneller als Menschen?",
  "Was ist der Placebo-Effekt, und wie stark kann er sein?",
  "Welche Rolle spielt der Golfstrom für Europa?",
  "Warum knacken Fingerknöchel, und ist das schädlich?",
  "Wie funktioniert ein Quantencomputer auf Basisidee-Ebene?",
  "Was bedeutet statistisch signifikant wirklich?",
  "Warum sind manche Sprachen tonal und andere nicht?",
  "Wie beeinflusst Schlafmangel die Entscheidungsfähigkeit?",
] as const;

const KURIOS_PROMPTS = [
  "Welche Länder haben die kuriosesten Gesetze, die heute noch gelten?",
  "Welche historischen Irrtümer glauben viele bis heute?",
  "Welche berühmten Erfindungen waren eigentlich Zufallsfunde?",
  "Warum tragen Richter in manchen Ländern Perücken?",
  "Welche absurden Steuern gab es in der Geschichte?",
  "Welche Tiere haben überraschend ungewöhnliche Superkräfte?",
  "Welche kuriosen Rekorde gelten bis heute?",
  "Welche Städte haben besonders seltsame lokale Traditionen?",
  "Welche historischen Fälschungen waren besonders überzeugend?",
  "Welche berühmten Marken hatten ursprünglich einen ganz anderen Zweck?",
  "Welche Speisen galten früher als Medizin?",
  "Welche peinlichen Übersetzungsfehler sind politisch relevant geworden?",
  "Welche Wetter-Mythen sind falsch, halten sich aber hartnäckig?",
  "Welche Berufe gab es früher, die heute komplett verschwunden sind?",
  "Welche skurrilen Verbote gab es in Schulen oder Städten?",
  "Welche ungewöhnlichen Feiertage werden irgendwo offiziell gefeiert?",
  "Welche kuriosen Fakten gibt es über Schlaf in verschiedenen Kulturen?",
  "Welche Aberglauben hatten echte historische Folgen?",
  "Welche Nischen-Museen sind überraschend populär?",
  "Welche Irrtümer über das Mittelalter sind besonders verbreitet?",
  "Welche kuriosen Fakten gibt es über Passwörter und digitale Sicherheit?",
  "Welche merkwürdigen Sportarten sind international organisiert?",
  "Welche berühmten wissenschaftlichen Fehltritte waren trotzdem nützlich?",
  "Welche kuriosen Sprachregeln gibt es weltweit?",
  "Welche Alltagsobjekte wurden für einen ganz anderen Zweck erfunden?",
] as const;

const SPICY18_PROMPTS = [
  "Welche Länder melden in Umfragen die höchste durchschnittliche Sex-Frequenz?",
  "Wie stark variiert die durchschnittliche Penisgröße je nach Studie und Messmethode?",
  "In welchem Jahr wurde der erste elektrische Vibrator patentiert?",
  "Seit wann sind Kondome historisch belegt, und wie haben sie sich entwickelt?",
  "Welche Mythen über Masturbation sind wissenschaftlich klar widerlegt?",
  "Welche Faktoren beeinflussen die Libido laut Forschung am stärksten?",
  "Welche Länder haben überraschend liberale Regeln zu Sexspielzeug?",
  "Wie haben sich Einstellungen zu vorehelichem Sex in den letzten 50 Jahren verändert?",
  "Welche Dating-App-Statistiken zeigen den größten Unterschied zwischen Mythos und Realität?",
  "Welche historischen Kulturen hatten unerwartet offene Sexualnormen?",
  "Wie verlässlich sind Umfragen zur Anzahl von Sexualpartnern?",
  "Welche Rolle spielen Hormone bei sexueller Anziehung laut Studien?",
  "Welche verbreiteten Penis-Mythen sind medizinisch falsch?",
  "Welche Kuriositäten gibt es zur Geschichte des Dildos?",
  "Welche Länder haben besonders ungewöhnliche Gesetze zu Pornografie und Jugendschutz?",
  "Wie unterscheiden sich Sexualaufklärungskonzepte international messbar?",
  "Welche Fakten widerlegen typische Männer-vs.-Frauen-Klischees beim Sex?",
  "Was sagt die Forschung über den Zusammenhang von Schlaf und Sexualtrieb?",
  "Welche ungewöhnlichen historischen Verhütungsmethoden wurden tatsächlich verwendet?",
  "Welche Statistiken zu Untreue werden häufig falsch interpretiert?",
  "Warum überschätzen Menschen regelmäßig, wie oft andere Sex haben?",
  "Welche kulturellen Tabus rund um Sexualität haben sich zuletzt stark gelockert?",
  "Welche gesundheitlichen Mythen rund um Erektionen sind fachlich falsch?",
  "Welche Länder haben hohe Raten bei STI-Tests, und woran liegt das?",
  "Welche Fakten zu sexueller Zufriedenheit werden in Medien oft verzerrt dargestellt?",
] as const;

function createPromptItems(
  category: RandomPromptCategory,
  prompts: readonly string[],
): RandomPromptItem[] {
  return prompts.map((text, index) => ({
    id: `${category}-${index + 1}`,
    category,
    text,
  }));
}

export const RANDOM_PROMPTS: RandomPromptItem[] = [
  ...createPromptItems("alltag", ALLTAG_PROMPTS),
  ...createPromptItems("wissen", WISSEN_PROMPTS),
  ...createPromptItems("kurios", KURIOS_PROMPTS),
  ...createPromptItems("spicy18", SPICY18_PROMPTS),
];

export const RANDOM_PROMPT_TOTAL = RANDOM_PROMPTS.length;
