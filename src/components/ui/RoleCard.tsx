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
      <div className="flex-grow">
        {role.category && (
          <Badge variant="outline" className="mb-2 font-medium">
            {role.category}
          </Badge>
        )}
        <h3 className="text-lg font-semibold text-text-primary">{role.name}</h3>
        <p className="mt-1 text-sm text-text-secondary line-clamp-3">{role.description}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {role.tags?.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="secondary">
              #{tag}
            </Badge>
          ))}
        </div>
      </div>
      <div className="mt-4 flex-shrink-0">
        <Button onClick={onActivate} disabled={isActive} className="w-full">
          {isActive ? "Aktiv" : "Aktivieren"}
        </Button>
      </div>
    </Card>
  );
}
