"use client";

import { useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addDocument } from "@/lib/storage";
import { DocumentCategory } from "@/lib/types";
import { DOCUMENT_CATEGORY_LABELS, MAX_DOCUMENT_SIZE_BYTES } from "@/lib/constants";
import { Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface DocumentUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DocumentUploadDialog({ open, onOpenChange }: DocumentUploadDialogProps) {
  const [category, setCategory] = useState<DocumentCategory>(DocumentCategory.Other);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload() {
    if (!file) {
      toast.error("Please select a file");
      return;
    }

    if (file.size > MAX_DOCUMENT_SIZE_BYTES) {
      toast.error("File is too large. Maximum size is 10 MB.");
      return;
    }

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const content = reader.result as string;
        try {
          await addDocument({
            id: uuidv4(),
            name: file.name,
            category,
            content,
            mimeType: file.type,
            size: file.size,
            createdAt: new Date().toISOString(),
          });
          toast.success(`Uploaded ${file.name}`);
          onOpenChange(false);
          setFile(null);
        } catch {
          toast.error("Failed to store document");
        } finally {
          setUploading(false);
        }
      };
      reader.onerror = () => {
        toast.error("Failed to read file");
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      toast.error("Failed to upload document");
      setUploading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as DocumentCategory)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(DocumentCategory).map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {DOCUMENT_CATEGORY_LABELS[cat]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>File</Label>
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              onChange={(e) => {
                const nextFile = e.target.files?.[0] ?? null;
                if (nextFile && nextFile.size > MAX_DOCUMENT_SIZE_BYTES) {
                  toast.error("File is too large. Maximum size is 10 MB.");
                  setFile(null);
                  return;
                }
                setFile(nextFile);
              }}
            />
            <div
              className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
              onClick={() => inputRef.current?.click()}
            >
              <Upload className="h-6 w-6 text-muted-foreground" />
              <p className="mt-2 text-sm">
                {file ? file.name : "Click to select file"}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={!file || uploading}>
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
