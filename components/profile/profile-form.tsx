"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TagInput } from "@/components/professor/tag-input";
import { getProfile, setProfile } from "@/lib/storage";
import { useStorage } from "@/hooks/use-storage";
import type { Profile } from "@/lib/types";
import { toast } from "sonner";

export function ProfileForm() {
  const profile = useStorage(getProfile);
  const [draft, setDraft] = useState<Partial<Profile>>({});
  const saveTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const pendingDraftRef = useRef<Partial<Profile>>({});
  const latestProfileRef = useRef(profile);
  latestProfileRef.current = profile;

  const form: Profile = { ...profile, ...draft };

  useEffect(() => {
    return () => clearTimeout(saveTimer.current);
  }, []);

  function handleChange(updates: Partial<Profile>) {
    pendingDraftRef.current = { ...pendingDraftRef.current, ...updates };
    setDraft(pendingDraftRef.current);

    // Auto-save with debounce
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      const updated = {
        ...latestProfileRef.current,
        ...pendingDraftRef.current,
      };
      setProfile(updated);
      pendingDraftRef.current = {};
      setDraft({});
      toast.success("Profile saved", { duration: 1500 });
    }, 1000);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Info</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input
              value={form.name}
              onChange={(e) => handleChange({ name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              value={form.email}
              onChange={(e) => handleChange({ email: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>University</Label>
            <Input
              value={form.university}
              onChange={(e) => handleChange({ university: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Degree</Label>
            <Input
              value={form.degree}
              onChange={(e) => handleChange({ degree: e.target.value })}
              placeholder="e.g. M.S. Computer Science"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Field of Study</Label>
            <Input
              value={form.field}
              onChange={(e) => handleChange({ field: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>GPA</Label>
            <Input
              value={form.gpa}
              onChange={(e) => handleChange({ gpa: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Research Interests</Label>
          <TagInput
            tags={form.researchInterests}
            onChange={(tags) => handleChange({ researchInterests: tags })}
            placeholder="Add research interest..."
          />
        </div>

        <div className="space-y-2">
          <Label>Skills</Label>
          <TagInput
            tags={form.skills}
            onChange={(tags) => handleChange({ skills: tags })}
            placeholder="Add skill..."
          />
        </div>

        <div className="space-y-2">
          <Label>Publications</Label>
          <TagInput
            tags={form.publications}
            onChange={(tags) => handleChange({ publications: tags })}
            placeholder="Add publication..."
          />
        </div>

        <div className="space-y-2">
          <Label>Work Experience</Label>
          <Textarea
            value={form.workExperience}
            onChange={(e) => handleChange({ workExperience: e.target.value })}
            rows={3}
            placeholder="Brief summary of relevant work experience..."
          />
        </div>

        <div className="space-y-2">
          <Label>Professional Summary</Label>
          <Textarea
            value={form.summary}
            onChange={(e) => handleChange({ summary: e.target.value })}
            rows={3}
            placeholder="2-3 sentences about your background and goals..."
          />
        </div>
      </CardContent>
    </Card>
  );
}
