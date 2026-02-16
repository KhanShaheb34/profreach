"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./chat-message";
import { addChat, getChatsByProfessor, getProfile, getMemory, getApiKey, addMemory } from "@/lib/storage";
import { useStorage } from "@/hooks/use-storage";
import type { Professor, ChatMessage as ChatMessageType } from "@/lib/types";
import { Send, Loader2, MessageSquare, X, Minus } from "lucide-react";
import { toast } from "sonner";

export function ChatSection({ professor }: { professor: Professor }) {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const getChats = useCallback(() => getChatsByProfessor(professor.id), [professor.id]);
  const messages = useStorage(getChats);
  const unreadCount = messages?.length ?? 0;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingContent, open]);

  async function extractMemory(userMsg: string, assistantMsg: string) {
    try {
      const res = await fetch("/api/gemini/memory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userMessage: userMsg,
          assistantMessage: assistantMsg,
          professorName: professor.name,
          apiKey: getApiKey(),
        }),
      });
      const data = await res.json();
      if (data.memories?.length) {
        for (const content of data.memories) {
          addMemory({
            id: uuidv4(),
            content,
            source: `chat:${professor.id}`,
            tags: [professor.name, "chat"],
            createdAt: new Date().toISOString(),
          });
        }
        toast.info(`${data.memories.length} insight(s) saved to memory`, { duration: 2000 });
      }
    } catch {
      // Silent fail for memory extraction
    }
  }

  async function handleSend() {
    const text = input.trim();
    if (!text || streaming) return;

    setInput("");
    setStreaming(true);
    setStreamingContent("");

    const userMsg: ChatMessageType = {
      id: uuidv4(),
      professorId: professor.id,
      role: "user",
      content: text,
      createdAt: new Date().toISOString(),
    };
    addChat(userMsg);

    try {
      const profile = getProfile();
      const memory = getMemory().filter(
        (m) => m.source.includes(professor.id) || m.source === "manual" || m.source === "resume"
      );

      const history = (messages || []).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          professor,
          profile,
          memory,
          history,
          apiKey: getApiKey(),
        }),
      });

      if (!res.ok) throw new Error("Chat failed");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          fullContent += chunk;
          setStreamingContent(fullContent);
        }
      }

      const assistantMsg: ChatMessageType = {
        id: uuidv4(),
        professorId: professor.id,
        role: "assistant",
        content: fullContent,
        createdAt: new Date().toISOString(),
      };
      addChat(assistantMsg);
      setStreamingContent("");

      extractMemory(text, fullContent);
    } catch {
      toast.error("Chat response failed");
    } finally {
      setStreaming(false);
    }
  }

  return (
    <>
      {/* Floating chat bubble */}
      {!open && (
        <button
          onClick={() => { setOpen(true); setMinimized(false); }}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 active:scale-95"
        >
          <MessageSquare className="h-6 w-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
              {unreadCount > 99 ? "99" : unreadCount}
            </span>
          )}
        </button>
      )}

      {/* Floating chat window */}
      {open && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex flex-col rounded-xl border bg-background shadow-2xl transition-all ${
            minimized ? "h-12 w-72" : "h-[500px] w-[380px] sm:w-[420px]"
          }`}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between gap-2 border-b px-4 py-2.5 cursor-pointer rounded-t-xl bg-muted/50"
            onClick={() => minimized && setMinimized(false)}
          >
            <div className="flex items-center gap-2 min-w-0">
              <MessageSquare className="h-4 w-4 text-primary shrink-0" />
              <span className="text-sm font-medium truncate">
                Chat — {professor.name}
              </span>
            </div>
            <div className="flex gap-1 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={(e) => { e.stopPropagation(); setMinimized(!minimized); }}
              >
                <Minus className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={(e) => { e.stopPropagation(); setOpen(false); }}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Body */}
          {!minimized && (
            <>
              <ScrollArea className="flex-1 px-4" ref={scrollRef}>
                <div className="space-y-4 py-4">
                  {(!messages || messages.length === 0) && !streaming && (
                    <p className="text-center text-sm text-muted-foreground py-8">
                      Ask about {professor.name}&apos;s research, how to approach them, or what to discuss.
                    </p>
                  )}
                  {messages?.map((msg) => (
                    <ChatMessage key={msg.id} message={msg} />
                  ))}
                  {streaming && streamingContent && (
                    <ChatMessage message={{ role: "assistant", content: streamingContent }} />
                  )}
                  {streaming && !streamingContent && (
                    <div className="flex gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      </div>
                      <div className="rounded-lg bg-muted px-3 py-2">
                        <p className="text-sm text-muted-foreground">Thinking...</p>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <div className="flex gap-2 border-t px-4 py-3">
                <Input
                  placeholder="Ask about this professor..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  disabled={streaming}
                  className="text-sm"
                />
                <Button onClick={handleSend} disabled={streaming || !input.trim()} size="icon" className="shrink-0">
                  {streaming ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
