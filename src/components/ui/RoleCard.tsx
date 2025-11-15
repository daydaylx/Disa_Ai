import { cn } from "../../lib/utils";
import type { EnhancedRole } from "../../types/enhanced-interfaces";
import { Badge } from "./badge";
import { Button } from "./button";
import { Card } from "./card";

interface RoleCardProps {
  role: EnhancedRole;
  isActive: boolean;
  onActivate: () => void;
}

export function RoleCard({ role, isActive, onActivate }: RoleCardProps) {
  return (
    <Card
      padding="none"
      className={cn(
        "flex flex-col justify-between p-[var(--space-padding-md)] h-full",
        isActive && "border-accent ring-2 ring-[color-mix(in_srgb, var(--accent) 30%, transparent)]",
      )}
    >
      <div className="flex-grow flex flex-col">
        {role.category && (
          <Badge variant="outline" className="mb-[var(--space-2xs)] font-medium text-xs">
            {role.category}
          </Badge>
        )}
        <h3 className="text-base font-semibold text-text-primary mb-[var(--space-2xs)]">{role.name}</h3>
        <p className="text-sm text-text-secondary line-clamp-3 mb-[var(--space-xs)] flex-grow">
          {role.description}
        </p>
        <div className="flex flex-wrap gap-[var(--space-2xs)] mb-[var(--space-sm)]">
          {role.tags?.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              #{tag}
            </Badge>
          ))}
        </div>
      </div>
      <div className="flex-shrink-0">
        <Button onClick={onActivate} disabled={isActive} className="w-full">
          {isActive ? "Aktiv" : "Aktivieren"}
        </Button>
      </div>
    </Card>
  );
}
