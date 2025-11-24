import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/ui/Button";
import { MaterialCard } from "@/ui/MaterialCard";
import { Typography } from "@/ui/Typography";

import { LiquidLogo } from "../../components/branding/LiquidLogo";
import { useRoles } from "../../contexts/RolesContext";
import { useSettings } from "../../hooks/useSettings";

export default function CustomSetup() {
  const navigate = useNavigate();
  const { roles } = useRoles();
  const settingsContext = useSettings();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>(
    settingsContext.settings.preferredModelId || "openai/gpt-4o-mini",
  );
  const [creativity, setCreativity] = useState<number>(settingsContext.settings.creativity || 45);
  const [language, setLanguage] = useState<string>(settingsContext.settings.language || "de");

  const handleUpdateSettings = useCallback(
    (updates: { preferredModelId?: string; creativity?: number; language?: string }) => {
      if (settingsContext.setPreferredModel && updates.preferredModelId) {
        settingsContext.setPreferredModel(updates.preferredModelId);
      }
      if (settingsContext.setCreativity && updates.creativity) {
        settingsContext.setCreativity(updates.creativity);
      }
      if (settingsContext.setLanguage && updates.language) {
        settingsContext.setLanguage(updates.language);
      }
    },
    [settingsContext],
  );

  const RoleSelectionStep = (
    <div className="space-y-4">
      {roles.map((role) => {
        const isSelected = selectedRole === role.id;
        return (
          <MaterialCard
            key={role.id}
            variant={isSelected ? "inset" : "raised"}
            className="p-4 cursor-pointer hover:scale-[1.01] transition-all duration-200"
            onClick={() => setSelectedRole(role.id)}
          >
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <div
                  className={`w-8 h-8 rounded-full ${isSelected ? "bg-accent-primary/20" : "bg-surface-1"}`}
                >
                  <div
                    className={`w-full h-full flex items-center justify-center ${isSelected ? "text-accent-primary" : "text-text-secondary"}`}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <Typography variant="body-sm" className="font-medium">
                  {role.name}
                </Typography>
                <Typography variant="body-xs" className="text-text-secondary">
                  {role.description}
                </Typography>
              </div>
            </div>
          </MaterialCard>
        );
      })}
    </div>
  );

  const ModelSelectionStep = (
    <div className="space-y-3">
      <MaterialCard
        variant={selectedModel === "openai/gpt-4o-mini" ? "inset" : "raised"}
        className="p-4 cursor-pointer hover:scale-[1.01] transition-all duration-200"
        onClick={() => setSelectedModel("openai/gpt-4o-mini")}
      >
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="body-sm" className="font-medium">
              GPT-4o Mini
            </Typography>
            <Typography variant="body-xs" className="text-text-secondary">
              Ausgewogenes Modell für die meisten Aufgaben
            </Typography>
          </div>
          {selectedModel === "openai/gpt-4o-mini" && (
            <svg className="w-5 h-5 text-accent-primary" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      </MaterialCard>

      <MaterialCard
        variant={selectedModel === "openai/gpt-4o" ? "inset" : "raised"}
        className="p-4 cursor-pointer hover:scale-[1.01] transition-all duration-200"
        onClick={() => setSelectedModel("openai/gpt-4o")}
      >
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="body-sm" className="font-medium">
              GPT-4o
            </Typography>
            <Typography variant="body-xs" className="text-text-secondary">
              Leistungsstarkes Modell für komplexe Aufgaben
            </Typography>
          </div>
          {selectedModel === "openai/gpt-4o" && (
            <svg className="w-5 h-5 text-accent-primary" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      </MaterialCard>

      <MaterialCard
        variant={selectedModel === "meta-llama/llama-3.1-8b" ? "inset" : "raised"}
        className="p-4 cursor-pointer hover:scale-[1.01] transition-all duration-200"
        onClick={() => setSelectedModel("meta-llama/llama-3.1-8b")}
      >
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="body-sm" className="font-medium">
              Llama 3.1 8B
            </Typography>
            <Typography variant="body-xs" className="text-text-secondary">
              Schnelles, effizientes Modell
            </Typography>
          </div>
          {selectedModel === "meta-llama/llama-3.1-8b" && (
            <svg className="w-5 h-5 text-accent-primary" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      </MaterialCard>
    </div>
  );

  const CreativitySettingsStep = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Typography variant="body-sm" className="font-medium">
          Kreativität: {creativity}
        </Typography>
        <div className="text-right">
          <Typography variant="body-xs" className="text-text-secondary">
            {creativity < 30 ? "Präzise" : creativity < 70 ? "Ausgewogen" : "Kreativ"}
          </Typography>
        </div>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={creativity}
        onChange={(e) => setCreativity(Number(e.target.value))}
        className="w-full h-2 bg-surface-inset rounded-lg appearance-none cursor-pointer"
      />
      <div className="flex justify-between text-xs text-text-secondary">
        <span>0</span>
        <span>50</span>
        <span>100</span>
      </div>
    </div>
  );

  const LanguageSettingsStep = (
    <div className="space-y-3">
      <MaterialCard
        variant={language === "de" ? "inset" : "raised"}
        className="p-4 cursor-pointer hover:scale-[1.01] transition-all duration-200"
        onClick={() => setLanguage("de")}
      >
        <div className="flex items-center justify-between">
          <Typography variant="body-sm" className="font-medium">
            Deutsch
          </Typography>
          {language === "de" && (
            <svg className="w-5 h-5 text-accent-primary" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      </MaterialCard>

      <MaterialCard
        variant={language === "en" ? "inset" : "raised"}
        className="p-4 cursor-pointer hover:scale-[1.01] transition-all duration-200"
        onClick={() => setLanguage("en")}
      >
        <div className="flex items-center justify-between">
          <Typography variant="body-sm" className="font-medium">
            English
          </Typography>
          {language === "en" && (
            <svg className="w-5 h-5 text-accent-primary" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      </MaterialCard>
    </div>
  );

  const setupSteps = [
    {
      id: "role-selection",
      title: "Wähle deine Rolle",
      description:
        "Wähle eine Rolle, die am besten zu deinen Bedürfnissen passt. Du kannst diese später jederzeit ändern.",
      component: RoleSelectionStep,
    },
    {
      id: "model-selection",
      title: "Wähle dein KI-Modell",
      description:
        "Wähle das KI-Modell, das am besten zu deinen Anforderungen passt. Verschiedene Modelle haben unterschiedliche Stärken.",
      component: ModelSelectionStep,
    },
    {
      id: "creativity-settings",
      title: "Kreativitätsgrad einstellen",
      description:
        "Passe den Kreativitätsgrad an deine Bedürfnisse an. Höhere Werte führen zu kreativeren, aber weniger vorhersehbaren Antworten.",
      component: CreativitySettingsStep,
    },
    {
      id: "language-settings",
      title: "Sprache auswählen",
      description: "Wähle die Sprache, in der Disa AI mit dir kommunizieren soll.",
      component: LanguageSettingsStep,
    },
  ];

  const nextStep = useCallback(() => {
    if (currentStep < setupSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Setup abschließen und Einstellungen speichern
      handleUpdateSettings({
        preferredModelId: selectedModel,
        creativity,
        language,
      });

      void navigate("/", { state: { onboardingComplete: true } });
    }
  }, [
    currentStep,
    navigate,
    setupSteps.length,
    selectedModel,
    creativity,
    language,
    handleUpdateSettings,
  ]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const skipSetup = useCallback(() => {
    void navigate("/", { state: { onboardingSkipped: true } });
  }, [navigate]);

  return (
    <div className="min-h-screen-mobile flex flex-col items-center justify-center p-6 bg-gradient-to-b from-surface-base to-surface-1">
      {/* Liquid Branding Header */}
      <div className="mb-8 text-center">
        <LiquidLogo className="w-20 h-20 mx-auto mb-4" animate={true} />
        <Typography variant="h2" className="text-2xl font-bold text-text-primary">
          Benutzerdefinierte Einrichtung
        </Typography>
        <Typography variant="body-lg" className="text-text-secondary mt-1">
          Schritt {currentStep + 1} von {setupSteps.length}
        </Typography>
      </div>

      {/* Fortschrittsbalken */}
      <div className="w-full max-w-md mb-8">
        <div className="h-2 bg-surface-inset rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-liquid-blue via-liquid-turquoise to-liquid-purple transition-all duration-300 ease-out"
            style={{ width: `${((currentStep + 1) / setupSteps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Aktueller Schritt */}
      <div className="w-full max-w-md">
        <MaterialCard variant="hero" className="p-6">
          <div className="mb-4">
            <Typography variant="h3" className="text-xl font-semibold text-text-primary mb-2">
              {setupSteps[currentStep]?.title}
            </Typography>
            <Typography variant="body-sm" className="text-text-secondary">
              {setupSteps[currentStep]?.description}
            </Typography>
          </div>

          <div className="space-y-4">{setupSteps[currentStep]?.component}</div>
        </MaterialCard>
      </div>

      {/* Navigation */}
      <div className="w-full max-w-md mt-8 flex flex-col sm:flex-row gap-4">
        {currentStep > 0 && (
          <Button variant="secondary" onClick={prevStep} className="flex-1">
            Zurück
          </Button>
        )}

        <Button
          variant="primary"
          onClick={nextStep}
          className="flex-1 bg-gradient-to-r from-liquid-blue to-liquid-purple hover:from-liquid-indigo hover:to-liquid-magenta"
        >
          {currentStep < setupSteps.length - 1 ? "Weiter" : "Einrichtung abschließen"}
        </Button>
      </div>

      {/* Skip Button */}
      <div className="mt-6">
        <Button
          variant="ghost"
          onClick={skipSetup}
          className="text-text-secondary hover:text-text-primary"
        >
          Einrichtung überspringen
        </Button>
      </div>
    </div>
  );
}
