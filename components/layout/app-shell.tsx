"use client";

import { Sidebar } from "./sidebar";
import { ApiKeyBanner } from "./api-key-banner";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="md:ml-60">
        <div className="pt-14 md:pt-0">
          <ApiKeyBanner />
        </div>
        <main>
          <div className="container mx-auto max-w-6xl p-4 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
