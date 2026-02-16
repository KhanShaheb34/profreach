"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TagInput } from "./tag-input";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { updateProfessor } from "@/lib/storage";
import { ApplicationStatus, HiringStatus } from "@/lib/types";
import { STATUS_LABELS, HIRING_STATUS_LABELS } from "@/lib/constants";
import type { Professor } from "@/lib/types";
import { ExternalLink, Save } from "lucide-react";
import { toast } from "sonner";

export function ProfessorInfoPanel({ professor }: { professor: Professor }) {
  const [form, setForm] = useState(professor);

  useEffect(() => {
    setForm(professor);
  }, [professor]);

  function handleSave() {
    updateProfessor(professor.id, {
      name: form.name,
      email: form.email,
      university: form.university,
      department: form.department,
      country: form.country,
      researchAreas: form.researchAreas,
      recentPapers: form.recentPapers,
      websiteUrl: form.websiteUrl,
      scholarUrl: form.scholarUrl,
      hiringStatus: form.hiringStatus,
      applicationStatus: form.applicationStatus,
      notes: form.notes,
    });
    toast.success("Professor info saved");
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg">Professor Info</CardTitle>
        <Button size="sm" onClick={handleSave}>
          <Save className="h-4 w-4 mr-1" />
          Save
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>University</Label>
            <Input
              value={form.university}
              onChange={(e) => setForm((f) => ({ ...f, university: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Department</Label>
            <Input
              value={form.department}
              onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Country</Label>
          <Input
            value={form.country}
            onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Application Status</Label>
            <Select
              value={form.applicationStatus}
              onValueChange={(v) =>
                setForm((f) => ({ ...f, applicationStatus: v as ApplicationStatus }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(ApplicationStatus).map((status) => (
                  <SelectItem key={status} value={status}>
                    {STATUS_LABELS[status]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Hiring Status</Label>
            <Select
              value={form.hiringStatus}
              onValueChange={(v) =>
                setForm((f) => ({ ...f, hiringStatus: v as HiringStatus }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(HiringStatus).map((status) => (
                  <SelectItem key={status} value={status}>
                    {HIRING_STATUS_LABELS[status]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Research Areas</Label>
          <TagInput
            tags={form.researchAreas}
            onChange={(tags) => setForm((f) => ({ ...f, researchAreas: tags }))}
            placeholder="Add research area..."
          />
        </div>

        <div className="space-y-2">
          <Label>Recent Papers</Label>
          <TagInput
            tags={form.recentPapers}
            onChange={(tags) => setForm((f) => ({ ...f, recentPapers: tags }))}
            placeholder="Add paper title..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Website</Label>
            <div className="flex gap-2">
              <Input
                value={form.websiteUrl}
                onChange={(e) => setForm((f) => ({ ...f, websiteUrl: e.target.value }))}
              />
              {form.websiteUrl && (
                <a href={form.websiteUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="icon" type="button">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </a>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Google Scholar</Label>
            <div className="flex gap-2">
              <Input
                value={form.scholarUrl}
                onChange={(e) => setForm((f) => ({ ...f, scholarUrl: e.target.value }))}
              />
              {form.scholarUrl && (
                <a href={form.scholarUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="icon" type="button">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Notes</Label>
          <Textarea
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
}
