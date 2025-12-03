import { useEffect, useState } from "react";

import { Book, Clock, TrendingUp } from "../../lib/icons";

interface ReadingProgressProps {
  currentPage: number;
  totalPages: number;
  readingTime: number;
  sessionStart?: Date;
}

export function ReadingProgress({
  currentPage,
  totalPages,
  readingTime,
  sessionStart,
}: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);

  useEffect(() => {
    const newProgress = totalPages > 0 ? (currentPage / totalPages) * 100 : 0;
    setProgress(newProgress);
  }, [currentPage, totalPages]);

  useEffect(() => {
    if (sessionStart) {
      const interval = setInterval(() => {
        setSessionTime(Math.floor((Date.now() - sessionStart.getTime()) / 1000 / 60));
      }, 1000);

      return () => clearInterval(interval);
    }
    return undefined;
  }, [sessionStart]);

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getAchievementLevel = () => {
    if (totalPages >= 50) return { level: "Bibliothekar", color: "text-purple-600", icon: "📚" };
    if (totalPages >= 20) return { level: "Leser", color: "text-blue-600", icon: "📖" };
    if (totalPages >= 10) return { level: "Entdecker", color: "text-green-600", icon: "🔍" };
    if (totalPages >= 5) return { level: "Anfänger", color: "text-yellow-600", icon: "🌱" };
    return { level: "Neuling", color: "text-gray-600", icon: "📘" };
  };

  const achievement = getAchievementLevel();

  return (
    <div className="bg-surface-bg border border-ink/20 rounded-lg p-4 shadow-sm">
      {/* Header with Achievement */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Book className="w-5 h-5 text-ink-primary" />
          <span className="font-medium text-ink-primary">Lesefortschritt</span>
        </div>
        <div
          className={`flex items-center gap-2 px-3 py-1 rounded-full bg-ink/10 ${achievement.color}`}
        >
          <span className="text-lg">{achievement.icon}</span>
          <span className="text-sm font-medium">{achievement.level}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-ink-secondary mb-2">
          <span>
            Seite {currentPage} von {totalPages}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-ink/20 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-accent-primary to-accent-primary/70 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Clock className="w-4 h-4 text-ink-secondary" />
            <span className="text-xs text-ink-secondary">Sitzung</span>
          </div>
          <div className="text-lg font-semibold text-ink-primary">{formatTime(sessionTime)}</div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <TrendingUp className="w-4 h-4 text-ink-secondary" />
            <span className="text-xs text-ink-secondary">Gesamt</span>
          </div>
          <div className="text-lg font-semibold text-ink-primary">{formatTime(readingTime)}</div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Book className="w-4 h-4 text-ink-secondary" />
            <span className="text-xs text-ink-secondary">Seiten</span>
          </div>
          <div className="text-lg font-semibold text-ink-primary">{totalPages}</div>
        </div>
      </div>

      {/* Milestone Rewards */}
      {progress >= 25 && progress < 50 && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
          🎉 Viertel geschafft! Weiter so!
        </div>
      )}
      {progress >= 50 && progress < 75 && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
          🚀 Halb geschafft! Du bist auf dem richtigen Weg!
        </div>
      )}
      {progress >= 75 && progress < 100 && (
        <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg text-sm text-purple-800">
          ⭐ Fast geschafft! Nur noch ein kleines Stück!
        </div>
      )}
      {progress >= 100 && (
        <div className="mt-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-300 rounded-lg text-sm text-yellow-900 font-medium">
          🏆 Buch abgeschlossen! Herzensglückwunsch!
        </div>
      )}
    </div>
  );
}
