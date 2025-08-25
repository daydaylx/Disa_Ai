import React from "react"
import Icon from "./Icon"
import { getSelectedModelId } from "../config/settings"
import { applyTheme, getTheme, setTheme, type ThemeMode } from "../config/theme"

type Props = { onOpenConversations?: () => void }

export default function TopBar({ onOpenConversations }: Props) {
  const modelId = getSelectedModelId()
  const [theme, setThemeState] = React.useState<ThemeMode>(getTheme())

  React.useEffect(() => { applyTheme(theme) }, [theme])

  function toggleTheme() {
    const next: ThemeMode = theme === "dark" ? "light" : "dark"
    setTheme(next); setThemeState(next)
  }

  return (
    <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-neutral-950/60 bg-white dark:bg-neutral-950 border-b border-neutral-200/70 dark:border-neutral-800/70">
      <div className="h-12 px-3 sm:px-4 flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenConversations}
          className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-blue-500"
          aria-label="Unterhaltungen öffnen"
          title="Unterhaltungen"
        >
          <Icon name="menu" width="16" height="16" />
        </button>
        <div className="flex items-center gap-2 text-sm font-medium">
          <Icon name="sparkles" width="18" height="18" />
          <span>Disa AI</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border border-neutral-300 dark:border-neutral-700">
            <Icon name="model" width="14" height="14" />
            <span className="truncate max-w-[180px]">{modelId ?? "kein Modell"}</span>
          </span>
          <button type="button" onClick={toggleTheme} className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-blue-500" aria-label="Theme umschalten">
            {theme === "dark" ? <Icon name="sun" width="16" height="16" /> : <Icon name="moon" width="16" height="16" />}
          </button>
          <a href="#/settings" className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-blue-500" aria-label="Einstellungen">
            <Icon name="settings" width="16" height="16" />
          </a>
        </div>
      </div>
    </header>
  )
}
