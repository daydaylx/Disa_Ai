import { Link } from "react-router-dom";

import { MORE_MENU_SECTIONS } from "@/config/moreMenu";
import { MobileCard, SectionHeader } from "@/ui";

export default function MorePage() {
  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Navigation"
        title="Mehr"
        description="Schnellzugriff auf Einstellungen, Rechtliches und Support"
      />

      <div className="space-y-8">
        {MORE_MENU_SECTIONS.map((section) => (
          <div key={section.title} className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-[var(--text-secondary)]">{section.title}</p>
              {section.description && (
                <p className="text-sm text-[var(--text-muted)]">{section.description}</p>
              )}
            </div>

            <div className="space-y-3">
              {section.items.map((item) => (
                <MobileCard key={item.label} accent="neutral">
                  <Link
                    to={item.path}
                    className="flex w-full items-center justify-between gap-3 text-left no-underline"
                  >
                    <div className="space-y-0.5">
                      <p className="text-base font-semibold text-[var(--text-primary)]">
                        {item.label}
                      </p>
                      {item.description && (
                        <p className="text-sm text-[var(--text-secondary)]">{item.description}</p>
                      )}
                    </div>
                    <span className="text-sm text-[var(--text-muted)]">Öffnen →</span>
                  </Link>
                </MobileCard>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
