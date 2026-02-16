"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getApiKey, setApiKey } from "@/lib/storage";
import { useStorage } from "@/hooks/use-storage";
import { Key, ExternalLink, X, Check } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export function ApiKeyBanner() {
  const apiKey = useStorage(getApiKey);
  const [input, setInput] = useState("");
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || apiKey) return null;

  function handleSave() {
    const key = input.trim();
    if (!key) {
      toast.error("Please enter an API key");
      return;
    }
    setApiKey(key);
    setInput("");
    toast.success("API key saved! AI features are now enabled.");
  }

  return (
    <div className="border-b bg-amber-50 dark:bg-amber-950/50 px-4 py-3">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <Key className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
              Gemini API key required for AI features
            </p>
            <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
              Get a free key from{" "}
              <a
                href="https://aistudio.google.com/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-medium inline-flex items-center gap-0.5"
              >
                Google AI Studio
                <ExternalLink className="h-3 w-3" />
              </a>
              {" "}— your key stays in your browser, never on our servers.
            </p>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <Input
            type="password"
            placeholder="Paste your API key..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
            }}
            className="w-full sm:w-64 h-8 text-sm bg-white dark:bg-background"
          />
          <Button size="sm" className="h-8 shrink-0" onClick={handleSave} disabled={!input.trim()}>
            <Check className="h-3.5 w-3.5 mr-1" />
            Save
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 text-amber-700 dark:text-amber-400"
            onClick={() => setDismissed(true)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
