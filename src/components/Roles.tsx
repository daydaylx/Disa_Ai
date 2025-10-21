import React from "react";

import { RoleCard } from "./studio/RoleCard";

interface Role {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  recommendedModel?: string;
  recommendedTemperature?: number;
}

interface RolesProps {
  roles: Role[];
  onRoleSelect: (role: Role) => void;
}

function summariseRole(role: Role) {
  if (role.description?.trim()) return role.description.trim();
  return role.systemPrompt.replace(/\s+/g, " ").trim();
}

export const Roles: React.FC<RolesProps> = ({ roles, onRoleSelect }) => {
  return (
    <div className="grid gap-3">
      {roles.map((role) => (
        <RoleCard
          key={role.id}
          title={role.name}
          description={summariseRole(role)}
          badge={role.recommendedModel}
          onClick={() => onRoleSelect(role)}
        />
      ))}
    </div>
  );
};
