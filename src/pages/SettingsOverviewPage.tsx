import { PageContainer } from "../components/layout/PageContainer";
import { SettingsOverview } from "../features/settings/SettingsOverview";

export default function SettingsOverviewPage() {
  return (
    <PageContainer width="wide" className="flex flex-col gap-6">
      <SettingsOverview />
    </PageContainer>
  );
}
