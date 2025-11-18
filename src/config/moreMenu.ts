export interface MoreMenuLink {
  label: string;
  path: string;
  description?: string;
  badge?: string | number;
  external?: boolean;
}

export interface MoreMenuSection {
  title: string;
  description?: string;
  items: MoreMenuLink[];
}

export const MORE_MENU_SECTIONS: MoreMenuSection[] = [
  {
    title: "Navigation",
    description: "Hauptbereiche der App",
    items: [
      { label: "Chat", path: "/chat", description: "Unterhaltungen & Verlauf" },
      { label: "Rollen", path: "/roles", description: "Persona-Templates" },
      { label: "Modelle", path: "/models", description: "Katalog & Bewertungen" },
      { label: "Einstellungen", path: "/settings", description: "API, Daten & Darstellung" },
      { label: "API", path: "/settings/api", description: "Schlüssel & Limits" },
      { label: "Verlauf", path: "/history", description: "Sitzungen & Speicher" },
      { label: "Filter", path: "/settings/filters", description: "Moderation & Schutz" },
      { label: "Darstellung", path: "/settings/appearance", description: "Themes & Spacing" },
      { label: "Daten", path: "/settings/data", description: "Speicher & Export" },
    ],
  },
  {
    title: "Rechtliches",
    description: "Pflichtseiten & Kontakt",
    items: [
      { label: "Impressum", path: "/impressum" },
      { label: "Datenschutz", path: "/datenschutz" },
    ],
  },
];
