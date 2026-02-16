"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useStorage } from "@/hooks/use-storage";
import { getProfessors } from "@/lib/storage";
import { ApplicationStatus } from "@/lib/types";
import { Users, Send, MessageSquare, CheckCircle } from "lucide-react";

export function DashboardStats() {
  const professors = useStorage(getProfessors);

  if (!professors) return null;

  const total = professors.length;
  const sent = professors.filter((p) => p.applicationStatus === ApplicationStatus.Sent).length;
  const replied = professors.filter(
    (p) => p.applicationStatus === ApplicationStatus.Replied || p.applicationStatus === ApplicationStatus.Interview
  ).length;
  const accepted = professors.filter((p) => p.applicationStatus === ApplicationStatus.Accepted).length;

  const stats = [
    { label: "Total Professors", value: total, icon: Users, color: "text-blue-600 dark:text-blue-400" },
    { label: "Emails Sent", value: sent, icon: Send, color: "text-cyan-600 dark:text-cyan-400" },
    { label: "Replied", value: replied, icon: MessageSquare, color: "text-emerald-600 dark:text-emerald-400" },
    { label: "Accepted", value: accepted, icon: CheckCircle, color: "text-green-600 dark:text-green-400" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="flex items-center gap-4 p-4">
            <stat.icon className={cn("h-8 w-8", stat.color)} />
            <div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
