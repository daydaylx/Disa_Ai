import { useNavigate } from "react-router-dom";

import { AppMenuDrawer, useMenuDrawer } from "../components/layout/AppMenuDrawer";
import { AppShell } from "../components/layout/AppShell";
import { ModelsCatalog } from "../components/models/ModelsCatalog";

export default function ModelsPage() {
  const { isOpen, openMenu, closeMenu } = useMenuDrawer();
  const navigate = useNavigate();

  return (
    <>
      <AppShell title="Modelle" onMenuClick={openMenu}>
        <div className="h-full overflow-hidden flex flex-col">
          <ModelsCatalog className="flex-1 min-h-0" />
        </div>
      </AppShell>

      <AppMenuDrawer isOpen={isOpen} onClose={closeMenu} />
    </>
  );
}
