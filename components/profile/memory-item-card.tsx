"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateMemory, deleteMemory } from "@/lib/storage";
import type { MemoryItem } from "@/lib/types";
import { Pencil, Trash2, Check, X } from "lucide-react";
import { toast } from "sonner";

export function MemoryItemCard({ item }: { item: MemoryItem }) {
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(item.content);

  function handleSave() {
    updateMemory(item.id, { content: content.trim() });
    setEditing(false);
    toast.success("Memory updated");
  }

  function handleDelete() {
    deleteMemory(item.id);
    toast.success("Memory deleted");
  }

  return (
    <div className="flex items-start gap-2 rounded-lg border p-3">
      {editing ? (
        <div className="flex flex-1 gap-2">
          <Input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") {
                setEditing(false);
                setContent(item.content);
              }
            }}
          />
          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleSave}>
            <Check className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={() => {
              setEditing(false);
              setContent(item.content);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <>
          <div className="min-w-0 flex-1">
            <p className="text-sm">{item.content}</p>
            <div className="mt-1 flex flex-wrap gap-1">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block rounded-full bg-secondary px-2 py-0.5 text-[10px] text-secondary-foreground"
                >
                  {tag}
                </span>
              ))}
              <span className="text-[10px] text-muted-foreground">
                {new Date(item.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="flex gap-1 shrink-0">
            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditing(true)}>
              <Pencil className="h-3 w-3" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-destructive"
              onClick={handleDelete}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
