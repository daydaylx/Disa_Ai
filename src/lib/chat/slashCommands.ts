import { getRoleById, listRoleTemplates } from "../../config/roleStore";
import {
  getNSFW,
  getSelectedModelId,
  getStyle,
  getTemplateId,
  setNSFW,
  setStyle,
  setTemplateId,
  type StyleKey,
} from "../../config/settings";

export interface CommandResult {
  success: boolean;
  message: string;
  shouldClearInput?: boolean;
}

export interface SlashCommand {
  name: string;
  description: string;
  usage: string;
  aliases?: string[];
  execute: (args: string[]) => Promise<CommandResult> | CommandResult;
}

const STYLES: StyleKey[] = [
  "neutral",
  "blunt_de",
  "concise",
  "friendly",
  "creative_light",
  "minimal",
  "technical_precise",
  "socratic",
  "bullet",
  "step_by_step",
  "formal_de",
  "casual_de",
  "detailed",
  "no_taboos",
];

const STYLE_ALIASES: Record<string, StyleKey> = {
  direct: "blunt_de",
  kurz: "concise",
  short: "concise",
  freundlich: "friendly",
  kreativ: "creative_light",
  creative: "creative_light",
  tech: "technical_precise",
  technical: "technical_precise",
  fragen: "socratic",
  questions: "socratic",
  bullets: "bullet",
  schritte: "step_by_step",
  steps: "step_by_step",
  formell: "formal_de",
  formal: "formal_de",
  locker: "casual_de",
  casual: "casual_de",
  detail: "detailed",
  unzensiert: "no_taboos",
  uncensored: "no_taboos",
};

// Style command
const styleCommand: SlashCommand = {
  name: "style",
  description: "Ändert den Antwortstil der KI",
  usage: "/style [stil] oder /style list",
  aliases: ["s"],
  execute: (args: string[]) => {
    const [rawArg] = args;

    if (!rawArg) {
      const current = getStyle();
      return {
        success: true,
        message: `Aktueller Stil: **${current}**\nNutze \`/style list\` für alle verfügbaren Stile.`,
      };
    }

    const arg = rawArg.toLowerCase();

    if (arg === "list" || arg === "liste") {
      const current = getStyle();
      const styleList = STYLES.map((s) => (s === current ? `**${s}** (aktiv)` : s)).join(", ");
      return {
        success: true,
        message: `Verfügbare Stile:\n${styleList}`,
      };
    }

    // Check direct match or alias
    const targetStyle = STYLES.find((s) => s === arg) || STYLE_ALIASES[arg];

    if (!targetStyle) {
      return {
        success: false,
        message: `Unbekannter Stil: "${rawArg}"\nNutze \`/style list\` für alle verfügbaren Stile.`,
      };
    }

    setStyle(targetStyle);
    return {
      success: true,
      message: `Stil geändert auf: **${targetStyle}**`,
      shouldClearInput: true,
    };
  },
};

// Role command
const roleCommand: SlashCommand = {
  name: "role",
  description: "Ändert oder zeigt die aktive KI-Rolle",
  usage: "/role [rollenname] oder /role list oder /role clear",
  aliases: ["r"],
  execute: (args: string[]) => {
    if (args.length === 0) {
      const currentId = getTemplateId();
      if (!currentId) {
        return {
          success: true,
          message:
            "Keine Rolle aktiv (Standard KI-Verhalten)\nNutze `/role list` für verfügbare Rollen.",
        };
      }
      const role = getRoleById(currentId);
      return {
        success: true,
        message: `Aktive Rolle: **${role?.name || currentId}**\nNutze \`/role clear\` zum Entfernen.`,
      };
    }

    const arg = args.join(" ").toLowerCase();

    if (arg === "list" || arg === "liste") {
      const roles = listRoleTemplates();
      if (roles.length === 0) {
        return {
          success: false,
          message: "Keine Rollen verfügbar. Überprüfe die styles.json Konfiguration.",
        };
      }
      const current = getTemplateId();
      const roleList = roles
        .map((r) => (r.id === current ? `**${r.name}** (aktiv)` : r.name))
        .join(", ");
      return {
        success: true,
        message: `Verfügbare Rollen:\n${roleList}`,
      };
    }

    if (arg === "clear" || arg === "reset" || arg === "none") {
      setTemplateId(null);
      return {
        success: true,
        message: "Rolle entfernt. Standard KI-Verhalten aktiv.",
        shouldClearInput: true,
      };
    }

    // Find role by name (case insensitive)
    const roles = listRoleTemplates();
    const targetRole = roles.find(
      (r) => r.name.toLowerCase().includes(arg) || r.id.toLowerCase() === arg,
    );

    if (!targetRole) {
      return {
        success: false,
        message: `Rolle "${args.join(" ")}" nicht gefunden.\nNutze \`/role list\` für verfügbare Rollen.`,
      };
    }

    setTemplateId(targetRole.id);
    return {
      success: true,
      message: `Rolle geändert auf: **${targetRole.name}**`,
      shouldClearInput: true,
    };
  },
};

// NSFW command
const nsfwCommand: SlashCommand = {
  name: "nsfw",
  description: "Schaltet NSFW-Inhalte ein oder aus",
  usage: "/nsfw [on|off|toggle]",
  execute: (args: string[]) => {
    const current = getNSFW();

    const [rawArg] = args;

    if (!rawArg) {
      return {
        success: true,
        message: `NSFW-Inhalte: **${current ? "Aktiviert" : "Deaktiviert"}**\nNutze \`/nsfw toggle\` zum Umschalten.`,
      };
    }

    const arg = rawArg.toLowerCase();
    let newValue: boolean;

    if (arg === "on" || arg === "true" || arg === "1" || arg === "an") {
      newValue = true;
    } else if (arg === "off" || arg === "false" || arg === "0" || arg === "aus") {
      newValue = false;
    } else if (arg === "toggle") {
      newValue = !current;
    } else {
      return {
        success: false,
        message: `Ungültiger Parameter: "${rawArg}"\nNutze: \`/nsfw on\`, \`/nsfw off\` oder \`/nsfw toggle\``,
      };
    }

    setNSFW(newValue);
    return {
      success: true,
      message: `NSFW-Inhalte **${newValue ? "aktiviert" : "deaktiviert"}**`,
      shouldClearInput: true,
    };
  },
};

// Model command (placeholder for now)
const modelCommand: SlashCommand = {
  name: "model",
  description: "Zeigt oder ändert das aktive AI-Modell",
  usage: "/model [modellname] oder /model list",
  aliases: ["m"],
  execute: (args: string[]) => {
    const current = getSelectedModelId();

    const [rawArg] = args;

    if (!rawArg) {
      return {
        success: true,
        message: `Aktuelles Modell: **${current || "Standard"}**\nNutze \`/model list\` oder gehe zu den Einstellungen für die Modell-Auswahl.`,
      };
    }

    if (rawArg.toLowerCase() === "list") {
      return {
        success: true,
        message: "Für die Modell-Auswahl gehe zu den **Einstellungen** → **Modell-Auswahl**",
      };
    }

    return {
      success: false,
      message:
        "Modell-Wechsel über Slash-Commands noch nicht implementiert.\nNutze die **Einstellungen** → **Modell-Auswahl**",
    };
  },
};

// Help command
const helpCommand: SlashCommand = {
  name: "help",
  description: "Zeigt alle verfügbaren Befehle",
  usage: "/help [befehl]",
  aliases: ["h", "?"],
  execute: (args: string[]) => {
    const [rawArg] = args;

    if (rawArg) {
      const cmdName = rawArg.toLowerCase();
      const cmd = COMMANDS.find((c) => c.name === cmdName || c.aliases?.includes(cmdName));

      if (!cmd) {
        return {
          success: false,
          message: `Befehl "${rawArg}" nicht gefunden.\nNutze \`/help\` für alle Befehle.`,
        };
      }

      return {
        success: true,
        message: `**${cmd.name}** - ${cmd.description}\n\n**Verwendung:** ${cmd.usage}${cmd.aliases ? `\n**Aliase:** ${cmd.aliases.join(", ")}` : ""}`,
      };
    }

    const commandList = COMMANDS.map((cmd) => `\`/${cmd.name}\` - ${cmd.description}`).join("\n");

    return {
      success: true,
      message: `**Verfügbare Befehle:**\n${commandList}\n\nNutze \`/help [befehl]\` für Details zu einem bestimmten Befehl.`,
    };
  },
};

export const COMMANDS: SlashCommand[] = [
  helpCommand,
  styleCommand,
  roleCommand,
  nsfwCommand,
  modelCommand,
];

export function parseSlashCommand(input: string): {
  isCommand: boolean;
  command?: SlashCommand;
  args?: string[];
  rawCommand?: string;
} {
  const trimmed = input.trim();

  if (!trimmed.startsWith("/")) {
    return { isCommand: false };
  }

  const parts = trimmed.slice(1).split(/\s+/);
  const commandName = (parts[0] ?? "").toLowerCase();
  const args = parts.slice(1);

  const command = COMMANDS.find(
    (cmd) => cmd.name === commandName || cmd.aliases?.includes(commandName),
  );

  return {
    isCommand: true,
    command,
    args,
    rawCommand: commandName,
  };
}

export async function executeSlashCommand(input: string): Promise<CommandResult> {
  const parsed = parseSlashCommand(input);

  if (!parsed.isCommand) {
    return {
      success: false,
      message: "Das ist kein gültiger Slash-Befehl.",
    };
  }

  if (!parsed.command) {
    return {
      success: false,
      message: `Unbekannter Befehl: "/${parsed.rawCommand}"\nNutze \`/help\` für verfügbare Befehle.`,
    };
  }

  try {
    const result = await parsed.command.execute(parsed.args || []);
    return result;
  } catch (error) {
    console.error("Slash command execution error:", error);
    return {
      success: false,
      message: `Fehler beim Ausführen des Befehls: ${error instanceof Error ? error.message : "Unbekannter Fehler"}`,
    };
  }
}
