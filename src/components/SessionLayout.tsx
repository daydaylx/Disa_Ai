import * as React from "react";
import SessionSidebar from "./SessionSidebar";

/**

Optionales Layout: teilt links die Sessions und rechts den Content-Bereich.

Nutze es in deiner Chat-View, z.B.:

<SessionLayout>
<YourChatComponent />
</SessionLayout>

*/
export default function SessionLayout({ children }: { children: React.ReactNode }): JSX.Element {
return (
<div className="w-full h-screen flex">
<SessionSidebar />
<main className="flex-1 overflow-y-auto">{children}</main>
</div>
);
}
