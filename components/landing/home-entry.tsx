"use client";

import { DashboardContent } from "@/components/dashboard/dashboard-content";
import { LandingPage } from "@/components/landing/landing-page";
import { useMockAuth } from "@/hooks/use-mock-auth";

export function HomeEntry() {
  const { isAuthenticated } = useMockAuth();
  return isAuthenticated ? <DashboardContent /> : <LandingPage />;
}
