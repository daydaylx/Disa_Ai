import { useState } from "react";

import { useCustomRoles } from "../../contexts/CustomRolesContext";
import { Plus, Users } from "../../lib/icons";
import { CustomRoleModal } from "./CustomRoleModal";

interface RoleSelectProps {
  role: string;
  setRole: (role: string) => void;
}

export function RoleSelect({ role, setRole }: RoleSelectProps) {
  const { customRoles } = useCustomRoles();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<any>(null);

  const handleEdit = (roleId: string) => {
    const roleToEdit = customRoles.find((r) => r.id === roleId);
    setSelectedRole(roleToEdit);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedRole(null);
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">Role</h2>
        <button onClick={() => handleEdit(role)} className="text-xs text-blue-500 hover:underline">
          Edit
        </button>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <Users className="h-5 w-5 text-[var(--color-text-secondary)]" />
        <select
          className="w-full bg-transparent/50 backdrop-blur-sm text-sm border border-transparent hover:border-gray-300 focus:border-blue-500 focus:ring-0 rounded-md transition-colors duration-200 glass-panel p-2"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option>Default</option>
          <option>Assistant</option>
          <option>Developer</option>
          {customRoles.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
        <button onClick={handleCreate} className="p-2 rounded-md bg-gray-200 hover:bg-gray-300">
          <Plus className="h-5 w-5" />
        </button>
      </div>
      <CustomRoleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        role={selectedRole}
      />
    </div>
  );
}
