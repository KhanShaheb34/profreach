"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./chat-message";
import { addChat, getChatsByProfessor, getProfile, getMemory, addMemory } from "@/lib/storage";
import { useStorage } from "@/hooks/use-storage";
import type { Professor, ChatMessage as ChatMessageType } from "@/lib/types";
import { Send, Loader2, MessageSquare } from "lucide-react";
import { toast } from "sonner";

export function ChatSection({ professor }: { professor: Professor }) {
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const getChats = useCallback(() => getChatsByProfessor(professor.id), [professor.id]);
  const messages = useStorage(getChats);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingContent]);

  async function extractMemory(userMsg: string, assistantMsg: string) {
    try {
      const res = await fetch("/api/gemini/memory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userMessage: userMsg,
          assistantMessage: assistantMsg,
          professorName: professor.name,
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

    // Save user message
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

      // Save assistant message
      const assistantMsg: ChatMessageType = {
        id: uuidv4(),
        professorId: professor.id,
        role: "assistant",
        content: fullContent,
        createdAt: new Date().toISOString(),
      };
      addChat(assistantMsg);
      setStreamingContent("");

      // Fire-and-forget memory extraction
      extractMemory(text, fullContent);
    } catch {
      toast.error("Chat response failed");
    } finally {
      setStreaming(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <MessageSquare className="h-5 w-5" />
          Research Chat
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4" ref={scrollRef}>
          <div className="space-y-4 pb-4">
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

        <div className="flex gap-2 pt-4">
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
          />
          <Button onClick={handleSend} disabled={streaming || !input.trim()} size="icon">
            {streaming ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
