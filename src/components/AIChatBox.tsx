import { cn } from "@/lib/utils";
import { useChat } from "ai/react";
import { Bot, XCircle } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Message } from "ai";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useEffect, useRef } from "react";

interface AIChatBoxProps {
  open: boolean;
  onClose: () => void;
}

export default function AIChatBox({ open, onClose }: AIChatBoxProps) {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setMessages,
    isLoading,
    error,
  } = useChat(); // /api/chat

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  return (
    <div
      className={cn(
        "bottom-0 right-0 z-10 w-full max-w-[500px] p-1 xl:right-36",
        open ? "fixed" : "hidden",
      )}
    >
      <button onClick={onClose} className="mb-1 ms-auto block">
        <XCircle size={30} />
      </button>
      <div className="flex h-[600px] flex-col rounded border-2 bg-background shadow-2xl shadow-gray-400">
        <div className="mt-3 h-full overflow-y-auto px-3" ref={scrollRef}>
          {messages.map((message) => (
            <ChatMessage message={message} key={message.id} />
          ))}
        </div>
        <form action="" onSubmit={handleSubmit} className="m-3 flex gap-1">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Say something..."
            ref={inputRef}
          />
          <Button type="submit">Send</Button>
        </form>
      </div>
    </div>
  );
}

function ChatMessage({ message: { role, content } }: { message: Message }) {
  const { user } = useUser();

  const isAiMessage = role === "assistant";

  return (
    <div
      className={cn(
        "mb-3 flex items-center",
        isAiMessage ? "me-5 justify-start" : "ms-5 justify-end",
      )}
    >
      {isAiMessage && <Bot className="mr-2 shrink-0" />}
      <p
        className={cn(
          "whitespace-pre-line rounded-md border px-3 py-2",
          isAiMessage ? "bg-background" : "bg-primary text-primary-foreground",
        )}
      >
        {content}
      </p>
      {!isAiMessage && user?.imageUrl && (
        <Image
          src={user.imageUrl}
          alt="User Avatar"
          width={100}
          height={100}
          className="ml-2 h-10 w-10 rounded-full object-cover"
        />
      )}
    </div>
  );
}
