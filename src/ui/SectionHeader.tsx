interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  variant?: "default" | "compact";
}

export function SectionHeader({ title, subtitle, variant = "default" }: SectionHeaderProps) {
  if (variant === "compact") {
    return (
      <div className="mb-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-accent/80 mb-1">
          {title}
        </p>
        {subtitle && <p className="text-sm text-text-secondary">{subtitle}</p>}
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-4 text-lg text-text-secondary">{subtitle}</p>}
    </div>
  );
}
