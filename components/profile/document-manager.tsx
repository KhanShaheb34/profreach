"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStorage } from "@/hooks/use-storage";
import { getDocuments, deleteDocument } from "@/lib/storage";
import { DOCUMENT_CATEGORY_LABELS } from "@/lib/constants";
import { DocumentUploadDialog } from "./document-upload-dialog";
import { Plus, Trash2, FileText, Download } from "lucide-react";
import { toast } from "sonner";

export function DocumentManager() {
  const documents = useStorage(getDocuments);
  const [uploadOpen, setUploadOpen] = useState(false);

  function handleDownload(doc: { name: string; content: string; mimeType: string }) {
    const link = document.createElement("a");
    link.href = doc.content;
    link.download = doc.name;
    link.click();
  }

  function handleDelete(id: string, name: string) {
    deleteDocument(id);
    toast.success(`Deleted ${name}`);
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Documents
        </CardTitle>
        <Button size="sm" onClick={() => setUploadOpen(true)}>
          <Plus className="h-4 w-4 mr-1" />
          Upload
        </Button>
      </CardHeader>
      <CardContent>
        {!documents || documents.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            No documents uploaded yet.
          </p>
        ) : (
          <div className="space-y-2">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{doc.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {DOCUMENT_CATEGORY_LABELS[doc.category]} &middot;{" "}
                    {(doc.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleDownload(doc)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => handleDelete(doc.id, doc.name)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <DocumentUploadDialog open={uploadOpen} onOpenChange={setUploadOpen} />
      </CardContent>
    </Card>
  );
}
