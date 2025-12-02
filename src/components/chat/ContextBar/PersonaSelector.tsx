import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useState } from "react";

import { useRoles } from "@/contexts/RolesContext";
import { cn } from "@/lib/utils";

import { ContextBadge } from "./ContextBadge";
import { PersonaDropdown } from "./PersonaDropdown";

export function PersonaSelector() {
  const [open, setOpen] = useState(false);
  const { activeRole, setActiveRole, roles } = useRoles();

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <ContextBadge label={`Rolle: ${activeRole?.name || "Standard"}`} isOpen={open} />
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className={cn(
            "z-popover min-w-[280px] rounded-xl border border-border-ink bg-bg-page/95 p-0 shadow-floating backdrop-blur-sm",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
          )}
          side="top"
          sideOffset={8}
          collisionPadding={8}
          align="start"
        >
          <PersonaDropdown
            activeRole={activeRole}
            roles={roles}
            onSelect={setActiveRole}
            onClose={() => setOpen(false)}
          />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
