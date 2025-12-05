import { AppMenuDrawer, useMenuDrawer } from "../components/layout/AppMenuDrawer";
import { AppShell } from "../components/layout/AppShell";
import { EnhancedRolesInterface } from "../components/roles/EnhancedRolesInterface";

export default function RolesPage() {
  const { isOpen, openMenu, closeMenu } = useMenuDrawer();
  // const navigate = useNavigate(); // Removed unused navigate

  return (
    <>
      <AppShell title="Rollen & Personas" onMenuClick={openMenu}>
        <div className="h-full flex flex-col">
          <EnhancedRolesInterface className="flex-1 min-h-0" />
        </div>
      </AppShell>

      <AppMenuDrawer isOpen={isOpen} onClose={closeMenu} />
    </>
  );
}
