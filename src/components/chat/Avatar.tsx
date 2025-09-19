type Props = { kind: "user" | "assistant"; className?: string };

export default function Avatar({ kind, className }: Props) {
  const label = kind === "user" ? "Du" : "AI";
  return (
    <div
      aria-hidden
      className={[
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-medium",
        kind === "user"
          ? "border-accent-1/40 bg-accent-1/10 text-accent-1"
          : "border-accent-2/40 bg-accent-2/10 text-accent-2",
        className || "",
      ].join(" ")}
    >
      {label}
    </div>
  );
}
