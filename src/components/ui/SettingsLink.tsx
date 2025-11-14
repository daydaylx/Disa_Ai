import { type LinkProps } from "react-router-dom";
import { NavLink } from "react-router-dom";

import { ChevronRight } from "../../lib/icons";
import { cn } from "../../lib/utils";

interface SettingsLinkProps extends LinkProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  to: string;
}

export function SettingsLink({ icon, title, description, className, ...props }: SettingsLinkProps) {
  return (
    <NavLink
      className={cn(
        "flex items-center gap-4 rounded-lg p-3 text-style-body transition-colors hover:bg-surface-muted/70",
        className,
      )}
      {...props}
    >
      <div className="flex-shrink-0 text-accent">{icon}</div>
      <div className="flex-1">
        <div className="text-style-body-strong text-text-primary">{title}</div>
        <p className="text-style-caption text-text-secondary">{description}</p>
      </div>
      <ChevronRight className="h-5 w-5 flex-shrink-0 text-text-tertiary" />
    </NavLink>
  );
}
