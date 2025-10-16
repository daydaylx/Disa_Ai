export function TypingIndicator() {
  return (
    <div className="flex h-6 items-center gap-1 px-2">
      <span className="h-2 w-2 animate-bounce rounded-full bg-[hsl(var(--acc1))] [animation-delay:0ms]"></span>
      <span className="h-2 w-2 animate-bounce rounded-full bg-[hsl(var(--acc1))] [animation-delay:120ms]"></span>
      <span className="h-2 w-2 animate-bounce rounded-full bg-[hsl(var(--acc1))] [animation-delay:240ms]"></span>
    </div>
  );
}
