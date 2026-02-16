"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStorage } from "@/hooks/use-storage";
import { useDebounce } from "@/hooks/use-debounce";
import { getMemory, addMemory } from "@/lib/storage";
import { MemoryItemCard } from "./memory-item-card";
import { Brain, Plus, Search } from "lucide-react";
import { toast } from "sonner";

export function SmartMemory() {
  const memory = useStorage(getMemory);
  const [search, setSearch] = useState("");
  const [newItem, setNewItem] = useState("");
  const debouncedSearch = useDebounce(search);

  const filtered = (memory || []).filter((item) => {
    if (!debouncedSearch) return true;
    const q = debouncedSearch.toLowerCase();
    return (
      item.content.toLowerCase().includes(q) ||
      item.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  function handleAdd() {
    if (!newItem.trim()) return;
    addMemory({
      id: uuidv4(),
      content: newItem.trim(),
      source: "manual",
      tags: ["manual"],
      createdAt: new Date().toISOString(),
    });
    setNewItem("");
    toast.success("Memory added");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Smart Memory
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Add a memory..."
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
            }}
          />
          <Button size="icon" onClick={handleAdd} disabled={!newItem.trim()}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search memories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            {memory?.length === 0
              ? "No memories yet. Add one above or chat with a professor to auto-generate."
              : "No memories match your search."}
          </p>
        ) : (
          <div className="space-y-2">
            {filtered.map((item) => (
              <MemoryItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
