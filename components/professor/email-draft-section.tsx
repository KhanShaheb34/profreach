"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getProfile, getMemory, getApiKey, addDraft, getDraftsByProfessor, deleteDraft } from "@/lib/storage";
import { useStorage } from "@/hooks/use-storage";
import { EmailTemplate } from "@/lib/types";
import { EMAIL_TEMPLATE_LABELS } from "@/lib/constants";
import type { Professor } from "@/lib/types";
import { Sparkles, Copy, Loader2, Trash2, Mail } from "lucide-react";
import { toast } from "sonner";
import { useCallback } from "react";

export function EmailDraftSection({ professor }: { professor: Professor }) {
  const [template, setTemplate] = useState<EmailTemplate>(EmailTemplate.ColdOutreach);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  const getDraftsForProf = useCallback(() => getDraftsByProfessor(professor.id), [professor.id]);
  const drafts = useStorage(getDraftsForProf);

  async function handleGenerate() {
    setLoading(true);
    try {
      const profile = getProfile();
      const memory = getMemory().filter(
        (m) => m.source.includes(professor.id) || m.source === "manual" || m.source === "resume"
      );

      const res = await fetch("/api/gemini/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ professor, profile, template, memory, apiKey: getApiKey() }),
      });

      if (!res.ok) throw new Error("Generation failed");

      const data = await res.json();
      setSubject(data.subject || "");
      setBody(data.body || "");
      toast.success("Email draft generated");
    } catch {
      toast.error("Failed to generate email draft");
    } finally {
      setLoading(false);
    }
  }

  function handleSaveDraft() {
    if (!subject.trim() && !body.trim()) {
      toast.error("Nothing to save");
      return;
    }
    addDraft({
      id: uuidv4(),
      professorId: professor.id,
      template,
      subject: subject.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
    });
    toast.success("Draft saved");
  }

  function handleCopy() {
    const text = `Subject: ${subject}\n\n${body}`;
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Mail className="h-5 w-5" />
          Email Drafts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Select value={template} onValueChange={(v) => setTemplate(v as EmailTemplate)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(EmailTemplate).map((t) => (
                <SelectItem key={t} value={t}>
                  {EMAIL_TEMPLATE_LABELS[t]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleGenerate} disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-1" />
                Generate
              </>
            )}
          </Button>
        </div>

        <div className="space-y-2">
          <Label>Subject</Label>
          <Input value={subject} onChange={(e) => setSubject(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label>Body</Label>
          <Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={10} />
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy} disabled={!body}>
            <Copy className="h-4 w-4 mr-1" />
            Copy
          </Button>
          <Button size="sm" onClick={handleSaveDraft} disabled={!subject && !body}>
            Save Draft
          </Button>
        </div>

        {drafts && drafts.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Saved Drafts</h4>
              <ScrollArea className="max-h-[200px]">
                <div className="space-y-2">
                  {drafts.map((draft) => (
                    <div
                      key={draft.id}
                      className="flex items-start justify-between rounded-lg border p-3 text-sm cursor-pointer hover:bg-accent"
                      onClick={() => {
                        setSubject(draft.subject);
                        setBody(draft.body);
                        setTemplate(draft.template);
                      }}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">{draft.subject || "No subject"}</p>
                        <p className="text-xs text-muted-foreground">
                          {EMAIL_TEMPLATE_LABELS[draft.template]} &middot;{" "}
                          {new Date(draft.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteDraft(draft.id);
                          toast.success("Draft deleted");
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
