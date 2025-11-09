import React, { createContext, useContext, useEffect, useState } from "react";

export interface CustomRole {
  id: string;
  name: string;
  systemPrompt: string;
  theme: {
    "--color-brand-primary": string;
    "--color-brand-light": string;
    "--color-brand-dark": string;
  };
}

interface CustomRolesContextType {
  customRoles: CustomRole[];
  addCustomRole: (role: CustomRole) => void;
  updateCustomRole: (role: CustomRole) => void;
  deleteCustomRole: (id: string) => void;
}

const CustomRolesContext = createContext<CustomRolesContextType | undefined>(undefined);

export function CustomRolesProvider({ children }: { children: React.ReactNode }) {
  const [customRoles, setCustomRoles] = useState<CustomRole[]>([]);

  useEffect(() => {
    const savedRoles = localStorage.getItem("customRoles");
    if (savedRoles) {
      setCustomRoles(JSON.parse(savedRoles));
    }
  }, []);

  const addCustomRole = (role: CustomRole) => {
    const newRoles = [...customRoles, role];
    setCustomRoles(newRoles);
    localStorage.setItem("customRoles", JSON.stringify(newRoles));
  };

  const updateCustomRole = (role: CustomRole) => {
    const newRoles = customRoles.map((r) => (r.id === role.id ? role : r));
    setCustomRoles(newRoles);
    localStorage.setItem("customRoles", JSON.stringify(newRoles));
  };

  const deleteCustomRole = (id: string) => {
    const newRoles = customRoles.filter((r) => r.id !== id);
    setCustomRoles(newRoles);
    localStorage.setItem("customRoles", JSON.stringify(newRoles));
  };

  return (
    <CustomRolesContext.Provider
      value={{
        customRoles,
        addCustomRole,
        updateCustomRole,
        deleteCustomRole,
      }}
    >
      {children}
    </CustomRolesContext.Provider>
  );
}

export function useCustomRoles() {
  const context = useContext(CustomRolesContext);
  if (!context) {
    throw new Error("useCustomRoles must be used within a CustomRolesProvider");
  }
  return context;
}
