"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { getApiKey, setApiKey } from "@/lib/storage";
import { useStorage } from "@/hooks/use-storage";
import { Key, ExternalLink, Check, Trash2, Eye, EyeOff, Sparkles } from "lucide-react";
import { toast } from "sonner";

export function SettingsContent() {
  const apiKey = useStorage(getApiKey);
  const [input, setInput] = useState("");
  const [showKey, setShowKey] = useState(false);

  function handleSave() {
    const key = input.trim();
    if (!key) {
      toast.error("Please enter an API key");
      return;
    }
    setApiKey(key);
    setInput("");
    toast.success("API key saved!");
  }

  function handleRemove() {
    setApiKey("");
    toast.success("API key removed");
  }

  function maskKey(key: string) {
    if (key.length <= 8) return "****";
    return key.slice(0, 4) + "..." + key.slice(-4);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Configure your Profreach experience
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Gemini API Key
          </CardTitle>
          <CardDescription>
            Required for AI-powered features like professor lookup, email drafting, research chat, and resume parsing.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {apiKey ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-lg border bg-muted/50 p-3">
                <Sparkles className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-green-700 dark:text-green-300">
                    API key is configured
                  </p>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">
                    {showKey ? apiKey : maskKey(apiKey)}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setShowKey(!showKey)}
                  >
                    {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={handleRemove}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Replace API Key</Label>
                <div className="flex gap-2">
                  <Input
                    type="password"
                    placeholder="Paste new API key..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSave();
                    }}
                  />
                  <Button onClick={handleSave} disabled={!input.trim()}>
                    <Check className="h-4 w-4 mr-1" />
                    Update
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg border-2 border-dashed border-amber-300 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-950/30 p-4">
                <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                  No API key set — AI features are disabled
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                  Add your Gemini API key below to enable professor lookup, email drafting, research chat, and resume parsing.
                </p>
              </div>

              <div className="space-y-2">
                <Label>API Key</Label>
                <div className="flex gap-2">
                  <Input
                    type="password"
                    placeholder="Paste your Gemini API key..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSave();
                    }}
                  />
                  <Button onClick={handleSave} disabled={!input.trim()}>
                    <Check className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                </div>
              </div>
            </div>
          )}

          <Separator />

          <div className="space-y-3">
            <h4 className="text-sm font-medium">How to get a Gemini API key</h4>
            <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
              <li>
                Go to{" "}
                <a
                  href="https://aistudio.google.com/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline inline-flex items-center gap-0.5"
                >
                  Google AI Studio
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>Sign in with your Google account</li>
              <li>Click &quot;Create API Key&quot; and select or create a Google Cloud project</li>
              <li>Copy the generated key and paste it above</li>
            </ol>

            <div className="rounded-lg bg-muted p-3 mt-3">
              <p className="text-xs text-muted-foreground">
                <strong>Privacy:</strong> Your API key is stored only in your browser&apos;s localStorage and sent directly to Google&apos;s API. It is never stored on any server. Each user needs their own key.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
