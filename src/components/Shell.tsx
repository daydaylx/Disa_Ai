import React from "react";

import { Header } from "./Header";
import { NetworkBanner } from "./NetworkBanner";

export function Shell({ children }: React.PropsWithChildren) {
  return (
    <div className="min-h-screen flex flex-col">
      <NetworkBanner />
      <Header />
      <main className="flex-1 container-page py-6">{children}</main>
      <footer className="border-t border-border py-4 text-sm text-zinc-400">
        <div className="container-page flex items-center justify-between">
          <span>© Disa AI</span>
          <span className="opacity-80">Private build</span>
        </div>
      </footer>
    </div>
  );
}
