import { PageLayout } from "../components/layout/PageLayout";
import { ModelsCatalog } from "../components/models/ModelsCatalog";

export default function ModelsPage() {
  return (
    <PageLayout accentColor="models">
      <div className="h-full flex flex-col">
        <ModelsCatalog className="flex-1 min-h-0" />
      </div>
    </PageLayout>
  );
}
