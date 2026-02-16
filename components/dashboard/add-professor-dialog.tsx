"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { addProfessor } from "@/lib/storage";
import { ApplicationStatus, HiringStatus } from "@/lib/types";
import type { Professor } from "@/lib/types";
import { toast } from "sonner";

interface AddProfessorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Partial<Professor>;
}

export function AddProfessorDialog({ open, onOpenChange, initialData }: AddProfessorDialogProps) {
  const [form, setForm] = useState({
    name: initialData?.name ?? "",
    email: initialData?.email ?? "",
    university: initialData?.university ?? "",
    department: initialData?.department ?? "",
    country: initialData?.country ?? "",
    researchAreas: initialData?.researchAreas?.join(", ") ?? "",
    recentPapers: initialData?.recentPapers?.join("\n") ?? "",
    websiteUrl: initialData?.websiteUrl ?? "",
    scholarUrl: initialData?.scholarUrl ?? "",
    notes: initialData?.notes ?? "",
  });

  // Reset form when initialData changes
  const [lastInitial, setLastInitial] = useState(initialData);
  if (initialData !== lastInitial) {
    setLastInitial(initialData);
    setForm({
      name: initialData?.name ?? "",
      email: initialData?.email ?? "",
      university: initialData?.university ?? "",
      department: initialData?.department ?? "",
      country: initialData?.country ?? "",
      researchAreas: initialData?.researchAreas?.join(", ") ?? "",
      recentPapers: initialData?.recentPapers?.join("\n") ?? "",
      websiteUrl: initialData?.websiteUrl ?? "",
      scholarUrl: initialData?.scholarUrl ?? "",
      notes: initialData?.notes ?? "",
    });
  }

  function handleSave() {
    if (!form.name.trim()) {
      toast.error("Professor name is required");
      return;
    }

    const now = new Date().toISOString();
    const professor: Professor = {
      id: uuidv4(),
      name: form.name.trim(),
      email: form.email.trim(),
      university: form.university.trim(),
      department: form.department.trim(),
      country: form.country.trim(),
      researchAreas: form.researchAreas
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      recentPapers: form.recentPapers
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      websiteUrl: form.websiteUrl.trim(),
      scholarUrl: form.scholarUrl.trim(),
      hiringStatus: initialData?.hiringStatus ?? HiringStatus.Unknown,
      applicationStatus: ApplicationStatus.Interested,
      notes: form.notes.trim(),
      lastContacted: null,
      createdAt: now,
      updatedAt: now,
    };

    addProfessor(professor);
    toast.success(`Added ${professor.name}`);
    onOpenChange(false);
    // Reset form
    setForm({
      name: "",
      email: "",
      university: "",
      department: "",
      country: "",
      researchAreas: "",
      recentPapers: "",
      websiteUrl: "",
      scholarUrl: "",
      notes: "",
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Professor</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Dr. Jane Smith"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="jsmith@university.edu"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="university">University</Label>
              <Input
                id="university"
                value={form.university}
                onChange={(e) => setForm((f) => ({ ...f, university: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={form.department}
                onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={form.country}
              onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="researchAreas">Research Areas (comma-separated)</Label>
            <Input
              id="researchAreas"
              value={form.researchAreas}
              onChange={(e) => setForm((f) => ({ ...f, researchAreas: e.target.value }))}
              placeholder="Machine Learning, NLP, Computer Vision"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="recentPapers">Recent Papers (one per line)</Label>
            <Textarea
              id="recentPapers"
              value={form.recentPapers}
              onChange={(e) => setForm((f) => ({ ...f, recentPapers: e.target.value }))}
              placeholder="Paper title 1&#10;Paper title 2"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="websiteUrl">Website URL</Label>
              <Input
                id="websiteUrl"
                value={form.websiteUrl}
                onChange={(e) => setForm((f) => ({ ...f, websiteUrl: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="scholarUrl">Google Scholar URL</Label>
              <Input
                id="scholarUrl"
                value={form.scholarUrl}
                onChange={(e) => setForm((f) => ({ ...f, scholarUrl: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              rows={2}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Add Professor</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
