"use client";

import { useCallback } from "react";
import Link from "next/link";
import { useStorage } from "@/hooks/use-storage";
import { getProfessor } from "@/lib/storage";
import { ProfessorInfoPanel } from "./professor-info-panel";
import { EmailDraftSection } from "./email-draft-section";
import { ChatSection } from "./chat-section";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";

export function ProfessorDetail({ id }: { id: string }) {
  const getProf = useCallback(() => getProfessor(id), [id]);
  const professor = useStorage(getProf);

  if (professor === undefined) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

  if (!professor) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <h2 className="text-lg font-medium">Professor not found</h2>
        <p className="text-sm text-muted-foreground mt-1">This professor may have been deleted.</p>
        <Link href="/">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">{professor.name}</h1>
          <p className="text-muted-foreground">
            {professor.university}
            {professor.department && ` — ${professor.department}`}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <ProfessorInfoPanel professor={professor} />
          <EmailDraftSection professor={professor} />
        </div>
        <div>
          <ChatSection professor={professor} />
        </div>
      </div>
    </div>
  );
}
