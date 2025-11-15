import { useTheme } from "next-themes";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { useSettings } from "../../hooks/useSettings";
import {
  Bell,
  ChevronDown,
  Cpu,
  Menu,
  MessageCircle,
  Monitor,
  Moon,
  Search,
  Settings,
  Sparkles,
  Sun,
  User,
  Users,
  X,
} from "../../lib/icons";
import { cn } from "../../lib/utils";
import { BrandWordmark } from "../shell/BrandWordmark";
import { SettingsDrawer } from "../shell/SettingsDrawer";
import { Button } from "../ui/button";

interface NavigationItem {
  name: string;
  href: string;
  icon: any;
  badge?: string;
}

export function ModernHeader() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { settings } = useSettings();
  const location = useLocation();

  const navigation: NavigationItem[] = [
    { name: "Chat", href: "/", icon: MessageCircle },
    { name: "Studio", href: "/studio", icon: Sparkles },
    { name: "Models", href: "/models", icon: Cpu, badge: "Pro" },
    { name: "Roles", href: "/roles", icon: Users },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  const themeIcon = {
    light: Sun,
    dark: Moon,
    system: Monitor,
  }[theme];

  const ThemeIcon = themeIcon;

  return (
    <header className="sticky top-0 z-[var(--z-sticky)] w-full border-b border-[var(--border-subtle)] bg-[var(--surface-card)]/95 backdrop-blur-[var(--backdrop-blur-medium)] shadow-[var(--shadow-light)] transition-all duration-[var(--duration-normal)]">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center space-x-3 transition-all duration-[var(--duration-normal)] hover:scale-105 focus:scale-105 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:ring-offset-2 rounded-[var(--radius-sm)]"
            >
              <BrandWordmark className="h-8 w-auto" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:space-x-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "group relative inline-flex items-center rounded-[var(--radius-md)] px-4 py-2 text-sm font-medium transition-all duration-[var(--duration-normal)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:ring-offset-2",
                    active
                      ? "bg-[var(--color-primary-100)] text-[var(--color-primary-700)] shadow-[var(--shadow-light)]"
                      : "text-[var(--text-secondary)] hover:bg-[var(--color-neutral-100)] hover:text-[var(--text-primary)] hover:shadow-[var(--shadow-light)]",
                  )}
                >
                  <Icon
                    className={cn(
                      "mr-2 h-4 w-4 transition-colors",
                      active
                        ? "text-[var(--color-primary-600)]"
                        : "text-[var(--text-muted)] group-hover:text-[var(--text-primary)]",
                    )}
                  />
                  {item.name}
                  {item.badge && (
                    <span className="ml-2 rounded-full bg-[var(--color-primary-500)] px-2 py-0.5 text-xs font-medium text-white">
                      {item.badge}
                    </span>
                  )}
                  {active && (
                    <div className="absolute inset-x-0 bottom-0 h-0.5 bg-[var(--color-primary-600)] rounded-full"></div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-1">
            {/* Search */}
            <Button
              variant="ghost"
              size="icon-sm"
              className="hidden sm:flex hover:bg-[var(--color-neutral-100)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:ring-offset-2"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </Button>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon-sm"
              className="hidden sm:flex hover:bg-[var(--color-neutral-100)] relative focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:ring-offset-2"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-[var(--color-error-500)] animate-pulse"></span>
            </Button>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => {
                const themes = ["light", "dark", "system"] as const;
                const currentIndex = themes.indexOf(theme);
                const nextTheme = themes[(currentIndex + 1) % themes.length];
                setTheme(nextTheme);
              }}
              className="hover:bg-[var(--color-neutral-100)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:ring-offset-2"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            >
              <ThemeIcon className="h-4 w-4" />
            </Button>

            {/* User Menu */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 hover:bg-[var(--color-neutral-100)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:ring-offset-2"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-primary-600)] text-white shadow-[var(--shadow-light)]">
                  <User className="h-4 w-4" />
                </div>
                <span className="hidden sm:inline text-[var(--text-primary)] font-medium">
                  User
                </span>
                <ChevronDown className="h-3 w-3" />
              </Button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-[var(--radius-lg)] border border-[var(--border-muted)] bg-[var(--surface-card)] py-2 shadow-[var(--shadow-heavy)] backdrop-blur-[var(--backdrop-blur-medium)] animate-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b border-[var(--border-subtle)]">
                    <p className="text-sm font-medium text-[var(--text-primary)]">John Doe</p>
                    <p className="text-xs text-[var(--text-muted)]">john@example.com</p>
                  </div>
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--color-neutral-100)] transition-colors"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <User className="mr-3 h-4 w-4" />
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--color-neutral-100)] transition-colors"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <Settings className="mr-3 h-4 w-4" />
                    Settings
                  </Link>
                  <hr className="my-2 border-[var(--border-subtle)]" />
                  <button
                    onClick={() => {
                      // Handle logout
                      setIsUserMenuOpen(false);
                    }}
                    className="flex w-full items-center px-4 py-2 text-left text-sm text-[var(--text-primary)] hover:bg-[var(--color-neutral-100)] transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>

            {/* Settings */}
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setIsSettingsOpen(true)}
              className="hover:bg-[var(--color-neutral-100)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:ring-offset-2"
              aria-label="Settings"
            >
              <Settings className="h-4 w-4" />
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon-sm"
              className="md:hidden hover:bg-[var(--color-neutral-100)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:ring-offset-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="border-t border-[var(--border-subtle)] bg-[var(--surface-card)]/98 backdrop-blur-[var(--backdrop-blur-medium)] md:hidden animate-in slide-in-from-top-2 duration-200">
          <div className="mx-auto w-full max-w-7xl px-4 py-4">
            <nav className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "flex items-center justify-between rounded-[var(--radius-md)] px-4 py-3 text-base font-medium transition-all duration-[var(--duration-normal)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:ring-offset-2",
                      active
                        ? "bg-[var(--color-primary-100)] text-[var(--color-primary-700)] shadow-[var(--shadow-light)]"
                        : "text-[var(--text-secondary)] hover:bg-[var(--color-neutral-100)] hover:text-[var(--text-primary)]",
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="flex items-center">
                      <Icon
                        className={cn(
                          "mr-3 h-5 w-5",
                          active ? "text-[var(--color-primary-600)]" : "text-[var(--text-muted)]",
                        )}
                      />
                      {item.name}
                    </div>
                    {item.badge && (
                      <span className="rounded-full bg-[var(--color-primary-500)] px-2 py-0.5 text-xs font-medium text-white">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      <SettingsDrawer open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
    </header>
  );
}
