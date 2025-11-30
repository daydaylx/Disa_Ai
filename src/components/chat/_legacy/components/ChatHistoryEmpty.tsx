import { Typography } from "@/ui/Typography";

export function ChatHistoryEmpty() {
  return (
    <div className="text-center py-8 text-text-secondary">
      <Typography variant="body-sm">Keine gespeicherten Chats.</Typography>
    </div>
  );
}
