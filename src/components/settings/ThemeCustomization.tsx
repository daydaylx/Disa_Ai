import { useEffect, useState } from "react";

import type { ThemeColors } from "../../hooks/useTheme";
import { DEFAULT_THEME_COLORS, useTheme } from "../../hooks/useTheme";
import { colors } from "../../styles/design-tokens";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const THEME_KEYS = ["primary", "secondary", "accent", "background", "foreground"] as const;

const defaultThemes = {
  default: { ...DEFAULT_THEME_COLORS },
  dark: {
    primary: colors.corporate.accent.blueHC,
    secondary: colors.corporate.text.subtle,
    accent: colors.semantic.warning,
    background: colors.corporate.background.primary,
    foreground: colors.corporate.text.primary,
  },
  ocean: {
    primary: colors.corporate.accent.tealHC,
    secondary: colors.corporate.text.muted,
    accent: colors.accent[500],
    background: colors.neutral[50],
    foreground: colors.corporate.text.onLight,
  },
  forest: {
    primary: colors.semantic.success,
    secondary: colors.corporate.text.subtle,
    accent: colors.corporate.accent.success,
    background: colors.neutral[50],
    foreground: colors.corporate.text.onLight,
  },
} satisfies Record<string, ThemeColors>;

type ThemePresetName = keyof typeof defaultThemes;

function isSameTheme(a: ThemeColors, b: ThemeColors) {
  return THEME_KEYS.every((key) => a[key] === b[key]);
}

function cloneTheme(colors: ThemeColors): ThemeColors {
  return { ...colors };
}

export function ThemeCustomization() {
  const { theme, setCustomTheme, resetCustomTheme } = useTheme();
  const [customColors, setCustomColors] = useState<ThemeColors>(cloneTheme(theme));
  const [selectedPreset, setSelectedPreset] = useState<string>(
    (Object.entries(defaultThemes) as [ThemePresetName, ThemeColors][]).find(([, preset]) =>
      isSameTheme(preset, theme),
    )?.[0] ?? "custom",
  );

  useEffect(() => {
    setCustomColors(cloneTheme(theme));
    const matchedPreset =
      (Object.entries(defaultThemes) as [ThemePresetName, ThemeColors][]).find(([, preset]) =>
        isSameTheme(preset, theme),
      )?.[0] ?? "custom";
    setSelectedPreset(matchedPreset);
  }, [theme]);

  const handleColorChange = (key: keyof ThemeColors, value: string) => {
    const newColors = cloneTheme(customColors);
    newColors[key] = value;
    setCustomColors(newColors);
    setSelectedPreset("custom");
  };

  const applyCustomTheme = () => {
    setCustomTheme(cloneTheme(customColors));
  };

  const applyPreset = (presetName: ThemePresetName) => {
    const preset = defaultThemes[presetName];
    if (!preset) return;

    setCustomColors(cloneTheme(preset));
    setSelectedPreset(presetName);
    setCustomTheme(cloneTheme(preset));
  };

  const resetToDefault = () => {
    resetCustomTheme();
    setCustomColors(cloneTheme(defaultThemes.default));
    setSelectedPreset("default");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Theme-Anpassung</CardTitle>
          <CardDescription>
            Passen Sie die Farben Ihrer Anwendung an Ihre Vorlieben an.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Preset Themes */}
          <div>
            <Label className="mb-3 block text-base font-medium">Vorgefertigte Themes</Label>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {(Object.entries(defaultThemes) as [ThemePresetName, ThemeColors][]).map(
                ([name, colors]) => (
                  <Button
                    key={name}
                    variant={selectedPreset === name ? "default" : "outline"}
                    className="flex h-auto flex-col items-center space-y-2 p-3"
                    onClick={() => applyPreset(name)}
                  >
                    <div className="flex space-x-1">
                      <div
                        className="h-3 w-3 rounded-full border"
                        style={{ backgroundColor: colors.primary }}
                      />
                      <div
                        className="h-3 w-3 rounded-full border"
                        style={{ backgroundColor: colors.secondary }}
                      />
                      <div
                        className="h-3 w-3 rounded-full border"
                        style={{ backgroundColor: colors.accent }}
                      />
                    </div>
                    <span className="text-xs capitalize">{name}</span>
                  </Button>
                ),
              )}
            </div>
          </div>

          {/* Custom Color Picker */}
          <div>
            <Label className="mb-3 block text-base font-medium">Benutzerdefinierte Farben</Label>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {Object.entries(customColors).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <Label htmlFor={key} className="capitalize">
                    {key}
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id={key}
                      type="color"
                      value={value}
                      onChange={(e) => handleColorChange(key as keyof ThemeColors, e.target.value)}
                      className="h-8 w-12 rounded border p-1"
                    />
                    <Input
                      value={value}
                      onChange={(e) => handleColorChange(key as keyof ThemeColors, e.target.value)}
                      placeholder={DEFAULT_THEME_COLORS.foreground}
                      className="flex-1"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4">
            <Button onClick={applyCustomTheme} className="flex-1 md:flex-none">
              Änderungen anwenden
            </Button>
            <Button variant="outline" onClick={resetToDefault}>
              Zurücksetzen
            </Button>
          </div>

          {/* Current Status */}
          <div className="flex items-center space-x-2 pt-2">
            <Badge variant={selectedPreset === "custom" ? "default" : "secondary"}>
              {selectedPreset === "custom"
                ? "Benutzerdefiniert"
                : `Voreinstellung: ${selectedPreset}`}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
