"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "./sidebar";
import { ApiKeyBanner } from "./api-key-banner";
import { useMockAuth } from "@/hooks/use-mock-auth";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isReady } = useMockAuth();
  const isLandingRoute = pathname === "/";

  useEffect(() => {
    if (isReady && !isAuthenticated && !isLandingRoute) {
      router.replace("/");
    }
  }, [isAuthenticated, isLandingRoute, isReady, router]);

  if (!isReady) {
    if (isLandingRoute) {
      return <main>{children}</main>;
    }
    return null;
  }

  if (!isAuthenticated) {
    if (!isLandingRoute) {
      return null;
    }

    return <main>{children}</main>;
  }

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
