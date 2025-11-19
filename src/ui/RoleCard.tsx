import React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/ui/Button";
import { Typography } from "@/ui/Typography";

// RoleCard Component
interface RoleCardProps {
  role: {
    id: string;
    name: string;
    description: string;
  };
  isActive?: boolean;
  onActivate?: () => void;
  onDeactivate?: () => void;
  className?: string;
}

const RoleCardComponent = React.memo(
  ({ role, isActive = false, onActivate, onDeactivate, className }: RoleCardProps) => {
    // Destructure properties from role object
    const { name: title, description } = role;

    return (
      <div className={cn("flex flex-col h-full", className)}>
        <div className="flex-1">
          <Typography variant="h3" className="text-text-primary font-semibold mb-2">
            {title}
          </Typography>
          <Typography variant="body-sm" className="text-text-secondary line-clamp-3">
            {description}
          </Typography>
        </div>
        <div className="mt-4">
          <Button
            variant={isActive ? "secondary" : "primary"}
            size="sm"
            onClick={isActive ? onDeactivate : onActivate}
            className="w-full"
          >
            {isActive ? "Deaktivieren" : "Aktivieren"}
          </Button>
        </div>
      </div>
    );
  },
);

RoleCardComponent.displayName = "RoleCard";

export const RoleCard = RoleCardComponent;
