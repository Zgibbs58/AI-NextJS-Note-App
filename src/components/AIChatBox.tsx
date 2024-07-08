import { cn } from "@/lib/utils";
import { useChat } from "ai/react";
import { XCircle } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Message } from "ai";

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
        <div className="h-full">
          {messages.map((message) => (
            <ChatMessage message={message} key={message.id} />
          ))}
        </div>
        <form action="" onSubmit={handleSubmit} className="m-3 flex gap-1">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Say something..."
          />
          <Button type="submit">Send</Button>
        </form>
      </div>
    </div>
  );
}

function ChatMessage({ message: { role, content } }: { message: Message }) {
  return (
    <div className="mb-3">
      <div>{role}</div>
      <div>{content}</div>
    </div>
  );
}
