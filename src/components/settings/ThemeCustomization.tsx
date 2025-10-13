import React, { useEffect, useState } from "react";

import { useTheme } from "../../hooks/useTheme";
import { colors } from "../../styles/design-tokens";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
}

const defaultThemes: Record<string, ThemeColors> = {
  default: {
    primary: colors.corporate.accent.primary,
    secondary: colors.corporate.text.muted,
    accent: colors.semantic.warning,
    background: colors.neutral[50],
    foreground: colors.corporate.text.onLight,
  },
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
};

export function ThemeCustomization() {
  const { theme, setCustomTheme } = useTheme();
  const [customColors, setCustomColors] = useState<ThemeColors>(defaultThemes.default);
  const [selectedPreset, setSelectedPreset] = useState<string>("default");

  useEffect(() => {
    // Load saved custom theme
    const saved = localStorage.getItem("customTheme");
    if (saved) {
      setCustomColors(JSON.parse(saved));
    }
  }, [theme]);

  const handleColorChange = (key: keyof ThemeColors, value: string) => {
    const newColors = { ...customColors, [key]: value };
    setCustomColors(newColors);
    setSelectedPreset("custom");
  };

  const applyCustomTheme = () => {
    setCustomTheme(customColors);
    localStorage.setItem("customTheme", JSON.stringify(customColors));
  };

  const applyPreset = (presetName: string) => {
    const preset = defaultThemes[presetName];
    setCustomColors(preset);
    setSelectedPreset(presetName);
    setCustomTheme(preset);
  };

  const resetToDefault = () => {
    setCustomColors(defaultThemes.default);
    setSelectedPreset("default");
    setCustomTheme(defaultThemes.default);
    localStorage.removeItem("customTheme");
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
              {Object.entries(defaultThemes).map(([name, colors]) => (
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
              ))}
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
                      placeholder={colors.corporate.text.onLight}
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
