import { Users } from "lucide-react";

interface RoleSelectProps {
  role: string;
  setRole: (role: string) => void;
}

export function RoleSelect({ role, setRole }: RoleSelectProps) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">Role</h2>
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
        </select>
      </div>
    </div>
  );
}
