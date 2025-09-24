import * as React from "react";
import { useEffect, useState } from "react";

import Switch from "../../components/Switch";
import {
  getFontSize,
  getHapticFeedback,
  getReduceMotion,
  getTheme,
  setFontSize,
  setHapticFeedback,
  setReduceMotion,
  setTheme,
} from "../../config/settings";

export default function SettingsAppearance() {
  const [theme, setThemeState] = useState(getTheme);
  const [fontSize, setFontSizeState] = useState(getFontSize);
  const [reduceMotion, setReduceMotionState] = useState(getReduceMotion);
  const [hapticFeedback, setHapticFeedbackState] = useState(getHapticFeedback);

  useEffect(() => {
    setTheme(theme);
  }, [theme]);

  useEffect(() => {
    setFontSize(fontSize);
  }, [fontSize]);

  useEffect(() => {
    setReduceMotion(reduceMotion);
  }, [reduceMotion]);

  useEffect(() => {
    setHapticFeedback(hapticFeedback);
  }, [hapticFeedback]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label htmlFor="theme-select" className="text-sm font-medium text-text-default">
          Theme
        </label>
        <select
          id="theme-select"
          value={theme}
          onChange={(e) => setThemeState(e.target.value as any)}
          className="rounded-lg border-transparent bg-bg-elevated px-3 py-2 text-sm"
        >
          <option value="system">System</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>
      <div className="flex items-center justify-between">
        <label htmlFor="font-size-slider" className="text-sm font-medium text-text-default">
          Font Size
        </label>
        <input
          id="font-size-slider"
          type="range"
          min="12"
          max="24"
          value={fontSize}
          onChange={(e) => setFontSizeState(Number(e.target.value))}
          className="w-48"
        />
      </div>
      <Switch checked={reduceMotion} onChange={setReduceMotionState} label="Reduce Motion" />
      <Switch checked={hapticFeedback} onChange={setHapticFeedbackState} label="Haptic Feedback" />
    </div>
  );
}
