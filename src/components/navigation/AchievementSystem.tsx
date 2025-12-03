import React, { useEffect, useState } from "react";

import { Book, Clock, MessageSquare, Star, Zap } from "../../lib/icons";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
  category: "navigation" | "reading" | "time" | "exploration";
  rarity: "common" | "rare" | "epic" | "legendary";
}

interface AchievementSystemProps {
  totalSwipes: number;
  totalSessions: number;
  totalPages: number;
  sessionDuration: number;
  uniqueTopics: number;
}

const ACHIEVEMENTS: Omit<Achievement, "unlockedAt" | "progress">[] = [
  // Navigation Achievements
  {
    id: "first_swipe",
    title: "Erste Seite",
    description: "Dein erster Swipe durch das Buch",
    icon: <Book className="w-6 h-6" />,
    category: "navigation",
    rarity: "common",
  },
  {
    id: "swipe_master",
    title: "Swipe-Meister",
    description: "100 Seiten durchswipen",
    icon: <Zap className="w-6 h-6" />,
    category: "navigation",
    rarity: "rare",
  },
  {
    id: "page_explorer",
    title: "Seiten-Entdecker",
    description: "50 verschiedene Seiten besuchen",
    icon: <MessageSquare className="w-6 h-6" />,
    category: "exploration",
    rarity: "epic",
  },

  // Reading Achievements
  {
    id: "book_worm",
    title: "Bücherwurm",
    description: "10 Seiten in einer Sitzung lesen",
    icon: <Book className="w-6 h-6" />,
    category: "reading",
    rarity: "rare",
  },
  {
    id: "marathon_reader",
    title: "Marathon-Leser",
    description: "25 Seiten in einer Sitzung lesen",
    icon: <Star className="w-6 h-6" />,
    category: "reading",
    rarity: "epic",
  },

  // Time Achievements
  {
    id: "speed_reader",
    title: "Schnell-Leser",
    description: "5 Seiten in unter 2 Minuten",
    icon: <Zap className="w-6 h-6" />,
    category: "time",
    rarity: "common",
  },
  {
    id: "dedicated_reader",
    title: "Engagierter Leser",
    description: "30 Minuten Lesen am Stück",
    icon: <Clock className="w-6 h-6" />,
    category: "time",
    rarity: "rare",
  },
  {
    id: "book_marathon",
    title: "Buch-Marathon",
    description: "2 Stunden Lesen am Stück",
    icon: <Star className="w-6 h-6" />,
    category: "time",
    rarity: "legendary",
  },
];

export function AchievementSystem({
  totalSwipes,
  totalSessions,
  totalPages,
  sessionDuration,
  uniqueTopics,
}: AchievementSystemProps) {
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [showNotification, setShowNotification] = useState<Achievement | null>(null);

  // Load unlocked achievements from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("disa-achievements");
    if (saved) {
      setUnlockedAchievements(JSON.parse(saved));
    }
  }, []);

  // Check for new achievements
  useEffect(() => {
    const newAchievements: Achievement[] = [];

    ACHIEVEMENTS.forEach((achievement) => {
      if (unlockedAchievements.includes(achievement.id)) return;

      let shouldUnlock = false;
      let _progress = 0;
      void _progress;
      let _maxProgress = 1;
      void _maxProgress;

      switch (achievement.id) {
        case "first_swipe":
          shouldUnlock = totalSwipes >= 1;
          break;
        case "swipe_master":
          shouldUnlock = totalSwipes >= 100;
          break;
        case "page_explorer":
          shouldUnlock = totalPages >= 50;
          break;
        case "book_worm":
          shouldUnlock = totalPages >= 10;
          break;
        case "marathon_reader":
          shouldUnlock = totalPages >= 25;
          break;
        case "speed_reader":
          shouldUnlock = sessionDuration <= 2 && totalPages >= 5;
          break;
        case "dedicated_reader":
          shouldUnlock = sessionDuration >= 30;
          break;
        case "book_marathon":
          shouldUnlock = sessionDuration >= 120;
          break;
      }

      if (shouldUnlock) {
        const unlockedAchievement = {
          ...achievement,
          unlockedAt: new Date(),
        };
        newAchievements.push(unlockedAchievement);
      }
    });

    // Show notifications for new achievements
    if (newAchievements.length > 0) {
      const latest = newAchievements[newAchievements.length - 1];
      if (latest) {
        setShowNotification(latest);

        // Update unlocked achievements
        const updatedUnlocked = [...unlockedAchievements, ...newAchievements.map((a) => a.id)];
        setUnlockedAchievements(updatedUnlocked);
        localStorage.setItem("disa-achievements", JSON.stringify(updatedUnlocked));

        // Hide notification after 5 seconds
        setTimeout(() => setShowNotification(null), 5000);
      }
    }
  }, [totalSwipes, totalSessions, totalPages, sessionDuration, uniqueTopics, unlockedAchievements]);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "border-gray-300 bg-gray-50 text-gray-700";
      case "rare":
        return "border-blue-300 bg-blue-50 text-blue-700";
      case "epic":
        return "border-purple-300 bg-purple-50 text-purple-700";
      case "legendary":
        return "border-yellow-300 bg-yellow-50 text-yellow-700";
      default:
        return "border-gray-300 bg-gray-50 text-gray-700";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "navigation":
        return <Zap className="w-4 h-4" />;
      case "reading":
        return <Book className="w-4 h-4" />;
      case "time":
        return <Clock className="w-4 h-4" />;
      case "exploration":
        return <MessageSquare className="w-4 h-4" />;
      default:
        return <Star className="w-4 h-4" />;
    }
  };

  const unlockedAchievementObjects = ACHIEVEMENTS.filter((a) =>
    unlockedAchievements.includes(a.id),
  ).map((a) => ({ ...a, unlockedAt: new Date() }));

  return (
    <>
      {/* Achievement Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 animate-bounce-in">
          <div
            className={`
            flex items-center gap-3 p-4 rounded-lg shadow-lg border-2
            ${getRarityColor(showNotification.rarity)}
          `}
          >
            <div className="flex-shrink-0">{showNotification.icon}</div>
            <div className="flex-1">
              <div className="font-semibold text-sm">
                🎉 {showNotification.title} freigeschaltet!
              </div>
              <div className="text-xs opacity-80">{showNotification.description}</div>
            </div>
          </div>
        </div>
      )}

      {/* Achievement Summary */}
      <div className="bg-surface-bg border border-ink/20 rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-ink-primary flex items-center gap-2">
            <Star className="w-5 h-5" />
            Erfolge ({unlockedAchievementObjects.length}/{ACHIEVEMENTS.length})
          </h3>
          <div className="text-sm text-ink-secondary">
            {Math.round((unlockedAchievementObjects.length / ACHIEVEMENTS.length) * 100)}%
          </div>
        </div>

        {/* Achievement Categories */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {["navigation", "reading", "time", "exploration"].map((category) => {
            const categoryAchievements = ACHIEVEMENTS.filter((a) => a.category === category);
            const unlockedInCategory = categoryAchievements.filter((a) =>
              unlockedAchievements.includes(a.id),
            );
            const categoryProgress =
              (unlockedInCategory.length / categoryAchievements.length) * 100;

            return (
              <div key={category} className="text-center p-3 bg-ink/5 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  {getCategoryIcon(category)}
                  <span className="text-xs font-medium text-ink-secondary uppercase">
                    {category}
                  </span>
                </div>
                <div className="text-lg font-bold text-ink-primary">
                  {unlockedInCategory.length}/{categoryAchievements.length}
                </div>
                <div className="w-full bg-ink/20 rounded-full h-1 mt-2">
                  <div
                    className="h-full bg-accent-primary rounded-full"
                    style={{ width: `${categoryProgress}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Achievements */}
        <div>
          <h4 className="text-sm font-medium text-ink-primary mb-3">Kürzlich freigeschaltet</h4>
          <div className="space-y-2">
            {unlockedAchievementObjects
              .sort((a, b) => (b.unlockedAt?.getTime() || 0) - (a.unlockedAt?.getTime() || 0))
              .slice(0, 3)
              .map((achievement) => (
                <div
                  key={achievement.id}
                  className={`
                    flex items-center gap-3 p-2 rounded-lg border
                    ${getRarityColor(achievement.rarity)}
                  `}
                >
                  <div className="flex-shrink-0">{achievement.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{achievement.title}</div>
                    <div className="text-xs opacity-80 truncate">{achievement.description}</div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Notification Animation Styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes bounce-in {
            0% { transform: scale(0.8) translateY(-20px); opacity: 0; }
            50% { transform: scale(1.05) translateY(5px); opacity: 1; }
            100% { transform: scale(1) translateY(0); opacity: 1; }
          }

          .animate-bounce-in {
            animation: bounce-in 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          }

          @media (prefers-reduced-motion: reduce) {
            .animate-bounce-in {
              animation: fadeIn 0.3s ease-in-out;
            }
          }
        `,
        }}
      />
    </>
  );
}
