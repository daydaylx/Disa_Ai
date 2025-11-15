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
      className={cn(
        "flex flex-col justify-between p-4 h-full",
        isActive && "border-accent ring-2 ring-accent/30",
      )}
    >
      <div className="flex-grow flex flex-col">
        {role.category && (
          <Badge variant="outline" className="mb-3 font-medium text-xs">
            {role.category}
          </Badge>
        )}
        <h3 className="text-base font-semibold text-text-primary mb-2">{role.name}</h3>
        <p className="text-sm text-text-secondary line-clamp-3 mb-3 flex-grow">
          {role.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
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
