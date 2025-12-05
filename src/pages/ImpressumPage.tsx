import { useNavigate } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { useMenuDrawer, AppMenuDrawer } from "../components/layout/AppMenuDrawer";
import { Button, Card } from "@/ui";
import { ArrowLeft } from "@/lib/icons";

export default function ImpressumPage() {
  const { isOpen, openMenu, closeMenu } = useMenuDrawer();
  const navigate = useNavigate();

  return (
    <>
      <AppShell 
        title="Impressum" 
        onMenuClick={openMenu}
        headerActions={
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Zurück
          </Button>
        }
      >
        <div className="flex flex-col items-center justify-center min-h-full p-4 overflow-y-auto">
          <Card className="w-full max-w-2xl" padding="lg">
            <div className="space-y-8">
              <div className="text-center pb-4 border-b border-white/5">
                <h1 className="text-2xl font-bold text-ink-primary">Impressum</h1>
                <p className="text-sm text-ink-secondary mt-2">Verantwortlich für den Inhalt</p>
              </div>

              <div className="rounded-xl bg-accent-primary/10 border border-accent-primary/20 p-4 text-sm text-ink-primary">
                <p className="leading-relaxed">
                  Dies ist eine rein private, nicht geschäftsmäßige Webseite ohne
                  Gewinnerzielungsabsicht.
                </p>
              </div>

              <section className="space-y-4">
                <h2 className="text-lg font-semibold text-ink-primary">
                  Angaben gemäß § 5 TMG
                </h2>
                <div className="text-ink-secondary space-y-2 leading-relaxed">
                  <p className="font-medium text-ink-primary">David Grunert</p>
                  <p>
                    Kontakt:<br />
                    E-Mail:{" "}
                    <a
                      href="mailto:grunert94@hotmail.com"
                      className="text-accent-primary hover:text-accent-primary/80 hover:underline transition-colors"
                    >
                      grunert94@hotmail.com
                    </a>
                  </p>
                </div>
              </section>
              
              <section className="space-y-4 pt-4 border-t border-white/5">
                 <p className="text-sm text-ink-tertiary">
                    Da diese Seite rein privat und nicht geschäftsmäßig betrieben wird, besteht keine
                    Verpflichtung zur Benennung eines Datenschutzbeauftragten.
                 </p>
              </section>
            </div>
          </Card>
        </div>
      </AppShell>
      
      <AppMenuDrawer isOpen={isOpen} onClose={closeMenu} />
    </>
  );
}