import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";

type ChatMessageProps = {
  author: "user" | "robot";
  text: string;
};

export function ChatMessage({ author, text }: ChatMessageProps) {
  const isRobot = author === "robot";

  return (
    <div
      className={cn(
        "flex items-start gap-3",
        !isRobot && "flex-row-reverse"
      )}
    >
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback className={cn(isRobot ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground")}>
          {isRobot ? <Bot /> : <User />}
        </AvatarFallback>
      </Avatar>
      <div
        className={cn(
          "max-w-[75%] rounded-lg p-3 text-sm shadow-md",
          isRobot
            ? "bg-secondary text-secondary-foreground"
            : "bg-primary text-primary-foreground"
        )}
      >
        <p>{text}</p>
      </div>
    </div>
  );
}
