import { useState } from "react";

import { useCustomRoles } from "../../contexts/CustomRolesContext";

interface CustomRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  role?: any;
}

export function CustomRoleModal({ isOpen, onClose, role }: CustomRoleModalProps) {
  const { addCustomRole, updateCustomRole } = useCustomRoles();
  const [name, setName] = useState(role ? role.name : "");
  const [systemPrompt, setSystemPrompt] = useState(role ? role.systemPrompt : "");
  // eslint-disable-next-line no-restricted-syntax
  const [primaryColor, setPrimaryColor] = useState(
    role ? role.theme["--color-brand-primary"] : "#4b63ff",
  );

  const handleSubmit = () => {
    const newRole = {
      id: role ? role.id : Date.now().toString(),
      name,
      systemPrompt,
      theme: {
        "--color-brand-primary": primaryColor,
        "--color-brand-light": `${primaryColor}80`,
        "--color-brand-dark": `${primaryColor}bf`,
      },
    };

    if (role) {
      updateCustomRole(newRole);
    } else {
      addCustomRole(newRole);
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">
          {role ? "Edit Custom Role" : "Create Custom Role"}
        </h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            />
          </div>
          <div>
            <label htmlFor="system-prompt" className="block text-sm font-medium text-gray-700">
              System Prompt
            </label>
            <textarea
              id="system-prompt"
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              rows={4}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            />
          </div>
          <div>
            <label htmlFor="primary-color" className="block text-sm font-medium text-gray-700">
              Primary Color
            </label>
            <input
              type="color"
              id="primary-color"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="mt-1 block w-full"
            />
          </div>
        </div>
        <div className="mt-8 flex justify-end space-x-4">
          <button onClick={onClose} className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600"
          >
            {role ? "Save" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
