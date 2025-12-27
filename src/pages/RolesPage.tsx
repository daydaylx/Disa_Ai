import { PageLayout } from "../components/layout/PageLayout";
import { EnhancedRolesInterface } from "../components/roles/EnhancedRolesInterface";

export default function RolesPage() {
  return (
    <PageLayout accentColor="roles">
      <div className="h-full flex flex-col">
        <EnhancedRolesInterface className="flex-1 min-h-0" />
      </div>
    </PageLayout>
  );
}
