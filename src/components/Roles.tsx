import React from "react";

import { Glass } from "./Glass";

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

export const Roles: React.FC<RolesProps> = ({ roles, onRoleSelect }) => {
  return (
    <div className="space-y-3">
      {roles.map((role) => (
        <Glass
          key={role.id}
          variant="subtle"
          className="cursor-pointer rounded-lg p-2 transition-colors hover:bg-[rgba(255,255,255,0.05)]"
          onClick={() => onRoleSelect(role)}
        >
          <h3 className="font-medium text-[var(--fg)]">{role.name}</h3>
          <p className="mt-1 text-sm text-[var(--fg-dim)]">{role.description}</p>
        </Glass>
      ))}
    </div>
  );
};
