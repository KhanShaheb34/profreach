"use client";

import { DashboardStats } from "./dashboard-stats";
import { AddProfessorInput } from "./add-professor-input";
import { ProfessorList } from "./professor-list";

export function DashboardContent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Track your professor outreach pipeline
        </p>
      </div>

      <DashboardStats />

      <div className="space-y-4">
        <AddProfessorInput />
        <ProfessorList />
      </div>
    </div>
  );
}
