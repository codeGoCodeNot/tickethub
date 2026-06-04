"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LucideBot, LucideSend, LucideX, LucideSparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";

type AiChatBotProps = {
  initialMessages?: { role: string; content: string; id: string }[];
  userName?: string;
};

const AiChatBot = ({ initialMessages, userName }: AiChatBotProps) => {
  const [input, setInput] = useState("");
  const { messages, sendMessage, setMessages, status } = useChat();
  const [open, setOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialMessages?.length) {
      setMessages(
        initialMessages.map((msg) => ({
          id: msg.id,
          role: msg.role as "user" | "assistant" | "system",
          parts: [{ type: "text", text: msg.content }],
        })),
      );
    }
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const isLoading = status === "streaming" || status === "submitted";

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="w-[min(360px,calc(100vw-3rem))] shadow-2xl border bg-background rounded-2xl flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground">
            <div className="flex items-center gap-2">
              <LucideSparkles className="size-4" />
              <span className="text-sm font-semibold">TicketHub Assistant</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground hover:bg-primary-foreground/20 size-7"
              onClick={() => setOpen(false)}
            >
              <LucideX className="size-4" />
            </Button>
          </div>

          <div className="flex flex-col gap-3 p-4 h-72 overflow-y-auto">
            {messages.length === 0 && (
              <p className="text-xs text-muted-foreground text-center mt-8">
                Ask me anything about TicketHub.
              </p>
            )}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex flex-col gap-1 max-w-[85%] ${
                  message.role === "user" ? "self-end items-end" : "self-start"
                }`}
              >
                <span className="text-[10px] text-muted-foreground px-1">
                  {message.role === "user"
                    ? (userName?.split(" ")[0] ?? "You")
                    : "AI"}
                </span>
                <div
                  className={`text-xs p-3 rounded-2xl ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-sm"
                      : "bg-muted rounded-tl-sm"
                  }`}
                >
                  {message.parts.map((part, idx) => {
                    if (part.type === "text") {
                      return (
                        <div
                          key={idx}
                          className="prose prose-xs dark:prose-invert max-w-none break-words"
                        >
                          <ReactMarkdown>{part.text}</ReactMarkdown>
                        </div>
                      );
                    }
                  })}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="self-start bg-muted text-xs px-3 py-2 rounded-2xl rounded-tl-sm text-muted-foreground">
                Thinking...
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <form
            className="flex gap-2 px-4 py-3 border-t"
            onSubmit={(e) => {
              e.preventDefault();
              if (!input.trim()) return;
              sendMessage({ text: input });
              setInput("");
            }}
          >
            <Input
              placeholder="Ask something..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="text-sm rounded-full"
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="icon"
              className="rounded-full shrink-0"
              disabled={isLoading}
            >
              <LucideSend className="size-4" />
            </Button>
          </form>
        </div>
      )}

      <Button
        size="icon"
        className="rounded-full size-12 shadow-lg"
        onClick={() => setOpen((prev) => !prev)}
      >
        {open ? (
          <LucideX className="size-5" />
        ) : (
          <LucideBot className="size-5" />
        )}
      </Button>
    </div>
  );
};

export default AiChatBot;
