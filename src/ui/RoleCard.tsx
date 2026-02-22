import React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/ui/Button";
import { Card } from "@/ui/Card";
import { Typography } from "@/ui/Typography";

// RoleCard Component
interface RoleCardProps {
  role: {
    id: string;
    name: string;
    description: string;
    category?: string;
  };
  isActive?: boolean;
  onActivate?: () => void;
  onDeactivate?: () => void;
  className?: string;
  roleColor?: string; // RGB format for role color
}

const RoleCardComponent = React.memo(
  ({ role, isActive = false, onActivate, onDeactivate, className, roleColor }: RoleCardProps) => {
    // Destructure properties from role object
    const { name: title, description } = role;

    return (
      <Card
        variant="tinted"
        roleColor={roleColor || "139 92 246"} // Default to brand color
        className={cn("flex flex-col h-full", className)}
      >
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
      </Card>
    );
  },
);

RoleCardComponent.displayName = "RoleCard";

export const RoleCard = RoleCardComponent;
