"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { setProfile, getProfile, getApiKey } from "@/lib/storage";
import type { Profile } from "@/lib/types";
import { MAX_RESUME_SIZE_BYTES } from "@/lib/constants";
import { Upload, Loader2, FileText } from "lucide-react";
import { toast } from "sonner";

export function ResumeUpload() {
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(file: File) {
    if (file.size > MAX_RESUME_SIZE_BYTES) {
      toast.error("Resume is too large. Maximum size is 10 MB.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("apiKey", getApiKey());

      const res = await fetch("/api/gemini/resume", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Resume parsing failed");

      const parsed = await res.json();
      const current = getProfile();

      // Merge parsed data with current profile (don't overwrite non-empty fields)
      const merged: Profile = {
        name: parsed.name || current.name,
        email: parsed.email || current.email,
        university: parsed.university || current.university,
        degree: parsed.degree || current.degree,
        field: parsed.field || current.field,
        gpa: parsed.gpa || current.gpa,
        researchInterests: parsed.researchInterests?.length
          ? [...new Set([...current.researchInterests, ...parsed.researchInterests])]
          : current.researchInterests,
        skills: parsed.skills?.length
          ? [...new Set([...current.skills, ...parsed.skills])]
          : current.skills,
        publications: parsed.publications?.length
          ? [...new Set([...current.publications, ...parsed.publications])]
          : current.publications,
        workExperience: parsed.workExperience || current.workExperience,
        summary: parsed.summary || current.summary,
      };

      setProfile(merged);
      toast.success("Resume parsed and profile updated");
    } catch {
      toast.error("Failed to parse resume");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Resume Upload
        </CardTitle>
      </CardHeader>
      <CardContent>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUpload(file);
          }}
        />
        <div
          className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file && file.type === "application/pdf") handleUpload(file);
          }}
        >
          {loading ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">Parsing resume with AI...</p>
            </>
          ) : (
            <>
              <Upload className="h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm font-medium">Upload Resume (PDF)</p>
              <p className="text-xs text-muted-foreground">
                AI will extract your info and update your profile
              </p>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
