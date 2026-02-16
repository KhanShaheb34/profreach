"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles, Loader2 } from "lucide-react";
import { AddProfessorDialog } from "./add-professor-dialog";
import type { Professor } from "@/lib/types";
import { toast } from "sonner";

export function AddProfessorInput() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [lookupData, setLookupData] = useState<Partial<Professor> | undefined>();

  async function handleLookup() {
    if (!query.trim()) {
      setLookupData(undefined);
      setDialogOpen(true);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/gemini/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim() }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Lookup failed");
      }

      const data = await res.json();
      setLookupData(data);
      setDialogOpen(true);
      toast.success("Professor info found via AI");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Lookup failed");
      // Open dialog anyway for manual entry
      setLookupData(undefined);
      setDialogOpen(true);
    } finally {
      setLoading(false);
    }
  }

  function handleDialogClose(open: boolean) {
    setDialogOpen(open);
    if (!open) {
      setQuery("");
      setLookupData(undefined);
    }
  }

  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Input
          placeholder="Search professor name and university (e.g. 'Dr. Jane Smith MIT')..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleLookup();
          }}
          className="pr-10"
        />
      </div>
      <Button onClick={handleLookup} disabled={loading}>
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : query.trim() ? (
          <>
            <Sparkles className="h-4 w-4 mr-1" />
            AI Lookup
          </>
        ) : (
          <>
            <Plus className="h-4 w-4 mr-1" />
            Add
          </>
        )}
      </Button>

      <AddProfessorDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        initialData={lookupData}
      />
    </div>
  );
}
