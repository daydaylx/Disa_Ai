import { cn } from "../lib/cn";

type Props = {
  role: "user" | "assistant";
  children: React.ReactNode;
};

export function MessageBubble({ role, children }: Props) {
  const isUser = role === "user";
  return (
    <div
      className={cn(
        "rounded-xl px-4 py-3 text-sm",
        isUser ? "bg-white/10 text-zinc-100 self-end" : "bg-white/5 text-zinc-200"
      )}
    >
      {children}
    </div>
  );
}
