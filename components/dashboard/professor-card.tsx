"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusBadge } from "./status-badge";
import { updateProfessor, deleteProfessor } from "@/lib/storage";
import { ApplicationStatus } from "@/lib/types";
import { STATUS_LABELS, HIRING_STATUS_LABELS } from "@/lib/constants";
import type { Professor } from "@/lib/types";
import {
  MoreHorizontal,
  ExternalLink,
  MapPin,
  Building2,
  Trash2,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

export function ProfessorCard({ professor }: { professor: Professor }) {
  function handleStatusChange(status: ApplicationStatus) {
    updateProfessor(professor.id, { applicationStatus: status });
    toast.success(`Status updated to ${STATUS_LABELS[status]}`);
  }

  function handleDelete() {
    deleteProfessor(professor.id);
    toast.success(`Removed ${professor.name}`);
  }

  return (
    <Card className="group relative transition-shadow hover:shadow-md">
      <CardHeader className="flex flex-row items-start justify-between gap-2 pb-3">
        <div className="min-w-0 flex-1">
          <Link
            href={`/professor/${professor.id}`}
            className="text-base font-semibold hover:underline line-clamp-1"
          >
            {professor.name}
          </Link>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            {professor.university && (
              <span className="flex items-center gap-1">
                <Building2 className="h-3 w-3" />
                {professor.university}
              </span>
            )}
            {professor.country && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {professor.country}
              </span>
            )}
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {Object.values(ApplicationStatus).map((status) => (
              <DropdownMenuItem
                key={status}
                onClick={() => handleStatusChange(status)}
              >
                {STATUS_LABELS[status]}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={professor.applicationStatus} />
          {professor.hiringStatus !== "unknown" && (
            <span className="text-xs text-muted-foreground">
              {HIRING_STATUS_LABELS[professor.hiringStatus]}
            </span>
          )}
        </div>

        {professor.researchAreas.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {professor.researchAreas.slice(0, 3).map((area) => (
              <span
                key={area}
                className="inline-block rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
              >
                {area}
              </span>
            ))}
            {professor.researchAreas.length > 3 && (
              <span className="text-xs text-muted-foreground">
                +{professor.researchAreas.length - 3} more
              </span>
            )}
          </div>
        )}

        <div className="mt-3 flex items-center justify-between">
          <div className="flex gap-2">
            {professor.websiteUrl && (
              <a
                href={professor.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
          <Link
            href={`/professor/${professor.id}`}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            Details
            <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
