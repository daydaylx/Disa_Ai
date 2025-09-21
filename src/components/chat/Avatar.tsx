import { cn } from "../../lib/utils/cn";

type Props = { kind: "user" | "assistant"; className?: string };

export default function Avatar({ kind, className }: Props) {
  const label = kind === "user" ? "Du" : "AI";
  const variant =
    kind === "user"
      ? "border-accent/40 bg-accent-low text-accent"
      : "border-border-subtle bg-surface-100 text-text-secondary";

  return (
    <div
      aria-hidden
      className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-medium",
        variant,
        className,
      )}
    >
      {label}
    </div>
  );
}
