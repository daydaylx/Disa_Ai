import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "../../lib/cn";
import { hapticFeedback } from "../../lib/touch/haptics";

export interface Command {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  shortcut?: string;
  action: () => void;
  disabled?: boolean;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  commands: Command[];
  placeholder?: string;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  commands,
  placeholder = "Befehl suchen...",
}) => {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const dialogRef = useRef<HTMLDivElement>(null);

  const filteredCommands = React.useMemo(() => {
    if (!query.trim()) return commands;

    const lowercaseQuery = query.toLowerCase();
    return commands.filter(
      (command) =>
        command.title.toLowerCase().includes(lowercaseQuery) ||
        command.description?.toLowerCase().includes(lowercaseQuery),
    );
  }, [commands, query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredCommands]);

  useEffect(() => {
    if (isOpen) {
      const previouslyFocused = document.activeElement as HTMLElement;

      requestAnimationFrame(() => {
        searchRef.current?.focus();
      });

      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key !== "Tab") return;

        const focusableElements = dialogRef.current?.querySelectorAll(
          'input, button, [tabindex]:not([tabindex="-1"])',
        );

        if (!focusableElements || focusableElements.length === 0) return;

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      };

      document.addEventListener("keydown", handleTabKey);

      return () => {
        document.removeEventListener("keydown", handleTabKey);
        if (previouslyFocused && previouslyFocused.focus) {
          previouslyFocused.focus();
        }
      };
    } else {
      setQuery("");
      setSelectedIndex(0);
      return undefined;
    }
  }, [isOpen]);

  useEffect(() => {
    const selectedItem = itemRefs.current[selectedIndex];
    if (selectedItem && listRef.current) {
      selectedItem.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [selectedIndex]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => (prev < filteredCommands.length - 1 ? prev + 1 : 0));
          hapticFeedback.select();
          break;

        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredCommands.length - 1));
          hapticFeedback.select();
          break;

        case "Enter":
          e.preventDefault();
          if (filteredCommands[selectedIndex] && !filteredCommands[selectedIndex].disabled) {
            hapticFeedback.success();
            filteredCommands[selectedIndex].action();
            onClose();
          }
          break;

        case "Escape":
          e.preventDefault();
          onClose();
          break;

        default:
          break;
      }
    },
    [filteredCommands, selectedIndex, onClose],
  );

  const handleCommandClick = useCallback(
    (command: Command, index: number) => {
      if (command.disabled) return;

      hapticFeedback.success();
      setSelectedIndex(index);
      command.action();
      onClose();
    },
    [onClose],
  );

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose} aria-hidden="true" />

      <div
        ref={dialogRef}
        className="fixed inset-x-4 z-50 mx-auto max-w-2xl"
        style={{ top: "calc(var(--vh, 100dvh) * 0.2)" }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="command-palette-title"
        aria-describedby="command-palette-description"
      >
        <h2 id="command-palette-title" className="sr-only">
          Befehlspalette
        </h2>
        <p id="command-palette-description" className="sr-only">
          Verwende die Pfeiltasten zur Navigation, Enter zum Ausführen, Escape zum Schließen
        </p>
        <div className="border-border bg-surface-card shadow-level overflow-hidden rounded-lg border">
          <div className="border-border flex items-center border-b px-4">
            <svg
              className="text-text-secondary h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                clipRule="evenodd"
              />
            </svg>
            <input
              ref={searchRef}
              type="text"
              className="text-text-primary placeholder:text-text-secondary h-12 w-full border-0 bg-transparent pl-3 pr-4 focus:ring-0 sm:text-sm"
              placeholder={placeholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              aria-labelledby="command-palette-title"
              aria-expanded="true"
              aria-activedescendant={
                filteredCommands[selectedIndex]
                  ? `command-${filteredCommands[selectedIndex].id}`
                  : undefined
              }
              role="combobox"
              aria-autocomplete="list"
            />
          </div>

          {filteredCommands.length > 0 ? (
            <ul
              ref={listRef}
              className="max-h-80 overflow-y-auto scroll-smooth p-2"
              role="listbox"
              aria-labelledby="command-palette-title"
            >
              {filteredCommands.map((command, index) => (
                <li
                  key={command.id}
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                  id={`command-${command.id}`}
                  className={cn(
                    "group flex cursor-pointer select-none items-center rounded-lg px-3 py-2",
                    "transition-colors duration-150",
                    index === selectedIndex
                      ? "bg-brand text-white"
                      : "text-text-secondary hover:bg-surface-subtle",
                    command.disabled && "cursor-not-allowed opacity-50",
                  )}
                  onClick={() => handleCommandClick(command, index)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  role="option"
                  aria-selected={index === selectedIndex}
                  aria-disabled={command.disabled}
                >
                  {command.icon && (
                    <div
                      className={cn(
                        "mr-3 h-5 w-5 flex-shrink-0",
                        index === selectedIndex ? "text-white" : "text-text-secondary",
                      )}
                    >
                      {command.icon}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div
                      className={cn(
                        "truncate font-medium",
                        index === selectedIndex ? "text-white" : "text-text-primary",
                      )}
                    >
                      {command.title}
                    </div>
                    {command.description && (
                      <div
                        className={cn(
                          "truncate text-sm",
                          index === selectedIndex ? "text-white/80" : "text-text-secondary",
                        )}
                      >
                        {command.description}
                      </div>
                    )}
                  </div>

                  {command.shortcut && (
                    <div
                      className={cn(
                        "ml-3 font-mono text-xs",
                        index === selectedIndex ? "text-white/80" : "text-text-secondary",
                      )}
                    >
                      {command.shortcut}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-text-secondary px-4 py-14 text-center text-sm">
              Keine Befehle gefunden für "{query}"
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export function useCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return { isOpen, open, close, toggle };
}

export function useDefaultCommands() {
  const focusComposer = useCallback(() => {
    const composer = document.querySelector(
      '[data-testid="composer-input"]',
    ) as HTMLTextAreaElement;
    if (composer) {
      composer.focus();
    }
  }, []);

  const copyLastMessage = useCallback(async () => {
    const messages = document.querySelectorAll('[role="article"]');
    const lastMessage = messages[messages.length - 1];
    if (lastMessage) {
      const text = lastMessage.textContent || "";
      try {
        await navigator.clipboard.writeText(text);
        hapticFeedback.success();
      } catch (error) {
        console.warn("Failed to copy to clipboard:", error);
      }
    }
  }, []);

  const newChat = useCallback(() => {
    window.location.hash = "#/";
  }, []);

  const openSettings = useCallback(() => {
    window.location.hash = "#/settings/api";
  }, []);

  const switchModel = useCallback(() => {
    const modelSelect = document.querySelector('[data-testid="model-select"]') as HTMLSelectElement;
    if (modelSelect) {
      modelSelect.focus();
    }
  }, []);

  return React.useMemo(
    () => [
      {
        id: "new-chat",
        title: "Neuer Chat",
        description: "Einen neuen Chat starten",
        shortcut: "Ctrl+N",
        action: newChat,
      },
      {
        id: "focus-composer",
        title: "Fokus auf Eingabe",
        description: "Cursor in das Eingabefeld setzen",
        shortcut: "/",
        action: focusComposer,
      },
      {
        id: "copy-last",
        title: "Letzte Antwort kopieren",
        description: "Die letzte KI-Antwort in die Zwischenablage kopieren",
        shortcut: "Ctrl+Shift+C",
        action: copyLastMessage,
      },
      {
        id: "switch-model",
        title: "Modell wechseln",
        description: "Das AI-Modell ändern",
        shortcut: "Ctrl+M",
        action: switchModel,
      },
      {
        id: "settings",
        title: "Einstellungen",
        description: "App-Einstellungen öffnen",
        shortcut: "Ctrl+,",
        action: openSettings,
      },
    ],
    [newChat, focusComposer, copyLastMessage, switchModel, openSettings],
  );
}
