import * as React from "react";
import SessionSidebar from "./SessionSidebar";
import type { UseConversations } from "../hooks/useConversations";

/**
 * Layout-Komponente mit verpflichtendem conv-Prop (gemeinsame Hook-Instanz).
 * Verwendung:
 *   const conv = useConversations();
 *   <SessionLayout conv={conv}>
 *     {/* Chat-Content *\/}
 *   </SessionLayout>
 */
interface Props {
  conv: UseConversations;
  children: React.ReactNode;
}

export default function SessionLayout({ conv, children }: Props): JSX.Element {
  return (
    <div className="w-full h-screen flex">
      <SessionSidebar conv={conv} />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
