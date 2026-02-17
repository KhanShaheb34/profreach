"use client";

import { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useStorage } from "@/hooks/use-storage";
import { exportAll, importAll, getProfessors, getDocuments, getMemory, getChats, getDrafts } from "@/lib/storage";
import { Download, Upload, Database, Users, FileText, Brain, MessageSquare, Mail } from "lucide-react";
import { toast } from "sonner";

export function ExportControls() {
  const professors = useStorage(getProfessors);
  const documents = useStorage(getDocuments);
  const memory = useStorage(getMemory);
  const chats = useStorage(getChats);
  const drafts = useStorage(getDrafts);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleExport() {
    const data = exportAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `profreach-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Data exported successfully");
  }

  function handleImport(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);
        importAll(data);
        toast.success("Data imported successfully");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Invalid backup file");
      }
    };
    reader.readAsText(file);
  }

  const stats = [
    { label: "Professors", value: professors?.length ?? 0, icon: Users },
    { label: "Documents", value: documents?.length ?? 0, icon: FileText },
    { label: "Memories", value: memory?.length ?? 0, icon: Brain },
    { label: "Chat Messages", value: chats?.length ?? 0, icon: MessageSquare },
    { label: "Email Drafts", value: drafts?.length ?? 0, icon: Mail },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-3 rounded-lg border p-3">
                <stat.icon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-lg font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Export & Import</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Export All Data</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Download all your data as a JSON file. This includes professors, profile, documents, memories, chats, and email drafts.
            </p>
            <Button onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export JSON
            </Button>
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-medium mb-2">Import Data</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Restore from a previously exported JSON backup. This will replace all existing data.
            </p>
            <input
              ref={inputRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImport(file);
                e.currentTarget.value = "";
              }}
            />
            <Button variant="outline" onClick={() => inputRef.current?.click()}>
              <Upload className="h-4 w-4 mr-2" />
              Import JSON
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
